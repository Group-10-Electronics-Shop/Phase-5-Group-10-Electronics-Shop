/**
 * scripts/map_images.cjs
 * Overwrite src/data/sampleProducts.json with mapped image_url values
 * Usage: node scripts/map_images.cjs
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const BACKUP = path.join(DATA_DIR, 'sampleProducts.json.bak');
const SOURCE = fs.existsSync(BACKUP) ? BACKUP : path.join(DATA_DIR, 'sampleProducts.json');
const OUT = path.join(DATA_DIR, 'sampleProducts.json');

if (!fs.existsSync(SOURCE)) {
  console.error('Source products JSON not found:', SOURCE);
  process.exit(1);
}
const raw = fs.readFileSync(SOURCE, 'utf8');
let products;
try { products = JSON.parse(raw); } catch (e) { console.error('Invalid JSON', e); process.exit(1); }

// Map id -> public image filename (edit if you want different file)
const mapping = {
  1: '/images/gamepad.jpg',
  2: '/images/playstation.jpg',
  3: '/images/iphone.jpg',
  4: '/images/monitor.jpg',
  5: '/images/keyboard.jpg',
  6: '/images/phone.jpg',
  7: '/images/camera.jpg',
  8: '/images/samsung.jpg',
  9: '/images/tablet.jpg',
  10: '/images/speaker.jpg',
  11: '/images/marshall.jpg',
  12: '/images/ps5.jpg'
};

const newProducts = products.map(p => {
  const copy = Object.assign({}, p);
  if (mapping[copy.id]) copy.image_url = mapping[copy.id];
  return copy;
});

fs.writeFileSync(OUT, JSON.stringify(newProducts, null, 2), 'utf8');
console.log('Wrote', OUT);
