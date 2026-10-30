set -uo pipefail
cd /home/xinreal/makers
V="data/WhatsApp Video 2026-10-26 at 7.24.12 PM.mp4"
rm -f public/img/_plan_candidate.jpg public/img/_plan_small.jpg

pick () {
  ffmpeg -y -loglevel error -ss "$1" -i "$V" -frames:v 1 \
    -vf "scale=1280:-2,eq=$3" -q:v 3 "public/img/$2.jpg"
}

pick 5.0  lakes-pool    "contrast=1.08:saturation=1.14"
pick 24.0 lakes-building "contrast=1.10:saturation=1.12"
pick 22.0 lakes-beach   "contrast=1.10:saturation=1.16"
pick 18.5 lakes-garden  "contrast=1.10:saturation=1.14"
pick 16.5 lakes-walk    "contrast=1.08:saturation=1.10"
pick 11.0 lakes-sunset  "contrast=1.16:saturation=1.02:brightness=-0.06"

ffmpeg -y -loglevel error -ss 7.0 -i "$V" -frames:v 1 -vf "scale=1280:-2,eq=contrast=1.04:saturation=1.06" -q:v 3 public/img/hero-poster.jpg
echo done