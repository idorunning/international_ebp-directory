import test from 'node:test';
import assert from 'node:assert/strict';
import {SOURCES} from '../public/data.js';
import {searchSources,signalScore,safeUrl} from '../public/ranking.js';
import worker from '../dist/worker.mjs';

test('society, country and research language filters intersect',()=>{
 const result=searchSources(SOURCES,{type:'EBP society',based:'Canada',language:'English'});
 assert.deepEqual(result.map(s=>s.id),['can-sebp']);
 assert.equal(searchSources(SOURCES,{type:'EBP society',based:'Canada',language:'French'}).length,0);
});
test('coverage does not imply the organisation is based in that country',()=>{
 assert(searchSources(SOURCES,{country:'United Kingdom'}).some(s=>s.id==='global-policing-database'));
 assert(!searchSources(SOURCES,{based:'United Kingdom'}).some(s=>s.id==='global-policing-database'));
});
test('identity and popularity cannot override a closer textual match',()=>{
 const template=SOURCES[0];
 const boosted={...template,id:'boosted',name:'Other collection',about:'policing resource',topics:[],signals:{organisationConfirmed:true,domainConfirmed:true,confirmedSocial:900,independentReferences:900,eligibleRecommendations:999999}};
 const relevant={...template,id:'relevant',name:'Policing resource',topics:[],signals:{}};
 assert.equal(signalScore(boosted),40);
 assert.equal(searchSources([boosted,relevant],{query:'policing'})[0].id,'relevant');
});
test('hidden sources and nonmatching topics cannot be boosted into results',()=>{
 const hidden={...SOURCES[0],status:'hidden'};
 assert.equal(searchSources([hidden]).length,0);
 assert.equal(searchSources(SOURCES,{topic:'Nonexistent subject'}).length,0);
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
