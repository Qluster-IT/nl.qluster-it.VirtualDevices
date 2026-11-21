'use strict';

const assert = require('node:assert/strict');
const Module = require('node:module');
const test = require('node:test');

const originalLoad = Module._load;
Module._load = function (request, parent, isMain) {
  if (request === 'homey') return { App: class {} };
  return originalLoad.call(this, request, parent, isMain);
};
const App = require('../app');
Module._load = originalLoad;

function setup(deviceDriver) {
  const settings = {};
  const notifications = [];
  const drivers = Object.fromEntries(['virtual_switch', 'mode', 'multi'].map(id => [id, {
    async ready() {},
    getDevices() { return id === deviceDriver ? [{}] : []; },
  }]));
  const app = new App();
  app._releaseDrivers = new Map(Object.entries(drivers));
  app.homey = {
    settings: {
      get: key => settings[key],
      set: (key, value) => { settings[key] = value; },
    },
    notifications: { async createNotification(notification) { notifications.push(notification); } },
    __: key => key,
  };
  return { app, settings, notifications, drivers };
}

test('existing devices receive the release notification only once', async () => {
  for (const id of ['virtual_switch', 'mode', 'multi']) {
    const { app, notifications } = setup(id);
    await app._notifyReleaseFeatures();
    await app._notifyReleaseFeatures();
    assert.deepEqual(notifications, [{ excerpt: 'release.notice' }]);
  }
});

test('a fresh installation does not notify after a device is added', async () => {
  const { app, notifications, drivers } = setup();
  await app._notifyReleaseFeatures();
  drivers.virtual_switch.getDevices = () => [{}];
  await app._notifyReleaseFeatures();
  assert.deepEqual(notifications, []);
});

test('driver readiness failure does not mark the upgrade as checked', async () => {
  const { app, settings, drivers } = setup('mode');
  drivers.mode.ready = async () => { throw new Error('driver unavailable'); };
  await assert.rejects(app._notifyReleaseFeatures(), /driver unavailable/);
  assert.equal(settings.release2NotificationAttempted, undefined);
});

test('notification waits for all drivers and their existing devices', async () => {
  const { app, notifications, drivers } = setup('virtual_switch');
  let release;
  drivers.virtual_switch.ready = () => new Promise(resolve => { release = resolve; });
  app.log = () => {};
  app.error = error => { throw error; };
  app.onInit();
  app.registerReleaseDriver('virtual_switch', drivers.virtual_switch);
  app.registerReleaseDriver('mode', drivers.mode);
  assert.deepEqual(notifications, []);
  app.registerReleaseDriver('multi', drivers.multi);
  assert.deepEqual(notifications, []);
  release();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(notifications.length, 1);
});

test('a failed notification is not sent again on restart', async () => {
  const { app, notifications } = setup('mode');
  app.homey.notifications.createNotification = async () => { throw new Error('notification failed'); };
  await assert.rejects(app._notifyReleaseFeatures(), /notification failed/);
  app.homey.notifications.createNotification = async notification => { notifications.push(notification); };
  await app._notifyReleaseFeatures();
  assert.deepEqual(notifications, []);
});
