set -uo pipefail
cd /home/xinreal/makers
rm -rf _src/norm && mkdir -p _src/norm
n=0
for f in _src/z1/*.jpeg _src/z2/*.jpeg; do
  n=$((n+1))
  ffmpeg -y -loglevel error -i "$f" -vf "scale=320:220:force_original_aspect_ratio=decrease,pad=320:220:(ow-iw)/2:(oh-ih)/2:color=#101010" "_src/norm/$(printf %02d $n).jpg"
done
echo "normalized: $n"
ffmpeg -y -loglevel error -i "_src/norm/%02d.jpg" -vf "tile=5x4" -frames:v 1 _src/frames/all_images.jpg
echo "== v2 sampling every 4s =="
ffmpeg -y -loglevel error -i "data/WhatsApp Video 2026-10-26 at 7.24.12 PM (2).mp4" -vf "fps=1/4,scale=260:-2,tile=7x4" -frames:v 1 _src/frames/v2_timeline.jpg
ls -la _src/frames/all_images.jpg _src/frames/v2_timeline.jpg