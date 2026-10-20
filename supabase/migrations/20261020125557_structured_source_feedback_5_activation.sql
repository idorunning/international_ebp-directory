insert into private.legacy_source_ratings(user_id,source_id,stars,updated_at) select user_id,source_id,stars,updated_at from private.source_ratings;
revoke insert,update on private.source_ratings from service_role;
create function private.retire_star_signal() returns trigger language plpgsql security invoker set search_path='' as $$
begin new.rating_average:=null;new.rating_count:=0;return new;end;$$;
revoke all on function private.retire_star_signal() from public,anon,authenticated,service_role;
create trigger retire_star_signal before insert or update of rating_average,rating_count on public.source_signals for each row execute function private.retire_star_signal();
update public.source_signals set rating_average=null,rating_count=0 where rating_average is not null or rating_count<>0;
alter function public.directory_api(text,jsonb,uuid,uuid,text) rename to directory_workflows;
alter function public.directory_workflows(text,jsonb,uuid,uuid,text) set schema private;
create function public.directory_api(p_action text,p_payload jsonb default '{}'::jsonb,p_actor uuid default null,p_session uuid default null,p_assurance text default 'aal1') returns jsonb language plpgsql security invoker set search_path='' as $$
declare result jsonb;
begin
 if jsonb_typeof(p_payload) is distinct from 'object' or octet_length(p_payload::text)>16384 then raise exception 'Invalid payload' using errcode='22023';end if;
 if p_action in ('rate_source','remove_rating') then raise exception 'Star ratings are retired; use source feedback' using errcode='22023';end if;
 if p_action in ('save_feedback','remove_feedback') then return private.feedback_mutation(p_action,p_payload,p_actor,p_session,p_assurance);end if;
 result:=private.directory_workflows(p_action,p_payload,p_actor,p_session,p_assurance);
 return private.feedback_view(p_action,p_payload,p_actor,result);
end;$$;
revoke all on function private.directory_workflows(text,jsonb,uuid,uuid,text) from public,anon,authenticated;
grant execute on function private.directory_workflows(text,jsonb,uuid,uuid,text) to service_role;
revoke all on function public.directory_api(text,jsonb,uuid,uuid,text) from public,anon,authenticated;
grant execute on function public.directory_api(text,jsonb,uuid,uuid,text) to service_role;
