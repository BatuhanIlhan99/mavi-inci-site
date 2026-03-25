import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();

const htmlFiles = [
  'index.html',
  'odalar.html',
  'erdek-rehberi.html',
  'deneyimler.html',
  'rezervasyon.html',
  'admin.html',
  'room.html',
  'tesis.html',
  'panel-mavi-inci.html',
  'panel-gulplaj.html',
  'panel-villa-ece.html',
  'panel-fastfood.html',
  'panel-pub.html'
];

const jsFiles = [
  'boot.js',
  'han-data.js',
  'han-shell.js',
  'han-app.js'
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function readFile(file) {
  const fullPath = path.join(root, file);
  assert(fs.existsSync(fullPath), `Missing file: ${file}`);
  return fs.readFileSync(fullPath, 'utf8');
}

for (const file of jsFiles) {
  const source = readFile(file);
  try {
    new vm.Script(source, { filename: file });
  } catch (error) {
    throw new Error(`JavaScript syntax error in ${file}: ${error.message}`);
  }
}

for (const file of htmlFiles) {
  const source = readFile(file);
  assert(source.includes('<div id="root"></div>'), `Missing root container in ${file}`);
  assert(source.includes('<script src="./boot.js"></script>'), `Missing boot.js include in ${file}`);

  const localAssetRefs = Array.from(
    source.matchAll(/(?:src|href)="\.\/([^"]+)"/g),
    (match) => match[1]
  );

  for (const asset of localAssetRefs) {
    const assetPath = path.join(root, asset);
    assert(fs.existsSync(assetPath), `Referenced asset missing in ${file}: ${asset}`);
  }
}

console.log('Site source validation passed.');
