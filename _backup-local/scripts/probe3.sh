set -uo pipefail
cd /home/xinreal/makers
echo "== image dimensions =="
python3 - <<'PY'
import struct, glob, os
def jpeg_size(p):
    with open(p,'rb') as f:
        d=f.read()
    i=2
    while i < len(d)-9:
        if d[i]!=0xFF: i+=1; continue
        m=d[i+1]
        if m in (0xC0,0xC1,0xC2,0xC3,0xC5,0xC6,0xC7,0xC9,0xCA,0xCB,0xCD,0xCE,0xCF):
            h,w=struct.unpack('>HH', d[i+5:i+9]); return w,h
        if m in (0xD8,0xD9) or 0xD0<=m<=0xD7: i+=2; continue
        ln=struct.unpack('>H', d[i+2:i+4])[0]; i+=2+ln
    return None
for p in sorted(glob.glob('_src/z1/*.jpeg'))+sorted(glob.glob('_src/z2/*.jpeg')):
    print(jpeg_size(p), os.path.basename(p))
PY
echo "== lakes film timeline (1 frame / 4s) =="
ffmpeg -y -loglevel error -i "data/WhatsApp Video 2026-10-26 at 7.24.12 PM (1).mp4" -vf "fps=1/4,scale=300:-2,tile=7x4" -frames:v 1 _src/frames/film_timeline.jpg
echo done