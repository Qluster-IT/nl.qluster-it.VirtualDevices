'use strict';

const assert = require('node:assert/strict');
const Module = require('node:module');
const test = require('node:test');

const originalLoad = Module._load;
Module._load = function (request, parent, isMain) {
  if (request === 'homey') return { Driver: class {}, Device: class {} };
  return originalLoad.call(this, request, parent, isMain);
};
const Driver = require('../drivers/multi/driver');
const Device = require('../drivers/multi/device');
Module._load = originalLoad;
const errors = require('../.homeycompose/locales/en.json').flow_errors;

test('multi-mode actions report missing and invalid modes instead of succeeding', async () => {
  let run;
  const driver = new Driver();
  driver.log = () => {};
  driver.error = () => {};
  driver.homey = {
    __: key => errors[key.split('.').pop()],
    flow: { getActionCard: () => ({ registerRunListener(listener) { run = listener; } }) },
  };
  driver.registerFlowCardAction('multi_set_state', 'multi_state');
  const device = {
    getName: () => 'Multi',
    isStateAllowed: state => state === 'Home',
    getData: () => ({ state_names: { 'onoff.opt1': 'Home' } }),
    getMultiState: () => 'Home',
  };
  await assert.rejects(run({}), { message: errors.device });
  await assert.rejects(run({ device }), { message: errors.mode });
  await assert.rejects(run({ device, multi_state: 'Missing' }), { message: errors.mode });
  await run({ device, multi_state: 'Home' });
});

test('multi-mode action waits for updates and reports failures without triggering', async () => {
  let run;
  let resolveUpdate;
  let triggers = 0;
  const logged = [];
  const driver = new Driver();
  driver.log = () => {};
  driver.error = (...args) => logged.push(args);
  driver.homey = {
    __: key => errors[key.split('.').pop()],
    flow: { getActionCard: () => ({ registerRunListener(listener) { run = listener; } }) },
  };
  driver.registerFlowCardAction('multi_set_state', 'multi_state', {
    trigger() { triggers++; return Promise.resolve(); },
  });
  const device = {
    getName: () => 'Multi',
    isStateAllowed: state => state === 'Away',
    getMultiState: () => 'Home',
    setMultiState: () => new Promise(resolve => { resolveUpdate = resolve; }),
  };
  let completed = false;
  const pending = run({ device, multi_state: 'Away' }).then(value => { completed = true; return value; });
  await Promise.resolve();
  assert.equal(completed, false);
  assert.equal(triggers, 0);
  resolveUpdate();
  assert.equal(await pending, true);
  assert.equal(triggers, 1);

  const failure = new Error('update failed');
  device.setMultiState = async () => { throw failure; };
  await assert.rejects(run({ device, multi_state: 'Away' }), { message: errors.set_failed });
  assert.equal(triggers, 1);
  assert.equal(logged[0][1], failure);
});

test('multi-mode device propagates capability failures to its caller', async () => {
  const device = new Device();
  const failure = new Error('update failed');
  const updates = [];
  device.log = () => {};
  device.getData = () => ({ state_names: { 'onoff.opt1': 'Home', 'onoff.opt2': 'Away' } });
  device.hasCapability = () => true;
  device.getCapabilityValue = () => 'Home';
  device.setCapabilityValue = async (id, value) => {
    updates.push([id, value]);
    if (id === 'onoff.opt1') throw failure;
  };
  await assert.rejects(device.setMultiState('Away'), failure);
  assert.deepEqual(updates, [
    ['previous_state', 'Home'],
    ['onoff.opt1', false],
  ]);

  updates.length = 0;
  device.setCapabilityValue = async (id, value) => { updates.push([id, value]); };
  await device.setMultiState('Away');
  assert.deepEqual(updates, [
    ['previous_state', 'Home'],
    ['onoff.opt1', false],
    ['onoff.opt2', true],
    ['multi_state', 'Away'],
  ]);
});

test('multi-mode device control propagates update failures without triggering', async () => {
  const device = new Device();
  const failure = new Error('update failed');
  let listener;
  let triggered = false;
  device.log = () => {};
  device.getName = () => 'Multi';
  device.getState = () => ({});
  device.getCapabilities = () => ['onoff.opt1'];
  device.getData = () => ({ state_names: { 'onoff.opt1': 'Away' } });
  device.getCapabilityValue = () => 'Home';
  device.setMultiState = async () => { throw failure; };
  device.registerMultipleCapabilityListener = (capabilities, callback) => { listener = callback; };
  device.homey = { flow: { getDeviceTriggerCard: () => ({
    trigger() { triggered = true; return Promise.resolve(); },
  }) } };
  device.onInit();
  await assert.rejects(listener({ 'onoff.opt1': true }), failure);
  assert.equal(triggered, false);
});
