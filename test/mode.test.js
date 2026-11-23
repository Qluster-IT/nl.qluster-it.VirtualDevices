'use strict';

const assert = require('node:assert/strict');
const Module = require('node:module');
const test = require('node:test');

const originalLoad = Module._load;
Module._load = function (request, parent, isMain) {
  if (request === 'homey') return { Driver: class {} };
  return originalLoad.call(this, request, parent, isMain);
};
const Driver = require('../drivers/mode/driver');
Module._load = originalLoad;

function setup(trigger) {
  let listener;
  const driver = new Driver();
  driver.log = () => {};
  driver.error = () => {};
  driver.homey = { __: key => require('../.homeycompose/locales/en.json').flow_errors[key.split('.').pop()], flow: { getActionCard: () => ({
    registerRunListener(callback) { listener = callback; },
  }) } };
  driver.registerFlowCardAction('mode_action_on', true, [trigger]);
  return listener;
}

test('mode action waits for the state change before succeeding or triggering', async () => {
  let resolveUpdate;
  let triggered = false;
  const listener = setup({ trigger() { triggered = true; return Promise.resolve(); } });
  const device = {
    getName: () => 'Mode',
    getCapabilityValue: () => false,
    setCapabilityValue: () => new Promise(resolve => { resolveUpdate = resolve; }),
  };
  let completed = false;
  const result = listener({ device }).then(value => { completed = true; return value; });
  await Promise.resolve();
  assert.equal(completed, false);
  assert.equal(triggered, false);
  resolveUpdate();
  assert.equal(await result, true);
  assert.equal(triggered, true);
});

test('mode action explains a missing device', async () => {
  const listener = setup({ trigger() { return Promise.resolve(); } });
  await assert.rejects(listener({}), { message: 'Select a device first.' });
});

test('mode action reports failed state updates without firing triggers', async () => {
  let triggered = false;
  const listener = setup({ trigger() { triggered = true; return Promise.resolve(); } });
  const device = {
    getName: () => 'Mode',
    getCapabilityValue: () => false,
    async setCapabilityValue() { throw new Error('update failed'); },
  };
  await assert.rejects(listener({ device }), { message: 'Could not set the capability. Check the value and try again.' });
  assert.equal(triggered, false);
});
