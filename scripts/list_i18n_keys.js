const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname,'..');
const exts = ['.ts','.tsx','.js','.jsx'];
// limit scan to app/, src/, components/ to avoid node_modules noise
const scanDirs = ['app','src','components'];
const keys = new Set();
function walk(dir){
  for(const f of fs.readdirSync(dir)){
    const p = path.join(dir,f);
    const st = fs.statSync(p);
    if(st.isDirectory()) walk(p);
    else if(exts.includes(path.extname(p))){
      const content = fs.readFileSync(p,'utf8');
      const re = /t\('([^']+)'\)/g;
      let m;
      while((m=re.exec(content))){ keys.add(m[1]); }
    }
  }
}

for(const d of scanDirs){
  const full = path.join(root,d);
  if(fs.existsSync(full)) walk(full);
}

console.log(Array.from(keys).sort().join('\n'));
