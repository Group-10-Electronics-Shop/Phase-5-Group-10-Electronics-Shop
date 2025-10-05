set -euo pipefail
OUT=project-inspect.txt
echo "### Project inspection report - $(date)" > $OUT

echo -e "\n=== Git branch ===" >> $OUT
git branch --show-current 2>/dev/null || echo "(no git)" >> $OUT

echo -e "\n=== Top-level files ===" >> $OUT
ls -la . >> $OUT

echo -e "\n=== public/images (files & sizes) ===" >> $OUT
ls -la public/images >> $OUT || echo "public/images missing" >> $OUT

echo -e "\n=== src/components listing ===" >> $OUT
ls -la src/components >> $OUT || echo "src/components missing" >> $OUT

echo -e "\n=== src/pages listing ===" >> $OUT
ls -la src/pages >> $OUT || echo "src/pages missing" >> $OUT

echo -e "\n=== src/styles listing ===" >> $OUT
ls -la src/styles >> $OUT || echo "src/styles missing" >> $OUT

echo -e "\n=== src/data listing ===" >> $OUT
ls -la src/data >> $OUT || echo "src/data missing" >> $OUT

echo -e "\n=== package.json ===" >> $OUT
sed -n '1,200p' package.json >> $OUT 2>/dev/null || echo "no package.json shown" >> $OUT

echo -e "\n=== App.jsx (first 200 lines) ===" >> $OUT
sed -n '1,200p' src/App.jsx >> $OUT 2>/dev/null || echo "src/App.jsx missing" >> $OUT

echo -e "\n=== main.jsx or index.jsx (first 200 lines) ===" >> $OUT
sed -n '1,200p' src/main.jsx 2>/dev/null || sed -n '1,200p' src/index.jsx 2>/dev/null >> $OUT || echo "main/index not found" >> $OUT

echo -e "\n=== Header.jsx (first 240 lines) ===" >> $OUT
sed -n '1,240p' src/components/Header.jsx >> $OUT 2>/dev/null || echo "Header.jsx missing" >> $OUT

echo -e "\n=== Banner.jsx (first 240 lines) ===" >> $OUT
sed -n '1,240p' src/components/Banner.jsx >> $OUT 2>/dev/null || echo "Banner.jsx missing" >> $OUT

echo -e "\n=== CategoryList.jsx (first 240 lines) ===" >> $OUT
sed -n '1,240p' src/components/CategoryList.jsx >> $OUT 2>/dev/null || echo "CategoryList.jsx missing" >> $OUT

echo -e "\n=== ProductCard.jsx (first 240 lines) ===" >> $OUT
sed -n '1,240p' src/components/ProductCard.jsx >> $OUT 2>/dev/null || echo "ProductCard.jsx missing" >> $OUT

echo -e "\n=== Footer.jsx (first 240 lines) ===" >> $OUT
sed -n '1,240p' src/components/Footer.jsx >> $OUT 2>/dev/null || echo "Footer.jsx missing" >> $OUT

echo -e "\n=== Home.jsx (first 240 lines) ===" >> $OUT
sed -n '1,240p' src/pages/Home.jsx >> $OUT 2>/dev/null || echo "Home.jsx missing" >> $OUT

echo -e "\n=== sampleProducts.json (full) ===" >> $OUT
sed -n '1,400p' src/data/sampleProducts.json >> $OUT 2>/dev/null || echo "sampleProducts.json missing" >> $OUT

echo -e "\n=== grep: where <Header /> is mounted ===" >> $OUT
grep -R --line-number -n "<Header" src || true >> $OUT

echo -e "\n=== grep: where <Footer /> is mounted ===" >> $OUT
grep -R --line-number -n "<Footer" src || true >> $OUT

echo -e "\n=== grep: CategoryList usage (places) ===" >> $OUT
grep -R --line-number -n "CategoryList" src || true >> $OUT

echo -e "\n=== grep: occurrences of className=\"app-header\" ===" >> $OUT
grep -R --line-number -n "className=\"app-header\"" src || true >> $OUT

echo -e "\n=== grep: CSS background-image or background: url(...) references ===" >> $OUT
grep -R --line-number -n "background-image\|background:.*url(" src || true >> $OUT

echo -e "\n=== grep: any /images/ references across src ===" >> $OUT
grep -R --line-number -n "/images/" src || true >> $OUT

echo -e "\n=== End of report ===" >> $OUT

echo "Wrote $OUT"
sh $0
