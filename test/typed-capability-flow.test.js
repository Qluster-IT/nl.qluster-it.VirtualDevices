'use strict';

const assert = require('node:assert/strict');
const Module = require('node:module');
const test = require('node:test');

const originalLoad = Module._load;
Module._load = function (request, parent, isMain) {
  if (request === 'homey') return { Driver: class {} };
  return originalLoad.call(this, request, parent, isMain);
};
const Driver = require('../drivers/virtual_switch/driver');
Module._load = originalLoad;

test('typed actions follow existing actions in the composed manifest', () => {
  const actions = require('../app.json').flow.actions;
  const existing = ['set_sensor_value', 'set_sensor_value_oc', 'mode_action_on', 'mode_action_off',
    'mode_state_on', 'mode_state_off', 'multi_set_state', 'set_album_image_token',
    'set_album_image_url', 'set_camera_image_token', 'set_camera_image_url'];
  const added = ['set_capability_boolean', 'set_capability_enum', 'set_capability_number', 'set_capability_string'];
  const ids = actions.map(action => action.id);
  assert.ok([...existing, ...added].every(id => ids.includes(id)));
  assert.ok(Math.max(...existing.map(id => ids.indexOf(id))) < Math.min(...added.map(id => ids.indexOf(id))));
  for (const [id, input] of [['set_capability_number', 'number'], ['set_capability_boolean', 'checkbox'],
    ['set_capability_string', 'text'], ['set_capability_enum', 'autocomplete']]) {
    assert.equal(actions.find(action => action.id === id).args.find(arg => arg.name === 'value').type, input);
  }
});

function setup(type) {
  const listeners = {};
  const calls = [];
  const device = {
    getCapabilities: () => ['measure_temperature', 'meter_power.imported', 'onoff', 'speaker_track', 'battery_charging_state'],
    async setCapabilityValue(id, value) { calls.push({ id, value }); },
  };
  const card = {
    registerRunListener(listener) { listeners.run = listener; },
    registerArgumentAutocompleteListener(name, listener) { listeners[name] = listener; },
  };
  const driver = new Driver();
  driver.homey = { flow: { getActionCard: () => card }, i18n: { getLanguage: () => 'en' } };
  driver.registerTypedCapabilityAction(type);
  return { listeners, device, calls };
}

test('typed pickers filter capabilities by type and search, including sub-capabilities', async () => {
  const { listeners, device } = setup('number');
  assert.deepEqual(await listeners.capability('POWER', { device }), [{ id: 'meter_power.imported', name: 'meter_power.imported' }]);
  assert.deepEqual(await listeners.capability('onoff', { device }), []);
});

test('typed actions preserve numbers, booleans and numeric-looking text', async () => {
  for (const [type, id, value] of [
    ['number', 'measure_temperature', -1.25],
    ['boolean', 'onoff', false],
    ['string', 'speaker_track', '123'],
  ]) {
    const { listeners, device, calls } = setup(type);
    await listeners.run({ device, capability: { id }, value });
    assert.deepEqual(calls, [{ id, value }]);
  }
});

test('typed actions reject stale or mismatched capabilities and invalid values', async () => {
  const { listeners, device, calls } = setup('number');
  await assert.rejects(listeners.run({ device, capability: { id: 'onoff' }, value: 1 }), /Invalid number capability/);
  await assert.rejects(listeners.run({ device, capability: { id: 'measure_humidity' }, value: 1 }), /Invalid number capability/);
  await assert.rejects(listeners.run({ device, capability: { id: 'measure_temperature' }, value: NaN }), /Invalid number value/);
  await assert.rejects(listeners.run({ device, capability: { id: 'measure_temperature' }, value: '1' }), /Invalid number value/);
  assert.deepEqual(calls, []);
});

test('choice action offers localized values and rejects stale choices', async () => {
  const { listeners, device, calls } = setup('enum');
  const capability = { id: 'battery_charging_state' };
  const options = await listeners.value('charg', { device, capability });
  assert.ok(options.some(option => option.id === 'charging' && option.name === 'Charging'));
  await listeners.run({ device, capability, value: options.find(option => option.id === 'charging') });
  assert.deepEqual(calls, [{ id: capability.id, value: 'charging' }]);
  await assert.rejects(listeners.run({ device, capability, value: { id: 'missing' } }), /Invalid choice/);
});
