import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const source=(await readFile(new URL('../supabase/functions/directory-api/index.ts',import.meta.url),'utf8')).replace("import {handleApi} from '../../../backend/api.mjs';",'');
function wrapper(environment={}){
  let serve;const calls=[];
  const Deno={env:{get:key=>environment[key]},serve:handler=>{serve=handler;}};
  const handler=async(request,env,context)=>{calls.push({request,env,context});return Response.json({ok:true});};
  new Function('Deno','handleApi',source)(Deno,handler);
  return {serve,calls};
}
test('Edge API rejects direct requests, wrong secrets and undeployed placeholders',async()=>{
  for(const [environment,submitted] of [[{},'__IDEBP_PROXY_SECRET_DEPLOYMENT__'],[{IDEBP_PROXY_SECRET:'private-test-proxy-secret'},''],[{IDEBP_PROXY_SECRET:'private-test-proxy-secret'},'wrong-proxy-secret-value']]){
    const edge=wrapper(environment);const response=await edge.serve(new Request('https://project.supabase.co/functions/v1/directory-api/api/status',{headers:{Origin:'https://id-ebp.org','X-IDEBP-Proxy-Key':submitted}}));
    assert.equal(response.status,403);assert.equal(edge.calls.length,0);
  }
});
test('Edge API normalises both platform path forms and trusts only the keyed Worker forwarding header',async()=>{
  for(const prefix of ['/directory-api','/functions/v1/directory-api']){
    const edge=wrapper({IDEBP_PROXY_SECRET:'private-test-proxy-secret',SUPABASE_URL:'https://project.supabase.co'});
    const response=await edge.serve(new Request('https://project.supabase.co'+prefix+'/api/sources/example/rating?test=1',{method:'PUT',headers:{Origin:'https://id-ebp.org','X-IDEBP-Proxy-Key':'private-test-proxy-secret','X-IDEBP-Client-IP':'192.0.2.15','CF-Connecting-IP':'spoofed-header','Content-Type':'application/json','X-CSRF-Token':'csrf-fixture',Cookie:'__Host-idebp_session=opaque'},body:'{"stars":0}'}));
    assert.equal(response.status,200);const call=edge.calls[0];assert.equal(call.request.url,'https://id-ebp.org/api/sources/example/rating?test=1');assert.equal(call.request.method,'PUT');assert.equal(call.context.clientIp,'192.0.2.15');assert.equal(call.request.headers.get('Cookie'),'__Host-idebp_session=opaque');assert.equal(await call.request.text(),'{"stars":0}');
    assert.equal(call.env.AUTH_EMAIL_ENABLED,'false');
  }
});
test('Edge API denies an unapproved browser origin even with the server key',async()=>{
  const edge=wrapper({IDEBP_PROXY_SECRET:'private-test-proxy-secret'});
  const response=await edge.serve(new Request('https://project.supabase.co/directory-api/api/status',{headers:{Origin:'https://attacker.test','X-IDEBP-Proxy-Key':'private-test-proxy-secret'}}));
  assert.equal(response.status,403);assert.equal(edge.calls.length,0);
});
