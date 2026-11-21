'use strict';

const assert = require('node:assert/strict');
const http = require('node:http');
const Module = require('node:module');
const { Readable, Writable } = require('node:stream');
const test = require('node:test');
const media = require('../drivers/virtual_switch/media');

const originalLoad = Module._load;
Module._load = function (request, parent, isMain) {
  if (request === 'homey') return { Device: class {}, Driver: class {} };
  return originalLoad.call(this, request, parent, isMain);
};
const Device = require('../drivers/virtual_switch/device');
const Driver = require('../drivers/virtual_switch/driver');
Module._load = originalLoad;

function setup(deviceClass = 'camera', version = '12.7.0', store = {}) {
  const calls = [];
  const device = new Device();
  device.homey = {
    version, platform: 'local', platformVersion: 2, __: key => key,
    images: {
      async createImage() {
        return {
          setStream(fn) { this.stream = fn; },
          async update() { calls.push('image-update'); },
          async unregister() { calls.push('image-unregister'); },
        };
      },
    },
    videos: {
      async createVideoRTSP() { return video('rtsp'); },
      async createVideoHLS() { return video('hls'); },
      async createVideoDASH() { return video('dash'); },
      async createVideoRTMP() { return video('rtmp'); },
      async createVideoOther() { return video('other'); },
    },
  };
  function video(type) {
    calls.push(type);
    return {
      registerVideoUrlListener(fn) { this.listener = fn; },
      async unregister() { calls.push('video-unregister'); },
    };
  }
  device.log = () => {};
  device.error = () => {};
  device.getName = () => 'Media device';
  device.getClass = () => deviceClass;
  device.getCapabilities = () => [];
  device.getStoreValue = key => store[key];
  device.setStoreValue = async (key, value) => { store[key] = value; };
  device.unsetStoreValue = async key => { delete store[key]; };
  device.setCameraImage = async (id, name, image) => { calls.push(['camera', id, image]); };
  device.setAlbumArtImage = async image => { calls.push(['album', image]); };
  device.setCameraVideo = async (id, name, video) => { calls.push(['video', id, video]); };
  return { device, calls, store };
}

async function contents(image) {
  const chunks = [];
  const writable = new Writable({ write(chunk, encoding, callback) { chunks.push(chunk); callback(); } });
  const metadata = await image.stream(writable);
  return { bytes: Buffer.concat(chunks).toString(), metadata };
}

test('camera image and token survive initialization and changing image sources', async () => {
  const { device, calls, store } = setup();
  await device.onInit();
  const token = { async getStream() { const stream = Readable.from([Buffer.from('snapshot')]); stream.meta = { contentType: 'image/png' }; return stream; } };
  await device.setMediaImageFromToken('camera', token);
  assert.equal(store.cameraImage.contentType, 'image/png');
  assert.deepEqual(await contents(device.mediaImages.camera), { bytes: 'snapshot', metadata: { contentType: 'image/png' } });
  const restored = setup('camera', '12.7.0', store);
  await restored.device.onInit();
  assert.equal((await contents(restored.device.mediaImages.camera)).bytes, 'snapshot');
  assert.equal(calls.filter(item => Array.isArray(item) && item[0] === 'camera').length, 1);
  await device.setMediaImage('camera', null);
  assert.equal(store.cameraImage, undefined);
  assert.ok(calls.includes('image-unregister'));
});

test('image URLs handle local HTTP redirects, invalid responses and size limits', async t => {
  const server = http.createServer((request, response) => {
    if (request.url === '/redirect') { response.writeHead(302, { location: '/image' }); response.end(); }
    else if (request.url === '/large') { response.writeHead(200); response.end(Buffer.alloc(5 * 1024 * 1024 + 1)); }
    else if (request.url === '/missing') { response.writeHead(404); response.end(); }
    else { response.writeHead(200, { 'content-type': 'image/png' }); response.end('image'); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  const { device } = setup();
  await device.onInit();
  await device.setMediaImage('camera', { url: `${base}/redirect` });
  assert.deepEqual(await contents(device.mediaImages.camera), { bytes: 'image', metadata: { contentType: 'image/png' } });
  await device.setMediaImage('camera', { url: `${base}/missing` });
  await assert.rejects(contents(device.mediaImages.camera), /404/);
  await device.setMediaImage('camera', { url: `${base}/large` });
  await assert.rejects(contents(device.mediaImages.camera), /5 MB/);
});

test('rejects invalid URLs, missing tokens and oversized token images', async () => {
  assert.throws(() => media.imageUrl('file:///etc/passwd'), /Invalid image URL/);
  await assert.rejects(media.copyToken(null), /image token/);
  await assert.rejects(media.copyToken({ getStream: async () => Readable.from([Buffer.alloc(5 * 1024 * 1024 + 1)]) }), /5 MB/);
  const { device } = setup('light');
  await device.onInit();
  await assert.rejects(device.setMediaImage('camera', { url: 'https://example.com/image' }), /not a camera/);
});

test('album images are attached only to speakers and camera video is version gated', async () => {
  const speaker = setup('speaker');
  await speaker.device.onInit();
  await speaker.device.setMediaImage('album', { url: 'https://example.com/album' });
  assert.equal(speaker.calls[0][0], 'album');
  await assert.rejects(speaker.device.setMediaImage('camera', { url: 'https://example.com/image' }), /not a camera/);
  const old = setup('camera', '12.6.1');
  await old.device.onInit();
  await assert.rejects(old.device.setCameraVideoUrl('rtsp://192.168.1.1/live'), /not supported/);
  const current = setup('doorbell');
  await current.device.onInit();
  await current.device.setCameraVideoUrl('rtsp://192.168.1.1/live');
  assert.equal((await current.device.cameraVideo.listener()).url, 'rtsp://192.168.1.1/live');
  await current.device.setCameraVideoUrl('https://example.com/stream.m3u8');
  assert.ok(current.calls.includes('video-unregister'));
  assert.ok(current.calls.includes('hls'));
  await current.device.setCameraVideoUrl('');
  assert.equal(current.store.cameraVideoUrl, undefined);
});

test('pairing preserves media drafts and validates URLs before creating a device', () => {
  const driver = new Driver();
  driver.homey = { version: '12.7.0', platform: 'local', platformVersion: 2, videos: {}, __: key => key };
  const handlers = {};
  driver.onPair({ setHandler(name, handler) { handlers[name] = handler; } });
  handlers.setClass({ class: 'camera' });
  handlers.setMediaDraft({ image: 'http://camera/image', video: 'rtsp://camera/live' });
  assert.equal(handlers.getMediaDraft().image, 'http://camera/image');
  assert.throws(() => handlers.updateMedia({ image: 'file:///bad', video: '' }), /Invalid image URL/);
  handlers.updateMedia(handlers.getMediaDraft());
  assert.equal(handlers.getPairingDevice().store.cameraImage.url, 'http://camera/image');
  assert.equal(handlers.getPairingDevice().store.cameraVideoUrl, 'rtsp://camera/live');
});

test('media flow cards pass URL and image tags to the selected device', async () => {
  const driver = new Driver();
  const listeners = {};
  driver.log = () => {};
  driver.homey = {
    app: { registerReleaseDriver() {} },
    flow: {
      getActionCard(id) {
        return {
          registerRunListener(listener) { listeners[id] = listener; return this; },
          registerArgumentAutocompleteListener() {},
        };
      },
    },
  };
  driver.onInit();
  const camera = setup();
  await camera.device.onInit();
  await listeners.set_camera_image_url({ device: camera.device, url: 'http://camera/image' });
  assert.equal(camera.store.cameraImage.url, 'http://camera/image');
  const speaker = setup('speaker');
  await speaker.device.onInit();
  await listeners.set_album_image_token({ device: speaker.device, droptoken: { getStream: async () => Readable.from([Buffer.from('art')]) } });
  assert.equal((await contents(speaker.device.mediaImages.album)).bytes, 'art');
  await assert.rejects(listeners.set_camera_image_token({ device: camera.device, droptoken: null }), /image token/);
});

test('failed persistence restores the previous image and later changes still work', async () => {
  const { device, store } = setup();
  await device.onInit();
  await device.setMediaImage('camera', { url: 'http://camera/old' });
  const save = device.setStoreValue;
  device.setStoreValue = async () => { throw new Error('Storage failed'); };
  await assert.rejects(device.setMediaImage('camera', { url: 'http://camera/new' }), /Storage failed/);
  assert.equal(store.cameraImage.url, 'http://camera/old');
  device.setStoreValue = save;
  await device.setMediaImage('camera', { url: 'http://camera/final' });
  assert.equal(store.cameraImage.url, 'http://camera/final');
});
