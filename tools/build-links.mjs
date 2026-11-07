// Usage (from the repo root): node tools/build-links.mjs
// Regenerates links.html from tools/links-data.mjs. Commit both.
import { writeFileSync } from 'node:fs';
import data from './links-data.mjs';
import { renderLinks } from './render-links.mjs';

const out = new URL('../links.html', import.meta.url);
writeFileSync(out, renderLinks(data));
console.log('Wrote', out.pathname);
