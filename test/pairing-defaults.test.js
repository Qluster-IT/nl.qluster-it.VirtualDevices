'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const vm = require('node:vm');
const { getCapabilities, getDeviceClasses } = require('homey-lib');

const source = fs.readFileSync(
  'drivers/virtual_switch/pair/capabilities.js',
  'utf8',
);
const context = {};
vm.createContext(context);
vm.runInContext(source, context);

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
      assert.ok(capabilities[capability], `Unknown capability "${capability}" in "${classId}"`);
    }

    for (const capability of defaults.defaultCapabilities) {
      assert.ok(
        defaults.capabilities.includes(capability),
        `Default "${capability}" is missing from recommendations for "${classId}"`,
      );
    }
  }
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
