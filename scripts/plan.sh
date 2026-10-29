set -uo pipefail
cd /home/xinreal/makers
mkdir -p public/img
cp "_src/z2/WhatsApp Image 2026-10-26 at 7.24.14 PM (1).jpeg" public/img/_plan_candidate.jpg
ffmpeg -y -loglevel error -i public/img/_plan_candidate.jpg -vf "scale=900:-2" -q:v 3 public/img/_plan_small.jpg
ls -la public/img/_plan*