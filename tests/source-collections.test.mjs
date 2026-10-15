import test from 'node:test';
import assert from 'node:assert/strict';
import {SOURCES} from '../public/data.js';
import {searchSources} from '../public/ranking.js';
test('resource View all includes only its collection and combines with country filters',()=>{
 const expected=SOURCES.filter(s=>s.status!=='hidden'&&s.types.some(t=>['Research collection','Practice collection','Official','Professional society','Charity','Company','Learning provider'].includes(t)));
 const actual=searchSources(SOURCES,{collection:'resources'});
 assert.deepEqual(actual.map(s=>s.id).sort(),expected.map(s=>s.id).sort());
 assert(actual.length>0&&actual.length<SOURCES.length);
 const filtered=searchSources(SOURCES,{collection:'resources',based:'United Kingdom'});
 assert(filtered.length>0);assert(filtered.every(s=>s.country==='United Kingdom'));
});
