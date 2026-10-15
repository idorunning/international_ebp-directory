import {ASSETS} from './assets.generated.mjs';
import {handleApi} from '../backend/api.mjs';

export default {
  async fetch(request,env={}) {
    const url=new URL(request.url);
    const security={
      'X-Content-Type-Options':'nosniff',
      'Referrer-Policy':'strict-origin-when-cross-origin',
      'X-Frame-Options':'DENY',
      'Permissions-Policy':'camera=(), microphone=(), geolocation=()',
      'Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' blob: data:; connect-src 'self'; font-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'none'",
      'X-Robots-Tag':'noindex, nofollow',
    };
    // Keep the purchased domain canonical; leave the workers.dev preview usable.
    if(url.hostname==='www.id-ebp.org'||(url.hostname==='id-ebp.org'&&url.protocol!=='https:')){
      url.hostname='id-ebp.org';
      url.protocol='https:';
      url.port='';
      return new Response(null,{status:308,headers:{...security,Location:url.href,'Cache-Control':'public, max-age=3600'}});
    }
    if(url.pathname.startsWith('/api/')){
      let response;
      if(env.DIRECTORY_API_URL){
        try{
          const endpoint=new URL(env.DIRECTORY_API_URL);
          if(endpoint.protocol!=='https:'||!endpoint.hostname.endsWith('.supabase.co')||endpoint.pathname!=='/functions/v1/directory-api')throw Error('Invalid account service configuration');
          const headers=new Headers(request.headers);headers.delete('Host');headers.delete('Authorization');
          if(!env.DIRECTORY_PROXY_SECRET)throw Error('Account service proxy is not configured');
          headers.set('X-IDEBP-Mail-Ready',env.AUTH_EMAIL_ENABLED==='true'&&env.EMAIL?'true':'false');
          headers.set('X-IDEBP-Proxy-Key',env.DIRECTORY_PROXY_SECRET);
          headers.set('X-IDEBP-Client-IP',request.headers.get('CF-Connecting-IP')||'unknown');
          response=await fetch(new Request(endpoint.href+url.pathname+url.search,{method:request.method,headers,body:['GET','HEAD'].includes(request.method)?undefined:request.body,redirect:'manual',duplex:'half'}));
          if(url.pathname==='/api/auth/request'&&response.ok){
            const data=await response.json();
            if(data.internalDelivery){
              const {email,code,purpose}=data.internalDelivery;
              const reset=purpose==='reset',label=reset?'password-reset':'verification';
              if(!env.EMAIL||!/^\d{6,10}$/.test(code))throw Error('Mail unavailable');
              await env.EMAIL.send({to:email,from:{email:'sign-in@auth.id-ebp.org',name:'ID-EBP'},subject:`Your ID-EBP ${label} code`,text:`Your ID-EBP ${label} code is ${code}. ${reset?'Return to the password-reset screen to choose a new password.':'Enter it on id-ebp.org to sign in.'} This code expires in 10 minutes. Do not share it. If you did not request it, ignore this email.`,html:`<p>Your ID-EBP ${label} code is:</p><h2>${code}</h2><p>${reset?'Return to the password-reset screen on id-ebp.org to choose a new password.':'Enter it on id-ebp.org to sign in.'} This code expires in 10 minutes. Do not share it. If you did not request it, ignore this email.</p>`});
              delete data.internalDelivery;
            }
            response=Response.json(data,{status:response.status,headers:response.headers});
          }
        }catch{return Response.json({error:{code:'service_unavailable',message:'The account service is temporarily unavailable. You can still browse the directory.'}},{status:503,headers:{...security,'Cache-Control':'no-store'}});}
      }else response=await handleApi(request,env);
      const headers=new Headers(response.headers);for(const [name,value] of Object.entries(security))headers.set(name,value);
      return new Response(response.body,{status:response.status,headers});
    }
    if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405,headers:{...security,Allow:'GET, HEAD'}});
    let path=url.pathname;
    if(path==='/')path='/index.html';
    const asset=ASSETS[path];
    if(!asset)return new Response('Not found',{status:404,headers:security});
    const body=asset.base64?Uint8Array.from(atob(asset.body),c=>c.charCodeAt(0)):asset.body;
    return new Response(request.method==='HEAD'?null:body,{headers:{...security,'Content-Type':asset.type,'Cache-Control':'public, max-age=60'}});
  }
};

