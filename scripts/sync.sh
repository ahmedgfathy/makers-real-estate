set -uo pipefail
cd /home/xinreal/makers

# 1. keep the old loop safe before anything overwrites it
cp public/video/hero.mp4 /tmp/hero-old.mp4
md5sum /tmp/hero-old.mp4

# 2. safety backup of the current working tree (no deps/build/scratch)
rm -rf _backup-local
mkdir -p _backup-local
tar -c --exclude=node_modules --exclude=.next --exclude=_src --exclude=_repo --exclude=_backup-local . | tar -x -C _backup-local 2>/dev/null
echo "backup files: $(find _backup-local -type f | wc -l)"

# 3. sync their repo over the working tree
tar -c -C _repo --exclude=.git . | tar -x -C .
echo "sync done"

# 4. restore the old hero loop (mine, not theirs)
cp /tmp/hero-old.mp4 public/video/hero.mp4
md5sum public/video/hero.mp4

# 5. one icon only
[ -f app/icon.png ] && rm -f app/icon.svg && echo "removed icon.svg (icon.png present)"

# 6. images only their content references
grep -o '/img/[a-z-]*\.jpg' data/content.ts | sort -u
echo "--- on disk ---"
ls public/img