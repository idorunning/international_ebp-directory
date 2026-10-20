-- Service-only feedback writes. Session checks and the established member lock
-- are applied before source locks or changes; browser roles cannot call this.
create function private.feedback_mutation(p_action text,p_payload jsonb,p_actor uuid,p_session uuid,p_assurance text) returns jsonb language plpgsql security invoker set search_path='' as $$
declare result jsonb;body jsonb;src public.sources%rowtype;old_feedback private.source_feedback%rowtype;saved private.source_feedback%rowtype;u text;c text;t text;ps text[];memo text;own jsonb;
begin
 if jsonb_typeof(p_payload) is distinct from 'object' or octet_length(p_payload::text)>16384 then raise exception 'Invalid payload' using errcode='22023';end if;
 if p_action in ('save_feedback','remove_feedback') then
  if p_actor is null then raise exception 'Sign in required' using errcode='42501';end if;
  -- The current session workflow also serialises member writes with suspension.
  perform pg_advisory_xact_lock(652827,hashtext(p_actor::text));
  perform private.directory_saved('session','{}',p_actor,p_session,p_assurance);
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
 raise exception 'Invalid feedback action' using errcode='22023';
end;$$;
revoke all on function private.feedback_mutation(text,jsonb,uuid,uuid,text) from public,anon,authenticated;
grant execute on function private.feedback_mutation(text,jsonb,uuid,uuid,text) to service_role;
