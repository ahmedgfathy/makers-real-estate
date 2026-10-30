set -uo pipefail
sleep 6
echo "=== page ==="
curl -s -o /tmp/page.html -w "html:%{http_code}\n" http://127.0.0.1:3001
echo "=== health ==="
curl -s http://127.0.0.1:3001/api/health | head -c 400
echo
echo "=== video ==="
curl -s -I http://127.0.0.1:3001/video/hero.mp4 | grep -i -E "HTTP/|content-length|content-type"
echo "=== html contains ==="
grep -c "video/hero.mp4" /tmp/page.html
grep -o "<title>[^<]*</title>" /tmp/page.html
echo "=== db rows ==="
psql -d makers -tAc "select count(*) from tiles" | sed "s/^/tiles: /"
psql -d makers -tAc "select count(*) from panel_sections" | sed "s/^/sections: /"