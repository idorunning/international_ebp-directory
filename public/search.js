// The index describes destinations, never papers fetched from those destinations.
export function normalise(value) {
  return String(value ?? '').normalize('NFKD').replace(/\p{M}/gu,'').toLowerCase()
    .replace(/&/g,' and ').replace(/[’']/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim().replace(/\s+/g,' ');
}
// These are spelling/terminology equivalents. They do not relax selected filters.
export function queryWords(value) {
  return normalise(value)
    .replace(/\bhot spots?\b/g,'hotspot').replace(/\bhotspots\b/g,'hotspot')
    .replace(/\bcommunity policing\b/g,'neighbourhood policing')
    .replace(/\bneighborhood\b/g,'neighbourhood')
    .replace(/\borganization(s)?\b/g,'organisation$1')
    .replace(/\bwell being\b/g,'wellbeing')
    .split(' ').filter(Boolean);
}
export const signature=s=>JSON.stringify([s.name,s.about,s.url]);
export function buildSearchEntry(s) {
  const fields={
    name:normalise(s.name),owner:normalise([s.owner,s.initials,s.brandName].join(' ')),
    topics:normalise((s.topics||[]).join(' ')),
    aliases:normalise((s.searchTerms||[]).join(' ')),
    description:normalise(s.about),
    geography:normalise([s.country,...(s.coverage||[])].join(' ')),
    classification:normalise([...(s.types||[]),...(s.content||[]),...(s.methods||[]),...(s.languages||[])].join(' ')),
  };
  return {id:s.id,signature:signature(s),fields,tokens:[...new Set(Object.values(fields).flatMap(queryWords))]};
}
export function tokenMatches(token,word) {
  return token===word || (word.length>=4 && token.startsWith(word));
}
