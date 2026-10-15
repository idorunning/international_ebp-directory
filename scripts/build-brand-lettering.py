"""Build the approved D3a lock-up as portable vector outlines."""
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.transformPen import TransformPen
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
f=instantiateVariableFont(TTFont(root/'public/assets/fonts/public-sans-latin.woff2'), {'wght':400})
gs=f.getGlyphSet(); cmap=f.getBestCmap()
def outlines(text,size,baseline,tracking=0):
    scale=size/f['head'].unitsPerEm; p=SVGPathPen(gs); b=BoundsPen(gs); x=0
    for ch in text:
        g=gs[cmap[ord(ch)]]; transform=(scale,0,0,-scale,x,baseline)
        g.draw(TransformPen(p,transform));g.draw(TransformPen(b,transform));x+=g.width*scale+tracking
    return {'path':p.getCommands(),'bounds':b.bounds}
result={text:outlines(text,92,77,-2) for text in ['ID','EBP']}
a=result['ID']['bounds'];z=result['EBP']['bounds'];gap=9;radius=32
width=a[2]-a[0]+2*gap+2*radius+z[2]-z[0];left=(375-width)/2
result['layout']={'idX':left-a[0],'ebpX':left+a[2]-a[0]+2*gap+2*radius-z[0],'cx':left+a[2]-a[0]+gap+radius,'cy':(a[1]+a[3])/2,'radius':radius,'gap':gap,'left':left,'right':left+width}
result['subtitle']=[]
for text,baseline in [('International Directory of',105),('Evidence-Based Policing',130)]:
    line=outlines(text,22,baseline,-.15);b=line['bounds'];line['x']=187.5-(b[0]+b[2])/2;result['subtitle'].append(line)
(root/'public/brand-lettering.js').write_text('// Generated from licensed Public Sans at weight 400. D3a: centred ink bounds and tight optical spacing.\nexport const LETTERING = '+json.dumps(result,separators=(',',':'))+';\n')
print(result['layout'])
