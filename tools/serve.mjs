// Local preview that mimics GitHub Pages: http://localhost:4321/stinto-website/
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = join(dirname(fileURLToPath(import.meta.url)), '..', 'site');
const BASE = '/stinto-website';
const PORT = Number(process.env.PORT || 4321);
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.ico': 'image/x-icon', '.mp4': 'video/mp4', '.txt': 'text/plain' };

createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p === '/' ) { res.writeHead(302, { location: BASE + '/' }); return res.end(); }
  if (!p.startsWith(BASE + '/')) { res.writeHead(404); return res.end('not found'); }
  p = p.slice(BASE.length);
  let f = join(SITE, p);
  if (!f.startsWith(SITE)) { res.writeHead(403); return res.end(); }
  try {
    if ((await stat(f)).isDirectory()) f = join(f, 'index.html');
    const data = await readFile(f);
    res.writeHead(200, { 'content-type': TYPES[extname(f).toLowerCase()] || 'application/octet-stream' });
    res.end(data);
  } catch {
    console.log('404', req.url);
    res.writeHead(404); res.end('not found');
  }
}).listen(PORT, () => console.log(`Preview: http://localhost:${PORT}${BASE}/`));
