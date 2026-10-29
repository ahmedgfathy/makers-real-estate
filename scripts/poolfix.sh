set -uo pipefail
cd /home/xinreal/makers
ffmpeg -y -loglevel error -ss 4.0 -i "data/WhatsApp Video 2026-10-26 at 7.24.12 PM.mp4" -frames:v 1 \
  -vf "scale=1280:-2,eq=contrast=1.08:saturation=1.14" -q:v 3 public/img/lakes-pool.jpg
echo pool-ok