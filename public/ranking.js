export const WEIGHTS = Object.freeze({organisation:12,ownership:8,social:5,references:8,recommendations:7});
const clamp=(n,max)=>Math.min(Math.max(Number(n)||0,0),max);
export function signals(source) {
  const s=source.signals||{};
  return {organisation:s.organisationConfirmed?12:0, ownership:s.domainConfirmed?8:0,
    social:clamp(s.confirmedSocial,2)*2.5, references:clamp(s.independentReferences,4)*2,
    recommendations:Math.min(7,Math.log2(1+Math.max(0,Number(s.eligibleRecommendations)||0)))};
}
export function signalScore(source){return Object.values(signals(source)).reduce((a,b)=>a+b,0);}
export function normalise(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
export function searchSources(sources,filters={}) {
  const words=normalise(filters.query).split(/\s+/).filter(Boolean);
  return sources.filter(s=>s.status!=='hidden').filter(s=>{
    const hay=normalise([s.name,s.about,s.country,...s.topics,...s.types,...s.content,...s.methods,...(s.searchTerms||[])].join(' '));
    return words.every(w=>hay.includes(w))&&(!filters.based||s.country===filters.based)&&(!filters.country||s.coverage.includes(filters.country))&&(!filters.type||s.types.includes(filters.type))&&(!filters.content||s.content.includes(filters.content))&&(!filters.access||s.access===filters.access)&&(!filters.language||s.languages.includes(filters.language))&&(!filters.topic||s.topics.includes(filters.topic));
  }).map(s=>{
    const matches=words.reduce((n,w)=>n+(normalise(s.name).includes(w)?25:normalise(s.topics.join(' ')).includes(w)?15:5),0);
    return {...s,matchScore:matches,signalScore:signalScore(s)};
  }).sort((a,b)=>filters.sort==='name'?a.name.localeCompare(b.name):filters.sort==='country'?a.country.localeCompare(b.country)||a.name.localeCompare(b.name):b.matchScore-a.matchScore||b.signalScore-a.signalScore||a.name.localeCompare(b.name));
}
export function safeUrl(value){try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)&&!u.username&&!u.password?u.href:null;}catch{return null;}}
