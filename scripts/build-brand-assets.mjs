import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { BRAND_OPTIONS, logoMarkup } from '../public/brand.js';

// The live site and the downloadable artwork share a single set of shapes.
// The downloaded files embed the existing Public Sans font and its licence,
// and resolve colours to SVG presentation attributes for portable rendering.
const fromRoot = relative => fileURLToPath(new URL(`../${relative}`, import.meta.url));
const font = (await readFile(fromRoot('public/assets/fonts/public-sans-latin.woff2'))).toString('base64');
const licence = (await readFile(fromRoot('public/assets/fonts/LICENSE.txt'), 'utf8'))
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const fontDefinition = `<metadata>${licence}</metadata><defs><style>@font-face{font-family:'Public Sans';src:url(data:font/woff2;base64,${font}) format('woff2');font-weight:100 900;font-style:normal}</style></defs>`;

await mkdir(fromRoot('public/assets/brand'), { recursive: true });
for (const option of BRAND_OPTIONS) {
  for (const monochrome of [false, true]) {
    const svg = logoMarkup(option.id)
      .replaceAll('currentColor', monochrome ? '#26282D' : '#254AA5')
      .replaceAll('var(--brand-accent,#254AA5)', monochrome ? '#26282D' : '#254AA5')
      .replaceAll('var(--brand-surface,#FFFFFF)', '#FFFFFF')
      .replace(/(<svg[^>]*>)/, `$1${fontDefinition}`);
    await writeFile(fromRoot(`public/assets/brand/id-ebp-${option.id}${monochrome ? '-mono' : ''}.svg`), `${svg}\n`);
  }
}
console.log(`Exported ${BRAND_OPTIONS.length * 2} ID-EBP logo SVGs from public/brand.js.`);
