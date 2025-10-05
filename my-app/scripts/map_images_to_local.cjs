/**
 * map_images_to_local.cjs
 * - creates a backup of src/data/sampleProducts.json
 * - remaps image_url according to the mapping in this script
 */
const fs = require('fs');
const path = require('path');

const DATA = path.resolve(__dirname, '..', 'src', 'data', 'sampleProducts.json');
const BAK = DATA + '.bak.' + Date.now();
if(!fs.existsSync(DATA)){ console.error('sampleProducts.json not found at', DATA); process.exit(1); }
fs.copyFileSync(DATA, BAK);
console.log('Backup written to', BAK);

const mapping = {
  1: '/images/34_213.png',
  2: '/images/142_1511.png',
  3: '/images/142_1509.png',
  4: '/images/142_1508.png',
  5: '/images/ak-900-wired-keyboard.svg',
  6: '/images/philips-phone.svg',
  7: '/images/canon-eos-dslr-camera.svg',
  8: '/images/samsung-galaxy-s23.svg',
  9: '/images/tablet.jpg',
  10:'/images/jbl-flip-6.svg',
  11:'/images/marshall-stanmore-ii.svg',
  12:'/images/sony-playstation-5.svg'
};

const products = JSON.parse(fs.readFileSync(DATA,'utf8'));
const newProducts = products.map(p=>{
  const m = mapping[p.id];
  if(m) p.image_url = m;
  return p;
});
fs.writeFileSync(DATA, JSON.stringify(newProducts, null, 2)+'\n', 'utf8');
console.log('Updated', DATA);
