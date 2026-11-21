'use strict';

const fs = require('fs');
const path = require('path');

const appPath = path.resolve(__dirname, '..');
const appSpecific = [
  'node_modules/homey-lib/examples',
  'node_modules/homey-lib/scripts',
  'node_modules/homey-lib/types',
  'node_modules/homey-lib/react-native',
  'node_modules/homey-lib/webpack.config.js',
  'node_modules/homey-lib/webpack',
  'node_modules/ajv/scripts',
  'node_modules/ajv/spec',
  'node_modules/ajv/.tonic_example.js',
  'node_modules/ajv/dist/ajv.bundle.js',
  'node_modules/ajv/dist/ajv.min.js',
  'node_modules/ajv/dist/ajv.min.js.map',
  'node_modules/fast-json-stable-stringify/benchmark',
  'node_modules/fast-json-stable-stringify/example',
  'node_modules/fast-json-stable-stringify/test',
  'node_modules/fast-json-stable-stringify/.github',
  'node_modules/tinycolor2/cjs/test.js',
  'node_modules/tinycolor2/cjs/test_template.js',
  'node_modules/tinycolor2/esm/test.js',
  'node_modules/tinycolor2/esm/test_template.js',
  'node_modules/uri-js/dist/es5/uri.all.js.map',
  'node_modules/uri-js/dist/es5/uri.all.min.d.ts',
  'node_modules/uri-js/dist/es5/uri.all.min.js',
  'node_modules/uri-js/dist/es5/uri.all.min.js.map',
  'node_modules/uri-js/yarn.lock',
];

function size(target) {
  const stat = fs.statSync(target);
  if (!stat.isDirectory()) return { bytes: stat.size, files: 1 };
  return fs.readdirSync(target).reduce((total, name) => {
    const child = size(path.join(target, name));
    return { bytes: total.bytes + child.bytes, files: total.files + child.files };
  }, { bytes: 0, files: 0 });
}

function remove(target, stats) {
  const removed = size(target);
  stats.bytes += removed.bytes;
  stats.files += removed.files;
  fs.rmSync(target, { recursive: true, force: true });
}

const stats = { files: 0, bytes: 0 };
for (const relative of appSpecific) {
  const target = path.join(appPath, relative);
  if (fs.existsSync(target)) remove(target, stats);
}

console.log(`Pruned ${stats.files} verified non-runtime files (${(stats.bytes / 1048576).toFixed(1)} MB) from production dependencies.`);
