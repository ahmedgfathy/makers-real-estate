set -uo pipefail
cd /home/xinreal/makers
V="data/WhatsApp Video 2026-10-26 at 7.24.12 PM.mp4"

pick () {
  ffmpeg -y -loglevel error -ss "$1" -i "$V" -frames:v 1 \
    -vf "scale=1280:-2,eq=$3" -q:v 3 "public/img/$2.jpg"
}

pick 4.5  lakes-pool     "contrast=1.08:saturation=1.14"
pick 25.0 lakes-building "contrast=1.10:saturation=1.12"
pick 7.0  lakes-beach    "contrast=1.08:saturation=1.12"
pick 19.0 lakes-garden   "contrast=1.10:saturation=1.14"
pick 11.0 lakes-sunset   "contrast=1.16:saturation=1.02:brightness=-0.06"

# tile 05: tight architectural crop so it reads as a detail, not another building shot
ffmpeg -y -loglevel error -ss 23.5 -i "$V" -frames:v 1 \
  -vf "crop=576:576:224:0,scale=900:900,eq=contrast=1.12:saturation=1.1" -q:v 3 public/img/lakes-walk.jpg

ffmpeg -y -loglevel error -ss 7.0 -i "$V" -frames:v 1 -vf "scale=1280:-2,eq=contrast=1.04:saturation=1.06" -q:v 3 public/img/hero-poster.jpg
echo done