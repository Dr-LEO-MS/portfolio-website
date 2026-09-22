/** Fix remaining indentation issues in index-w.html */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

const file = path.join(ROOT, 'index-w.html');
let lines = fs.readFileSync(file, 'utf8').split('\n');

// Fix line 288 (0-indexed: 287) - should be 4 spaces
console.log('288 before:', JSON.stringify(lines[287]));
lines[287] = '    -->';
console.log('288 after:', JSON.stringify(lines[287]));

// Fix line 570 (0-indexed: 569) - should be 4 spaces
console.log('570 before:', JSON.stringify(lines[569]));
lines[569] = '    -->';
console.log('570 after:', JSON.stringify(lines[569]));

// Fix line 1298 (0-indexed: 1297) - should be 20 spaces
console.log('1298 before:', JSON.stringify(lines[1297]));
lines[1297] = "                    <li><a href=\"#\" onclick=\"setActiveStyleSheet('defauld'); return false;\" title=\"Teal\">";
console.log('1298 after:', JSON.stringify(lines[1297]));

fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log('Done!');
