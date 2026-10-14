// The build inserts an immutable asset map. No credentials or personal data belong here.
import {ASSETS} from './assets.generated.mjs';
export default {
  async fetch(request) {
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
    if(url.pathname==='/api/status')return Response.json({mode:'design-preview',authentication:false,registrations:false,email:false,publicRecommendations:false},{headers:{...security,'Cache-Control':'no-store'}});
    if(url.pathname.startsWith('/api/'))return Response.json({error:'This design preview does not accept registrations, credentials or messages.'},{status:503,headers:{...security,'Cache-Control':'no-store'}});
    if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405,headers:{...security,Allow:'GET, HEAD'}});
    let path=url.pathname;
    if(path==='/')path='/index.html';
    const asset=ASSETS[path];
    if(!asset)return new Response('Not found',{status:404,headers:security});
    const body=asset.base64?Uint8Array.from(atob(asset.body),c=>c.charCodeAt(0)):asset.body;
    return new Response(request.method==='HEAD'?null:body,{headers:{...security,'Content-Type':asset.type,'Cache-Control':'public, max-age=60'}});
  }
};
