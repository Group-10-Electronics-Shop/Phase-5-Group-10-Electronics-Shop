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

const products = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
products.forEach(p => {
  const slug = slugify(p.name || `product-${p.id}`);
  const filename = slug + '.svg';
  const outPath = path.join(OUT_DIR, filename);

  const safeName = (p.name||'Product').replace(/&/g,'&amp;');
  const safeCat = (p.category||'').replace(/&/g,'&amp;');

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="g" x1="0" x2="1">
      <stop offset="0" stop-color="#0ea5a4"/>
      <stop offset="1" stop-color="#6366f1"/>
    </linearGradient>
  </defs>
  <rect rx="18" ry="18" width="100%" height="100%" fill="#0f172a"/>
  <rect x="24" y="24" rx="12" ry="12" width="752" height="400" fill="url(#g)" opacity="0.12"/>
  <g transform="translate(40, 460)">
    <text x="0" y="-100" font-family="Inter, Roboto, Arial, sans-serif" font-size="36" fill="#ffffff" font-weight="700">${safeName}</text>
    <text x="0" y="-60" font-family="Inter, Roboto, Arial, sans-serif" font-size="18" fill="#e6e6e6">${safeCat}</text>
  </g>
  <g transform="translate(40, 60)">
    <rect x="0" y="0" width="720" height="320" rx="12" fill="#0f172a" opacity="0.09"/>
    <text x="30" y="180" font-family="Inter, Roboto, Arial, sans-serif" font-size="120" fill="#0f172a" opacity="0.25" font-weight="700">⚡</text>
  </g>
</svg>`;

  fs.writeFileSync(outPath, svg, 'utf8');

  // update product to point to this svg
  p.image_url = `/images/${filename}`;
});
fs.writeFileSync(DATA_PATH, JSON.stringify(products, null, 2), 'utf8');
console.log('Wrote', products.length, 'SVGs to', OUT_DIR);
