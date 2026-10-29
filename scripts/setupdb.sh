set -uo pipefail
cd /home/xinreal/makers
rm -f public/img/master-plan.jpg

echo "=== npm install ==="
npm install --no-audit --no-fund 2>&1 | tail -4

echo "=== postgres role ==="
whoami
psql -d postgres -tAc "SELECT current_user, rolsuper, rolcreatedb FROM pg_roles WHERE rolname = current_user"

echo "=== create db ==="
psql -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='makers'" | grep -q 1 && echo "makers exists" || { createdb makers && echo "created makers"; }