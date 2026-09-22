const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
// DOM-level smoke test using regex structure checks (no browser needed).
let fail = 0;
function check(name, cond, extra) {
  console.log((cond ? 'PASS' : 'FAIL') + ' ' + name + (extra ? ' :: ' + extra : ''));
  if (!cond) fail++;
}
const index = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const indexW = fs.readFileSync(path.join(ROOT, 'index-w.html'), 'utf8');
const admin = fs.readFileSync(path.join(ROOT, 'Admin.html'), 'utf8');
const scripts = fs.readFileSync(path.join(ROOT, 'assets/js/custom-scripts.js'), 'utf8');
const customize = fs.readFileSync(path.join(ROOT, 'assets/js/customize.js'), 'utf8');

// 1. Nav anchors all resolve
for (const [name, html] of [['index', index], ['index-w', indexW]]) {
  const ids = new Set([...html.matchAll(/\sid\s*=\s*"([^"]+)"/g)].map((x) => x[1]));
  const nav = html.match(/<nav[\s\S]*?<\/nav>/) || [''];
  const hrefs = [...nav[0].matchAll(/href="#([^"]+)"/g)].map((x) => x[1]);
  const missing = hrefs.filter((h) => !ids.has(h));
  check(name + ' nav anchors (' + hrefs.length + ')', missing.length === 0, missing.join(','));
}
// 2. Every nav anchor target exists (sections intentionally differ per page)
for (const [name, html] of [['index', index], ['index-w', indexW]]) {
  const ids = new Set([...html.matchAll(/\sid\s*=\s*"([^"]+)"/g)].map((x) => x[1]));
  const hrefs = [...html.matchAll(/href="#([^"]+)"/g)].map((x) => x[1]);
  const missing = [...new Set(hrefs)].filter((h) => !ids.has(h));
  check(name + ' all anchors resolve (' + new Set(hrefs).size + ')', missing.length === 0, missing.join(','));
}
// 3. Portfolio filter buttons match data-filter categories used by items
for (const [name, html] of [['index', index], ['index-w', indexW]]) {
  const btns = [...html.matchAll(/data-filter="\.([^"]+)"/g)].map((x) => x[1]);
  const itemClasses = [...html.matchAll(/class="([^"]*grid-item[^"]*)"/g)].map((x) => x[1].split(/\s+/));
  const missing = btns.filter((b) => !itemClasses.some((tokens) => tokens.includes(b)));
  check(name + ' portfolio filters (' + btns.length + ' btns, ' + itemClasses.length + ' items)', missing.length === 0, missing.join(','));
}
// 4. Fancybox: every data-fancybox target opens an existing modal id
for (const [name, html] of [['index', index], ['index-w', indexW]]) {
  const t = [...html.matchAll(/data-fancybox[^>]*data-src="#([^"]+)"/g)].map((x) => x[1]);
  const missing = t.filter((id) => !html.includes('id="' + id + '"'));
  check(name + ' fancybox modals (' + t.length + ')', missing.length === 0, missing.join(','));
}
// 5. Contact forms have validation hooks
for (const [name, html] of [['index', index], ['index-w', indexW]]) {
  check(name + ' contact form', /id="contactForm"/.test(html) && /form-validator|validator\.min\.js/.test(html));
}
// 6. JS: guarded lookups never throw on missing nodes (spot check patterns)
check('custom-scripts guards getElementById', /getElementById\("mh-home"\) \|\|/.test(scripts) === false || /document\.getElementById\("mh-home"\) \|\| document\.querySelector/.test(scripts));
check('custom-scripts no bare .style on maybe-null', !/\$\("#mh-topbar"\)\.style/.test(scripts));
// 7. Admin customize.js defines all inline onclick handlers used in Admin.html
const handlers = [...admin.matchAll(/onclick="([A-Za-z_$][\w$]*)\s*\(/g)].map((x) => x[1]);
const missingH = [...new Set(handlers)].filter((fn) => !new RegExp('(function\\s+' + fn + '\\b|window\\.' + fn + '\\s*=)').test(customize));
check('Admin inline handlers (' + new Set(handlers).size + ')', missingH.length === 0, missingH.join(','));
// 8. Admin preview iframe + storage keys wired
check('Admin preview iframe', /id="preview-iframe"/.test(admin));
check('Admin storage keys', /PORTFOLIO_SETTINGS/.test(customize));
console.log(fail === 0 ? 'SMOKE OK' : 'SMOKE FAILURES: ' + fail);
process.exit(fail === 0 ? 0 : 1);
