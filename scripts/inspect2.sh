set -uo pipefail
cd /home/xinreal/makers
echo "=== THEIR hero.mp4 ==="
ffprobe -v error -show_entries format=duration,size,bit_rate -show_entries stream=codec_name,width,height,r_frame_rate -of default=nw=1 "_repo/public/video/hero.mp4"
echo
echo "=== MINE hero.mp4 ==="
ffprobe -v error -show_entries format=duration,size,bit_rate -show_entries stream=codec_name,width,height,r_frame_rate -of default=nw=1 public/video/hero.mp4
echo
echo "=== first frames of theirs (title card?) ==="
ffmpeg -y -loglevel error -i "_repo/public/video/hero.mp4" -vf "fps=1/2,scale=300:-2,tile=5x2" -frames:v 1 _src/frames/theirs_hero.jpg
ls -la _src/frames/theirs_hero.jpg
echo
echo "=== postgres ==="
psql -lqt 2>&1 | cut -d'|' -f1 | sed 's/ //g' | grep -v '^$' | head -10
echo
echo "=== git credentials present? ==="
ls -la /home/xinreal/.git-credentials 2>/dev/null && echo "(exists)" || echo "(none)"