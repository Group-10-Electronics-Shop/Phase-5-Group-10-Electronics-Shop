/**
 * Map product names -> local images (svg/png) in public/images.
 * Writes a backup and overwrites src/data/sampleProducts.json with updated image_url
 */
const fs = require('fs');
const path = require('path');

const DATA = path.join(__dirname, '..', 'src', 'data', 'sampleProducts.json');
if (!fs.existsSync(DATA)) {
  console.error('sampleProducts.json not found at', DATA);
  process.exit(1);
}
const backup = DATA + '.bak.' + Date.now();
fs.copyFileSync(DATA, backup);
console.log('Backup written to', backup);

const raw = fs.readFileSync(DATA, 'utf8');
let products = JSON.parse(raw);

// mapping: product name (lowercase includes slug) -> file in public/images
const mapping = {
  'havit': '/images/havit-hv-g92-gamepad.svg',
  'havit hv-g92': '/images/havit-hv-g92-gamepad.svg',
  'playstation': '/images/playstation-5.svg',
  'ps5': '/images/ps5.jpg',
  'iphone 14': '/images/iphone-14-series.svg',
  'iphone 14 series': '/images/iphone-14-series.svg',
  'ips lcd': '/images/ips-lcd-gaming-monitor.svg',
  'ak-900': '/images/ak-900-wired-keyboard.svg',
  'keyboard': '/images/ak-900-wired-keyboard.svg',
  'philips': '/images/philips-phone.svg',
  'canon': '/images/canon-eos-dslr-camera.svg',
  'samsung galaxy s23': '/images/samsung-galaxy-s23.svg',
  'samsung': '/images/samsung-galaxy-s23.svg',
  'jbl': '/images/jbl-flip-6.svg',
  'marshall': '/images/marshall-stanmore-ii.svg',
  'tablet': '/images/samsung-galaxy-tab-s8.svg',
  'playstation 5': '/images/sony-playstation-5.svg'
  // add more mappings here if you have other svg/png names
};

const chooseImageFor = (name) => {
  const n = (name || '').toLowerCase();
  for (const key in mapping) {
    if (n.includes(key)) return mapping[key];
  }
  // fallback: prefer a figma export hero or placeholder if available
  if (fs.existsSync(path.join(__dirname, '..', 'public', 'images', '34_213.png'))) {
    return '/images/34_213.png';
  }
  return '/images/placeholder.png';
};

const newProducts = products.map(p => {
  const newP = Object.assign({}, p);
  newP.image_url = chooseImageFor(p.name);
  return newP;
});

fs.writeFileSync(DATA, JSON.stringify(newProducts, null, 2), 'utf8');
console.log('Updated', DATA, 'and assigned images. Review file and restart dev server.');
