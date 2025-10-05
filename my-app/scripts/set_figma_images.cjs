/*
  set_figma_images.cjs
  - backs up sampleProducts.json
  - updates image_url for each product by id -> local figma png.
*/
const fs = require('fs');
const path = require('path');
const DATA = path.join(__dirname,'..','src','data','sampleProducts.json');

if(!fs.existsSync(DATA)){ console.error('data file missing:', DATA); process.exit(1); }

const bak = DATA + '.bak.' + Date.now();
fs.copyFileSync(DATA, bak);
console.log('Backup written to', bak);

const products = JSON.parse(fs.readFileSync(DATA,'utf8'));

// Map product id -> local figma image file (update as needed)
const map = {
  1: '/images/34_213.png',
  2: '/images/142_1511.png',
  3: '/images/142_1509.png',
  4: '/images/142_1508.png',
  5: '/images/142_1510.png',
  // if you have more figma exports, add them here (id: '/images/filename.png')
};

// Apply mapping (only if id exists)
const updated = products.map(p => {
  if(map[p.id]) p.image_url = map[p.id];
  return p;
});

fs.writeFileSync(DATA, JSON.stringify(updated, null, 2), 'utf8');
console.log('Wrote updated product file:', DATA);
