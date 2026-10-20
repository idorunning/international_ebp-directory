-- Called only after the established workflow authorises the requested view.
create function private.feedback_view(p_action text,p_payload jsonb,p_actor uuid,result jsonb) returns jsonb language plpgsql security invoker set search_path='' as $$
declare src public.sources%rowtype;own jsonb;
begin
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
revoke all on function private.feedback_view(text,jsonb,uuid,jsonb) from public,anon,authenticated;
grant execute on function private.feedback_view(text,jsonb,uuid,jsonb) to service_role;
