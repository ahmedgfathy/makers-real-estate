set -uo pipefail
cd /home/xinreal/makers
rm -rf .next
npm run build 2>&1 | tail -60