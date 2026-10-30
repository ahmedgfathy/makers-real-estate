set -uo pipefail
cd /home/xinreal/makers
FONT=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf
ffmpeg -y -loglevel error -ss 3 -t 24 -i "data/WhatsApp Video 2026-10-26 at 7.24.12 PM.mp4" \
 -vf "fps=1,crop=576:576:224:0,scale=280:280,drawtext=fontfile=$FONT:text='%{pts\:hms}':x=6:y=6:fontsize=16:fontcolor=yellow:box=1:boxcolor=black@0.65,tile=6x4" \
 -frames:v 1 _src/frames/square_grid.jpg
echo ok