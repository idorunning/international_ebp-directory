import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { BRAND_OPTIONS, logoMarkup, earthMarkup } from '../public/brand.js';
const fromRoot = relative => fileURLToPath(new URL(`../${relative}`, import.meta.url));
const licence = (await readFile(fromRoot('public/assets/fonts/LICENSE.txt'),'utf8')).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
function portable(svg,mono=false){return svg.replaceAll('var(--logo-ink,#414A54)',mono?'#26282D':'#414A54').replaceAll('var(--logo-blue,#254AA5)',mono?'#26282D':'#254AA5').replaceAll('var(--logo-dash,#8C293E)',mono?'#26282D':'#8C293E').replaceAll('var(--logo-surface,#FFFFFF)','#FFFFFF');}
await mkdir(fromRoot('public/assets/brand'),{recursive:true});
for(const option of BRAND_OPTIONS)for(const mono of [false,true]){
 const svg=portable(logoMarkup(option.id),mono).replace(/(<svg[^>]*>)/,`$1<metadata>${licence}</metadata>`);
 await writeFile(fromRoot(`public/assets/brand/id-ebp-${option.id}${mono?'-mono':''}.svg`),svg+'\n');
}
await writeFile(fromRoot('public/mark.svg'),portable(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -6 112 112"><title>ID-EBP</title>${earthMarkup()}</svg>`)+'\n');
console.log('Exported approved D3a logo, monochrome artwork and matching favicon.');
