set -uo pipefail
cd /home/xinreal/makers
FONT=$(fc-list 2>/dev/null | grep -i -m1 "DejaVuSans.ttf" | cut -d: -f1)
if [ -z "${FONT:-}" ]; then FONT=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf; fi
echo "font=$FONT"
ffmpeg -y -loglevel error -ss 4 -t 24 -i "data/WhatsApp Video 2026-10-26 at 7.24.12 PM.mp4" \
 -vf "fps=1,scale=300:-2,drawtext=fontfile=$FONT:text='%{pts\:hms}':x=8:y=8:fontsize=18:fontcolor=yellow:box=1:boxcolor=black@0.6,tile=6x5" \
 -frames:v 1 _src/frames/labeled.jpg
ls -la _src/frames/labeled.jpg