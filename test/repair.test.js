'use strict';

const assert = require('node:assert/strict');
const Module = require('node:module');
const test = require('node:test');
const iconStorage = require('../drivers/virtual_switch/icon-storage');

const writes = [];
const storage = {
  ...iconStorage,
  async writeIcon(id, contents) { writes.push({ id, contents }); },
  async deleteIcon() {},
};
const originalLoad = Module._load;
Module._load = function (request, parent, isMain) {
  if (request === 'homey') return { Driver: class {}, Device: class {} };
  if (request === './icon-storage' && parent.filename.endsWith('driver.js')) return storage;
  return originalLoad.call(this, request, parent, isMain);
};
const Driver = require('../drivers/virtual_switch/driver');
const Device = require('../drivers/virtual_switch/device');
Module._load = originalLoad;

function setup(icon = '../../../userdata/test-id.svg') {
  writes.length = 0;
  const calls = [];
  const device = {
    class: 'socket',
    capabilities: ['onoff', 'target_temperature'],
    options: { target_temperature: { min: 5, max: 35, step: 0.5, units: '°C' } },
    getName() { return 'Test'; },
    getData() { return { id: 'test-id', icon }; },
    store: {},
    energy: {},
    getStoreValue(key) { return this.store[key]; },
    getEnergy() { return this.energy; },
    async setEnergy(value) { calls.push(['energy', value]); this.energy = value; },
    getClass() { return this.class; },
    getCapabilities() { return this.capabilities.slice(); },
    hasCapability(id) { return this.capabilities.includes(id); },
    getCapabilityOptions(id) {
      if (!this.capabilities.includes(id)) throw new Error(`Missing capability: ${id}`);
      return this.options[id];
    },
    async addCapability(id) { calls.push(['add', id]); this.capabilities.push(id); },
    registerVirtualCapabilities(ids) { calls.push(['register', ...ids]); },
    async setClass(value) { calls.push(['class', value]); this.class = value; },
    async setCapabilityOptions(id, value) { calls.push(['options', id, value]); this.options[id] = value; },
    async removeCapability(id) { calls.push(['remove', id]); this.capabilities = this.capabilities.filter(value => value !== id); },
    async setMediaImage(kind, source) { calls.push(['image', kind, source]); this.store.cameraImage = source; },
    async setCameraVideoUrl(url) { calls.push(['video', url]); this.store.cameraVideoUrl = url; },
  };
  const driver = new Driver();
  driver.homey = {
    version: '12.3.0',
    app: { registerReleaseDriver() {} },
    i18n: { getLanguage: () => 'en' },
    __: key => key,
    flow: { getActionCard: () => ({ registerRunListener() { return this; }, registerArgumentAutocompleteListener() {} }) },
  };
  driver.log = () => {};
  driver.onInit();
  const handlers = {};
  driver.onRepair({ setHandler(name, handler) { handlers[name] = handler; } }, device);
  return { device, calls, handlers, driver };
}

test('repair loads existing state and saving unchanged does not change it', async () => {
  const { handlers, calls } = setup();
  const loaded = handlers.repairLoad();
  assert.deepEqual(loaded.capabilities, ['onoff', 'target_temperature']);
  assert.equal(loaded.options.target_temperature.min, 5);
  assert.equal(loaded.iconEditable, true);
  assert.deepEqual(await handlers.repairSave({ class: loaded.class, capabilities: loaded.capabilities }), { iconChanged: false });
  assert.deepEqual(calls, []);
  assert.equal(writes.length, 0);
});

test('pairing stores optional energy configuration and keeps drafts when revisiting a class', async () => {
  const { driver } = setup();
  driver.homey.version = '13.5.0';
  const handlers = {};
  driver.onPair({ setHandler(name, handler) { handlers[name] = handler; } });
  handlers.setClass({ class: 'battery' });
  handlers.updateCapabilities({ capabilities: ['measure_battery', 'meter_power.imported', 'meter_power.exported'] });
  assert.equal(handlers.getPairingDevice().capabilitiesOptions['meter_power.imported'].title.nl, 'Geïmporteerde / geladen energie');
  assert.deepEqual(handlers.getEnergyDraft(), {});
  handlers.setEnergyDraft({ homeBattery: true });
  handlers.setEnergyDraft({ meterPowerImportedCapability: 'meter_power.imported' });
  handlers.setEnergyDraft({ meterPowerExportedCapability: 'meter_power.exported' });
  handlers.setClass({ class: 'car' });
  assert.deepEqual(handlers.getEnergyDraft(), {});
  handlers.setClass({ class: 'battery' });
  handlers.updateEnergy(handlers.getEnergyDraft());
  assert.deepEqual(handlers.getPairingDevice().store.pendingEnergy, {
    homeBattery: true,
    meterPowerImportedCapability: 'meter_power.imported',
    meterPowerExportedCapability: 'meter_power.exported',
  });
  const device = new Device();
  const calls = [];
  device.log = () => {};
  device.getName = () => 'Battery';
  device.getCapabilities = () => [];
  device.getStoreValue = key => handlers.getPairingDevice().store[key];
  device.setEnergy = async value => calls.push(value);
  device.unsetStoreValue = async key => { delete handlers.getPairingDevice().store[key]; };
  await device.onInit();
  assert.deepEqual(calls, [{ homeBattery: true, meterPowerImportedCapability: 'meter_power.imported', meterPowerExportedCapability: 'meter_power.exported' }]);
  assert.equal(handlers.getPairingDevice().store.pendingEnergy, undefined);
});

test('repair gives newly added energy meters localized default titles and preserves edited numeric options', async () => {
  const { handlers, device, driver } = setup();
  driver.homey.version = '13.5.0';
  device.class = 'battery';
  device.capabilities = ['measure_battery'];
  await handlers.repairSave({
    class: 'battery', capabilities: ['measure_battery', 'meter_power.imported', 'meter_power.exported'],
    options: { 'meter_power.imported': { decimals: 2 } },
  });
  assert.equal(device.options['meter_power.imported'].title.en, 'Imported / charged energy');
  assert.equal(device.options['meter_power.imported'].decimals, 2);
  assert.equal(device.options['meter_power.exported'].title.nl, 'Geëxporteerde / ontladen energie');
});

test('charger defaults to Energy enabled but an explicit opt-out survives revisiting', () => {
  const { driver } = setup();
  driver.homey.version = '13.5.0';
  const handlers = {};
  driver.onPair({ setHandler(name, handler) { handlers[name] = handler; } });
  handlers.setClass({ class: 'evcharger' });
  assert.equal(handlers.getEnergyDraft().evCharger, true);
  handlers.setEnergyDraft({ evCharger: false });
  assert.equal(handlers.getEnergyDraft().evCharger, false);
  handlers.updateEnergy(handlers.getEnergyDraft());
  assert.equal(handlers.getPairingDevice().store.pendingEnergy, undefined);
});

test('a failed initial Energy configuration remains pending and surfaces the error', async () => {
  const device = new Device();
  device.log = () => {};
  device.getName = () => 'Battery';
  device.getCapabilities = () => [];
  device.getStoreValue = key => key === 'pendingEnergy' ? { homeBattery: true } : undefined;
  device.setEnergy = async () => { throw new Error('Energy unavailable'); };
  let cleared = false;
  device.unsetStoreValue = async () => { cleared = true; };
  await assert.rejects(device.onInit(), /Energy unavailable/);
  assert.equal(cleared, false);
});

test('repair preserves energy properties and clears mappings only when their capability is removed', async () => {
  const { handlers, device, calls } = setup();
  device.class = 'battery';
  device.capabilities = ['measure_battery', 'meter_power.imported', 'meter_power.exported'];
  device.energy = { homeBattery: true, meterPowerImportedCapability: 'meter_power.imported', meterPowerExportedCapability: 'meter_power.exported', unrelated: 42 };
  await handlers.repairSave({ class: 'battery', capabilities: device.capabilities });
  assert.deepEqual(calls, []);
  await handlers.repairSave({ class: 'battery', capabilities: ['measure_battery', 'meter_power.imported'] });
  assert.deepEqual(device.energy, { homeBattery: true, meterPowerImportedCapability: 'meter_power.imported', unrelated: 42 });
  assert.deepEqual(calls.map(call => call[0]), ['energy', 'remove']);
});

test('repair validates Energy selections before changing the device', async () => {
  const { handlers, device, calls, driver } = setup();
  driver.homey.version = '13.5.0';
  device.class = 'battery';
  device.capabilities = ['measure_battery', 'meter_power.imported', 'meter_power.exported'];
  for (const energy of [
    { electricCar: true },
    { homeBattery: 'true' },
    { meterPowerImportedCapability: 'meter_power.not_selected' },
    { meterPowerImportedCapability: 'meter_power.imported', meterPowerExportedCapability: 'meter_power.imported' },
  ]) {
    await assert.rejects(handlers.repairSave({ class: 'battery', capabilities: device.capabilities, energy }), /repair.invalid/);
  }
  assert.deepEqual(calls, []);
  await handlers.repairSave({
    class: 'battery', capabilities: device.capabilities,
    energy: { homeBattery: true, meterPowerImportedCapability: 'meter_power.imported', meterPowerExportedCapability: 'meter_power.exported' },
  });
  assert.equal(device.energy.homeBattery, true);
  driver.homey.version = '12.2.0';
  await assert.rejects(handlers.repairSave({ class: 'battery', capabilities: device.capabilities, energy: { homeBattery: true } }), /repair.invalid/);
});

test('target power excludes only a range including zero and preserves other capability options', async () => {
  const { handlers, device, driver } = setup();
  driver.homey.version = '13.5.0';
  device.capabilities = ['target_power', 'measure_power'];
  device.options.target_power = { min: -5000, max: 5000, step: 10 };
  await handlers.repairSave({
    class: 'battery', capabilities: device.capabilities,
    options: { target_power: { excludeMin: -200, excludeMax: 300 }, measure_power: { approximated: true } },
  });
  assert.deepEqual(device.options.target_power, { min: -5000, max: 5000, step: 10, excludeMin: -200, excludeMax: 300 });
  assert.equal(device.options.measure_power.approximated, true);
  for (const change of [{ min: 1 }, { max: -1 }, { excludeMin: 1 }, { excludeMax: -1 }]) {
    await assert.rejects(handlers.repairSave({ class: 'battery', capabilities: device.capabilities, options: { target_power: change } }), /repair.invalid/);
  }
});

test('repair preserves a camera image unless edited and validates media before changing capabilities', async () => {
  const { handlers, device, calls } = setup();
  device.class = 'camera';
  device.store.cameraImage = { data: 'cGljdHVyZQ==', contentType: 'image/png' };
  const loaded = handlers.repairLoad();
  assert.equal(loaded.media.image, '');
  await handlers.repairSave({ class: 'camera', capabilities: loaded.capabilities, media: {} });
  assert.equal(device.store.cameraImage.data, 'cGljdHVyZQ==');
  await assert.rejects(handlers.repairSave({
    class: 'camera', capabilities: ['onoff'], media: { image: 'file:///invalid' },
  }), /Invalid image URL/);
  assert.deepEqual(calls, []);
  await handlers.repairSave({
    class: 'camera', capabilities: loaded.capabilities, media: { image: 'http://camera/image' },
  });
  assert.equal(device.store.cameraImage.url, 'http://camera/image');
});

test('repair handles Homey capabilities without custom options', async () => {
  const { handlers, device } = setup();
  device.getCapabilityOptions = id => {
    if (!device.options[id]) throw new Error(`Invalid Capability: ${id}`);
    return device.options[id];
  };
  assert.deepEqual(handlers.repairLoad().options.onoff, {});
  await handlers.repairSave({
    class: 'socket', capabilities: ['onoff', 'target_temperature'],
    options: { onoff: { title: 'Switch' } },
  });
  assert.equal(device.options.onoff.title.en, 'Switch');
  device.getCapabilityOptions = () => { throw new Error('Unexpected failure'); };
  assert.throws(() => handlers.repairLoad(), /Unexpected failure/);
});

test('repair applies capability, class and option edits without losing other options', async () => {
  const { handlers, device, calls } = setup();
  await handlers.repairSave({
    class: 'light',
    capabilities: ['dim', 'target_temperature'],
    options: { target_temperature: { min: 10, max: 30, step: 1 } },
  });
  assert.deepEqual(device.capabilities, ['target_temperature', 'dim']);
  assert.equal(device.class, 'light');
  assert.deepEqual(device.options.target_temperature, { min: 10, max: 30, step: 1, units: '°C' });
  assert.deepEqual(calls.map(call => call[0]), ['add', 'register', 'class', 'options', 'remove']);
});

test('repair can name a button and change numeric options without changing other settings', async () => {
  const { handlers, device } = setup();
  device.capabilities.push('button', 'measure_power');
  device.options.measure_power = { decimals: 2, units: { en: 'W' } };
  await handlers.repairSave({
    class: 'socket',
    capabilities: ['onoff', 'target_temperature', 'button', 'measure_power'],
    options: { button: { title: 'Open' }, measure_power: { min: 0, max: 5000, decimals: 1 } },
  });
  assert.equal(device.options.button.title.en, 'Open');
  assert.equal(device.options.button.title.nl, 'Open');
  assert.deepEqual(device.options.measure_power, { min: 0, max: 5000, decimals: 1, units: { en: 'W' } });
  assert.equal(device.options.target_temperature.min, 5);
});

test('repair can configure a capability being added', async () => {
  const { handlers, device } = setup();
  await handlers.repairSave({
    class: 'socket', capabilities: ['onoff', 'button'], options: { button: { title: 'Open' } },
  });
  assert.equal(device.options.button.title.en, 'Open');
});

test('pairing preserves selected options and initializes existing temperature defaults', () => {
  const { driver } = setup();
  const handlers = {};
  driver.onPair({ setHandler(name, handler) { handlers[name] = handler; } });
  const paired = handlers.updateCapabilities({ capabilities: ['button', 'target_temperature'] });
  assert.deepEqual(paired.capabilitiesOptions.target_temperature, { min: 12, max: 32, step: 0.5 });
  handlers.updateCapabilitiesOptions({ button: { title: 'Open' }, target_temperature: { max: 40 } });
  assert.equal(paired.capabilitiesOptions.button.title.en, 'Open');
  assert.deepEqual(paired.capabilitiesOptions.target_temperature, { min: 12, max: 40, step: 0.5 });
  assert.throws(() => handlers.updateCapabilitiesOptions({ button: { decimals: 2 } }), /repair.invalid/);
});

test('repair rejects numeric options on non-numeric capabilities before changes', async () => {
  const { handlers, calls } = setup();
  await assert.rejects(handlers.repairSave({
    class: 'socket', capabilities: ['onoff'], options: { onoff: { min: 1 } },
  }), /repair.invalid/);
  assert.deepEqual(calls, []);
});

test('repair checks numeric bounds against Homey defaults when an override is absent', async () => {
  const { handlers, device, calls } = setup();
  device.options.target_temperature = {};
  await assert.rejects(handlers.repairSave({
    class: 'socket', capabilities: ['onoff', 'target_temperature'], options: { target_temperature: { min: 40 } },
  }), /repair.invalid/);
  assert.deepEqual(calls, []);
});

test('repair can clear a custom name and number without losing unrelated options', async () => {
  const { handlers, device } = setup();
  device.options.target_temperature.title = { en: 'Room' };
  await handlers.repairSave({
    class: 'socket', capabilities: ['onoff', 'target_temperature'],
    options: { target_temperature: { title: null, step: null } },
  });
  assert.deepEqual(device.options.target_temperature, { min: 5, max: 35, units: '°C' });
});

test('repair rejects invalid input before making changes', async () => {
  const { handlers, calls } = setup();
  for (const payload of [
    { class: 'socket', capabilities: [] },
    { class: 'socket', capabilities: ['onoff', 'onoff'] },
    { class: 'invalid', capabilities: ['onoff'] },
    { class: 'socket', capabilities: ['not_a_capability'] },
    { class: 'socket', capabilities: ['target_temperature'], options: { target_temperature: { min: 20, max: 10, step: 1 } } },
    { class: 'socket', capabilities: ['onoff'], icon: { location: '../../bad.svg' } },
    { class: 'socket', capabilities: ['onoff'], options: null },
    { class: 'socket', capabilities: ['target_temperature'], options: { target_temperature: { min: 5, max: 35, step: 1, extra: true } } },
    { class: 'socket', capabilities: ['onoff'], icon: { upload: 'data:image/svg+xml;base64,YmFk' } },
  ]) {
    await assert.rejects(handlers.repairSave(payload));
  }
  assert.deepEqual(calls, []);
  assert.equal(writes.length, 0);
});

test('icon storage rejects invalid paths and invalid uploads', () => {
  assert.throws(() => iconStorage.iconReference('../other'), /Invalid device ID/);
  assert.throws(() => iconStorage.decodeIcon('data:image/svg+xml;base64,YmFk'), /Invalid SVG/);
  assert.throws(() => iconStorage.decodeIcon('data:image/png;base64,AAAA'), /Invalid SVG/);
  assert.equal(iconStorage.hasEditableIcon({ id: 'test-id', icon: '../../../userdata/test-id.svg' }), true);
  assert.equal(iconStorage.hasEditableIcon({ id: 'test-id', icon: '../../../userdata/other.svg' }), false);
});

test('legacy icons stay unchanged while other edits remain possible', async () => {
  const { handlers, device } = setup('light.svg');
  assert.equal(handlers.repairLoad().iconEditable, false);
  await assert.rejects(handlers.repairSave({ class: 'light', capabilities: ['onoff'], icon: { location: 'light.svg' } }), /repair.legacy_icon/);
  await handlers.repairSave({ class: 'light', capabilities: ['onoff'] });
  assert.equal(device.class, 'light');
  assert.equal(writes.length, 0);
});

test('repair writes selected and uploaded icons to the existing device file', async () => {
  const { handlers } = setup();
  const base = { class: 'socket', capabilities: ['onoff'] };
  assert.deepEqual(await handlers.repairSave({ ...base, icon: { location: 'light.svg' } }), { iconChanged: true });
  assert.equal(writes[0].id, 'test-id');
  assert.match(writes[0].contents.toString(), /<svg/);
  const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>');
  await handlers.repairSave({ ...base, icon: { upload: `data:image/svg+xml;base64,${svg.toString('base64')}` } });
  assert.deepEqual(writes[1].contents, svg);
});

test('repair propagates failed operations and does not continue', async () => {
  const { handlers, device, calls } = setup();
  device.setClass = async () => { throw new Error('class failed'); };
  await assert.rejects(handlers.repairSave({ class: 'light', capabilities: ['dim'] }), /class failed/);
  assert.deepEqual(calls.map(call => call[0]), ['add', 'register']);
  assert.equal(writes.length, 0);
});

test('newly added capabilities use the existing virtual capability listener', async () => {
  const device = new Device();
  let listener;
  const events = [];
  device.getName = () => 'Test';
  device.log = () => {};
  device.hasCapability = id => id === 'onoff';
  device.setCapabilityValue = async (id, value) => { events.push([id, value]); };
  device.registerMultipleCapabilityListener = (ids, callback) => { assert.deepEqual(ids, ['dim']); listener = callback; };
  device.homey = { flow: {
    getTriggerCard: () => ({ trigger: async tokens => events.push(tokens) }),
    getDeviceTriggerCard: () => ({ trigger: async () => {} }),
  } };
  device.registerVirtualCapabilities(['dim']);
  await listener({ dim: 0.5 }, {});
  assert.deepEqual(events[0], ['onoff', true]);
  assert.deepEqual(events[1], { device: 'Test', variable: 'dim', value: '0.5' });
});
