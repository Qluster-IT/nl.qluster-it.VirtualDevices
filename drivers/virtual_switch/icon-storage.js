'use strict';

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

function iconPath(id) {
  if (typeof id !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(id)) {
    throw new Error('Invalid device ID');
  }
  return path.join('/userdata', `${id}.svg`);
}

function iconReference(id) {
  iconPath(id);
  return `../../../userdata/${id}.svg`;
}

function hasEditableIcon(data) {
  return !!data && typeof data.id === 'string' && /^[a-zA-Z0-9_-]+$/.test(data.id)
    && data.icon === iconReference(data.id);
}

function decodeIcon(data) {
  if (typeof data !== 'string' || data.length > 1048000) {
    throw new Error('Invalid or oversized SVG icon');
  }
  const match = /^data:image\/svg\+xml;base64,([A-Za-z0-9+/]+={0,2})$/.exec(data);
  if (!match) throw new Error('Invalid SVG icon');
  const contents = Buffer.from(match[1], 'base64');
  if (contents.toString('base64') !== match[1]
    || !/<svg(?:\s|>)/i.test(contents.toString('utf8'))) throw new Error('Invalid SVG icon');
  return contents;
}

async function writeIcon(id, contents) {
  const target = iconPath(id);
  const temporary = `${target}.${crypto.randomBytes(8).toString('hex')}.tmp`;
  try {
    await fs.writeFile(temporary, contents, { flag: 'wx' });
    await fs.rename(temporary, target);
  } catch (error) {
    try {
      await fs.unlink(temporary);
    } catch (cleanupError) {
      if (cleanupError.code !== 'ENOENT') error.message += ` (cleanup: ${cleanupError.message})`;
    }
    throw error;
  }
}

async function deleteIcon(id) {
  try {
    await fs.unlink(iconPath(id));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

module.exports = { iconReference, hasEditableIcon, decodeIcon, writeIcon, deleteIcon };
