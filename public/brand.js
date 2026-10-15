import {LETTERING} from './brand-lettering.js';
/**
 * ID-EBP identity studies. The lettering and integrated globe share the approved main blue. These are alternatives for review, not interchangeable brands.
 * Preserve the hyphen and the exact descriptor in every production lock-up.
 */
export const BRAND_OPTIONS = Object.freeze([
  {id:'b',name:'B1 · Equator',detail:'Selected direction. A continuous equator thickens within the globe to form the hyphen, with equal clear space beside the D and E.',recommended:true},
  {id:'b2',name:'B2 · Curved equator',detail:'The same balanced lettering, with a gently curved equatorial band following the globe’s surface.',recommended:false},
  {id:'b3',name:'B3 · Open equator',detail:'An open equatorial ribbon gives the dash a lighter treatment within the same circular globe.',recommended:false}
]);

export const DESCRIPTOR = 'International Directorate of Evidence-Based Policing';
const FONT = "'Public Sans',Arial,Helvetica,sans-serif";

function meridians(cx, cy, radius, { weight = 1.7, colour = 'var(--brand-accent,#254AA5)', fill = 'none', equator = true } = {}) {
  const left = cx - radius, right = cx + radius, top = cy - radius, bottom = cy + radius;
  return `<g fill="${fill}" stroke="${colour}" stroke-width="${weight}" stroke-linecap="round" stroke-linejoin="round"><circle cx="${cx}" cy="${cy}" r="${radius}"/><ellipse cx="${cx}" cy="${cy}" rx="${radius * .43}" ry="${radius}"/><path d="${equator?`M${left} ${cy}H${right}`:''}M${cx - radius * .86} ${cy - radius * .5}Q${cx} ${cy - radius * .24} ${cx + radius * .86} ${cy - radius * .5}M${cx - radius * .86} ${cy + radius * .5}Q${cx} ${cy + radius * .24} ${cx + radius * .86} ${cy + radius * .5}"/></g>`;
}

function artwork(option) {
  if (['b','b2','b3'].includes(option)) {
    const {cx,cy,idX,ebpX}=LETTERING.layout;
    const globe=meridians(cx,cy,25,{weight:1.8,equator:false});
    const band=option==='b2'?`<path d="M${cx-29} ${cy-2}Q${cx} ${cy+7} ${cx+29} ${cy-2}" stroke-width="4.5"/>`:option==='b3'?`<path d="M${cx-29} ${cy-1.8}H${cx+29}M${cx-25} ${cy+1.8}H${cx+25}" stroke-width="1.8"/>`:`<path d="M${cx-29} ${cy}H${cx+29}" stroke-width="2"/><path d="M${cx-22} ${cy}H${cx+22}" stroke-width="4.8"/>`;
    return `<g class="logo-lettering" fill="currentColor"><path data-lettering="ID" transform="translate(${idX} 0)" d="${LETTERING.ID.path}"/><path data-lettering="EBP" transform="translate(${ebpX} 0)" d="${LETTERING.EBP.path}"/></g>${globe}<g fill="none" stroke="var(--brand-accent,#254AA5)" stroke-linecap="round">${band}</g>`;
  }

}

/**
 * Inline SVG; inherits the surrounding text colour. The integrated globe uses --brand-accent. Set it to currentColor for a single-colour identity.
 * --brand-surface supplies the background behind the lettering in option C.
 */
export function logoMarkup(option = 'b', { descriptor = true } = {}) {
  const choice = BRAND_OPTIONS.some(item => item.id === option) ? option : 'b';
  const height = descriptor ? 137 : 101;
  const subtitle = descriptor ? `<text x="187.5" text-anchor="middle" font-family="${FONT}" font-size="14" font-weight="550" letter-spacing=".04" fill="currentColor"><tspan x="187.5" y="113">International Directorate of</tspan><tspan x="187.5" y="131">Evidence-Based Policing</tspan></text>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 375 ${height}" class="brand-logo id-ebp-logo id-ebp-logo--${choice}" role="img" aria-label="ID-EBP${descriptor ? ` — ${DESCRIPTOR}` : ''}"><title>ID-EBP${descriptor ? ` — ${DESCRIPTOR}` : ''}</title>${artwork(choice)}${subtitle}</svg>`;
}
