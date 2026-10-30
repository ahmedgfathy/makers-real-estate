set -uo pipefail
cd /home/xinreal/makers
echo "=== db:setup ==="
npm run db:setup 2>&1 | tail -25