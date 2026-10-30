set -uo pipefail
cd /home/xinreal/makers/data
cat _p1.txt _p2.txt _p3.txt _p4.txt > content.ts
rm -f _p1.txt _p2.txt _p3.txt _p4.txt
wc -c content.ts
head -3 content.ts
tail -3 content.ts