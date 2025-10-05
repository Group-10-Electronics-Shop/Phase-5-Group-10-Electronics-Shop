/*
 remap_product_images.cjs
 - reads src/data/sampleProducts.json
 - matches product name tokens to filenames in public/images
 - writes update and makes a timestamped backup
*/
const fs = require('fs');
const path = require('path');

const PROD = path.join(__dirname, '..','src','data','sampleProducts.json');
const IMG_DIR = path.join(__dirname, '..','public','images');

if(!fs.existsSync(PROD)){ console.error('Missing', PROD); process.exit(1); }
if(!fs.existsSync(IMG_DIR)){ console.error('Missing', IMG_DIR); process.exit(1); }

const files = fs.readdirSync(IMG_DIR).map(f => f.toLowerCase());
const raw = fs.readFileSync(PROD,'utf8');
const products = JSON.parse(raw);

function slug(s){ return (s||'').toLowerCase().replace(/[^a-z0-9]+/g,'-'); }
function tokens(s){ return (s||'').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean); }

products.forEach(p => {
  const name = p.name || '';
  const cat = p.category || '';
  const wants = (p.image_url||'').toLowerCase();

  // if currently points to a big figma full-page file, or missing, remap
  const bad = /34_213|fullpage|export|figma/i.test(wants) || wants.trim()==='' || wants.endsWith('placeholder.png');

  if(bad){
    // try exact slug match
    const s = slug(name);
    let found = files.find(f => f.includes(s));
    if(!found){
      // try multi-token progressive matching
      const tks = tokens(name);
      for(const tk of tks){
        found = files.find(f => f.includes(tk));
        if(found) break;
      }
    }
    // fallback to category
    if(!found){
      const cs = slug(cat);
      found = files.find(f => f.includes(cs));
    }
    // final fallback to 'placeholder.png'
    if(found) p.image_url = '/images/' + found;
    else p.image_url = p.image_url || '/images/placeholder.png';
  } else {
    // keep existing but ensure starts with /images/
    if(!p.image_url.startsWith('/images/')) p.image_url = '/images/' + p.image_url.replace(/^\.?\//,'');
  }
});

const bak = PROD + '.bak.' + new Date().toISOString().replace(/[:.]/g,'-');
fs.copyFileSync(PROD, bak);
fs.writeFileSync(PROD, JSON.stringify(products, null, 2), 'utf8');
console.log('Wrote updated', PROD, 'backup at', bak);
products.forEach(p => console.log(p.id, '->', p.image_url));
