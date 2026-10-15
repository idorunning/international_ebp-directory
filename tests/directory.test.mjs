import test from 'node:test';
import assert from 'node:assert/strict';
import {SOURCES,BASE_COUNTRIES,COUNTRY_CODES} from '../public/data.js';
import {searchSources,signalScore,ratingScore,safeUrl} from '../public/ranking.js';
import worker from '../dist/worker.mjs';
import {INDEX} from '../public/search-index.js';

test('society, country and research language filters intersect',()=>{
 const result=searchSources(SOURCES,{type:'EBP society',based:'Canada',language:'English'});
 assert.deepEqual(result.map(s=>s.id),['can-sebp']);
 assert.equal(searchSources(SOURCES,{type:'EBP society',based:'Canada',language:'French'}).length,0);
});
test('coverage does not imply the organisation is based in that country',()=>{
 assert(searchSources(SOURCES,{country:'New Zealand'}).some(s=>s.id==='anzsebp'));
 assert(!searchSources(SOURCES,{based:'New Zealand'}).some(s=>s.id==='anzsebp'));
});
test('country browsing accounts for every source and university and researcher filters stay distinct',()=>{
 const countries=[...new Set(SOURCES.map(s=>s.country))];
 assert.equal(countries.reduce((n,country)=>n+searchSources(SOURCES,{based:country}).length,0),SOURCES.length);
 for(const country of countries)assert.match(COUNTRY_CODES[country],/^[A-Z]{2}$/);
 assert(searchSources(SOURCES,{type:'University',based:'Portugal'}).some(s=>s.id==='porto-cjs'));
 assert(!searchSources(SOURCES,{type:'University'}).some(s=>s.id==='cambridge-ebp'));
 assert(searchSources(SOURCES,{type:'Researcher',based:'Ireland'}).some(s=>s.id==='ian-marder'));
 assert(!searchSources(SOURCES,{type:'University'}).some(s=>s.id==='ian-marder'));
 const portsmouth=SOURCES.find(s=>s.id==='portsmouth-policing');
 assert.equal(portsmouth.publicationLinks.length,3);
 for(const link of portsmouth.publicationLinks)assert(safeUrl(link.url));
});
test('identity and popularity cannot override a closer textual match',()=>{
 const template=SOURCES[0];
 const boosted={...template,id:'boosted',name:'Other collection',about:'policing resource',topics:[],ratingAverage:5,ratingCount:10000000,signals:{organisationConfirmed:true,domainConfirmed:true,confirmedSocial:900,independentReferences:900}};
 const relevant={...template,id:'relevant',name:'Policing resource',topics:[],signals:{}};
 assert(signalScore(boosted)<=40&&signalScore(boosted)>39.99);
 assert.equal(searchSources([boosted,relevant],{query:'policing'})[0].id,'relevant');
});
test('zero stars differs from unrated and a tiny sample cannot dominate a stable rating',()=>{
 const unrated={ratingAverage:null,ratingCount:0};
 assert.equal(ratingScore(unrated),3.5);
 assert(ratingScore({ratingAverage:0,ratingCount:5})<ratingScore(unrated));
 assert(ratingScore({ratingAverage:5,ratingCount:1})<ratingScore({ratingAverage:4,ratingCount:100}));
 for(const average of [0,1,2,3,4,5])assert(ratingScore({ratingAverage:average,ratingCount:100})>=0&&ratingScore({ratingAverage:average,ratingCount:100})<=7);
});
test('translated descriptions, native names and new community tags remain searchable',()=>{
 assert(searchSources(SOURCES,{query:'中央警察'}).length>0);
 assert(searchSources(SOURCES,{query:'警察'}).length>0);
 assert(searchSources(SOURCES,{query:'prévention'}).length>0);
 const source=structuredClone(SOURCES[0]);
 assert.equal(searchSources([source],{query:'zxcommunitytag'}).length,0);
 source.communityTags=['zxcommunitytag'];
 assert.equal(searchSources([source],{query:'zxcommunitytag'}).length,1);
});
test('hidden sources and nonmatching topics cannot be boosted into results',()=>{
 const hidden={...SOURCES[0],status:'hidden'};
 assert.equal(searchSources([hidden]).length,0);
 assert.equal(searchSources(SOURCES,{topic:'Nonexistent subject'}).length,0);
});
test('every public source has a generated metadata index and supporting page',()=>{
 assert.equal(Object.keys(INDEX).length,SOURCES.length);
 assert.equal(new Set(SOURCES.map(s=>s.id)).size,SOURCES.length);
 for(const s of SOURCES){
  assert.equal(INDEX[s.id].id,s.id);
  assert(s.verificationUrls.length>0);
  assert(INDEX[s.id].tokens.length>0);
  assert(BASE_COUNTRIES.includes(s.country),`Country filter must include ${s.country}`);
 }
});
test('search handles accents, phrase equivalents, acronyms and content languages',()=>{
 assert.deepEqual(searchSources(SOURCES,{query:'Malmö'}).map(s=>s.id),searchSources(SOURCES,{query:'Malmo'}).map(s=>s.id));
 assert.deepEqual(searchSources(SOURCES,{query:'hot spots'}).map(s=>s.id),searchSources(SOURCES,{query:'hotspot'}).map(s=>s.id));
 assert.deepEqual(searchSources(SOURCES,{query:'ISS'}).map(s=>s.id),['iss']);
 assert.deepEqual(searchSources(SOURCES,{query:'iIIRG'}).map(s=>s.id),['iiirg']);
 assert(searchSources(SOURCES,{query:'Portuguese'}).some(s=>s.id==='fbsp'));
 assert(searchSources(SOURCES,{query:'community policing'}).some(s=>s.id==='osce-policing'));
});
test('search includes geographical coverage but never relaxes explicit requirements',()=>{
 assert(searchSources(SOURCES,{query:'Scotland'}).some(s=>s.id==='sipr'));
 const brazil=searchSources(SOURCES,{query:'Portuguese',language:'English',based:'Brazil'});
 assert(brazil.length>0);
 assert(brazil.every(s=>s.country==='Brazil'&&s.languages.includes('English')));
 assert.equal(searchSources(SOURCES,{query:'county lines',based:'Japan'}).length,0);
});
test('edits in the administration demonstration refresh the index in this tab',()=>{
 const s=structuredClone(SOURCES[0]);
 assert.equal(searchSources([s],{query:'zxnewsubject'}).length,0);
 s.about='A collection on zxnewsubject';
 assert.equal(searchSources([s],{query:'zxnewsubject'}).length,1);
});
test('unsafe external URL schemes and embedded credentials are rejected',()=>{
 for(const u of ['javascript:alert(1)','data:text/html,hello','https://person:secret@example.org','file:///etc/passwd'])assert.equal(safeUrl(u),null);
 assert.equal(safeUrl('https://example.org/research'),'https://example.org/research');
});
test('preview rejects account writes and declares its actual capability',async()=>{
 const status=await worker.fetch(new Request('https://example.org/api/status'));
 assert.equal((await status.json()).authentication,false);
 const write=await worker.fetch(new Request('https://example.org/api/signup',{method:'POST',body:'example'}));
 assert.equal(write.status,503);
 const post=await worker.fetch(new Request('https://example.org/',{method:'POST'}));
 assert.equal(post.status,405);
});
test('served preview has restrictive headers and cannot expose backend files',async()=>{
 const page=await worker.fetch(new Request('https://example.org/'));
 assert.equal(page.status,200);
 assert.match(page.headers.get('content-security-policy'),/frame-ancestors 'none'/);
 assert.equal(page.headers.get('x-robots-tag'),'noindex, nofollow');
 const secret=await worker.fetch(new Request('https://example.org/backend/schema.sql'));
 assert.equal(secret.status,404);
});
test('www and plain HTTP redirect to the canonical HTTPS domain without losing paths or queries',async()=>{
 for(const address of ['http://www.id-ebp.org/app.js?version=2','https://www.id-ebp.org/app.js?version=2','http://id-ebp.org/app.js?version=2']){
  const response=await worker.fetch(new Request(address));
  assert.equal(response.status,308);
  assert.equal(response.headers.get('location'),'https://id-ebp.org/app.js?version=2');
 }
 for(const address of ['https://id-ebp.org/','https://idebp-preview.ntracey.workers.dev/']){
  assert.equal((await worker.fetch(new Request(address))).status,200);
 }
});

test('nested binary font and source images retain their file signatures and MIME types',async()=>{
 const font=await worker.fetch(new Request('https://example.org/assets/fonts/public-sans-latin.woff2'));
 assert.equal(font.headers.get('content-type'),'font/woff2');
 assert.equal(new TextDecoder().decode((await font.arrayBuffer()).slice(0,4)),'wOF2');
 const logo=await worker.fetch(new Request('https://example.org/assets/sources/cebcp-matrix-logo.png'));
 assert.equal(logo.headers.get('content-type'),'image/png');
 assert.deepEqual([...new Uint8Array(await logo.arrayBuffer()).slice(0,8)],[137,80,78,71,13,10,26,10]);
});
