set -uo pipefail
cd /home/xinreal/makers
mkdir -p /home/xinreal/makers-backup
rm -rf /home/xinreal/makers-backup/pre-github-sync
mv _backup-local /home/xinreal/makers-backup/pre-github-sync
rm -rf _repo
echo "backup at: /home/xinreal/makers-backup/pre-github-sync ($(find /home/xinreal/makers-backup/pre-github-sync -type f | wc -l) files)"
ls