set -uo pipefail
cd /home/xinreal/makers
rm -rf _repo
timeout 120 git clone --depth 30 https://github.com/ahmedgfathy/makers-real-estate _repo 2>&1 | tail -6
echo "=== exit: $? ==="
if [ -d _repo ]; then
  cd _repo
  echo "=== branches ==="; git branch -a
  echo "=== log ==="; git log --oneline -15
  echo "=== files ==="; find . -path ./.git -prune -o -type f -print | head -60
fi