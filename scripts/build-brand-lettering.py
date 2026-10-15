from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.transformPen import TransformPen
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
f=TTFont(root/'public/assets/fonts/public-sans-latin.woff2')
f=instantiateVariableFont(f, {'wght':850})
gs=f.getGlyphSet(); cmap=f.getBestCmap(); scale=78/f['head'].unitsPerEm
result={}
for text in ['ID','EBP']:
    p=SVGPathPen(gs); b=BoundsPen(gs); x=0
    for ch in text:
        g=gs[cmap[ord(ch)]]; transform=(scale,0,0,-scale,x,80)
        g.draw(TransformPen(p,transform));g.draw(TransformPen(b,transform))
        x+=g.width*scale-1.5
    result[text]={'path':p.getCommands(),'bounds':b.bounds}
# Centre the whole visible lock-up in a 375-unit canvas; equal visible ink gaps.
a=result['ID']['bounds']; z=result['EBP']['bounds']; gap=14; radius=25
width=(a[2]-a[0])+2*gap+2*radius+(z[2]-z[0]); left=(375-width)/2
result['layout']={'idX':left-a[0],'ebpX':left+(a[2]-a[0])+2*gap+2*radius-z[0],'cx':left+(a[2]-a[0])+gap+radius,'cy':(a[1]+a[3])/2,'gap':gap,'left':left,'right':left+width}
(root/'public/brand-lettering.js').write_text('// Generated from the licensed Public Sans font at weight 850. Ink bounds fix optical side bearings.\nexport const LETTERING = '+json.dumps(result,separators=(',',':'))+';\n')
print(result['layout'])
