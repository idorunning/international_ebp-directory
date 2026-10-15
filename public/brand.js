/**
 * ID-EBP identity studies. All lettering uses one colour; the globe alone may
 * take the teal accent. These are alternatives for review, not four brands.
 * Preserve the hyphen and the exact descriptor in every production lock-up.
 */
export const BRAND_OPTIONS = Object.freeze([
  { id: 'a', name: 'The globe within', detail: 'A small, complete globe sits inside the D: one compact wordmark with a recognisable international detail.', recommended: false },
  { id: 'b', name: 'The world between', detail: 'A clear globe forms the hyphen. Its equator continues the horizontal dash between ID and EBP.', recommended: true },
  { id: 'c', name: 'A shared world', detail: 'The first two letters sit within a globe. Its meridians remain a simple, familiar globe shape.', recommended: false },
  { id: 'd', name: 'The open atlas', detail: 'A continent globe and the full name share a single directory-style frame, giving the identity a formal, institutional character.', recommended: false }
]);

const DESCRIPTOR = 'International Directory of Evidence-Based Practice';
const FONT = "'Public Sans',Arial,Helvetica,sans-serif";

function meridians(cx, cy, radius, { weight = 1.7, colour = 'var(--brand-accent,#087F8C)', fill = 'none' } = {}) {
  const left = cx - radius, right = cx + radius, top = cy - radius, bottom = cy + radius;
  return `<g fill="${fill}" stroke="${colour}" stroke-width="${weight}" stroke-linecap="round" stroke-linejoin="round"><circle cx="${cx}" cy="${cy}" r="${radius}"/><ellipse cx="${cx}" cy="${cy}" rx="${radius * .43}" ry="${radius}"/><path d="M${left} ${cy}H${right}M${cx - radius * .86} ${cy - radius * .5}Q${cx} ${cy - radius * .24} ${cx + radius * .86} ${cy - radius * .5}M${cx - radius * .86} ${cy + radius * .5}Q${cx} ${cy + radius * .24} ${cx + radius * .86} ${cy + radius * .5}"/></g>`;
}

// A deliberately simplified map, not an assertion about territorial borders.
function continents(cx, cy, radius) {
  return `<g transform="translate(${cx - radius} ${cy - radius}) scale(${radius / 30})" fill="var(--brand-accent,#087F8C)"><path d="M8 12l6-5 5-1 4 4 5 1 1 4-5 5-6 1-1 5-3 2-3-5-5-3-2-4zM21 29c4 0 8 2 11 5l-1 7-5 10-4 5-2-9-4-7 1-7zM28 5l6-2 4 3-5 8-4-2zM38 12l7-3 7 4 5 5-2 4-7-1-4 4-6-3-4 1-2-4 5-3zM38 27l8-1 6 6-3 8-6 10-4-4-1-8-4-5zM50 46l6-2 2 6-5 4-5-3z"/></g>`;
}

const letter = (text, x, y, size, extra = '') => `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" font-weight="850" letter-spacing="-2.5" fill="currentColor" ${extra}>${text}</text>`;

function artwork(option) {
  if (option === 'a') {
    return `${letter('ID-EBP', 12, 80, 78)}${meridians(64.2, 51.5, 9.1, { weight: 1 })}`;
  }
  if (option === 'b') {
    return `${letter('ID', 12, 80, 78)}${letter('EBP', 158, 80, 78)}<path d="M92 52H153" fill="none" stroke="currentColor" stroke-width="7"/>${meridians(122.5, 52, 25, { weight: 2.1 })}`;
  }
  if (option === 'c') {
    return `${meridians(55, 51, 41, { weight: 1.9 })}<text x="21" y="71" font-family="${FONT}" font-size="54" font-weight="850" letter-spacing="-2" fill="currentColor" stroke="var(--brand-surface,#FFFFFF)" stroke-width="7" paint-order="stroke fill">ID</text>${letter('-EBP', 108, 80, 78)}`;
  }
  return `<path d="M58 12H356V91H58" fill="none" stroke="currentColor" stroke-width="2.3"/><circle cx="49" cy="51.5" r="34.5" fill="none" stroke="currentColor" stroke-width="2.3"/>${continents(49, 51.5, 32)}${letter('ID-EBP', 97, 75, 61)}`;
}

/**
 * Inline SVG; inherits the surrounding text colour. The only optional accent
 * is --brand-accent. Set it to currentColor for a single-colour identity.
 * --brand-surface supplies the background behind the lettering in option C.
 */
export function logoMarkup(option = 'b', { descriptor = true } = {}) {
  const choice = BRAND_OPTIONS.some(item => item.id === option) ? option : 'b';
  const height = descriptor ? 121 : 101;
  const subtitle = descriptor ? `<text x="13" y="113" font-family="${FONT}" font-size="12.35" font-weight="550" letter-spacing=".04" fill="currentColor">${DESCRIPTOR}</text>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 375 ${height}" class="brand-logo id-ebp-logo id-ebp-logo--${choice}" role="img" aria-label="ID-EBP${descriptor ? ` — ${DESCRIPTOR}` : ''}"><title>ID-EBP${descriptor ? ` — ${DESCRIPTOR}` : ''}</title>${artwork(choice)}${subtitle}</svg>`;
}
