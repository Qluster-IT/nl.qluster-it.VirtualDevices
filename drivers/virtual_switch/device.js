'use strict';

const Homey = require('homey');
const { hasEditableIcon, deleteIcon } = require('./icon-storage');
const media = require('./media');

//a list of devices, with their 'id' as key
//it is generally advisable to keep a list of
//paired and active devices in your driver's memory.
var devices = {};

class VirtualDevice extends Homey.Device {
  async onInit() {
    this.log('Virtual Device (' + this.getName() + ') initialized');

		// this.log('name:        ', this.getName());
    // this.log('id:          ', this.getData().id);
    // this.log('version:     ', this.getData().version);
    // this.log('icon:        ', this.getData().icon);
    // this.log('class:       ', this.getClass());
    // this.log('capabilities:', JSON.stringify(this.getCapabilities()));
    // this.getCapabilities().forEach(capability => {
    //   this.log('capabilityOptions - ' + capability + ':', JSON.stringify(this.getCapabilityOptions(capability)));      
    // });
    // this.log('state:       ', this.getState());

    this.registerVirtualCapabilities(this.getCapabilities());
    const pendingEnergy = this.getStoreValue('pendingEnergy');
    if (pendingEnergy) {
      await this.setEnergy(pendingEnergy);
      await this.unsetStoreValue('pendingEnergy');
    }
    this.mediaImages = {};
    this.mediaQueue = Promise.resolve();
    for (const kind of ['camera', 'album']) {
      const source = this.getStoreValue(`${kind}Image`);
      if (source) await this.applyMediaImage(kind, source);
    }
    const video = this.getStoreValue('cameraVideoUrl');
    if (video && media.supportsVideo(this.homey)) await this.applyCameraVideo(video);
  }

  queueMedia(operation) {
    const next = this.mediaQueue.then(operation);
    // Keep later edits usable while the caller still receives this failure.
    this.mediaQueue = next.catch(() => {});
    return next;
  }

  async applyMediaImage(kind, source) {
    let image = this.mediaImages[kind];
    if (!source) {
      if (image) {
        await image.unregister();
        delete this.mediaImages[kind];
      }
      return;
    }
    const created = !image;
    if (created) image = await this.homey.images.createImage();
    if (source.url) {
      const url = media.imageUrl(source.url);
      image.setStream(async stream => {
        const response = await media.getResponse(url);
        await media.pipeline(response, media.limitStream(), stream);
        return { contentType: response.headers['content-type'] || 'image/jpeg' };
      });
    } else {
      const bytes = Buffer.from(source.data, 'base64');
      image.setStream(async stream => {
        await media.pipeline(media.Readable.from(bytes), stream);
        return { contentType: source.contentType };
      });
    }
    try {
      if (created) {
        if (kind === 'camera') await this.setCameraImage('main', this.homey.__('media.camera'), image);
        else await this.setAlbumArtImage(image);
        this.mediaImages[kind] = image;
      }
      await image.update();
    } catch (error) {
      if (created) {
        try { await image.unregister(); } catch (cleanupError) { this.error('Could not unregister image', cleanupError); }
        delete this.mediaImages[kind];
      }
      throw error;
    }
  }

  setMediaImage(kind, source) {
    return this.queueMedia(async () => {
      if (kind === 'camera' && !media.CAMERA_CLASSES.includes(this.getClass())) throw new Error('This device is not a camera or doorbell');
      if (kind === 'album' && this.getClass() !== 'speaker') throw new Error('This device is not a speaker');
      const key = `${kind}Image`;
      const previous = this.getStoreValue(key);
      try {
        await this.applyMediaImage(kind, source);
        if (source) await this.setStoreValue(key, source);
        else await this.unsetStoreValue(key);
      } catch (error) {
        try { await this.applyMediaImage(kind, previous); }
        catch (restoreError) { this.error('Could not restore previous image', restoreError); }
        throw error;
      }
    });
  }

  async setMediaImageFromToken(kind, token) {
    return this.setMediaImage(kind, await media.copyToken(token));
  }

  async applyCameraVideo(url) {
    const previous = this.cameraVideo;
    if (!url) {
      if (previous) await previous.unregister();
      this.cameraVideo = null;
      return;
    }
    const video = await media.videoFactory(this.homey, url);
    video.registerVideoUrlListener(async () => ({ url }));
    try {
      await this.setCameraVideo('main', this.homey.__('media.camera'), video);
    } catch (error) {
      await video.unregister();
      throw error;
    }
    this.cameraVideo = video;
    if (previous) await previous.unregister();
  }

  setCameraVideoUrl(url) {
    return this.queueMedia(async () => {
      if (!media.CAMERA_CLASSES.includes(this.getClass())) throw new Error('This device is not a camera or doorbell');
      if (!media.supportsVideo(this.homey)) throw new Error('Video is not supported on this Homey');
      const normalized = media.videoUrl(url, true);
      const previous = this.getStoreValue('cameraVideoUrl') || '';
      try {
        await this.applyCameraVideo(normalized);
        if (normalized) await this.setStoreValue('cameraVideoUrl', normalized);
        else await this.unsetStoreValue('cameraVideoUrl');
      } catch (error) {
        try { await this.applyCameraVideo(previous); }
        catch (restoreError) { this.error('Could not restore previous video'); }
        throw error;
      }
    });
  }

  registerVirtualCapabilities(capabilities) {
    if (!capabilities.length) return;
    this.registerMultipleCapabilityListener(capabilities, (changedCapabs, optsObj) => {
      this.log(this.getName() + ' -> Capability changed: ' + JSON.stringify(changedCapabs));

      for (var capability in changedCapabs) {
        var value = changedCapabs[capability];
        // this.log('capability: ' + capability);
        // this.log('value:    ' + value);

        if ( capability === 'onoff' ) {
          if ( this.getCapabilityValue('onoff') === value ) {
            return Promise.resolve(); // no change, no triggers
          }
        }

        if (capability === 'dim' && this.hasCapability( 'onoff' )) {
          if ( value > 0 ) {
            this.setCapabilityValue( 'onoff', true );
          } else {
            this.setCapabilityValue( 'onoff', false );
          }
        }

        process.nextTick(async () => {
          await sleep(100);
          this.homey.flow.getDeviceTriggerCard('press').trigger( this, {}, null ) // , changedCapabs )
            .catch( this.error );
        });

        let tokens = {
            'device': this.getName(),
            'variable': capability,
            'value': '' + value
        };
        this.homey.flow.getTriggerCard('device_changed').trigger( tokens ) // Fire and forget
          .catch( this.error )
      }

      return Promise.resolve();
    }, 500);
  }

  // this method is called when the Device is added
  onAdded() {
    this.log('Adding device');
    this.log('Adding device: ' + this.getName() + ' (' + this.getData().id + ')');
  }

  // this method is called when the Device is deleted
  async onDeleted() {
    this.log('device deleted: ' + this.getName());
    for (const image of Object.values(this.mediaImages || {})) {
      try { await image.unregister(); } catch (error) { this.error(error); }
    }
    if (this.cameraVideo) {
      try { await this.cameraVideo.unregister(); } catch (error) { this.error(error); }
    }
    if (hasEditableIcon(this.getData())) {
      try { await deleteIcon(this.getData().id); } catch (error) { this.error(error); }
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = VirtualDevice;
