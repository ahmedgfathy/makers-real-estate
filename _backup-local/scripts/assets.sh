set -uo pipefail
cd /home/xinreal/makers
mkdir -p public/video public/img

V="data/WhatsApp Video 2026-10-26 at 7.24.12 PM.mp4"

# seamless boomerang loop: 6.6s -> end, forward + reversed
ffmpeg -y -loglevel error -i "$V" -filter_complex "\
[0:v]trim=start=6.6,setpts=PTS-STARTPTS,scale=1280:720:flags=lanczos[a];\
[a]split[a1][a2];[a2]reverse[r];[a1][r]concat=n=2:v=1[v]" \
-map "[v]" -an -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 28 -preset slow -movflags +faststart public/video/hero.mp4

ffmpeg -y -loglevel error -i "$V" -ss 7 -frames:v 1 -vf "scale=1280:-2" -q:v 3 public/img/hero-poster.jpg

pick () { ffmpeg -y -loglevel error -ss "$1" -i "$V" -frames:v 1 -vf "scale=1280:-2" -q:v 4 "public/img/$2.jpg"; }
pick 7.0  lakes-pool
pick 10.5 lakes-sunset
pick 14.0 lakes-garden
pick 18.5 lakes-beach
pick 21.0 lakes-walk
pick 23.0 lakes-building

ls -la public/video public/img
du -sh public/video/hero.mp4