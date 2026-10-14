import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import {extname,resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.txt':'text/plain; charset=utf-8'};
const assets={};
for(const name of await readdir(resolve(root,'public'))){const type=types[extname(name)];if(type)assets['/'+name]={type,body:await readFile(resolve(root,'public',name),'utf8')};}
await mkdir(resolve(root,'dist'),{recursive:true});
const worker=await readFile(resolve(root,'src/worker.mjs'),'utf8');
await writeFile(resolve(root,'dist/worker.mjs'),worker.replace("import {ASSETS} from './assets.generated.mjs';",`const ASSETS=${JSON.stringify(assets)};`));
console.log(`Built ${Object.keys(assets).length} static assets into dist/worker.mjs.`);
