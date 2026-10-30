set -uo pipefail
cd /home/xinreal/makers
git config --list --show-origin 2>/dev/null | grep -i credential | head -5 || echo "no credential config"

BR=$(curl -s -m 20 https://api.github.com/repos/ahmedgfathy/makers-real-estate | python3 -c "import sys,json;d=json.load(sys.stdin);print(d.get('default_branch','main'), d.get('pushed_at'), d.get('size'))")
echo "default_branch/pushed_at/size: $BR"
BRANCH=$(echo "$BR" | cut -d' ' -f1)

rm -rf _repo /tmp/repo.tar.gz
curl -sL -m 180 -o /tmp/repo.tar.gz "https://codeload.github.com/ahmedgfathy/makers-real-estate/tar.gz/refs/heads/$BRANCH"
echo "tarball bytes: $(stat -c%s /tmp/repo.tar.gz 2>/dev/null)"
mkdir -p _repo
tar -xzf /tmp/repo.tar.gz -C _repo --strip-components=1 2>&1 | head -3
echo "=== repo files ==="
find _repo -type f | head -50
echo "=== count ==="
find _repo -type f | wc -l