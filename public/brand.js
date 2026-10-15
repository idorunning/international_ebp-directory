import {LETTERING} from './brand-lettering.js';
/** Approved D3a: graphite lettering, blue continents and an integrated burgundy hyphen. */
export const BRAND_OPTIONS = Object.freeze([
  {id:'d3a',name:'D3a · Blue continents',detail:'The selected identity: light graphite lettering, a simplified Earth icon and a burgundy dash. The descriptor is centred beneath the complete wordmark.',recommended:true}
]);
export const DESCRIPTOR = 'International Directory of Evidence-Based Policing';
const INK='var(--logo-ink,#414A54)', BLUE='var(--logo-blue,#254AA5)', DASH='var(--logo-dash,#8C293E)', SURFACE='var(--logo-surface,#FFFFFF)';

// Deliberately simplified continental silhouettes, without meridians or grid lines.
export function earthMarkup(){return `<g fill="${SURFACE}" stroke="none"><circle cx="50" cy="50" r="46"/></g><g fill="${BLUE}"><path d="M29 10C24 14 18 19 14 26C12 30 11 35 12 39C17 41 20 38 23 34C26 30 34 29 35 24C36 20 31 18 33 15Z"/><path d="M45 12C42 12 42 17 44 21C45 25 48 25 50 21C52 18 56 15 53 13Z"/><path d="M73 14C77 18 79 21 81 24C77 24 74 25 72 29C71 33 64 32 62 37C59 41 62 46 69 47L94 47C93 35 86 22 73 14Z"/><path d="M18 55C21 58 25 59 30 60C37 61 42 64 42 69C42 75 35 78 34 84C33 87 35 89 36 92C30 90 26 88 25 83C24 78 27 75 24 71C21 68 16 65 16 61Z"/><path d="M69 56C74 56 79 59 79 64C79 70 74 76 69 82C65 86 62 84 62 79L62 64C62 59 59 56 55 55Z"/></g><circle cx="50" cy="50" r="46" fill="none" stroke="${BLUE}" stroke-width="2.2"/><path d="M-4 50H104" fill="none" stroke="${SURFACE}" stroke-width="9"/><path d="M-4 50H104" fill="none" stroke="${DASH}" stroke-width="4.5" stroke-linecap="round"/>`;}

// Legacy option IDs resolve to the approved identity, including existing header callers.
export function logoMarkup(option='d3a',{descriptor=true}={}){
  const {cx,cy,idX,ebpX,radius}=LETTERING.layout;
  const subtitle=descriptor?`<g fill="${INK}" data-descriptor="${DESCRIPTOR}">${LETTERING.subtitle.map(line=>`<path transform="translate(${line.x} 0)" d="${line.path}"/>`).join('')}</g>`:'';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 375 ${descriptor?138:87}" class="brand-logo id-ebp-logo id-ebp-logo--d3a" role="img" aria-label="ID-EBP${descriptor?` — ${DESCRIPTOR}`:''}"><title>ID-EBP${descriptor?` — ${DESCRIPTOR}`:''}</title><g class="logo-lettering" fill="${INK}"><path data-lettering="ID" transform="translate(${idX} 0)" d="${LETTERING.ID.path}"/><path data-lettering="EBP" transform="translate(${ebpX} 0)" d="${LETTERING.EBP.path}"/></g><g transform="translate(${cx-radius} ${cy-radius}) scale(${radius/50})">${earthMarkup()}</g>${subtitle}</svg>`;
}
