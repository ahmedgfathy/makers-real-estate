set -uo pipefail
cd /home/xinreal/makers
ffmpeg -y -loglevel error -i "data/WhatsApp Video 2026-10-26 at 7.24.12 PM.mp4" -vf "fps=2/3,scale=340:-2,tile=6x3" -frames:v 1 _src/frames/lakes_timeline.jpg
echo ok