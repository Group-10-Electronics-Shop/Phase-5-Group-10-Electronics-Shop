const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'src', 'data', 'sampleProducts.json');
const OUT_DIR = path.join(__dirname, '..', 'public', 'images');

if (!fs.existsSync(DATA_PATH)) {
  console.error('Missing', DATA_PATH);
  process.exit(1);
}
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
function hashToHue(s){
  let h=0;
  for(let i=0;i<s.length;i++){ h = (h<<5) - h + s.charCodeAt(i); h |= 0; }
  return Math.abs(h)%360;
}
const emojiMap = {
  phones: '📱', phone: '📱', phones: '📱', phones_plural: '📱',
  computers: '💻', laptop: '💻', computers_plural: '💻',
  gaming: '🎮', console: '🎮', controllers: '🎮',
  audio: '��', headphones: '🎧', speakers: '🔊',
  cameras: '📷', camera: '📷',
  tablets: '📱', accessories: '🔌', wearables: '⌚', default: '⚡'
};

const products = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
products.forEach(p => {
  const slug = slugify(p.name || `product-${p.id}`);
  const filename = slug + '.svg';
  const outPath = path.join(OUT_DIR, filename);

  // pick emoji by category (fuzzy)
  const cat = String(p.category||'').toLowerCase();
  let em = emojiMap[cat] || null;
  if(!em){
    for(const key of Object.keys(emojiMap)){
      if(cat.includes(key)) { em = emojiMap[key]; break; }
    }
  }
  if(!em) em = emojiMap.default;

  const hue = hashToHue(p.name || String(p.id));
  const gradientA = `hsl(${hue} 65% 52%)`;
  const gradientB = `hsl(${(hue+45)%360} 60% 45%)`;
  const safeName = (p.name||'Product').replace(/&/g,'&amp;');
  const safeCat = (p.category||'').replace(/&/g,'&amp;');

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="g-${slug}" x1="0" x2="1">
      <stop offset="0" stop-color="${gradientA}"/>
      <stop offset="1" stop-color="${gradientB}"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="#0b1220"/>
  <rect x="28" y="28" rx="16" ry="16" width="744" height="444" fill="url(#g-${slug})" opacity="0.14"/>
  <g transform="translate(40, 60)">
    <rect x="0" y="0" width="720" height="320" rx="12" fill="#071028" opacity="0.06"/>
    <text x="40" y="160" font-family="Inter, Roboto, Arial, sans-serif" font-size="160" fill="#ffffff" opacity="0.12">${em}</text>
  </g>

  <g transform="translate(40, 460)">
    <text x="0" y="-70" font-family="Inter, Roboto, Arial, sans-serif" font-size="36" fill="#ffffff" font-weight="700">${safeName}</text>
    <text x="0" y="-36" font-family="Inter, Roboto, Arial, sans-serif" font-size="18" fill="#e6e6e6">${safeCat}</text>
  </g>
</svg>`;

  fs.writeFileSync(outPath, svg, 'utf8');

  // update product data to point to this file
  p.image_url = `/images/${filename}`;
});

// write updated JSON file
fs.writeFileSync(DATA_PATH, JSON.stringify(products, null, 2), 'utf8');
console.log('Generated', products.length, 'product SVGs with variant colors & emoji to', OUT_DIR);
