set -uo pipefail
cd /home/xinreal/makers
mkdir -p _src/frames
echo "== videos =="
for f in data/*.mp4; do
  dur=$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$f")
  res=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0:s=x "$f")
  echo "FILE: $f | dur=${dur}s | res=$res"
done
i=0
for f in data/*.mp4; do
  ffmpeg -y -loglevel error -i "$f" -vf "fps=1/2,scale=380:-2,tile=5x2" -frames:v 1 "_src/frames/v${i}_sheet.jpg"
  i=$((i+1))
done
ffmpeg -y -loglevel error -pattern_type glob -i '_src/z1/*.jpeg' -vf "scale=300:200:force_original_aspect_ratio=decrease,pad=300:200:(ow-iw)/2:(oh-ih)/2:color=#111111,tile=5x3" -frames:v 1 _src/frames/z1_sheet.jpg
ffmpeg -y -loglevel error -pattern_type glob -i '_src/z2/*.jpeg' -vf "scale=300:200:force_original_aspect_ratio=decrease,pad=300:200:(ow-iw)/2:(oh-ih)/2:color=#111111,tile=5x3" -frames:v 1 _src/frames/z2_sheet.jpg
ffmpeg -y -loglevel error -i "data/WhatsApp Image 2026-10-26 at 5.53.19 PM.jpeg" -vf "scale=760:-2" _src/frames/wa_image.jpg
ls -la _src/frames