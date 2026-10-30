set -uo pipefail
cd /home/xinreal/makers
npm install --no-audit --no-fund -D playwright 2>&1 | tail -3
npx playwright install --with-deps chromium 2>&1 | tail -8
echo "== chromium check =="
node -e "const {chromium}=require('playwright'); chromium.launch().then(async b=>{console.log('launch ok'); await b.close();}).catch(e=>{console.log('ERR',e.message.slice(0,300))})"