set -uo pipefail
cd /home/xinreal/makers
npm install --no-audit --no-fund next react react-dom 2>&1 | tail -4
npm install --no-audit --no-fund -D typescript @types/node @types/react @types/react-dom 2>&1 | tail -4
echo "== resolved =="
node -p "JSON.stringify({next:require('./package.json').dependencies.next, react:require('./package.json').dependencies.react, ts:require('./package.json').devDependencies.typescript})"