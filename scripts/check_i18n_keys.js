const fs = require('fs');
const path = require('path');
const project = path.resolve(__dirname,'..');
const pt = require(path.join(project,'src','locales','pt.json'));
const es = require(path.join(project,'src','locales','es.json'));
const keys = fs.readFileSync(path.join(project,'scripts','list_i18n_keys.js'),'utf8').match(/t\('([^']+)'\)/g);
// Instead reuse previous output: run list_i18n_keys and capture
const { execSync } = require('child_process');
const out = execSync('node ./scripts/list_i18n_keys.js',{cwd:project}).toString().split(/\r?\n/).filter(Boolean);
const missing = {pt:[], es:[]};
for(const k of out){
  // skip keys that look non-translation
  if(k.match(/^[a-z0-9_\.]+$/i)==null) continue;
  // check nested keys like buttons.create_moto
  const check = (obj, key)=>{
    const parts = key.split('.');
    let cur = obj;
    for(const p of parts){
      if(cur && Object.prototype.hasOwnProperty.call(cur,p)) cur = cur[p];
      else return false;
    }
    return typeof cur === 'string';
  };
  if(!check(pt,k)) missing.pt.push(k);
  if(!check(es,k)) missing.es.push(k);
}
console.log('MISSING PT:', missing.pt);
console.log('MISSING ES:', missing.es);
