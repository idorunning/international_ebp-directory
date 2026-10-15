#!/usr/bin/env python3
"""Discover publisher branding from the source's own pages; keep a reviewable audit.

Requires Python 3, curl and Pillow. No browser hotlinks or third-party logo service.
Run --missing for new sources, --all for a fresh audit, or --ids a,b for corrections.
"""
import argparse, concurrent.futures, datetime, hashlib, html, io, ipaddress, json, re
import subprocess, sys, threading, urllib.parse, xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
CATALOGUE = ROOT / 'research/catalogue.json'
AUDIT = ROOT / 'research/source-logo-audit.json'
CACHE = ROOT / '.cache/source-logos'
TODAY = datetime.date.today().isoformat()
Image.MAX_IMAGE_PIXELS = 20_000_000

def public_url(value):
    u = urllib.parse.urlsplit(value)
    if u.scheme not in ('https', 'http') or not u.hostname or u.username or u.password:
        raise ValueError('Not a public web URL')
    h = u.hostname.lower()
    if '.' not in h or h.endswith(('.local', '.internal', '.localhost')):
        raise ValueError('Local hostname is not allowed')
    try:
        if not ipaddress.ip_address(h).is_global: raise ValueError('Non-public IP')
    except ValueError as e:
        if str(e) == 'Non-public IP': raise
    return value

def fetch(url):
    public_url(url)
    key = hashlib.sha256(url.encode()).hexdigest()
    cached = CACHE / key
    if cached.exists(): return cached.read_bytes(), url
    # URLs come only from the editorial catalogue or its publisher's public HTML.
    p = subprocess.run(['curl','-sSL','--proto','=http,https','--proto-redir','=http,https',
        '--max-redirs','4','--connect-timeout','15','--max-time','40','--max-filesize','3000000',
        '-A','Mozilla/5.0',
        '-w','\n%{http_code}\n%{url_effective}',url],capture_output=True,timeout=45)
    data, code, final = p.stdout.rsplit(b'\n',2)
    if p.returncode or code != b'200': raise ValueError('HTTP '+code.decode(errors='replace')+' '+p.stderr.decode(errors='replace')[:220])
    final = final.decode(); public_url(final)
    CACHE.mkdir(parents=True,exist_ok=True); cached.write_bytes(data)
    return data, final

class Branding(HTMLParser):
    def __init__(self, base):
        super().__init__(convert_charrefs=True); self.base=base; self.candidates=[]; self.order=0
    def handle_starttag(self, name, attrs):
        d=dict(attrs); self.order+=1
        if name=='img':
            raw=d.get('data-src') or d.get('src') or ''
            hint=' '.join(str(d.get(k,'')) for k in ('alt','class','id')).lower()
            if 'logo' not in hint and 'brand' not in hint and not re.search(r'(?:^|[/_-])logo[_.-]',d.get('src',''),re.I): return
            if any(x in hint for x in ('partner','sponsor','facebook','twitter','instagram','linkedin','youtube','payment','cookie','regulator','accreditation','fundraising')): return
            score=100+(25 if 'logo' in d.get('alt','').lower() else 0)-min(35,self.order/30)
            if any(x in hint for x in ('white','inverse','footer','negative')): score-=25
            self.add(raw,score,'publisher-logo',d.get('alt',''))
        elif name=='link' and 'icon' in d.get('rel','').lower():
            score=40 if 'apple-touch-icon' in d.get('rel','') else 25
            self.add(d.get('href',''),score,'publisher-icon','')
    def add(self,url,score,kind,alt):
        if not url or url.startswith(('data:','javascript:')): return
        self.candidates.append({'url':urllib.parse.urljoin(self.base,html.unescape(url)),
            'score':score,'kind':kind,'alt':alt,'page':self.base})

def save_asset(data, slug):
    destination=ROOT/'public/assets/sources'
    if b'<svg' in data[:1000]:
        if b'<!ENTITY' in data.upper() or b'<!DOCTYPE' in data.upper(): raise ValueError('SVG entities not accepted')
        root=ET.fromstring(data)
        allowed={'svg','g','path','rect','circle','ellipse','line','polyline','polygon','title','desc','defs','linearGradient','radialGradient','stop','clipPath','mask','use','symbol','style','text','tspan'}
        for element in root.iter():
            if element.tag.split('}')[-1] not in allowed: raise ValueError('Unsafe SVG element')
            for key,value in element.attrib.items():
                if key.lower().startswith('on') or ('href' in key and not value.startswith('#')):
                    raise ValueError('External or active SVG content')
            markup=ET.tostring(element,encoding='unicode')
            if re.search(r'url\(\s*["\']?(?!#)|@import|javascript:',markup,re.I):
                raise ValueError('External SVG resource')
        extension='svg'; output=data
    else:
        im=Image.open(io.BytesIO(data)); im.load()
        if im.width<24 or im.height<16 or im.width/im.height>14: raise ValueError('Image too small or implausible')
        im=im.convert('RGBA'); im.thumbnail((480,180))
        out=io.BytesIO(); im.save(out,format='WEBP',quality=92,method=6); output=out.getvalue(); extension='webp'
    path=destination/f'{slug}-identity.{extension}'; path.write_bytes(output)
    return '/'+str(path.relative_to(ROOT/'public'))

def process(source, prior, overrides, force=False):
    slug=source['id']; previous=prior.get(slug,{})
    record={'sourceUrl':source['url'],'checked':TODAY,'status':'unavailable','attempts':[]}
    if source.get('logo') and not force:
        if previous: return slug, previous, source['logo']
        return slug,{**record,'status':'existing','asset':source['logo'],'page':source['url'],
            'note':'Existing editorial asset retained and visually reviewed.'},source['logo']
    candidates=[]
    override=overrides.get(slug,{})
    if override.get('assetUrl'):
        candidates.append({'url':override['assetUrl'],'score':200,'kind':override.get('kind','publisher-logo'),'page':override['page'],'alt':override.get('note','')})
    pages=override.get('pages') or [source['url'],urllib.parse.urljoin(source['url'],'/')]
    for page in dict.fromkeys(pages):
        try:
            data, final=fetch(page); parser=Branding(final); parser.feed(data.decode('utf8','replace')); candidates+=parser.candidates
            record['attempts'].append({'page':page,'result':f'{len(parser.candidates)} branding candidates'})
            if any(c['score']>=100 for c in candidates): break
        except Exception as e: record['attempts'].append({'page':page,'result':str(e)[:180]})
    tried=set()
    for c in sorted(candidates,key=lambda c:-c['score']):
        if c['url'] in tried: continue
        tried.add(c['url'])
        try:
            data, final=fetch(c['url']); asset=save_asset(data,slug)
            record.update(status='needs-review',kind=c['kind'],asset=asset,assetUrl=final,page=c['page'],alt=c['alt'],sha256=hashlib.sha256((ROOT/'public'/asset.lstrip('/')).read_bytes()).hexdigest())
            return slug,record,asset
        except Exception as e: record['attempts'].append({'assetUrl':c['url'],'result':str(e)[:180]})
        if len(tried)>=6: break
    if source.get('logo'):
        record.update(status='existing',asset=source['logo'],note='Refresh failed; retained existing branding.')
    return slug,record,source.get('logo')

def main():
    parser=argparse.ArgumentParser(); parser.add_argument('--all',action='store_true'); parser.add_argument('--missing',action='store_true'); parser.add_argument('--ids'); parser.add_argument('--retry-unavailable',action='store_true'); args=parser.parse_args()
    records=json.loads(CATALOGUE.read_text()); audit=json.loads(AUDIT.read_text()) if AUDIT.exists() else {}
    overrides_path=ROOT/'research/source-logo-overrides.json'; overrides=json.loads(overrides_path.read_text()) if overrides_path.exists() else {}
    ids=set(args.ids.split(',')) if args.ids else None
    selected=[s for s in records if (not ids or s['id'] in ids) and (not args.retry_unavailable or audit.get(s['id'],{}).get('status')=='unavailable') and (not args.missing or s['id'] not in audit or audit[s['id']].get('sourceUrl')!=s['url'])]
    by_id={s['id']:s for s in records}
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        futures=[pool.submit(process,s,audit,overrides,args.all or bool(ids) or audit.get(s['id'],{}).get('sourceUrl')!=s['url']) for s in selected]
        for future in concurrent.futures.as_completed(futures):
            slug,result,asset=future.result(); audit[slug]=result
            if asset and result['status'] in ('existing','reviewed'): by_id[slug]['logo']=asset
            # Checkpoint each completed source so an interrupted audit is resumable.
            AUDIT.write_text(json.dumps(audit,ensure_ascii=False,indent=2)+'\n')
            CATALOGUE.write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n')
            print(slug,result['status'],asset or 'text identity retained',flush=True)
    print(f"Audited {len(selected)} sources; {sum(bool(s.get('logo')) for s in records)}/{len(records)} have local branding.")

if __name__=='__main__': main()
