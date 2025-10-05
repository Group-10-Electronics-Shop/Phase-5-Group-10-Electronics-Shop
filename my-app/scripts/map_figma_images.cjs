const fs = require('fs');
const path = require('path');

const DATA = path.join(__dirname, '..', 'src', 'data', 'sampleProducts.json');
const OUT = DATA + '.updated.json';

const mapById = {
  // map product id -> file in public/images (edit to change)
  1: '/images/34_213.png',      // hero / large figma screenshot -> replace Gamepad
  2: '/images/142_1511.png',    // replace PlayStation 5
  3: '/images/142_1509.png',    // replace iPhone 14 Series
  4: '/images/142_1510.png',    // replace IPS Monitor
  // leave others alone or map more below...
  // 5: '/images/142_1508.png'
};

if (!fs.existsSync(DATA)) {
  console.error('ERROR: sampleProducts.json not found at', DATA);
  process.exit(1);
}

const raw = fs.readFileSync(DATA, 'utf8');
const products = JSON.parse(raw);

const newProducts = products.map(p => {
  if (mapById[p.id]) {
    return { ...p, image_url: mapById[p.id] };
  }
  return p;
});

fs.writeFileSync(OUT, JSON.stringify(newProducts, null, 2), 'utf8');
console.log('Wrote', OUT);
