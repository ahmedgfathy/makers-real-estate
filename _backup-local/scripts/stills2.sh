set -uo pipefail
cd /home/xinreal/makers
V="data/WhatsApp Video 2026-10-26 at 7.24.12 PM.mp4"
pick () { ffmpeg -y -loglevel error -ss "$1" -i "$V" -frames:v 1 -vf "scale=1280:-2,eq=contrast=1.1:saturation=1.14" -q:v 3 "public/img/$2.jpg"; }
pick 4.0  lakes-pool
pick 23.5 lakes-building
pick 22.0 lakes-beach
pick 18.0 lakes-garden
pick 21.0 lakes-walk
pick 16.0 lakes-sunset
ffmpeg -y -loglevel error -ss 7.0 -i "$V" -frames:v 1 -vf "scale=1280:-2,eq=contrast=1.04:saturation=1.06" -q:v 3 public/img/hero-poster.jpg
echo stills-updated