'use strict';

const Homey = require('homey');
const fs = require('fs');
const path = require('path');
const { getDeviceClasses, getCapabilities } = require('homey-lib');
const pairingIcons = require('./pairing-icons.json');
const { iconReference, hasEditableIcon, decodeIcon, writeIcon, deleteIcon } = require('./icon-storage');
const { updateOptions } = require('./capability-options');
const { updateEnergy } = require('./energy');
const { default_options } = require('./pair/capabilities');
const media = require('./media');

//let app;
let homey;
class VirtualDriver extends Homey.Driver {
  onInit() {
    this.log('Initialized driver for Virtual Devices');
    //app = this.homey.app;
    homey = this.homey;

    this.registerFlowCardAction_sensor('set_sensor_value', false);
    this.registerFlowCardAction_sensor('set_sensor_value_oc', true);
    for (const type of ['number', 'boolean', 'string', 'enum']) {
      this.registerTypedCapabilityAction(type);
    }
    for (const kind of ['camera', 'album']) {
      for (const source of ['url', 'token']) {
        this.homey.flow.getActionCard(`set_${kind}_image_${source}`).registerRunListener(async args => {
          const device = requireFlowDevice(this.homey, args);
          if (kind === 'camera' ? !media.CAMERA_CLASSES.includes(device.getClass()) : device.getClass() !== 'speaker') {
            throw new Error(this.homey.__('flow_errors.image_device'));
          }
          let url;
          if (source === 'url') {
            url = media.imageUrl(args.url, false, this.homey.__('flow_errors.image_url'));
          } else if (!args.droptoken || typeof args.droptoken.getStream !== 'function') {
            throw new Error(this.homey.__('flow_errors.image_token'));
          }
          try {
            if (source === 'url') return await device.setMediaImage(kind, { url });
            return await device.setMediaImageFromToken(kind, args.droptoken);
          } catch (error) {
            this.error('Could not set Flow image:', error);
            if (error.code === 'IMAGE_TOO_LARGE') throw new Error(this.homey.__('flow_errors.image_size'));
            if (error.code === 'IMAGE_EMPTY') throw new Error(this.homey.__('flow_errors.image_empty'));
            throw new Error(this.homey.__('flow_errors.image_failed'));
          }
        });
      }
    }
    this.homey.app.registerReleaseDriver('virtual_switch', this);
  }

  onPair(session) {
    let mediaDraft = { image: '', video: '' };
    let energyDraft = {};
    const energyDrafts = {};
    let pairingDevice = {
      name: this.homey.__('pair.default.name.device'),
      settings: {},
      store: {},
      data: {
        id: guid(),
        version: 3
      },
      capabilities: [],
      capabilitiesOptions: {}
    };

    session.setHandler('log', (data) => {
      console.log('log: ' + JSON.stringify(data));
      return "ok";
    });

    session.setHandler('setClass', (data) => {
      // if(data.minCompatibility && !getRequiredVersion(data.minCompatibility)) {
      //   throw new Error("You need Homey version " + data.minCompatibility+ " to use this class.");
        
      // }
      console.log('setClass: ' + data);
      if (pairingDevice.class !== data.class) {
        if (pairingDevice.class) energyDrafts[pairingDevice.class] = energyDraft;
        energyDraft = energyDrafts[data.class] || {};
        pairingDevice.class = data.class;
      }
      return pairingDevice;
    });

    session.setHandler('getAllClasses', (data) => {
      let classes = getDeviceClasses();
      let language = homey.i18n.getLanguage();
      let newClasses = {};
      for (let i = 0; i < Object.keys(classes).length; i++) {
        const key = Object.keys(classes)[i];
        const cls = classes[key];
        if(!cls.minCompatibility || getRequiredVersion(cls.minCompatibility)) {
          newClasses[key] = {
            minCompatibility : cls.minCompatibility,
            title: cls.title[language] ? cls.title[language] : cls.title['en']
          }
        }        
      }      
      newClasses = sortObject(newClasses, 'title');
      return newClasses;
    });

    session.setHandler('getAllCapabilities', (data) => {
      let capabilities = availableCapabilities(this.homey);
      let language = homey.i18n.getLanguage();
      let newCapabilities = {};
      for (let i = 0; i < Object.keys(capabilities).length; i++) {
        const key = Object.keys(capabilities)[i];
        const cls = capabilities[key];
        if(!cls.minCompatibility || getRequiredVersion(cls.minCompatibility)) {
          newCapabilities[key] = {
            minCompatibility : cls.minCompatibility,
            title: cls.title[language] ? cls.title[language] : cls.title['en'],
            type: cls.type
          }
        }        
      }
      newCapabilities = sortObject(newCapabilities, 'title');
      return newCapabilities;
    });
    session.setHandler('setName', (data) => {
      console.log('setName: ' + data);
      pairingDevice.name = data.name;
      return pairingDevice;
    });

    session.setHandler('getPairingDevice', (data) => {
      //if(data===true) pairingDevice.capabilities=[];
      return pairingDevice;
    });

    session.setHandler('mediaSupport', () => ({ video: media.supportsVideo(this.homey) }));
    session.setHandler('getMediaDraft', () => mediaDraft);
    session.setHandler('setMediaDraft', data => {
      if (!data || typeof data.image !== 'string' || typeof data.video !== 'string') {
        throw new Error(this.homey.__('repair.invalid'));
      }
      mediaDraft = { image: data.image, video: data.video };
    });
    session.setHandler('updateMedia', data => {
      if (!media.CAMERA_CLASSES.includes(pairingDevice.class) || !data || typeof data !== 'object') {
        throw new Error(this.homey.__('repair.invalid'));
      }
      const image = media.imageUrl(data.image, true);
      const video = media.videoUrl(data.video || '', true);
      if (video && !media.supportsVideo(this.homey)) throw new Error('Video is not supported on this Homey');
      if (image) pairingDevice.store.cameraImage = { url: image };
      else delete pairingDevice.store.cameraImage;
      if (video) pairingDevice.store.cameraVideoUrl = video;
      else delete pairingDevice.store.cameraVideoUrl;
      return true;
    });

    session.setHandler('updateCapabilities', (data) => {
      console.log('updateCapabilities: ' + JSON.stringify(data));
      pairingDevice.capabilities = data.capabilities;
      data.capabilities.forEach(id => {
        if (!pairingDevice.capabilitiesOptions[id] && default_options[id]) {
          pairingDevice.capabilitiesOptions[id] = { ...default_options[id] };
        }
        const meterOptions = defaultMeterOptions(id);
        if (!pairingDevice.capabilitiesOptions[id] && meterOptions) pairingDevice.capabilitiesOptions[id] = meterOptions;
      });
      return pairingDevice;
    });

    session.setHandler('updateCapabilitiesOptions', (capabilityOptionChanges) => {
      const available = availableCapabilities(this.homey);
      Object.keys(capabilityOptionChanges).forEach(capability => {
        if (!pairingDevice.capabilities.includes(capability) || !available[capability]) {
          throw new Error(this.homey.__('repair.invalid'));
        }
        pairingDevice.capabilitiesOptions[capability] = updateOptions(
          pairingDevice.capabilitiesOptions[capability], capabilityOptionChanges[capability], available[capability],
          this.homey.__('repair.invalid'), capability,
        );
      });
      return pairingDevice;
    });

    session.setHandler('energySupport', () => energySupport());
    session.setHandler('getEnergyDraft', () => {
      if (pairingDevice.class === 'evcharger' && energySupport().evCharger
        && !Object.prototype.hasOwnProperty.call(energyDraft, 'evCharger')) {
        energyDraft.evCharger = true;
      }
      return energyDraft;
    });
    session.setHandler('setEnergyDraft', changes => {
      updateEnergy(energyDraft, changes, pairingDevice.class, pairingDevice.capabilities,
        energySupport(), this.homey.__('repair.invalid'));
      energyDraft = { ...energyDraft, ...changes };
      return energyDraft;
    });
    session.setHandler('updateEnergy', changes => {
      const energy = updateEnergy({}, changes, pairingDevice.class, pairingDevice.capabilities,
        energySupport(), this.homey.__('repair.invalid'));
      if (Object.keys(energy).length) pairingDevice.store.pendingEnergy = energy;
      else delete pairingDevice.store.pendingEnergy;
    });

    session.setHandler('getIcons', () => this.getIcons());

    session.setHandler('setIcon', async (data) => {
      const icon = this.getIcons().find(item => item.location === data.icon.location);
      if (!icon) throw new Error('Invalid icon');
      const contents = await fs.promises.readFile(path.join(__dirname, 'assets', icon.location));
      await writeIcon(pairingDevice.data.id, contents);
      pairingDevice.data.icon = iconReference(pairingDevice.data.id);
      pairingDevice.icon = pairingDevice.data.icon;
      return pairingDevice;
    });

    session.setHandler('saveIcon', async (data) => {
      await writeIcon(pairingDevice.data.id, decodeIcon(data));
      pairingDevice.data.icon = iconReference(pairingDevice.data.id);
      pairingDevice.icon = pairingDevice.data.icon;
      return pairingDevice;
    });

    session.setHandler('disconnect', () => {
      console.log("User aborted pairing, or pairing is finished");

      this.homey.setTimeout(() => {
        let devices = this.getDevices();
        if (hasEditableIcon(pairingDevice.data) && !devices.find(x => x.getData().icon === pairingDevice.data.icon)) {
          deleteIcon(pairingDevice.data.id).catch(error => this.error(error));
        }
      }, 10000);
      return true;
    })
  }

  getIcons() {
      const device_data = [
        getIconNameAndLocation('switch'),
        getIconNameAndLocation('light'),
        getIconNameAndLocation('button'),
        getIconNameAndLocation('alarm'),
        getIconNameAndLocation('lock'),
        getIconNameAndLocation('door'),
        getIconNameAndLocation('window_open'),
        getIconNameAndLocation('motion'),
        getIconNameAndLocation('blinds'),
        getIconNameAndLocation('curtains'),
        getIconNameAndLocation('garage'),
        getIconNameAndLocation('tv'),
        getIconNameAndLocation('hifi'),
        getIconNameAndLocation('sensor'),
        getIconNameAndLocation('thermostat'),
        getIconNameAndLocation('radiator'),
        getIconNameAndLocation('fan'),
        getIconNameAndLocation('electricity'),
        getIconNameAndLocation('water'),
        getIconNameAndLocation('sensor2'),
        getIconNameAndLocation('coffee_maker'),
        getIconNameAndLocation('kettle'),
        getIconNameAndLocation('airconditioner'),
        getIconNameAndLocation('air_purifier'),
        getIconNameAndLocation('battery'),
        getIconNameAndLocation('camera'),
        getIconNameAndLocation('car'),
        getIconNameAndLocation('dishwasher'),
        getIconNameAndLocation('dryer'),
        getIconNameAndLocation('oven'),
        getIconNameAndLocation('pump'),
        getIconNameAndLocation('smoke_detector'),
        getIconNameAndLocation('sprinkler'),
        getIconNameAndLocation('vacuum'),
        getIconNameAndLocation('washer'),
      ]

      const additionalIcons = new Set();
      Object.values(pairingIcons).forEach(icons => {
        icons.forEach(icon => additionalIcons.add(icon));
      });
      additionalIcons.forEach(icon => device_data.push(getIconNameAndLocation('mdi/' + icon)));

      return device_data;
  }

  onRepair(session, device) {
    const getOptions = id => {
      try {
        return device.getCapabilityOptions(id) || {};
      } catch (error) {
        if (error.message === `Invalid Capability: ${id}` && device.hasCapability(id)) return {};
        throw error;
      }
    };
    const localize = entries => {
      const language = this.homey.i18n.getLanguage();
      const result = {};
      Object.entries(entries).forEach(([id, entry]) => {
        if (!entry.minCompatibility || getRequiredVersion(entry.minCompatibility)) {
          result[id] = { title: entry.title[language] || entry.title.en, type: entry.type };
        }
      });
      return sortObject(result, 'title');
    };

    session.setHandler('repairLoad', () => {
      const capabilities = device.getCapabilities();
      const options = {};
      capabilities.forEach(id => { options[id] = getOptions(id); });
      return {
        name: device.getName(),
        class: device.getClass(),
        capabilities,
        options,
        classes: localize(getDeviceClasses()),
        allCapabilities: localize(availableCapabilities(this.homey)),
        energy: device.getEnergy() || {},
        energySupport: energySupport(),
        icons: hasEditableIcon(device.getData()) ? this.getIcons() : [],
        iconEditable: hasEditableIcon(device.getData()),
        media: {
          image: (device.getStoreValue('cameraImage') || {}).url || '',
          imageFromFlow: !!(device.getStoreValue('cameraImage') || {}).data,
          video: device.getStoreValue('cameraVideoUrl') || '',
          videoSupported: media.supportsVideo(this.homey),
        }
      };
    });

    session.setHandler('repairSave', async data => {
      const classes = getDeviceClasses();
      const available = availableCapabilities(this.homey);
      const current = device.getCapabilities();
      if (!data || typeof data.class !== 'string'
        || (!classes[data.class] && data.class !== device.getClass())
        || (classes[data.class] && classes[data.class].minCompatibility
          && !getRequiredVersion(classes[data.class].minCompatibility)
          && data.class !== device.getClass())
        || !Array.isArray(data.capabilities) || !data.capabilities.length
        || new Set(data.capabilities).size !== data.capabilities.length
        || data.capabilities.some(id => typeof id !== 'string'
          || (!available[id] && !current.includes(id))
          || (available[id] && available[id].minCompatibility
            && !getRequiredVersion(available[id].minCompatibility) && !current.includes(id)))) {
        throw new Error(this.homey.__('repair.invalid'));
      }

      const options = data.options === undefined ? {} : data.options;
      if (!options || typeof options !== 'object' || Array.isArray(options)
        || Object.keys(options).some(id => !data.capabilities.includes(id))) {
        throw new Error(this.homey.__('repair.invalid'));
      }
      const updatedOptions = {};
      for (const id of Object.keys(options)) {
        updatedOptions[id] = updateOptions(
          current.includes(id) ? getOptions(id) : (defaultMeterOptions(id) || {}), options[id], available[id],
          this.homey.__('repair.invalid'), id,
        );
      }

      const currentEnergy = device.getEnergy() || {};
      const updatedEnergy = updateEnergy(currentEnergy, data.energy === undefined ? {} : data.energy,
        data.class, data.capabilities, energySupport(), this.homey.__('repair.invalid'), device.getClass(),
        current.filter(id => !data.capabilities.includes(id)));
      const energyChanged = JSON.stringify(updatedEnergy) !== JSON.stringify(currentEnergy);

      let mediaChanges;
      if (data.media !== undefined) {
        if (!media.CAMERA_CLASSES.includes(data.class) || !data.media || typeof data.media !== 'object') {
          throw new Error(this.homey.__('repair.invalid'));
        }
        mediaChanges = {};
        if (data.media.image !== undefined) mediaChanges.image = media.imageUrl(data.media.image, true);
        if (data.media.video !== undefined) {
          mediaChanges.video = media.videoUrl(data.media.video, true);
          if (!media.supportsVideo(this.homey)) throw new Error('Video is not supported on this Homey');
        }
      }

      let iconContents;
      if (data.icon) {
        if (!hasEditableIcon(device.getData())) throw new Error(this.homey.__('repair.legacy_icon'));
        if (data.icon.upload) {
          iconContents = decodeIcon(data.icon.upload);
        } else {
          const icon = this.getIcons().find(item => item.location === data.icon.location);
          if (!icon) throw new Error(this.homey.__('repair.invalid'));
          iconContents = await fs.promises.readFile(path.join(__dirname, 'assets', icon.location));
        }
      }

      for (const id of data.capabilities) {
        if (!current.includes(id)) {
          await device.addCapability(id);
          device.registerVirtualCapabilities([id]);
          const meterOptions = defaultMeterOptions(id);
          if (meterOptions && !updatedOptions[id]) updatedOptions[id] = meterOptions;
        }
      }
      if (data.class !== device.getClass()) await device.setClass(data.class);
      for (const id of Object.keys(updatedOptions)) {
        await device.setCapabilityOptions(id, updatedOptions[id]);
      }
      if (energyChanged) await device.setEnergy(updatedEnergy);
      for (const id of current) {
        if (!data.capabilities.includes(id)) await device.removeCapability(id);
      }
      if (iconContents) await writeIcon(device.getData().id, iconContents);
      if (mediaChanges && mediaChanges.image !== undefined) {
        await device.setMediaImage('camera', mediaChanges.image ? { url: mediaChanges.image } : null);
      }
      if (mediaChanges && mediaChanges.video !== undefined) await device.setCameraVideoUrl(mediaChanges.video);
      return { iconChanged: !!iconContents };
    });
  }

  registerFlowCardAction_sensor(card_name, oc) {
    let flowCardAction = this.homey.flow.getActionCard(card_name);
    flowCardAction
      .registerRunListener(async (args, state) => {
        try {
          this.log('args: ' + simpleStringify(args));
          const device = requireFlowDevice(this.homey, args);
          const sensor = oc ? (args.sensor && args.sensor.id) : args.sensor;
          if (typeof sensor !== 'string' || !sensor.trim()) throw new Error(this.homey.__('flow_errors.capability'));
          if (!device.getCapabilities().includes(sensor)) throw new Error(this.homey.__('flow_errors.capability_unavailable'));
          const value = args.value;
          if (value === undefined || value === null || (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean')
            || (typeof value === 'string' && value.trim() === '')) {
            throw new Error(this.homey.__('flow_errors.value'));
          }

          this.log(device.getName() + ' -> Sensor: ' + sensor);

          var valueToSet;
          if (typeof value === 'boolean') {
            valueToSet = value;
          } else if (isNaN(value)) {
            if (value.toLowerCase() === 'true') {
              valueToSet = true;
            } else if (value.toLowerCase() === 'false') {
              valueToSet = false;
            } else {
              valueToSet = value;
            }
          } else {
            valueToSet = parseFloat(value, 10);
          }

          this.log(device.getName() + ' -> Value:  ' + valueToSet);
          return await setFlowCapability(this, device, sensor, valueToSet);
        }
        catch (error) {
          this.log('Device triggered with missing information: ' + error.message)
          this.log('args: ' + simpleStringify(args));
          return Promise.reject(error);
        }
      });
    if (oc) flowCardAction.registerArgumentAutocompleteListener('sensor', async (query, args) => {

      let caps = requireFlowDevice(this.homey, args).getCapabilities();
      return caps.map(x => {
        return {
          name: x,
          id: x
        }
      });
    });
  }

  registerTypedCapabilityAction(type) {
    const card = this.homey.flow.getActionCard(`set_capability_${type}`);
    const definitionFor = id => getCapabilities()[id.split('.')[0]];
    const selectedCapability = args => {
      const device = requireFlowDevice(this.homey, args);
      const id = args.capability && args.capability.id;
      if (typeof id !== 'string' || !id) throw new Error(this.homey.__('flow_errors.capability'));
      const definition = definitionFor(id);
      if (!device.getCapabilities().includes(id) || !definition || definition.type !== type) {
        throw new Error(this.homey.__('flow_errors.capability_unavailable'));
      }
      return { device, id, definition };
    };

    card.registerRunListener(async args => {
      const { device, id, definition } = selectedCapability(args);
      const value = args.value;
      if (type === 'enum') {
        if (!value || typeof value.id !== 'string' || !definition.values.some(option => option.id === value.id)) {
          throw new Error(this.homey.__('flow_errors.value'));
        }
        return setFlowCapability(this, device, id, value.id);
      }
      if (typeof value !== type || (type === 'number' && !Number.isFinite(value))) {
        throw new Error(this.homey.__('flow_errors.value'));
      }
      return setFlowCapability(this, device, id, value);
    });

    card.registerArgumentAutocompleteListener('capability', async (query, args) => {
      const device = requireFlowDevice(this.homey, args);
      const search = query.toLowerCase();
      return device.getCapabilities()
        .filter(id => {
          const definition = definitionFor(id);
          return definition && definition.type === type && id.toLowerCase().includes(search);
        })
        .map(id => ({ id, name: id }));
    });
    if (type === 'enum') {
      card.registerArgumentAutocompleteListener('value', async (query, args) => {
        const { definition } = selectedCapability(args);
        const language = this.homey.i18n.getLanguage();
        const search = query.toLowerCase();
        return definition.values
          .map(option => ({ id: option.id, name: option.title[language] || option.title.en }))
          .filter(option => option.name.toLowerCase().includes(search) || option.id.toLowerCase().includes(search));
      });
    }
  }
}

module.exports = VirtualDriver;

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function getIconNameAndLocation(name) {
  return {
    "name": name,
    "location": name + ".svg"
  }
};


function requireFlowDevice(homey, args) {
  if (!args || !args.device) throw new Error(homey.__('flow_errors.device'));
  return args.device;
}

async function setFlowCapability(driver, device, id, value) {
  try {
    return await device.setCapabilityValue(id, value);
  } catch (error) {
    driver.error('Could not set Flow capability:', error);
    throw new Error(driver.homey.__('flow_errors.set_failed'));
  }
}

function simpleStringify(object) {
  var simpleObject = cleanJson(object);
  return JSON.stringify(simpleObject);
};

function cleanJson(object) {
  var simpleObject = {};
  for (var prop in object) {
    if (!object.hasOwnProperty(prop)) {
      continue;
    }
    if (typeof (object[prop]) == 'object') {
      continue;
    }
    if (typeof (object[prop]) == 'function') {
      continue;
    }
    simpleObject[prop] = object[prop];
  }
  return simpleObject; // returns cleaned up Object
};

function getRequiredVersion(version) {
  if(homey.version!=version) {
    let versionArr = homey.version.split(".");
    let versionUpdatedToArr = version.split(".");
    return (
      parseInt(versionArr[0])> parseInt(versionUpdatedToArr[0]) || 
      (parseInt(versionArr[0])=== parseInt(versionUpdatedToArr[0]) && parseInt(versionArr[1])> parseInt(versionUpdatedToArr[1])) || 
      (parseInt(versionArr[0])=== parseInt(versionUpdatedToArr[0]) && parseInt(versionArr[1])=== parseInt(versionUpdatedToArr[1]) && parseInt(versionArr[2])> parseInt(versionUpdatedToArr[2]))
      );
  }
  return true;
}

function energySupport() {
  return {
    homeBattery: getRequiredVersion('12.3.0'),
    electricCar: getRequiredVersion('12.4.5'),
    evCharger: getRequiredVersion('12.4.5'),
    cumulativeMeters: getRequiredVersion('12.3.0'),
    deviceMeters: getRequiredVersion('12.4.5'),
  };
}

function availableCapabilities(instance) {
  const capabilities = { ...getCapabilities() };
  if (getRequiredVersion('12.3.0')) {
    for (const direction of ['imported', 'exported']) {
      capabilities[`meter_power.${direction}`] = {
        ...capabilities.meter_power,
        title: Object.fromEntries(['en', instance.i18n.getLanguage()].map(language =>
          [language, instance.__(`energy.${direction}`)])),
      };
    }
  }
  return capabilities;
}

function defaultMeterOptions(id) {
  const direction = id === 'meter_power.imported' ? 'imported' : id === 'meter_power.exported' ? 'exported' : null;
  if (!direction) return null;
  const languages = ['en', 'nl', 'de', 'da', 'es', 'fr', 'it', 'no', 'sv', 'pl', 'ru', 'ko', 'ar'];
  return { title: Object.fromEntries(languages.map(language => [language, require(`../../locales/${language}.json`).energy[direction]])) };
}


function sortObject(obj, propertyName) {
  let cap = Object.entries(obj).sort(([aKey,a],[bKey,b]) => a[propertyName]>b[propertyName]? 1 :a[propertyName]<b[propertyName] ? -1 :0  );
  let caps = {};
  for (let i = 0; i < cap.length; i++) {
    const element = cap[i];
    caps[element[0]] = element[1];
  }
  return caps;
}