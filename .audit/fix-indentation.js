/**
 * Fix indentation issues in index-w.html
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

const file = 'index-w.html';
let lines = fs.readFileSync(path.join(ROOT, file), 'utf8').split('\n');

// Fix 1: Line 112 - nav link indentation
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('href="#mh-education">Experiences</a>')) {
    lines[i] = '                                <a class="nav-link" href="#mh-education">Experiences</a>';
    console.log(`Fixed nav link at line ${i + 1}`);
    break;
  }
}

// Fix 2-4: Section comment close and section tags (8 spaces -> 4 spaces)
const sectionPatterns = [
  '        -->\n        <section class="mh-service"',
  '        -->\n        <section class="mh-featured-project"',
  '        -->\n        <section class="mh-experince"',
];
const sectionReplacements = [
  '    -->\n    <section class="mh-service"',
  '    -->\n    <section class="mh-featured-project"',
  '    -->\n    <section class="mh-experince"',
];

let content = lines.join('\n');
for (let i = 0; i < sectionPatterns.length; i++) {
  if (content.includes(sectionPatterns[i])) {
    content = content.replace(sectionPatterns[i], sectionReplacements[i]);
    console.log(`Fixed section indentation #${i + 1}`);
  } else {
    console.log(`Pattern not found: ${sectionPatterns[i].substring(0, 40)}...`);
  }
}

// Fix 5-6: Modal image indentation
content = content.replace(
  /(\r?\n)(\s+)<img src="assets\/images\/pr-0\.jpg"/,
  '$1                            <img src="assets/images/pr-0.jpg"'
);
content = content.replace(
  /(\r?\n)(\s+)<img src="assets\/images\/pr-1\.jpg"/,
  '$1                            <img src="assets/images/pr-1.jpg"'
);

// Fix 7: Color swatch <li> indentation
content = content.replace(
  /\n\s+<li><a href="#" onclick="setActiveStyleSheet\('defauld'\)">/,
  '\n                    <li><a href="#" onclick="setActiveStyleSheet(\'defauld\')">'
);

fs.writeFileSync(path.join(ROOT, file), content, 'utf8');
console.log('Done fixing index-w.html indentation');

