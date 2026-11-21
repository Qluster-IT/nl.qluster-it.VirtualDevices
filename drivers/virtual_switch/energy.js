'use strict';

const flags = { homeBattery: 'battery', electricCar: 'car', evCharger: 'evcharger' };
const mappings = [
  'meterPowerImportedCapability', 'meterPowerExportedCapability',
  'cumulativeImportedCapability', 'cumulativeExportedCapability',
];

function updateEnergy(current, changes, deviceClass, capabilities, supports, invalidMessage, previousClass = deviceClass, removed = []) {
  if (!changes || typeof changes !== 'object' || Array.isArray(changes)) throw new Error(invalidMessage);
  const updated = { ...current };
  for (const [key, value] of Object.entries(changes)) {
    if (Object.prototype.hasOwnProperty.call(flags, key)) {
      if (typeof value !== 'boolean' || flags[key] !== deviceClass || (value && !supports[key])) {
        throw new Error(invalidMessage);
      }
      if (value) updated[key] = true;
      else delete updated[key];
    } else if (key === 'cumulative') {
      if (typeof value !== 'boolean') throw new Error(invalidMessage);
      if (value) updated.cumulative = true;
      else delete updated.cumulative;
    } else if (mappings.includes(key)) {
      if (value === null || value === '') {
        delete updated[key];
      } else {
        const supported = key.startsWith('cumulative') ? supports.cumulativeMeters : supports.deviceMeters;
        if (!supported || typeof value !== 'string'
          || !/^meter_power(?:\.[a-z0-9_]+)?$/.test(value) || !capabilities.includes(value)) {
          throw new Error(invalidMessage);
        }
        updated[key] = value;
      }
    } else {
      throw new Error(invalidMessage);
    }
  }
  if (deviceClass !== previousClass) {
    for (const [key, requiredClass] of Object.entries(flags)) {
      if (deviceClass !== requiredClass) delete updated[key];
    }
  }
  for (const key of mappings) {
    if (updated[key] && removed.includes(updated[key])) delete updated[key];
  }
  for (const [imported, exported] of [
    ['meterPowerImportedCapability', 'meterPowerExportedCapability'],
    ['cumulativeImportedCapability', 'cumulativeExportedCapability'],
  ]) {
    if ((Object.prototype.hasOwnProperty.call(changes, imported) || Object.prototype.hasOwnProperty.call(changes, exported))
      && updated[imported] && updated[imported] === updated[exported]) throw new Error(invalidMessage);
  }
  return updated;
}

module.exports = { updateEnergy };
