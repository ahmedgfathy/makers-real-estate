set -uo pipefail
cd /home/xinreal/makers
npm run build 2>&1 | tail -14
pkill -f "next start" 2>/dev/null || true
pkill -f "next-server" 2>/dev/null || true
sleep 1
echo rebuilt