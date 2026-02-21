// Icon generation script
// For MVP: Use any 192x192 and 512x512 PNG placeholder files
// or use online tools like https://favicon.io/ to generate icons

const fs = require('fs');
const path = require('path');

console.log('Icon generation placeholder');
console.log('For production, generate proper icons using:');
console.log('1. https://favicon.io/');
console.log('2. Or use design tools to create 192x192 and 512x512 PNGs');
console.log('3. Place them in public/ directory as icon-192.png and icon-512.png');

// Create minimal SVG placeholders
const svg192 = `<svg width="192" height="192" xmlns="http://www.w3.org/2000/svg">
  <rect width="192" height="192" fill="#ff914d"/>
  <text x="50%" y="50%" font-size="120" fill="white" text-anchor="middle" dominant-baseline="middle">M</text>
</svg>`;

const svg512 = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#ff914d"/>
  <text x="50%" y="50%" font-size="320" fill="white" text-anchor="middle" dominant-baseline="middle">M</text>
</svg>`;

fs.writeFileSync(path.join(__dirname, '../public/icon-192.svg'), svg192);
fs.writeFileSync(path.join(__dirname, '../public/icon-512.svg'), svg512);

console.log('SVG placeholders created. Convert to PNG for production.');
