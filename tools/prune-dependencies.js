'use strict';

const fs = require('fs');
const path = require('path');

const appPath = path.resolve(__dirname, '..');
const productionPackages = new Set();

const removableDir = new Set([
  '.github',
  'benchmark',
  'benchmarks',
  'docs',
  'example',
  'examples',
  'scripts',
  'spec',
  'specs',
  'test',
  'tests',
  'types',
  'react-native',
]);

const removableFile = /(^|[\\/])(change(log)?|readme|license|licence|authors|contributors|history)\.(md|txt)$/i;
const appSpecific = [
  'node_modules/homey-lib/examples',
  'node_modules/homey-lib/scripts',
  'node_modules/homey-lib/types',
  'node_modules/homey-lib/react-native',
  'node_modules/homey-lib/webpack.config.js',
  'node_modules/ajv/scripts',
  'node_modules/ajv/spec',
  'node_modules/ajv/.tonic_example.js',
  'node_modules/ajv/dist/ajv.bundle.js',
  'node_modules/fast-json-stable-stringify/benchmark',
  'node_modules/fast-json-stable-stringify/example',
  'node_modules/fast-json-stable-stringify/test',
  'node_modules/fast-json-stable-stringify/.github',
  'node_modules/tinycolor2/cjs/test.js',
  'node_modules/tinycolor2/cjs/test_template.js',
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

function entryFiles(dir) {
  const entries = new Set();
  const walk = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const target = path.join(current, entry.name);
      if (entry.isDirectory()) walk(target);
      else entries.add(target);
    }
  };
  walk(dir);
  return entries;
}

function prune(dir, entries, stats) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules') continue;
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (removableDir.has(entry.name.toLowerCase()) && ![...entries].some((file) => file.startsWith(target + path.sep))) {
        remove(target, stats);
      } else {
        prune(target, entries, stats);
      }
    } else if (entry.isFile() && removableFile.test(entry.name) && !entries.has(target)) {
      remove(target, stats);
    }
  }
}

function collectPackages(nodeModulesDir) {
  if (!fs.existsSync(nodeModulesDir)) return;
  for (const entry of fs.readdirSync(nodeModulesDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const target = path.join(nodeModulesDir, entry.name);
    if (entry.name.startsWith('@')) {
      if (fs.existsSync(target)) {
        for (const scoped of fs.readdirSync(target, { withFileTypes: true })) {
          if (scoped.isDirectory()) productionPackages.add(path.join(target, scoped.name));
        }
      }
    } else {
      productionPackages.add(target);
      const nested = path.join(target, 'node_modules');
      if (fs.existsSync(nested)) collectPackages(nested);
    }
  }
}

collectPackages(path.join(appPath, 'node_modules'));

const stats = { files: 0, bytes: 0 };
for (const dir of productionPackages) {
  if (fs.existsSync(dir)) prune(dir, entryFiles(dir), stats);
}
for (const relative of appSpecific) {
  const target = path.join(appPath, relative);
  if (fs.existsSync(target)) remove(target, stats);
}

console.log(`Pruned ${stats.files} non-runtime files (${(stats.bytes / 1048576).toFixed(1)} MB) from production dependencies.`);
