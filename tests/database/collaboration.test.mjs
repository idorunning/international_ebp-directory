import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';

const ids={member:'10000000-0000-4000-8000-000000000001',owner:'10000000-0000-4000-8000-000000000002',other:'10000000-0000-4000-8000-000000000003',admin:'10000000-0000-4000-8000-000000000004',unconfirmed:'10000000-0000-4000-8000-000000000005'};
const session=id=>id.replace(/^1/,'2');
test('member collaboration authorisation, review and rating integrity',async t=>{
  const db=new PGlite();await db.waitReady;t.after(()=>db.close());
  await db.exec(`create role anon nologin;create role authenticated nologin;create role service_role nologin bypassrls;
    create schema auth;create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz,is_anonymous boolean default false);
    create table auth.sessions(id uuid primary key,user_id uuid references auth.users,not_after timestamptz);
    grant usage on schema public,auth to anon,authenticated,service_role;
    create function auth.uid() returns uuid language sql stable as $$select (nullif(current_setting('request.jwt.claims',true),'')::jsonb->>'sub')::uuid$$;
    alter default privileges in schema public grant all on tables to anon,authenticated,service_role;
    alter default privileges in schema public grant all on sequences to anon,authenticated,service_role;`);
  const folder=new URL('../../supabase/migrations/',import.meta.url);
  for(const file of (await readdir(folder)).filter(f=>f.endsWith('.sql')).sort())await db.exec(await readFile(new URL(file,folder),'utf8'));
  for(const [name,id] of Object.entries(ids)){
    await db.query('insert into auth.users(id,email,email_confirmed_at) values($1,$2,$3)',[id,name==='owner'?'researcher@university.test':name+'@mail.test',name==='unconfirmed'?null:new Date().toISOString()]);
    await db.query('insert into auth.sessions(id,user_id) values($1,$2)',[session(id),id]);
  }
  const source=(await db.query(`insert into public.sources(slug,name,website_url,canonical_domain,about,country_code,kinds,content_types,research_languages,access_type,status)
    values('university-fixture','University research','https://university.test/research','university.test','Published research from a test university.','GB',array['University'],array['Original research'],array['en'],'free','published') returning id`)).rows[0].id;
  await db.query('insert into public.source_signals(source_id) values($1)',[source]);
  await db.query("insert into private.admin_roles(user_id,state,must_set_password) values($1,'active',false)",[ids.admin]);
  const rpc=async(action,payload={},name='member',aal='aal1',overrideSession)=>{
    await db.exec('begin;set local role service_role;');
    try{const result=(await db.query('select public.directory_api($1,$2,$3,$4,$5) as result',[action,JSON.stringify(payload),name?ids[name]:null,name?(overrideSession||session(ids[name])):null,aal])).rows[0].result;await db.exec('commit');return result;}catch(error){await db.exec('rollback');throw error;}
  };
  await t.test('public clients cannot call privileged functions or read private member records',async()=>{
    for(const role of ['anon','authenticated']){
      assert.equal((await db.query("select has_function_privilege($1,'public.directory_api(text,jsonb,uuid,uuid,text)','EXECUTE') as allowed",[role])).rows[0].allowed,false);
      await db.exec('begin;set local role '+role+';');
      await assert.rejects(db.query('select * from private.source_ratings'),{code:'42501'});await db.exec('rollback');
    }
  });
  await t.test('server-verified identity also requires confirmed account, live session and active membership',async()=>{
    await assert.rejects(rpc('session',{},'unconfirmed'),{code:'42501'});
    await assert.rejects(rpc('session',{},'member','aal1',session(ids.owner)),{code:'42501'});
    await db.query("insert into private.member_profiles(user_id,state) values($1,'suspended')",[ids.other]);
    await assert.rejects(rpc('session',{},'other'),{code:'42501'});
    await db.query("update private.member_profiles set state='active' where user_id=$1",[ids.other]);
    assert.equal((await rpc('session')).admin,false);
  });
  await t.test('zero is a rating, upsert does not duplicate and removal restores unrated null',async()=>{
    let result=await rpc('rate_source',{slug:'university-fixture',stars:0});assert.deepEqual(result.rating,{average:0,count:1,own:0});
    result=await rpc('rate_source',{slug:'university-fixture',stars:5});assert.deepEqual(result.rating,{average:5,count:1,own:5});
    result=await rpc('rate_source',{slug:'university-fixture',stars:3},'other');assert.equal(result.rating.average,4);assert.equal(result.rating.count,2);
    await assert.rejects(rpc('rate_source',{slug:'university-fixture',stars:5.1}),{code:'22023'});
    await rpc('remove_rating',{slug:'university-fixture'},'other');result=await rpc('remove_rating',{slug:'university-fixture'});assert.deepEqual(result.rating,{average:null,count:0,own:null});
  });
  await t.test('tags stay private until a real admin using MFA approves them',async()=>{
    const tag=await rpc('suggest_tag',{slug:'university-fixture',label:'  Procedural   justice  '});assert.equal(tag.suggestion.label,'Procedural justice');
    assert.deepEqual((await rpc('community',{},null)).sources['university-fixture'].tags,[]);
    await assert.rejects(rpc('admin_review'),{code:'42501'});
    await assert.rejects(rpc('admin_review',{},'admin'),error=>error.message==='mfa_required');
    await rpc('moderate',{kind:'tag',id:tag.suggestion.id,decision:'approve',reason:'Relevant public research topic'},'admin','aal2');
    assert.deepEqual((await rpc('community',{},null)).sources['university-fixture'].tags,['Procedural justice']);
    await assert.rejects(rpc('suggest_tag',{slug:'university-fixture',label:'<script>bad</script>'}),{code:'22023'});
    await assert.rejects(rpc('suggest_tag',{slug:'university-fixture',label:'Visit https://spam.test'}),{code:'22023'});
  });
  await t.test('AI descriptions are explicitly labelled, bound to current public text and separate from human translations',async()=>{
    await db.query(`insert into public.source_ai_translations(source_id,locale,about,original_about) values
      ($1,'fr','Description de recherche assistée par IA.','Published research from a test university.'),
      ($1,'es','Descripción antigua.','A former English description.')`,[source]);
    await db.exec('begin;set local role anon;');
    const visible=(await db.query('select locale,origin from public.source_ai_translations')).rows;
    await db.exec('rollback');assert.deepEqual(visible,[{locale:'fr',origin:'ai_translation'}]);
    let translated=(await rpc('community',{},null)).sources['university-fixture'].profile.translations;
    assert.equal(translated.fr.origin,'ai_translation');assert.equal(translated.es,undefined);
    await db.query("insert into public.source_translations(source_id,locale,about,origin,reviewed_at) values($1,'fr','Human-reviewed source description.','human_translation',now())",[source]);
    translated=(await rpc('community',{},null)).sources['university-fixture'].profile.translations;
    assert.equal(translated.fr.origin,'human_translation');
    await assert.rejects(db.query("insert into public.source_translations(source_id,locale,about,origin,reviewed_at) values($1,'de','AI text cannot use the human/source table.','ai_translation',now())",[source]),{code:'23514'});
    await assert.rejects(db.query("update public.source_ai_translations set origin='human_translation' where source_id=$1",[source]),{code:'23514'});
  });
  await t.test('only an exact preapproved contact grants management; organisational email alone stays in review',async()=>{
    const pending=await rpc('claim_source',{slug:'university-fixture'});assert.equal(pending.claim.state,'review');
    assert.equal((await rpc('session')).managedSources.length,0);
    await db.query("update auth.users set email='student@university.test' where id=$1",[ids.other]);
    const domainOnly=await rpc('claim_source',{slug:'university-fixture'},'other');assert.equal(domainOnly.claim.state,'review');
    let community=(await rpc('community',{},null)).sources['university-fixture'];assert.equal(community.domainConfirmed,false);assert.equal(community.organisationConfirmed,false);
    assert.equal((await rpc('session',{},'other')).managedSources.length,0);
    await db.query("insert into private.source_contacts(source_id,contact_email) values($1,'researcher@university.test')",[source]);
    await rpc('rate_source',{slug:'university-fixture',stars:5},'owner');
    const accepted=await rpc('claim_source',{slug:'university-fixture'},'owner');assert.equal(accepted.claim.state,'accepted');
    assert.equal((await rpc('session',{},'owner')).managedSources.length,1);
    community=(await rpc('community',{},null)).sources['university-fixture'];assert.equal(community.domainConfirmed,true);assert.equal(community.organisationConfirmed,true);assert.equal(community.ratingCount,0);
    await assert.rejects(rpc('rate_source',{slug:'university-fixture',stars:5},'owner'),{code:'42501'});
    assert.equal((await rpc('session',{},'other')).claims[0].state,'review');
  });
  await t.test('source edits are constrained, audited, owner-only and reviewed before publication',async()=>{
    const profile={name:'University research updated',about:'Updated public description of published university research.',topics:['Problem-solving'],methods:['Trial'],contentTypes:['Original research']};
    await assert.rejects(rpc('edit_profile',{slug:'university-fixture',profile}),{code:'42501'});
    await assert.rejects(rpc('edit_profile',{slug:'university-fixture',profile:{...profile,domainConfirmed:true}},'owner'),{code:'22023'});
    for(const field of ['topics','methods','contentTypes'])await assert.rejects(rpc('edit_profile',{slug:'university-fixture',profile:{...profile,[field]:[null]}},'owner'),{code:'22023'});
    assert.equal((await rpc('edit_profile',{slug:'university-fixture',profile},'owner')).state,'review');
    assert.equal((await rpc('profile',{slug:'university-fixture'},null)).profile.name,'University research');
    const queue=await rpc('admin_review',{},'admin','aal2');
    await rpc('moderate',{kind:'revision',id:queue.revisions[0].id,decision:'approve',reason:'Confirmed the revised public description'},'admin','aal2');
    assert.equal((await rpc('profile',{slug:'university-fixture'},null)).profile.name,profile.name);
    assert.deepEqual((await rpc('community',{},null)).sources['university-fixture'].profile.translations,{});
    assert.ok((await db.query("select count(*)::int as count from private.audit_events where action='edit_profile'")).rows[0].count>0);
  });
  await t.test('new submissions require review and confer no automatic ownership',async()=>{
    const submitted=await rpc('submit_source',{name:'Another research centre',url:'https://centre.test/research',about:'A university research centre with publicly available policing research.',country:'GB',languages:['en'],types:['University']});
    assert.equal(submitted.submission.state,'review');
    await rpc('moderate',{kind:'submission',id:submitted.submission.id,decision:'approve',reason:'Checked the public centre and its research'},'admin','aal2');
    assert.equal((await db.query("select count(*)::int as count from public.sources where canonical_domain='centre.test' and status='published'")).rows[0].count,1);
    assert.equal((await rpc('session')).managedSources.length,0);
    await assert.rejects(rpc('submit_source',{name:'Bad source',url:'javascript:alert(1)',about:'This source has an invalid website URL.',country:'GB',languages:['en'],types:['Academic']}),{code:'22023'});
    const valid={name:'Null-array source',url:'https://safe.test/research',about:'A sufficiently long public source description.',country:'GB',languages:['en'],types:['University'],contentTypes:['Original research'],topics:[]};
    for(const field of ['languages','types','contentTypes','topics']){
      for(const invalid of [null,7,{bad:'object'}])await assert.rejects(rpc('submit_source',{...valid,[field]:[invalid]}),{code:'22023'});
    }
  });
  await t.test('rate limiting persists across API instances and expires by server time',async()=>{
    await rpc('rate_limit',{key:'local-fixture:opaque-hash',limit:2,seconds:3600},null);
    await rpc('rate_limit',{key:'local-fixture:opaque-hash',limit:2,seconds:3600},null);
    await assert.rejects(rpc('rate_limit',{key:'local-fixture:opaque-hash',limit:2,seconds:3600},null),error=>error.message==='rate_limited');
  });
  await t.test('admin rights require a deliberate private invitation, then a confirmed mailbox and MFA',async()=>{
    assert.equal((await rpc('session',{},'other')).admin,false);
    await db.query("insert into private.admin_invitations(email) values('student@university.test')");
    const accepted=await rpc('session',{},'other');assert.equal(accepted.admin,true);assert.equal(accepted.mfaRequired,true);
    await assert.rejects(rpc('admin_review',{},'other'),error=>error.message==='mfa_required');
    assert.ok((await rpc('admin_review',{},'other','aal2')).tags);
    assert.equal((await db.query("select state from private.admin_invitations where email='student@university.test'")).rows[0].state,'accepted');
  });
  await t.test('deleting a member removes their rating from public aggregates',async()=>{
    await rpc('rate_source',{slug:'university-fixture',stars:0},'member');
    await db.query('delete from auth.sessions where user_id=$1',[ids.member]);
    await db.query('delete from auth.users where id=$1',[ids.member]);
    const aggregate=(await rpc('community',{},null)).sources['university-fixture'];assert.equal(aggregate.ratingAverage,null);assert.equal(aggregate.ratingCount,0);
  });
});
