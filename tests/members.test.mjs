import test from 'node:test';
import assert from 'node:assert/strict';
import {memberCopy, renderMemberPage, renderContributionWidget, initialiseMembers, loadPublicContributions, getContributionSummary, getMemberSession, isMemberPath, completeMutation, bindContributionWidgets} from '../public/members.js';

test('every member interface message is available in each supported interface language',()=>{
  const keys=Object.keys(memberCopy('en')).sort();
  for(const locale of ['fr','es']) {
    assert.deepEqual(Object.keys(memberCopy(locale)).sort(),keys);
    for(const [key,text] of Object.entries(memberCopy(locale))) assert.ok(text.trim(),`${locale}.${key}`);
  }
});

test('member service does not invent an account, star score or successful registration while inactive',async t=>{
  const original=globalThis.fetch; const requests=[];
  t.after(()=>{globalThis.fetch=original;});
  globalThis.fetch=async(url,options)=>{
    requests.push({url,options});
    if(url==='/api/status') return Response.json({configured:false,mode:'setup_required'});
    return Response.json({sources:{}});
  };
  await initialiseMembers({refresh:true});
  const html=renderMemberPage({path:'/register'});
  assert.match(html,/Account activation required/);
  assert.match(html,/Nothing entered here is submitted while it is inactive/);
  assert.match(html,/type="submit" disabled/);
  assert.equal(getMemberSession().user,null);
  const widget=renderContributionWidget({id:'sample'});
  assert.match(widget,/No reader feedback yet|0 contributors/);
  assert.doesNotMatch(widget,/<input[^>]*\bchecked\b/);
  assert.doesNotMatch(widget,/value="0"/);
  assert.doesNotMatch(widget,/instant-stars|data-rate|value="5"/);
  assert.equal(requests.some(request=>request.options.method!=='GET'),false);
});

test('published community tags remain escaped and account requests use same-origin cookies',async t=>{
  const original=globalThis.fetch;const requests=[];
  t.after(()=>{globalThis.fetch=original;});
  globalThis.fetch=async(url,options)=>{
    requests.push({url,options});
    if(url==='/api/status') return Response.json({configured:true,email:true});
    if(url==='/api/session') return Response.json({user:{id:'member',email:'member@example.org',emailConfirmed:true,admin:false},csrfToken:'csrf'});
    return Response.json({sources:{sample:{feedback:{contributors:2},tags:['<img src=x onerror=alert(1)>'],domainConfirmed:true,organisationConfirmed:false},fractional:{feedback:{contributors:19},tags:[],domainConfirmed:false,organisationConfirmed:false}}});
  };
  await initialiseMembers({refresh:true});
  const contributions=await loadPublicContributions();
  assert.equal(contributions.sample.feedback.contributors,2);
  assert.equal(getContributionSummary('sample').feedback.contributors,2);
  const widget=renderContributionWidget({id:'sample'});
  assert.match(widget,/2 contributors/);
  assert.match(widget,/&lt;img/);
  assert.doesNotMatch(widget,/<img src=x/);
  assert.match(widget,/Approved source contact confirmed/);
  assert.doesNotMatch(widget,/instant-stars|data-rate/);
  assert.doesNotMatch(widget,/\sstyle\s*=/);
  const fractional=renderContributionWidget({id:'fractional'});
  assert.match(fractional,/19 contributors/);
  assert.doesNotMatch(fractional,/instant-star|\/ 5/);
  assert.doesNotMatch(fractional,/\sstyle\s*=/);
  assert.equal(requests.every(request=>request.options.credentials==='same-origin'),true);
  assert.equal(requests.every(request=>request.options.cache==='no-store'),true);
});

test('email sign-in remains clearly inactive if data service is connected before email delivery',async t=>{
  const original=globalThis.fetch;t.after(()=>{globalThis.fetch=original;});
  globalThis.fetch=async(url)=>Response.json(url==='/api/status'?{configured:true,email:false}:{user:null});
  await initialiseMembers({refresh:true});
  const html=renderMemberPage({path:'/login',lang:'es'});
  assert.match(html,/Se está conectando el acceso por correo/);
  assert.match(html,/type="submit" disabled/);
  assert.equal(isMemberPath('/source-workspace'),true);
  assert.equal(isMemberPath('/admin'),true);
  assert.equal(isMemberPath('/directory'),false);
});

test('an expired session still lets the member request a fresh sign-in code',async t=>{
  const original=globalThis.fetch;t.after(()=>{globalThis.fetch=original;});
  globalThis.fetch=async(url)=>url==='/api/status'
    ? Response.json({configured:true,email:true})
    : Response.json({error:{code:'sign_in_required'}},{status:401});
  await initialiseMembers({refresh:true});
  assert.equal(getMemberSession().user,null);
  const html=renderMemberPage({path:'/login'});
  assert.doesNotMatch(html,/type="submit" disabled/);
  assert.doesNotMatch(html,/Account activation required/);
});

test('password recovery has an email-code screen and no authenticator controls',()=>{
 const page=renderMemberPage({path:'/reset-password',lang:'en'});assert.match(page,/Send password-reset email/);assert.doesNotMatch(page,/authenticator|enrol-mfa|member-form="mfa"/i);
 const login=renderMemberPage({path:'/login',lang:'en'});assert.match(login,/href="\/reset-password"/);
});

test('claim form requires only source, email and code, with no required supporting text',()=>{
 const page=renderMemberPage({path:'/source-workspace',params:new URLSearchParams({claim:'sample'}),sources:[{id:'sample',name:'Sample source'}]});
 assert.match(page,/name="email"[^>]+required/);assert.match(page,/data-claim-step="email"/);assert.doesNotMatch(page,/name="token"/);
 const previous=globalThis.sessionStorage;globalThis.sessionStorage={getItem:()=>JSON.stringify({email:'editor@example.org',sentTo:'editor@example.org',evidence:'x'})};
 const codePage=renderMemberPage({path:'/source-workspace',params:new URLSearchParams({claim:'draft-source'}),sources:[{id:'draft-source',name:'Draft source'}]});globalThis.sessionStorage=previous;
 assert.match(codePage,/name="token"[^>]+required/);assert.match(codePage,/data-claim-step="code"/);
 assert.doesNotMatch(page,/<textarea name="evidence"[^>]*(?:required|minlength)/);
 assert.doesNotMatch(page,/<input name="evidenceUrl"[^>]*required/);
 assert.match(codePage,/Your form stays here/);assert.match(codePage,/Send claim/);
 const widget=renderContributionWidget({id:'sample'});assert.equal((widget.match(/data-rate="/g)||[]).length,0);assert.doesNotMatch(widget,/Save rating|rating-editor/);
});


test('a successful write followed by a failed refresh remains a confirmed success',async()=>{
 let writes=0;const result=await completeMutation({submit:async()=>{writes++;return {claim:{id:'recorded'}};},refresh:async()=>{throw Object.assign(Error('admin denied'),{status:403});}});
 assert.equal(writes,1);assert.equal(result.refreshPending,true);assert.equal(result.result.claim.id,'recorded');
});
test('a lost write response checks stored state before deciding the result',async()=>{
 let checked=0;const result=await completeMutation({submit:async()=>{throw Error('response lost');},confirm:async()=>{checked++;return true;}});assert.equal(checked,1);assert.equal(result.confirmed,true);
 await assert.rejects(completeMutation({submit:async()=>{throw Error('offline');},confirm:async()=>false}),e=>e.uncertain===true);
 const denied=Object.assign(Error('denied'),{status:403});await assert.rejects(completeMutation({submit:async()=>{throw denied;},confirm:async()=>{throw Error('must not read');}}),e=>e===denied&&!e.uncertain);
});
test('pending and approved claimants see their status instead of another claim form',async t=>{
 const previous=globalThis.fetch;t.after(()=>{globalThis.fetch=previous;});
 for(const managed of [false,true]){
  globalThis.fetch=async path=>Response.json(path==='/api/status'?{configured:true,email:true}:{user:{id:'claimant',emailConfirmed:true},managedSources:managed?[{slug:'claimed-source'}]:[],claims:[{slug:'claimed-source',name:'Claimed source',state:managed?'accepted':'review'}]});
  await initialiseMembers({refresh:true});const html=renderMemberPage({path:'/source-workspace',params:new URLSearchParams({claim:'claimed-source'}),sources:[{id:'claimed-source',name:'Claimed source'}]});
  assert.doesNotMatch(html,/data-member-form="claim"/);assert.match(html,managed?/You manage this source/:/Awaiting review/);
 }
});
test('approved source owners can propose every extended field and settings keep account proofs separate',async t=>{
 const previous=globalThis.fetch;t.after(()=>{globalThis.fetch=previous;});globalThis.fetch=async path=>Response.json(path==='/api/status'?{configured:true,email:true}:{user:{id:'owner',email:'owner@example.org',emailConfirmed:true},managedSources:[{slug:'extended-source',role:'owner'}]});await initialiseMembers({refresh:true});
 const page=renderMemberPage({path:'/source-workspace',params:new URLSearchParams({edit:'extended-source'}),sources:[{id:'extended-source',name:'Extended source',about:'A descriptive public source summary.',url:'https://example.org',country:'United Kingdom',languages:['English'],content:['Original research'],topics:[],methods:[],contactEmail:'public@example.org'}]});
 for(const name of ['url','contactName','contactEmail','contactPage','social','logoUrl','portraitUrl','portraitSourceUrl','country','languages','imagePermission','removeLogo','removePortrait'])assert.match(page,new RegExp('name="'+name+'"'));
 assert.match(page,/value="public@example.org"/);assert.match(page,/value="English" selected/);assert.match(page,/administrator reviews/i);
 const settings=renderMemberPage({path:'/account'});assert.match(settings,/Download my account and saved sources/);assert.match(settings,/data-member-form="account-deletion"/);assert.match(settings,/Code from current email/);assert.match(settings,/Code from new email/);assert.match(settings,/does not immediately delete/);
});
test('recovery verified in the cookie-backed session survives a reload of the reset screen',async t=>{
 const previous=globalThis.fetch;t.after(()=>{globalThis.fetch=previous;});globalThis.fetch=async path=>Response.json(path==='/api/status'?{configured:true,email:true}:{user:{id:'recovering',emailConfirmed:true},recoveryVerified:true});await initialiseMembers({refresh:true});const html=renderMemberPage({path:'/reset-password'});assert.match(html,/Save new password/);assert.doesNotMatch(html,/Send password-reset email/);
});


test('the feedback form saves, recovers a lost acknowledgement and removes without exposing notes to cards',async t=>{
 const previousFetch=globalThis.fetch,previousFormData=globalThis.FormData;t.after(()=>{globalThis.fetch=previousFetch;globalThis.FormData=previousFormData;});
 let saved=null,loseAck=false,writes=0;const requests=[],controls=Array.from({length:6},()=>({disabled:false})),aggregate=()=>({contributors:saved?1:0,own:saved});
 globalThis.fetch=async(path,options)=>{requests.push({path,options});if(path==='/api/status')return Response.json({configured:true,email:true});if(path==='/api/session')return Response.json({user:{id:'feedback-member',emailConfirmed:true},csrfToken:'feedback-csrf'});if(options.method==='PUT'){assert.ok(controls.every(c=>c.disabled));writes++;saved={...JSON.parse(options.body),revision:'revision-'+writes,updatedAt:'2026-10-20T00:00:00Z'};if(loseAck)throw Error('acknowledgement lost');return Response.json({feedback:aggregate(),saved:true});}if(options.method==='DELETE'){assert.equal(JSON.parse(options.body).revision,saved.revision);saved=null;return Response.json({feedback:aggregate(),removed:true});}return Response.json({viewerId:'feedback-member',feedback:aggregate(),tags:[]});};
 await initialiseMembers({refresh:true});const handlers={},region={textContent:'',classList:{toggle(){}},setAttribute(){}};const host={dataset:{contributionSource:'form-flow'},isConnected:true,innerHTML:'',addEventListener:(type,fn)=>handlers[type]=fn,querySelector:()=>region};bindContributionWidgets({root:{querySelectorAll:()=>[host]}});await new Promise(setImmediate);assert.match(host.innerHTML,/Share your experience/);
 globalThis.FormData=class{constructor(form){this.entries=form.values;}[Symbol.iterator](){return this.entries[Symbol.iterator]();}getAll(key){return this.entries.filter(([k])=>k===key).map(([,v])=>v);}get(key){return this.getAll(key)[0];}};
 const form={dataset:{contributionForm:'feedback'},values:[['usefulness','very'],['clarity',''],['traceability','na'],['purposes','research'],['note','private form note']],querySelectorAll:()=>controls},event={target:{closest:()=>form},preventDefault(){}};
 await handlers.submit(event);assert.equal(writes,1);assert.match(region.textContent,/has been saved/);assert.ok(controls.every(c=>!c.disabled));const request=requests.find(r=>r.options.method==='PUT');assert.equal(request.options.headers['X-IDEBP-Account'],'feedback-member');assert.equal(request.options.headers['X-CSRF-Token'],'feedback-csrf');assert.equal(getContributionSummary('form-flow').feedback.own,undefined);assert.doesNotMatch(JSON.stringify(getContributionSummary('form-flow')),/private form note/);
 form.dataset.revision=saved.revision;form.values[0]=['usefulness','somewhat'];loseAck=true;await handlers.submit(event);assert.equal(writes,2);assert.match(region.textContent,/has been saved/);assert.doesNotMatch(region.textContent,/could not confirm/);
 const button={dataset:{contributionAction:'remove-feedback',revision:saved.revision},disabled:false};await handlers.click({target:{closest:()=>button}});assert.match(region.textContent,/has been removed/);assert.equal(getContributionSummary('form-flow').feedback.contributors,0);
});

test('switching accounts clears source answers and private notes before displaying a new member',async t=>{
 const previous=globalThis.fetch;t.after(()=>{globalThis.fetch=previous;});let member='first';globalThis.fetch=async path=>Response.json(path==='/api/status'?{configured:true,email:true}:path==='/api/session'?{user:{id:member,emailConfirmed:true}}:{viewerId:member,feedback:{contributors:1,own:{usefulness:'very',note:'first member private note',revision:'first-revision'}},tags:[]});await initialiseMembers({refresh:true});const host={dataset:{contributionSource:'account-switch'},isConnected:true,innerHTML:'',addEventListener(){}};bindContributionWidgets({root:{querySelectorAll:()=>[host]}});await new Promise(setImmediate);assert.match(host.innerHTML,/first member private note/);member='second';await initialiseMembers({refresh:true});const html=renderContributionWidget({id:'account-switch'});assert.doesNotMatch(html,/first member private note|first-revision/);assert.match(html,/Reload feedback/);
});
