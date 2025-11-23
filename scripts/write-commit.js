const { execSync } = require('child_process');
const { writeFileSync } = require('fs');
const { join } = require('path');

function getCommitHash() {
  try {
    const out = execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] });
    return out.toString().trim();
  } catch (e) {
    return null;
  }
}

function writeHashFile(hash) {
  const dest = join(__dirname, '..', 'assets', 'commit.json');
  const content = JSON.stringify({ hash: hash || 'NÃO INFORMADO' }, null, 2);
  writeFileSync(dest, content, 'utf8');
  console.log('Wrote commit hash to', dest, '->', hash);
}

const hash = getCommitHash();
writeHashFile(hash);
