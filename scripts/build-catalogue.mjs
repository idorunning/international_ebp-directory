import {readFile,writeFile} from 'node:fs/promises';
import {buildSearchEntry} from '../public/search.js';
const records=JSON.parse(await readFile(new URL('../research/catalogue.json',import.meta.url),'utf8'));
const seen=new Set();
for(const s of records){
  if(!s.id||seen.has(s.id))throw new Error(`Duplicate/missing source ID: ${s.id}`);
  seen.add(s.id);
  const url=new URL(s.url);
  if(!['https:','http:'].includes(url.protocol)||url.username||url.password)throw new Error(`Unsafe source URL: ${s.id}`);
  if(!s.about||!s.checked||!s.languages?.length||!s.verificationUrls?.length)throw new Error(`Incomplete source: ${s.id}`);
}
await writeFile(new URL('../public/data.js',import.meta.url),`// Generated from research/catalogue.json by npm run catalogue.\nexport * from './taxonomy.js';\nexport const SOURCES=${JSON.stringify(records,null,2)};\n`);
await writeFile(new URL('../public/search-index.js',import.meta.url),`// Generated metadata index. No external full-text crawling.\nexport const INDEX=${JSON.stringify(Object.fromEntries(records.map(s=>[s.id,buildSearchEntry(s)])))};\n`);
console.log(`Indexed ${records.length} source profiles across ${new Set(records.map(s=>s.country)).size} organisation countries.`);
