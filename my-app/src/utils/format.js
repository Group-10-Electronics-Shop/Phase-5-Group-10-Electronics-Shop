export function formatKES(n){
  if (n === undefined || n === null) return 'KES 0';
  const num = Number(n);
  if (Number.isNaN(num)) return `KES ${n}`;
  return 'KES ' + num.toLocaleString();
}