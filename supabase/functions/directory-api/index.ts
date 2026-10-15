import {handleApi} from '../../../backend/api.mjs';

// Deployment supplies the normal Supabase URL/anon/service-role environment.
// The service key remains inside the Edge Function and never crosses to CF or JS.
const origins=new Set(['https://id-ebp.org','https://idebp-preview.ntracey.workers.dev']);
const proxySecret=Deno.env.get('IDEBP_PROXY_SECRET')||'__IDEBP_PROXY_SECRET_DEPLOYMENT__';
Deno.serve(async incoming=>{
  const submitted=incoming.headers.get('X-IDEBP-Proxy-Key')||'';
  if(!proxySecret||proxySecret==='__IDEBP_PROXY_SECRET_DEPLOYMENT__'||submitted.length!==proxySecret.length||submitted.length>1024)
    return Response.json({error:{code:'proxy_required',message:'Use the ID-EBP website to access this service.'}},{status:403,headers:{'Cache-Control':'no-store'}});
  let difference=0;for(let index=0;index<proxySecret.length;index++)difference|=proxySecret.charCodeAt(index)^submitted.charCodeAt(index);
  if(difference)return Response.json({error:{code:'proxy_required',message:'Use the ID-EBP website to access this service.'}},{status:403,headers:{'Cache-Control':'no-store'}});
  const incomingUrl=new URL(incoming.url);
  const suffix=incomingUrl.pathname.replace(/^(?:\/functions\/v1)?\/directory-api(?=\/|$)/,'');
  const origin=incoming.headers.get('Origin');
  if(origin&&!origins.has(origin))return Response.json({error:{code:'origin_denied',message:'Submit changes from the ID-EBP website.'}},{status:403,headers:{'Cache-Control':'no-store'}});
  const base=origin&&origins.has(origin)?origin:'https://id-ebp.org';
  const request=new Request(base+(suffix.startsWith('/api/')?suffix:'/api'+suffix)+incomingUrl.search,incoming);
  return handleApi(request,{
    SUPABASE_URL:Deno.env.get('SUPABASE_URL'),
    SUPABASE_ANON_KEY:Deno.env.get('SUPABASE_ANON_KEY'),
    SUPABASE_SERVICE_ROLE_KEY:Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
    SESSION_SECRET:Deno.env.get('SESSION_SECRET'),
    // Turn on only after configuring the {{ .Token }} email template and SMTP.
    AUTH_EMAIL_ENABLED:Deno.env.get('IDEBP_AUTH_EMAIL_ENABLED')||'false',
  },{clientIp:incoming.headers.get('X-IDEBP-Client-IP')||'unknown'});
});
