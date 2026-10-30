set -uo pipefail
cd /home/xinreal/makers
V="data/WhatsApp Video 2026-10-26 at 7.24.12 PM.mp4"
pick () { ffmpeg -y -loglevel error -ss "$1" -i "$V" -frames:v 1 -vf "scale=1280:-2,eq=contrast=1.14:saturation=1.16:brightness=-0.015" -q:v 3 "public/img/$2.jpg"; }
pick 7.0  lakes-pool
pick 10.5 lakes-sunset
pick 13.5 lakes-garden
pick 19.5 lakes-beach
pick 21.0 lakes-walk
pick 23.5 lakes-building
ffmpeg -y -loglevel error -ss 7.0 -i "$V" -frames:v 1 -vf "scale=1280:-2,eq=contrast=1.06:saturation=1.08" -q:v 3 public/img/hero-poster.jpg
ls -la public/img