// 在 GitHub Actions 中把 gh-pages 的 r11 index.html 精确替换为 r12
const fs = require('fs');
const path = require('path');
const target = process.argv[2];
if (!target) throw new Error('usage: node r12_patch.js <index.html>');
const raw = fs.readFileSync(path.join(__dirname, 'r12_patch.b64'), 'utf8');
const pairs = JSON.parse(Buffer.from(raw.replace(/\s+/g, ''), 'base64').toString('utf8'));
let s = fs.readFileSync(target, 'utf8');
for (const [from, to] of pairs) {
  const n = s.split(from).length - 1;
  if (n !== 1) throw new Error('expected exactly 1 match, got ' + n + ' :: ' + from.slice(0, 40));
  s = s.split(from).join(to);
}
fs.writeFileSync(target, s, 'utf8');
console.log('patched ' + target + ' with ' + pairs.length + ' replacements');
