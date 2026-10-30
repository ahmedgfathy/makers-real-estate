set -uo pipefail
cd /home/xinreal/makers
echo "=== repo public/ ==="
find _repo/public -type f -printf "%10s  %p\n" 2>/dev/null | sort -k2
echo
echo "=== local public/ ==="
find public -type f -printf "%10s  %p\n" | sort -k2
echo
echo "=== differing tracked files ==="
for f in app/layout.tsx app/page.tsx app/globals.css app/site.css components/Hero.tsx components/Header.tsx components/Landing.tsx components/Collection.tsx components/Footer.tsx components/Panel.tsx components/Sections.tsx components/Brand.tsx components/Reveal.tsx data/content.ts lib/labels.ts package.json next.config.ts README.md; do
  if [ -f "_repo/$f" ] && [ -f "$f" ]; then
    cmp -s "_repo/$f" "$f" || echo "DIFF     $f"
  else
    echo "ONE-SIDE $f"
  fi
done
echo
echo "=== repo-only files ==="
cd _repo && find . -path ./.git -prune -o -type f -print | sed 's|^\./||' | sort > /tmp/repo_files.txt
cd /home/xinreal/makers && find . -maxdepth 2 -type f -not -path "./node_modules/*" -not -path "./.next/*" -not -path "./_src/*" -not -path "./_repo/*" -print | sed 's|^\./||' | sort > /tmp/local_files.txt
comm -23 /tmp/repo_files.txt /tmp/local_files.txt | grep -v '^scripts/' | head -20