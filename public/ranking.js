export const WEIGHTS = Object.freeze({organisation:12,ownership:8,social:5,references:8,recommendations:7});
const clamp=(n,max)=>Math.min(Math.max(Number(n)||0,0),max);
export function signals(source) {
  const s=source.signals||{};
  return {organisation:s.organisationConfirmed?12:0, ownership:s.domainConfirmed?8:0,
    social:clamp(s.confirmedSocial,2)*2.5, references:clamp(s.independentReferences,4)*2,
    recommendations:Math.min(7,Math.log2(1+Math.max(0,Number(s.eligibleRecommendations)||0)))};
}
export function signalScore(source){return Object.values(signals(source)).reduce((a,b)=>a+b,0);}
import {INDEX} from './search-index.js';
import {normalise,queryWords,buildSearchEntry,signature,tokenMatches} from './search.js';
export {normalise} from './search.js';
const cache=new WeakMap();
function indexed(s){
  const sig=signature(s),cached=cache.get(s);
  if(cached?.signature===sig)return cached;
  const entry=INDEX[s.id]?.signature===sig?INDEX[s.id]:buildSearchEntry(s);
  cache.set(s,entry);return entry;
}
export function searchSources(sources,filters={}) {
  const words=queryWords(filters.query);
  return sources.filter(s=>s.status!=='hidden').filter(s=>{
    const entry=indexed(s);
    return words.every(w=>entry.tokens.some(token=>tokenMatches(token,w)))&&(!filters.based||s.country===filters.based)&&(!filters.country||s.coverage.includes(filters.country))&&(!filters.type||s.types.includes(filters.type))&&(!filters.content||s.content.includes(filters.content))&&(!filters.access||s.access===filters.access)&&(!filters.language||s.languages.includes(filters.language))&&(!filters.topic||s.topics.includes(filters.topic));
  }).map(s=>{
    const f=indexed(s).fields;
    const inField=(field,w)=>queryWords(field).some(token=>tokenMatches(token,w));
    const matches=words.reduce((n,w)=>n+(inField(f.name,w)?25:inField(f.owner,w)?22:inField(f.topics,w)?15:inField(f.aliases,w)?12:5),0);
    return {...s,matchScore:matches,matchFields:words.length?Object.entries(f).filter(([,value])=>words.some(w=>inField(value,w))).map(([key])=>key):[],signalScore:signalScore(s)};
  }).sort((a,b)=>filters.sort==='name'?a.name.localeCompare(b.name):filters.sort==='country'?a.country.localeCompare(b.country)||a.name.localeCompare(b.name):b.matchScore-a.matchScore||b.signalScore-a.signalScore||a.name.localeCompare(b.name));
}
export function safeUrl(value){try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)&&!u.username&&!u.password?u.href:null;}catch{return null;}}
