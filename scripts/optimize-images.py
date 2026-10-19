"""Deterministic format/size derivatives of preserved, unmodified source art."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import hashlib,json
root=Path(__file__).resolve().parents[1];assets=root/'src/assets'
im=Image.open(assets/'brand/approved-master.png')
assert hashlib.sha256((assets/'brand/approved-master.png').read_bytes()).hexdigest()=='f05fcdf4602d9c63add7799469c64060a8f13e5efa66ad6c7b762fb8273ec89f'
for size in [32,64,128,192,512]: im.resize((size,size),Image.Resampling.LANCZOS).save(assets/f'brand/mark-{size}.png',optimize=True)
for name in ['hero','vibe','moment','cast']:
 im=Image.open(assets/f'artwork/{name}-original.png').convert('RGB')
 for w in [480,800,1280]:im.resize((w,round(im.height*w/im.width)),Image.Resampling.LANCZOS).save(assets/f'artwork/{name}-{w}.webp',quality=85,method=6)
fontpath='/System/Library/Fonts/Supplemental/Arial.ttf'
for locale,title in {'nl':'Jouw muziek.\nJouw DJ.','en':'Your music.\nYour DJ.','de':'Deine Musik.\nDein DJ.','fr':'Ta musique.\nTon DJ.','es':'Tu música.\nTu DJ.'}.items():
 canvas=Image.new('RGB',(1200,630),'#070a18')
 hero=Image.open(assets/'artwork/hero-original.png').resize((945,630),Image.Resampling.LANCZOS)
 canvas.paste(hero,(390,0));draw=ImageDraw.Draw(canvas)
 mark=Image.open(assets/'brand/approved-master.png').resize((72,72),Image.Resampling.LANCZOS);canvas.paste(mark,(60,65))
 draw.text((150,88),'DJCONNECT',font=ImageFont.truetype(fontpath,24),fill='#f4f5ff')
 draw.multiline_text((60,245),title,font=ImageFont.truetype(fontpath,64),fill='#f4f5ff',spacing=10)
 canvas.save(assets/f'social-{locale}.png',optimize=True)
