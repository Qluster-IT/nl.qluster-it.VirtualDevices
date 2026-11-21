'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const vm = require('node:vm');
const path = require('node:path');
const { getCapabilities, getDeviceClasses } = require('homey-lib');
const pairingIcons = require('../drivers/virtual_switch/pairing-icons.json');

const source = fs.readFileSync(
  'drivers/virtual_switch/pair/capabilities.js',
  'utf8',
);
const context = {};
vm.createContext(context);
vm.runInContext(source, context);

test('custom pairing and repair views and their local resources exist at Homey paths', () => {
  for (const driverId of ['virtual_switch', 'mode']) {
    const driver = require(`../drivers/${driverId}/driver.compose.json`);
    for (const kind of ['pair', 'repair']) {
      for (const view of driver[kind] || []) {
        if (view.template) continue;
        const file = path.join('drivers', driverId, kind, `${view.id}.html`);
        assert.ok(fs.existsSync(file), `Missing ${kind} view ${file}`);
        const html = fs.readFileSync(file, 'utf8');
        for (const [, src] of html.matchAll(/<(?:script\s+src|link\s+rel="stylesheet"\s+href)=["']([^"']+)["']/g)) {
          assert.ok(fs.existsSync(path.resolve(path.dirname(file), src)), `Missing resource ${src} in ${file}`);
        }
      }
    }
  }
});

test('pairing waits for the device name to save before continuing', () => {
  const html = fs.readFileSync('drivers/virtual_switch/pair/name.html', 'utf8');
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  const elements = {
    'device-name': { value: '', disabled: true },
    'name-next': { disabled: true },
  };
  const callbacks = {};
  const calls = [];
  const Homey = {
    setTitle() {},
    emit(event, data, callback) { calls.push([event, data]); callbacks[event] = callback; },
    nextView() { calls.push(['nextView']); },
    alert(message) { calls.push(['alert', message]); },
  };
  const view = { Homey, __: key => key, document: { getElementById: id => elements[id] } };
  vm.runInNewContext(script, view);
  assert.equal(elements['device-name'].disabled, true);
  callbacks.getPairingDevice(null, { name: 'Previous name' });
  assert.equal(elements['device-name'].value, 'Previous name');
  elements['device-name'].value = 'New name';
  view.continuePairing();
  assert.equal(elements['name-next'].disabled, true);
  assert.equal(calls.some(([event]) => event === 'nextView'), false);
  assert.equal(calls.at(-1)[1].name, 'New name');
  callbacks.setName(new Error('Save failed'));
  assert.equal(elements['name-next'].disabled, false);
  assert.equal(calls.at(-1)[1], 'Save failed');
  view.continuePairing();
  callbacks.setName(null);
  assert.equal(calls.at(-1)[0], 'nextView');
});

test('pairing and repair icons have a non-percentage height under Homey button styling', () => {
  for (const [file, selector] of [
    ['drivers/virtual_switch/pair/icon.html', '.vd-icon'],
    ['drivers/virtual_switch/repair/repair.html', '.repair-icon span'],
  ]) {
    const html = fs.readFileSync(file, 'utf8');
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    assert.match(html, new RegExp(`${escaped}\\s*\\{[^}]*height:\\s*[1-9]\\d*px`));
    assert.match(html, /height:\s*'48px',\s*WebkitMaskImage/);
  }
});

test('Every Homey device class has a recommended capability list', () => {
  const deviceClasses = getDeviceClasses();

  for (const classId of Object.keys(deviceClasses)) {
    assert.ok(context.devices[classId], `Missing defaults for device class "${classId}"`);
  }
});

test('Every recommended and default capability exists in Homey', () => {
  const capabilities = getCapabilities();

  for (const [classId, defaults] of Object.entries(context.devices)) {
    assert.ok(defaults.capabilities.length > 0, `No recommended capabilities for "${classId}"`);
    assert.ok(
      defaults.defaultCapabilities.length > 0,
      `No preselected capabilities for "${classId}"`,
    );

    for (const capability of defaults.capabilities) {
      assert.ok(capabilities[capability.split('.')[0]], `Unknown capability "${capability}" in "${classId}"`);
    }

    for (const capability of defaults.defaultCapabilities) {
      assert.ok(
        defaults.capabilities.includes(capability),
        `Default "${capability}" is missing from recommendations for "${classId}"`,
      );
    }
  }
});

test('locks suggest an optional open button without preselecting it', () => {
  assert.ok(context.devices.lock.capabilities.includes('button'));
  assert.ok(!context.devices.lock.defaultCapabilities.includes('button'));
});

test('capability option drafts survive earlier responses and failed edits are discarded', () => {
  let component;
  const Vue = {
    component(name, definition) { component = definition; },
    set(object, key, value) { object[key] = value; },
    delete(object, key) { delete object[key]; },
  };
  const script = fs.readFileSync('drivers/virtual_switch/pair/capability-options.js', 'utf8');
  vm.runInNewContext(script, { Vue, Homey: {} });
  let discard;
  const instance = {
    ...component.data(),
    ...component.methods,
    options: { target_temperature: { min: 12 } },
    $emit(event, id, field, value, reject) { discard = reject; },
  };
  const event = { target: { value: '15' } };
  instance.remember('target_temperature', 'min', event);
  instance.change('target_temperature', 'min', event);
  instance.options = { target_temperature: { min: 12, max: 28 } };
  assert.equal(instance.numericValue('target_temperature', 'min'), '15');
  discard();
  assert.equal(instance.numericValue('target_temperature', 'min'), 12);
});

test('Every predefined pairing icon exists', () => {
  const driverSource = fs.readFileSync(
    'drivers/virtual_switch/driver.js',
    'utf8',
  );
  const iconNames = [...driverSource.matchAll(/getIconNameAndLocation\('([^']+)'\)/g)]
    .map((match) => match[1]);

  assert.ok(iconNames.length > 0, 'No predefined pairing icons found');
  for (const iconName of iconNames) {
    assert.ok(
      fs.existsSync(`drivers/virtual_switch/assets/${iconName}.svg`),
      `Missing pairing icon "${iconName}.svg"`,
    );
  }
});

test('Every Homey device class has three distinct available icons', () => {
  for (const classId of Object.keys(getDeviceClasses())) {
    const icons = pairingIcons[classId];
    assert.ok(Array.isArray(icons), `Missing icons for "${classId}"`);
    assert.equal(new Set(icons).size, 3, `Expected three distinct icons for "${classId}"`);
    for (const icon of icons) {
      assert.match(icon, /^[a-z0-9-]+$/);
      const file = `drivers/virtual_switch/assets/mdi/${icon}.svg`;
      assert.ok(fs.existsSync(file), `Missing icon "${file}"`);
      assert.match(fs.readFileSync(file, 'utf8'), /xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
    }
  }
});

test('every supported language has single-word English virtual device search tags', () => {
  const manifest = require('../.homeycompose/app.json');
  for (const language of Object.keys(manifest.name)) {
    for (const tag of ['virtual', 'device', 'devices']) {
      assert.ok(manifest.tags[language].includes(tag), `Missing "${tag}" tag for ${language}`);
    }
    assert.ok(manifest.tags[language].every(tag => !/\s/.test(tag)), `Multi-word tag for ${language}`);
  }
});

async function loadCapabilityView(supported, selected) {
  const html = fs.readFileSync('drivers/virtual_switch/pair/capabilities.html', 'utf8');
  const script = html.match(/<script>\s*([\s\S]*?)<\/script>/)[1];
  const updates = [];
  const device = { class: 'light', name: 'Test', capabilities: selected, capabilitiesOptions: {} };
  const instances = [];
  function Vue(config) {
    Object.assign(this, config.data);
    Object.assign(this, config.methods);
    this.$forceUpdate = () => {};
    instances.push(this);
  }
  const Homey = {
    setTitle() {},
    emit(event, data, callback) {
      if (event === 'getAllCapabilities') return Promise.resolve(supported);
      if (event === 'getPairingDevice') return callback(null, device);
      if (event === 'updateCapabilities') {
        updates.push(data.capabilities.slice());
        return callback(null, { ...device, capabilities: data.capabilities });
      }
    },
  };
  const browser = { Vue, Homey, __: key => key, _: { debounce: callback => callback }, console: { log() {} }, devices: context.devices, default_options: context.default_options };
  vm.runInNewContext(script, browser);
  await new Promise(resolve => setImmediate(resolve));
  return { instances, updates };
}

test('pairing only shows supported recommendations and preselects a supported fallback', async () => {
  const { instances, updates } = await loadCapabilityView({ dim: { title: 'Dim' } }, []);
  assert.deepEqual(Array.from(instances[1].capabilities), ['dim']);
  assert.deepEqual(Array.from(instances[1].selectedCapabilities), ['dim']);
  assert.equal(instances[1].capabilityTitles.dim, 'Dim');
  assert.deepEqual(Array.from(updates.at(-1)), ['dim']);
});

test('returning to capabilities preserves recommended and other selections', async () => {
  const { instances, updates } = await loadCapabilityView(
    { onoff: { title: 'On/off' }, dim: { title: 'Dim' }, alarm_smoke: { title: 'Smoke' } },
    ['dim', 'alarm_smoke'],
  );
  assert.deepEqual(Array.from(instances[1].selectedCapabilities), ['dim']);
  assert.deepEqual(Array.from(instances[2].selectedCapabilities), ['alarm_smoke']);
  assert.deepEqual(Array.from(updates.at(-1)), ['dim', 'alarm_smoke']);
});

test('pairing options wait for edits before creating the device', async () => {
  const html = fs.readFileSync('drivers/virtual_switch/pair/capability_options.html', 'utf8');
  const script = html.match(/<script>\s*([\s\S]*?)<\/script>/)[1];
  let view;
  let resolveEdit;
  let shown = false;
  const Homey = {
    setTitle() {},
    alert() {},
    showView(id) { assert.equal(id, 'done'); shown = true; },
    emit(event) {
      if (event === 'getAllCapabilities') return Promise.resolve({ button: { title: 'Button' } });
      if (event === 'getPairingDevice') return Promise.resolve({ capabilities: ['button'], capabilitiesOptions: {} });
      if (event === 'getEnergyDraft' || event === 'energySupport') return Promise.resolve({});
      if (event === 'updateEnergy') return Promise.resolve();
      if (event === 'updateCapabilitiesOptions') return new Promise(resolve => { resolveEdit = resolve; });
      throw new Error(`Unexpected event ${event}`);
    },
  };
  function Vue(config) {
    Object.assign(this, config.data, config.methods);
    view = this;
  }
  vm.runInNewContext(script, { Vue, Homey, __: key => key, Promise });
  await new Promise(resolve => setImmediate(resolve));
  view.changeOption('button', 'title', 'Open', () => {});
  const finish = view.finish();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(shown, false);
  resolveEdit({ capabilitiesOptions: { button: { title: { en: 'Open' } } } });
  await finish;
  assert.equal(shown, true);
});

test('pairing options prevent creation when an edit fails', async () => {
  const html = fs.readFileSync('drivers/virtual_switch/pair/capability_options.html', 'utf8');
  const script = html.match(/<script>\s*([\s\S]*?)<\/script>/)[1];
  let view;
  let shown = false;
  let alerts = 0;
  let discarded = false;
  const Homey = {
    setTitle() {},
    alert() { alerts++; },
    showView() { shown = true; },
    emit(event) {
      if (event === 'getAllCapabilities') return Promise.resolve({ button: { title: 'Button' } });
      if (event === 'getPairingDevice') return Promise.resolve({ capabilities: ['button'], capabilitiesOptions: {} });
      if (event === 'getEnergyDraft' || event === 'energySupport') return Promise.resolve({});
      if (event === 'updateCapabilitiesOptions') return Promise.reject(new Error('Invalid option'));
      throw new Error(`Unexpected event ${event}`);
    },
  };
  function Vue(config) {
    Object.assign(this, config.data, config.methods);
    view = this;
  }
  vm.runInNewContext(script, { Vue, Homey, __: key => key, Promise });
  await new Promise(resolve => setImmediate(resolve));
  view.changeOption('button', 'title', 'Open', () => { discarded = true; });
  await view.finish();
  assert.equal(shown, false);
  assert.equal(alerts, 1);
  assert.equal(discarded, true);
  assert.equal(view.saving, false);
});

test('repair options step preserves edits when navigating back', async () => {
  const html = fs.readFileSync('drivers/virtual_switch/repair/repair.html', 'utf8');
  const script = html.match(/<script>\s*([\s\S]*?)<\/script>/)[1];
  let repair;
  let warnings = 0;
  const Vue = function (config) {
    Object.assign(this, config.data, config.methods);
    repair = this;
  };
  Vue.set = (object, key, value) => { object[key] = value; };
  const Homey = {
    setTitle() {},
    alert() { warnings++; },
    emit() { return new Promise(() => {}); },
  };
  vm.runInNewContext(script, { Vue, Homey, __: key => key });
  await repair.next();
  assert.equal(warnings, 1);
  assert.equal(repair.step, 'selection');
  repair.selected = ['button'];
  await repair.next();
  assert.equal(repair.step, 'options');
  repair.changeOption('button', 'title', 'Open');
  repair.step = 'selection';
  await repair.next();
  assert.equal(repair.optionChanges.button.title, 'Open');
  assert.equal(repair.draftOptions.button.title.en, 'Open');
});
