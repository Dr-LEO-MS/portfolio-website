const fs = require('fs');
for (const f of ['index.html', 'index-w.html', 'Admin.html']) {
  const h = fs.readFileSync(f, 'utf8');
  const ids = [...h.matchAll(/\sid\s*=\s*"([^"]+)"/g)].map((x) => x[1]);
  const dup = [...new Set(ids.filter((v, i) => ids.indexOf(v) !== i))];
  console.log(f + ': total=' + ids.length + ' dup=' + (dup.length ? dup.join(',') : 'none'));
}
// void elements that must NOT have closing tags; flag any stray ones
for (const f of ['index.html', 'index-w.html', 'Admin.html']) {
  const h = fs.readFileSync(f, 'utf8');
  const bad = [...h.matchAll(/<\/(img|br|hr|input|meta|link)\s*>/gi)].map((x) => x[0]);
  console.log(f + ': stray void closers=' + (bad.length ? bad.join(',') : 'none'));
}
