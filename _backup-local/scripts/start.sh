set -uo pipefail
cd /home/xinreal/makers
mkdir -p _src/shots
pkill -f "next dev" 2>/dev/null || true
sleep 1
nohup npm run dev -- --port 3000 > /tmp/dev.log 2>&1 &
for i in $(seq 1 60); do
  if curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000 | grep -q 200; then echo "server ready"; break; fi
  sleep 1
done
tail -6 /tmp/dev.log