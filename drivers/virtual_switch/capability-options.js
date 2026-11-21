'use strict';

const languages = ['en', 'nl', 'de', 'da', 'es', 'fr', 'it', 'no', 'sv', 'pl', 'ru', 'ko', 'ar'];
const numericFields = ['min', 'max', 'step', 'decimals', 'excludeMin', 'excludeMax'];

function updateOptions(current, changes, definition, invalidMessage = 'Invalid capability options', capability = '') {
  if (!changes || typeof changes !== 'object' || Array.isArray(changes)) throw new Error(invalidMessage);
  const updated = { ...current };
  for (const [key, value] of Object.entries(changes)) {
    if (key === 'title') {
      if (value === null || value === '') {
        delete updated.title;
      } else {
        if (typeof value !== 'string' || !value.trim() || value.length > 100) throw new Error(invalidMessage);
        updated.title = Object.fromEntries(languages.map(language => [language, value.trim()]));
      }
    } else if (key === 'approximated' && capability === 'measure_power') {
      if (value === null) delete updated[key];
      else if (typeof value === 'boolean') updated[key] = value;
      else throw new Error(invalidMessage);
    } else if (numericFields.includes(key) && definition && definition.type === 'number'
      && (!key.startsWith('exclude') || capability === 'target_power')) {
      if (value === null) {
        delete updated[key];
      } else {
        if (!Number.isFinite(value)
          || (key === 'step' && value <= 0)
          || (key === 'decimals' && (!Number.isInteger(value) || value < 0 || value > 5))) {
          throw new Error(invalidMessage);
        }
        updated[key] = value;
      }
    } else {
      throw new Error(invalidMessage);
    }
  }
  const min = updated.min === undefined && definition ? definition.min : updated.min;
  const max = updated.max === undefined && definition ? definition.max : updated.max;
  if ((Object.prototype.hasOwnProperty.call(changes, 'min') || Object.prototype.hasOwnProperty.call(changes, 'max'))
    && Number.isFinite(min) && Number.isFinite(max) && min > max) {
    throw new Error(invalidMessage);
  }
  if (capability === 'target_power' && ['min', 'max', 'excludeMin', 'excludeMax'].some(key => Object.prototype.hasOwnProperty.call(changes, key))
    && ((Number.isFinite(min) && min > 0) || (Number.isFinite(max) && max < 0)
      || (Number.isFinite(updated.excludeMin) && updated.excludeMin > 0)
      || (Number.isFinite(updated.excludeMax) && updated.excludeMax < 0))) {
    throw new Error(invalidMessage);
  }
  return updated;
}

module.exports = { updateOptions };
