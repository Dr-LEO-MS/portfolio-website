/**
 * Lightweight static audit for the portfolio site.
 * Checks: local asset references, in-page anchors, JS getElementById targets.
 * Run: node .audit/check.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const pages = ['index.html', 'index-w.html', 'Admin.html'];

function read(p) {
  return fs.readFileSync(path.join(ROOT, p), 'utf8');
}

function exists(ref) {
  return fs.existsSync(path.join(ROOT, ref.replace(/[?#].*$/, '')));
}

let problems = 0;

for (const page of pages) {
  const html = read(page);
  console.log('\n=== ' + page + ' ===');

  // 1. Local src/href references
  const refs = new Set();
  const re = /(?:src|href)\s*=\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(html))) {
    const r = m[1].trim();
    if (!r || /^(https?:|mailto:|tel:|callto:|javascript:|data:|#|\/\/)/i.test(r)) continue;
    refs.add(r);
  }
  for (const r of [...refs].sort()) {
    if (!exists(r)) {
      console.log('  [MISSING FILE] ' + r);
      problems++;
    }
  }

  // 2. In-page anchors
  const ids = new Set();
  const idRe = /\sid\s*=\s*"([^"]+)"/g;
  while ((m = idRe.exec(html))) ids.add(m[1]);

  const hashRe = /href\s*=\s*"#([^"]+)"/g;
  const badAnchors = new Set();
  while ((m = hashRe.exec(html))) {
    if (!ids.has(m[1])) badAnchors.add(m[1]);
  }
  for (const a of badAnchors) {
    console.log('  [BROKEN ANCHOR] #' + a);
    problems++;
  }

  // 3. Inline on* handlers referencing functions that never get defined in any loaded script
  const inlineHandlers = [...html.matchAll(/on(?:click|change|input)\s*=\s*"([^"]+)"/g)].map((x) => x[1]);
  const scripts = [...html.matchAll(/<script[^>]*src\s*=\s*"([^"]+)"/g)].map((x) => x[1]);
  const jsText = scripts
    .filter((s) => !/^(https?:|\/\/)/.test(s) && exists(s))
    .map((s) => read(s))
    .join('\n');
  for (const h of inlineHandlers) {
    for (const fn of [...h.matchAll(/([A-Za-z_$][\w$]*)\s*\(/g)].map((x) => x[1])) {
      if (/^(this|window|document|return|function|if|alert)$/.test(fn)) continue;
      const defined =
        new RegExp('function\\s+' + fn + '\\b').test(jsText) ||
        new RegExp('(?:var|let|const)\\s+' + fn + '\\s*=').test(jsText) ||
        new RegExp('window\\.' + fn + '\\s*=').test(jsText) ||
        new RegExp('\\b' + fn + '\\s*[:=]\\s*function').test(jsText);
      if (!defined) {
        console.log('  [UNDEFINED HANDLER] ' + fn + '() used inline');
        problems++;
      }
    }
  }

  // 3b. Selectors used by the page's own scripts (#id / .class) that do not exist in the markup
  const scriptSrcs = [...html.matchAll(/<script[^>]*src\s*=\s*"([^"]+)"/g)]
    .map((x) => x[1])
    .filter((s) => !/^(https?:|\/\/)/.test(s) && exists(s) && !/plugins\//.test(s));
  // Selectors that are (a) created dynamically by the script itself at runtime,
  // or (b) guarded `A || B` fallbacks where the primary selector exists.
  // These never indicate a broken page, so skip them here.
  const KNOWN_DYNAMIC = new Set([
    '.cursor-glow', '.text-shimmer', // created by custom-scripts.js itself
    '.mh-home-2', '.mh-contact', // guarded `getElementById(...) || querySelector(...)` fallbacks
    '.btn-del-prof-skill', '.btn-del-project', '.btn-del-tag', '.btn-del-tech-skill',
    '.chk-proj-featured', '.chk-proj-gallery',
    '.prof-skill-slider', '.tech-skill-slider', // rendered dynamically by customize.js
  ]);
  for (const s of scriptSrcs) {
    const js = read(s);
    const selectors = new Set();
    const selRe = /(?:getElementById\(\s*['"]([^'"]+)['"]\s*\)|(?:querySelector(?:All)?|\$)\(\s*['"]([#.][A-Za-z0-9_\-]+)['"]\s*\))/g;
    // getElementById captures carry no prefix, querySelector captures do
    while ((m = selRe.exec(js))) selectors.add(m[1] ? '#' + m[1] : m[2]);
    for (const sel of [...selectors].sort()) {
      if (KNOWN_DYNAMIC.has(sel)) continue;
      const probe = sel[0] === '#' ? 'id\\s*=\\s*"' + sel.slice(1) + '"'
        : 'class\\s*=\\s*"[^"]*' + sel.slice(1) + '[^"]*"';
      if (!new RegExp(probe).test(html)) {
        console.log('  [MISSING SELECTOR] ' + s + ' -> ' + sel);
        problems++;
      }
    }
  }

  // 4. getElementById targets used by the page's own scripts
  const pageScripts = scripts.filter((s) => !/^(https?:|\/\/)/.test(s) && exists(s));
  for (const s of pageScripts) {
    if (/plugins\//.test(s)) continue; // third-party libraries
    const js = read(s);
    const wanted = new Set(
      [...js.matchAll(/getElementById\(\s*['"]([^'"]+)['"]\s*\)/g)].map((x) => x[1])
    );
    for (const w of [...wanted].sort()) {
      if (!ids.has(w)) {
        console.log('  [MISSING ID] ' + s + ' -> #' + w + ' not present in ' + page);
        problems++;
      }
    }
  }
}

console.log('\nTOTAL PROBLEMS: ' + problems);
