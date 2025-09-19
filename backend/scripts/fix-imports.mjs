import fs from 'fs';
import path from 'path';

function fixFile(file) {
  let src = fs.readFileSync(file, 'utf8');

  // Replace: from '<relpath>'  -> from '<relpath>.js'  (preserve quote style)
  src = src.replace(/from\s+(['"])(\.{1,2}\/[^'"\n]+?)(?:\.js)?\1/g, (m, q, p) => `from ${q}${p}.js${q}`);

  fs.writeFileSync(file, src);
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.isFile() && full.endsWith('.ts')) {
      fixFile(full);
    }
  }
}

walk(path.resolve('src'));
console.log('✅ imports normalized to .js with correct quotes');
