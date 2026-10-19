import sharp from 'sharp';
import fs from 'fs';

async function generateAssets() {
  const rawSvg = fs.readFileSync('public/sgk-logo.svg', 'utf-8');

  // 1. Create a Square SVG for Favicon and Touch Icon (512x512)
  // Clean white rounded-corner card with the authentic horizontal SGK logo perfectly centered
  // SGK logo is 660.3 x 318.6 (aspect ratio 2.07:1).
  // At width 440, height is ~212.3. On 512x512, centered at x=36, y=150.
  const squareSvg = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-opacity="0.12"/>
    </filter>
  </defs>
  <!-- Background with subtle border -->
  <rect width="512" height="512" rx="100" fill="#FFFFFF"/>
  <rect width="504" height="504" x="4" y="4" rx="96" fill="none" stroke="#E2E8F0" stroke-width="4"/>
  
  <!-- Embedded Authentic SGK Logo -->
  <g transform="translate(36, 148)">
    <svg viewBox="0 0 660.3 318.6" width="440" height="212.3">
      ${rawSvg.replace(/<\?xml[\s\S]*?<svg[\s\S]*?>/i, '').replace(/<\/svg>/i, '')}
    </svg>
  </g>
</svg>`;

  fs.writeFileSync('public/sgk-favicon.svg', squareSvg);
  console.log('Created public/sgk-favicon.svg');

  // 2. Generate sgk-logo.png (512x512)
  await sharp(Buffer.from(squareSvg))
    .resize(512, 512)
    .png()
    .toFile('public/sgk-logo.png');
  console.log('Created public/sgk-logo.png');

  // 3. Generate sgk-logo-192.png (192x192)
  await sharp(Buffer.from(squareSvg))
    .resize(192, 192)
    .png()
    .toFile('public/sgk-logo-192.png');
  console.log('Created public/sgk-logo-192.png');

  // 4. Generate 1200x630 OpenGraph / Twitter Social Preview Card
  // Rich professional preview card featuring the authentic SGK logo on a white badge
  const ogSvg = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f2b48"/>
      <stop offset="60%" stop-color="#0a192f"/>
      <stop offset="100%" stop-color="#05101d"/>
    </linearGradient>
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bgGrad)"/>
  
  <!-- Subtle decorative ambient glows -->
  <circle cx="1080" cy="120" r="280" fill="#0087C2" opacity="0.12"/>
  <circle cx="150" cy="520" r="220" fill="#0d9488" opacity="0.10"/>

  <!-- Left Side: Official SGK Logo inside a crisp white card -->
  <g transform="translate(80, 140)">
    <rect width="450" height="350" rx="36" fill="#FFFFFF" filter="url(#cardShadow)"/>
    <rect width="446" height="346" x="2" y="2" rx="34" fill="none" stroke="#E2E8F0" stroke-width="2"/>
    <g transform="translate(30, 75)">
      <svg viewBox="0 0 660.3 318.6" width="390" height="188">
        ${rawSvg.replace(/<\?xml[\s\S]*?<svg[\s\S]*?>/i, '').replace(/<\/svg>/i, '')}
      </svg>
    </g>
  </g>

  <!-- Right Side: Clean Typography & Mevzuat Badges -->
  <g transform="translate(580, 145)">
    <!-- Badge -->
    <rect x="0" y="0" width="320" height="42" rx="21" fill="#0d9488" opacity="0.25"/>
    <rect x="0" y="0" width="320" height="42" rx="21" fill="none" stroke="#14b8a6" stroke-width="2"/>
    <text x="160" y="27" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="800" fill="#2dd4bf" text-anchor="middle" letter-spacing="1">
      2024/12 &amp; 2026/15 GENELGE
    </text>

    <!-- Main Title -->
    <text x="0" y="110" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="900" fill="#FFFFFF" letter-spacing="-1">
      SGK 6183 / 48
    </text>
    <text x="0" y="165" font-family="system-ui, -apple-system, sans-serif" font-size="38" font-weight="800" fill="#38bdf8" letter-spacing="-0.5">
      Tecil ve Taksitlendirme
    </text>

    <!-- Feature points -->
    <g transform="translate(0, 220)">
      <text x="0" y="0" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="600" fill="#94a3b8">
        ✓ Eşit Taksit, Tecil Faizi &amp; Teminat Hesaplama
      </text>
      <text x="0" y="38" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="600" fill="#94a3b8">
        ✓ Ek-1 &amp; Ek-1/b Resmî Talep Formu (PDF / Yazdır)
      </text>
      <text x="0" y="76" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="600" fill="#94a3b8">
        ✓ Dönem Borç Dökümü İcra / İşveren Analizi
      </text>
    </g>
  </g>
</svg>`;

  await sharp(Buffer.from(ogSvg))
    .png()
    .toFile('public/og-image.png');
  console.log('Created public/og-image.png');
}

generateAssets().catch(err => {
  console.error('Asset generation failed:', err);
  process.exit(1);
});
