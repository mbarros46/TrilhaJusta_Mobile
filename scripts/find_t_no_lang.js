const fs = require('fs');
const path = require('path');
const exts = ['.ts','.tsx','.js','.jsx'];
const root = path.resolve(__dirname,'..');
const dirs = ['app','src','components'];
function walk(dir, cb){
  for(const f of fs.readdirSync(dir)){
    const p = path.join(dir,f);
    const st = fs.statSync(p);
    if(st.isDirectory()) walk(p,cb);
    else if(exts.includes(path.extname(p))){
      cb(p, fs.readFileSync(p,'utf8'));
    }
  }
}
const results = [];
for(const d of dirs){
  const full = path.join(root,d);
  if(!fs.existsSync(full)) continue;
  walk(full, (p, content)=>{
    const lines = content.split(/\r?\n/);
    lines.forEach((ln, idx)=>{
      const re = /t\('([^']+)'\)/g;
      let m;
      while((m=re.exec(ln))){
        // check if there is a comma after the closing paren in the same line
        const rest = ln.slice(m.index + m[0].length).trim();
        if(!rest.startsWith(',') && !rest.startsWith("||") && !rest.startsWith(')')){
          // probably missing lang arg (but hard to be perfect)
        }
        // crude: if pattern t('key', exists) then it has lang; else record
        if(/t\('[^']+'\s*,/.test(ln)) return;
        results.push({file:p,line:idx+1,text:ln.trim()});
      }
    });
  });
}
console.log(JSON.stringify(results, null, 2));
