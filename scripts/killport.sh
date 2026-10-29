set -uo pipefail
echo "=== processes on 3001 ==="
ss -ltnp 2>/dev/null | grep ':3001' || echo none
pkill -f "next start" 2>/dev/null || true
pkill -f "next-server" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true
sleep 2
echo "=== after kill ==="
ss -ltnp 2>/dev/null | grep ':3001' || echo "port free"