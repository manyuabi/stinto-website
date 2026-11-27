// Check every page and stylesheet in site/ for broken internal references and
// leftover links to the live WordPress site.
// Usage: node tools/check-links.mjs     (exit code 1 if anything new is broken)
import { readFileSync, existsSync, statSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join, dirname, posix } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = join(dirname(fileURLToPath(import.meta.url)), '..', 'site');
// Missing on the live WordPress site too (unused lightbox play icons)
const KNOWN_MISSING = /lightgallery\/img\/(vimeo|video|youtube)-play\.png$/;

const files = execSync(`find . -name '*.html' -o -name '*.css'`, { cwd: SITE }).toString().trim().split('\n').map((f) => f.slice(2));
const missing = new Map();
const live = new Map();
for (const f of files) {
  // Canonical, og:/twitter: tags and JSON-LD point at the production domain on purpose.
  const t = readFileSync(join(SITE, f), 'utf8')
    .replace(/<link rel="canonical"[^>]*>/g, '')
    .replace(/<base [^>]*>/g, '')
    .replace(/<meta (?:property|name)="(?:og|twitter):[^>]*>/g, '')
    .replace(/<script type="application\/ld\+json"[\s\S]*?<\/script>/g, '');
  const refs = [...t.matchAll(/(?:href|src|srcset|data-src)="([^"]+)"/g)]
    .filter((m) => !m[1].startsWith('data:'))
    .flatMap((m) => m[1].split(',').map((s) => s.trim().split(/\s+/)[0]))
    .concat([...t.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)].map((m) => m[1]));
  for (let r of refs) {
    if (!r || /^(data:|#|mailto:|tel:|javascript:|\{)/.test(r)) continue;
    if (/^(https?:)?\/\//.test(r)) {
      if (/(^|\/\/)(www\.)?stinto\.com|usercontent\.one/.test(r) && !/(web|dashboard|knowledgebase)\.stinto/.test(r)) live.set(r, f);
      continue;
    }
    r = r.split(/[?#]/)[0];
    if (!r) continue;
    let p;
    try { p = posix.normalize(posix.join(posix.dirname(f), decodeURIComponent(r))); } catch { continue; }
    if (KNOWN_MISSING.test(p)) continue;
    let full = join(SITE, p);
    if (existsSync(full) && statSync(full).isDirectory()) full = join(full, 'index.html');
    if (!existsSync(full)) missing.set(p, f);
  }
}
console.log(`Broken internal links: ${missing.size}`);
for (const [p, f] of [...missing].slice(0, 40)) console.log(`   ${p}  <-  ${f}`);
console.log(`Links to the live WordPress site: ${live.size}`);
for (const [p, f] of [...live].slice(0, 20)) console.log(`   ${p}  <-  ${f}`);
process.exit(missing.size || live.size ? 1 : 0);
