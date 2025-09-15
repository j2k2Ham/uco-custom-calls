#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const summaryPath = path.resolve('coverage', 'coverage-summary.json');
if (!fs.existsSync(summaryPath)) {
  console.error('coverage-summary.json not found. Run coverage first.');
  process.exit(1);
}
const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
const total = summary.total;
const pct = Math.round(total.lines.pct);
function coverageColor(p) {
  if (p >= 90) return { key: 'brightgreen', hex: '4c1' };
  if (p >= 80) return { key: 'green', hex: '97CA00' };
  if (p >= 70) return { key: 'yellowgreen', hex: 'a4a61d' };
  if (p >= 60) return { key: 'yellow', hex: 'dfb317' };
  return { key: 'orange', hex: 'fe7d37' };
}
const palette = coverageColor(pct);
const svg = [
  "<svg xmlns='http://www.w3.org/2000/svg' width='140' height='20' role='img' aria-label='coverage: "+pct+"%'>",
  "<linearGradient id='a' x2='0' y2='100%'><stop offset='0' stop-color='#bbb' stop-opacity='.1'/><stop offset='1' stop-opacity='.1'/></linearGradient>",
  "<rect rx='3' width='140' height='20' fill='#555'/>",
  "<rect rx='3' x='70' width='70' height='20' fill='#"+palette.hex+"'/>",
  "<rect rx='3' width='140' height='20' fill='url(#a)'/>",
  "<g fill='#fff' text-anchor='middle' font-family='Verdana,Geneva,DejaVu Sans,sans-serif' font-size='11'>",
  "<text x='35' y='14'>coverage</text>",
  "<text x='105' y='14'>"+pct+"%</text>",
  "</g></svg>"
].join('');
fs.mkdirSync('public/badges', { recursive: true });
fs.writeFileSync('public/badges/coverage.svg', svg);
console.log('Generated public/badges/coverage.svg');
