#!/usr/bin/env node
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, extname } from 'node:path';

const root = process.cwd();
const imagesDir = join(root, 'public', 'images');
const srcDir = join(root, 'src');

const imageExts = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.svg']);

function walk(dir) {
  return readdirSync(dir).flatMap(name => {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) return walk(p);
    return [p];
  });
}

function toWebPath(p) {
  return p.split('public').pop().replace(/\\/g, '/');
}

const imageFiles = walk(imagesDir).filter(f => imageExts.has(extname(f).toLowerCase()));
const codeFiles = walk(srcDir).filter(f => /\.(ts|tsx|js|jsx|mjs|cjs|css|md|json)$/i.test(f));

const codeBlob = codeFiles.map(f => readFileSync(f, 'utf8')).join('\n');

const unused = [];
for (const file of imageFiles) {
  const webPath = toWebPath(file);
  if (!codeBlob.includes(webPath)) {
    unused.push(webPath);
  }
}

if (!unused.length) {
  console.log('All images referenced.');
  process.exit(0);
}

console.log('Unused image assets:');
unused.forEach(p => console.log('  ' + p));
process.exitCode = 1; // signal that there is cleanup potential
