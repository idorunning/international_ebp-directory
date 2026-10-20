-- Preserve the old responses exactly as private history, without interpreting
-- stars as answers to the new questions. Retain the original private rows too.
create table private.legacy_source_ratings (
 user_id uuid not null references auth.users on delete cascade,source_id uuid not null references public.sources on delete cascade,
 stars smallint not null check(stars between 0 and 5),updated_at timestamptz not null,archived_at timestamptz not null default now(),primary key(user_id,source_id)
);
insert into private.legacy_source_ratings(user_id,source_id,stars,updated_at) select user_id,source_id,stars,updated_at from private.source_ratings;
create index legacy_source_ratings_source on private.legacy_source_ratings(source_id);
revoke insert,update on private.source_ratings from service_role;
create function private.retire_star_signal() returns trigger language plpgsql security invoker set search_path='' as $$
begin new.rating_average:=null;new.rating_count:=0;return new;end;$$;
revoke all on function private.retire_star_signal() from public,anon,authenticated,service_role;
create trigger retire_star_signal before insert or update of rating_average,rating_count on public.source_signals for each row execute function private.retire_star_signal();
update public.source_signals set rating_average=null,rating_count=0 where rating_average is not null or rating_count<>0;
create table private.source_feedback (
 user_id uuid not null references auth.users on delete cascade,source_id uuid not null references public.sources on delete cascade,
 usefulness text check(usefulness in ('very','somewhat','limited','unable')),clarity text check(clarity in ('clear','mixed','unclear','unable')),traceability text check(traceability in ('easy','difficult','missing','na')),
 purposes text[] not null default '{}' check(purposes <@ array['research','practice','teaching','policy','learning']::text[] and array_position(purposes,null) is null and cardinality(purposes)<=5),
 note text not null default '' check(char_length(note)<=1000),revision uuid not null default gen_random_uuid(),created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
 primary key(user_id,source_id),check(usefulness is not null or clarity is not null or traceability is not null)
);
create index source_feedback_source on private.source_feedback(source_id);
alter table private.source_feedback enable row level security;
alter table private.legacy_source_ratings enable row level security;
revoke all on private.source_feedback,private.legacy_source_ratings from public,anon,authenticated,service_role;
grant select,insert,update,delete on private.source_feedback to service_role;
grant select on private.legacy_source_ratings to service_role;
comment on column private.source_feedback.note is 'Optional private feedback for the directory team, never included in public summaries.';

create function private.feedback_summary(p_source uuid) returns jsonb language sql stable security invoker set search_path='' as $$
 with eligible as materialized (
  select f.* from private.source_feedback f join auth.users u on u.id=f.user_id where f.source_id=p_source and u.email_confirmed_at is not null and not coalesce(u.is_anonymous,false)
   and not exists(select 1 from private.member_profiles mp where mp.user_id=f.user_id and mp.state='suspended')
   and not exists(select 1 from private.source_managers m where m.source_id=f.source_id and m.user_id=f.user_id)
 ), totals as (
  select jsonb_build_object('schemaVersion',1,'contributors',count(*),'dimensions',jsonb_build_object(
   'usefulness',jsonb_build_object('answered',count(*) filter(where usefulness in ('very','somewhat','limited')),'unassessed',count(*) filter(where usefulness='unable'),'omitted',count(*) filter(where usefulness is null),'responses',jsonb_build_object('very',count(*) filter(where usefulness='very'),'somewhat',count(*) filter(where usefulness='somewhat'),'limited',count(*) filter(where usefulness='limited'))),
   'clarity',jsonb_build_object('answered',count(*) filter(where clarity in ('clear','mixed','unclear')),'unassessed',count(*) filter(where clarity='unable'),'omitted',count(*) filter(where clarity is null),'responses',jsonb_build_object('clear',count(*) filter(where clarity='clear'),'mixed',count(*) filter(where clarity='mixed'),'unclear',count(*) filter(where clarity='unclear'))),
   'traceability',jsonb_build_object('answered',count(*) filter(where traceability in ('easy','difficult','missing')),'unassessed',count(*) filter(where traceability='na'),'omitted',count(*) filter(where traceability is null),'responses',jsonb_build_object('easy',count(*) filter(where traceability='easy'),'difficult',count(*) filter(where traceability='difficult'),'missing',count(*) filter(where traceability='missing')))
  )) as data from eligible
 ), purpose_counts as (
  select p,(select count(*) from eligible e where p=any(e.purposes) and e.usefulness in ('very','somewhat')) as n from unnest(array['research','practice','teaching','policy','learning']) p
 ) select data||jsonb_build_object('purposes',(select jsonb_object_agg(p,n) from purpose_counts)) from totals;
$$;
revoke all on function private.feedback_summary(uuid) from public,anon,authenticated;
grant execute on function private.feedback_summary(uuid) to service_role;

alter function public.directory_api(text,jsonb,uuid,uuid,text) rename to directory_workflows;
alter function public.directory_workflows(text,jsonb,uuid,uuid,text) set schema private;
create function public.directory_api(p_action text,p_payload jsonb default '{}'::jsonb,p_actor uuid default null,p_session uuid default null,p_assurance text default 'aal1')
returns jsonb language plpgsql security invoker set search_path='' as $$
declare result jsonb;body jsonb;src public.sources%rowtype;old_feedback private.source_feedback%rowtype;saved private.source_feedback%rowtype;u text;c text;t text;ps text[];memo text;own jsonb;
begin
 if jsonb_typeof(p_payload) is distinct from 'object' or octet_length(p_payload::text)>16384 then raise exception 'Invalid payload' using errcode='22023';end if;
 if p_action in ('rate_source','remove_rating') then raise exception 'Star ratings are retired; use source feedback' using errcode='22023';end if;
 if p_action in ('save_feedback','remove_feedback') then
  if p_actor is null then raise exception 'Sign in required' using errcode='42501';end if;
  -- The current session workflow also serialises member writes with suspension.
  perform private.directory_workflows('session','{}',p_actor,p_session,p_assurance);
  select * into src from public.sources where slug=p_payload->>'slug' for update;
  if not found then raise exception 'Source not found' using errcode='P0002';end if;
  body:=coalesce(p_payload->'feedback','{}'::jsonb);
  if jsonb_typeof(body) is distinct from 'object' then raise exception 'Invalid feedback' using errcode='22023';end if;
  select * into old_feedback from private.source_feedback where source_id=src.id and user_id=p_actor for update;
  if p_action='remove_feedback' then
   if old_feedback.user_id is not null and old_feedback.revision::text is distinct from body->>'revision' then raise exception 'feedback_changed' using errcode='P0001';end if;
   delete from private.source_feedback where source_id=src.id and user_id=p_actor;
   return jsonb_build_object('feedback',private.feedback_summary(src.id)||jsonb_build_object('own',null),'removed',true);
  end if;
  if src.status<>'published' then raise exception 'Source not found' using errcode='P0002';end if;
  if exists(select 1 from private.source_managers where source_id=src.id and user_id=p_actor) then raise exception 'Source representatives cannot assess their own source' using errcode='42501';end if;
  if exists(select 1 from jsonb_object_keys(body) k where k not in ('usefulness','clarity','traceability','purposes','note','revision')) then raise exception 'Invalid feedback fields' using errcode='22023';end if;
  u:=body->>'usefulness';c:=body->>'clarity';t:=body->>'traceability';
  if (u is not null and u not in ('very','somewhat','limited','unable')) or (c is not null and c not in ('clear','mixed','unclear','unable')) or (t is not null and t not in ('easy','difficult','missing','na')) or (u is null and c is null and t is null) then raise exception 'Choose at least one valid response' using errcode='22023';end if;
  if jsonb_typeof(coalesce(body->'purposes','[]'::jsonb)) is distinct from 'array' or jsonb_array_length(coalesce(body->'purposes','[]'::jsonb))>5 then raise exception 'Invalid purposes' using errcode='22023';end if;
  if exists(select 1 from jsonb_array_elements(coalesce(body->'purposes','[]'::jsonb)) v where jsonb_typeof(v)<>'string' or (v#>>'{}') not in ('research','practice','teaching','policy','learning')) then raise exception 'Invalid purpose' using errcode='22023';end if;
  ps:=array(select distinct jsonb_array_elements_text(coalesce(body->'purposes','[]'::jsonb)) order by 1);
  if body ? 'note' and jsonb_typeof(body->'note') is distinct from 'string' then raise exception 'Invalid note' using errcode='22023';end if;
  memo:=trim(coalesce(body->>'note',''));if char_length(memo)>1000 then raise exception 'Note too long' using errcode='22023';end if;
  if old_feedback.user_id is not null and old_feedback.usefulness is not distinct from u and old_feedback.clarity is not distinct from c and old_feedback.traceability is not distinct from t and old_feedback.purposes=ps and old_feedback.note=memo then saved:=old_feedback;
  else
   if old_feedback.revision::text is distinct from body->>'revision' then raise exception 'feedback_changed' using errcode='P0001';end if;
   insert into private.source_feedback as f(user_id,source_id,usefulness,clarity,traceability,purposes,note) values(p_actor,src.id,u,c,t,ps,memo)
    on conflict(user_id,source_id) do update set usefulness=excluded.usefulness,clarity=excluded.clarity,traceability=excluded.traceability,purposes=excluded.purposes,note=excluded.note,revision=gen_random_uuid(),updated_at=now() returning * into saved;
  end if;
  own:=jsonb_build_object('usefulness',saved.usefulness,'clarity',saved.clarity,'traceability',saved.traceability,'purposes',saved.purposes,'note',saved.note,'revision',saved.revision,'updatedAt',saved.updated_at);
  return jsonb_build_object('feedback',private.feedback_summary(src.id)||jsonb_build_object('own',own),'saved',true);
 end if;
 result:=private.directory_workflows(p_action,p_payload,p_actor,p_session,p_assurance);
 if p_action='community' then
  select coalesce(jsonb_object_agg(s.slug,(result->'sources'->s.slug)-'ratingAverage'-'ratingCount'||jsonb_build_object('feedback',private.feedback_summary(s.id))),'{}') into own from public.sources s where s.status='published';
  result:=result||jsonb_build_object('sources',own);
 elsif p_action='source_community' then
  select * into src from public.sources where slug=p_payload->>'slug';
  select jsonb_build_object('usefulness',f.usefulness,'clarity',f.clarity,'traceability',f.traceability,'purposes',f.purposes,'note',f.note,'revision',f.revision,'updatedAt',f.updated_at) into own from private.source_feedback f where f.source_id=src.id and f.user_id=p_actor;
  result:=result-'rating'||jsonb_build_object('viewerId',p_actor,'feedback',private.feedback_summary(src.id)||jsonb_build_object('own',own));
 elsif p_action='account_export' then
  result:=result-'ratings'||jsonb_build_object('sourceFeedback',coalesce((select jsonb_agg(jsonb_build_object('source',s.slug,'usefulness',f.usefulness,'clarity',f.clarity,'traceability',f.traceability,'purposes',f.purposes,'note',f.note,'updatedAt',f.updated_at)) from private.source_feedback f join public.sources s on s.id=f.source_id where f.user_id=p_actor),'[]'),'historicalStarRatings',coalesce((select jsonb_agg(jsonb_build_object('source',s.slug,'stars',r.stars,'updatedAt',r.updated_at,'archivedAt',r.archived_at)) from private.legacy_source_ratings r join public.sources s on s.id=r.source_id where r.user_id=p_actor),'[]'));
 elsif p_action='session' then
  result:=result||jsonb_build_object('feedbackContributions',coalesce((select jsonb_agg(jsonb_build_object('slug',s.slug,'name',s.name,'published',s.status='published','revision',f.revision,'updatedAt',f.updated_at) order by f.updated_at desc) from private.source_feedback f join public.sources s on s.id=f.source_id where f.user_id=p_actor),'[]'));
 elsif p_action='admin_sources' then
  select coalesce(jsonb_agg((r-'ratingCount'-'ratingAverage')||jsonb_build_object('feedback',private.feedback_summary((r->>'id')::uuid),'feedbackNotes',coalesce((select jsonb_agg(jsonb_build_object('note',f.note,'updatedAt',f.updated_at)) from private.source_feedback f where f.source_id=(r->>'id')::uuid and f.note<>''),'[]'),'legacyRating',jsonb_build_object('count',(select count(*) from private.legacy_source_ratings where source_id=(r->>'id')::uuid)))),'[]') into own from jsonb_array_elements(result->'sources') r;
  result:=result||jsonb_build_object('sources',own);
 elsif p_action='admin_people' then
  select coalesce(jsonb_agg((r-'ratingCount')||jsonb_build_object('feedbackCount',(select count(*) from private.source_feedback where user_id=(r->>'id')::uuid),'legacyRatingCount',(select count(*) from private.legacy_source_ratings where user_id=(r->>'id')::uuid))),'[]') into own from jsonb_array_elements(result->'members') r;
  result:=result||jsonb_build_object('members',own);
 end if;
 return result;
end;$$;
revoke all on function private.directory_workflows(text,jsonb,uuid,uuid,text) from public,anon,authenticated;
grant execute on function private.directory_workflows(text,jsonb,uuid,uuid,text) to service_role;
revoke all on function public.directory_api(text,jsonb,uuid,uuid,text) from public,anon,authenticated;
grant execute on function public.directory_api(text,jsonb,uuid,uuid,text) to service_role;
