// Render the 1200x630 social share images into site/assets/share/ with headless Chrome.
// Copy is in content/seo/share-images.md. Usage: node tools/make-share-images.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const ROOT = path.resolve('.');
const UP = path.join(ROOT, 'site/wp-content/uploads');
const OUT = path.join(ROOT, 'site/assets/share');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

export const SHARE = [
  { name: 'default', title: 'AI lead capture for sales and event teams', sub: 'Captured, enriched, followed up, synced.', img: null },
  { name: 'home', title: 'AI lead capture and CRM enrichment', sub: 'From first handshake to CRM, automatically.', img: 'CRM-options-ill-v2-1440x1440.png' },
  { name: 'pricing', title: 'Simple per-user pricing', sub: 'Capture, enrich, follow up and sync every lead.', img: 'Company-dashboard-720x574.png' },
  { name: 'lead-capture', title: 'Capture every lead from every event and meeting', sub: 'Straight into your CRM.', img: 'CleanShot-2024-05-16-at-14.13.44.gif', card: true },
  { name: 'digital-business-card', title: 'Digital business cards that capture leads', sub: 'Every share becomes a lead in your CRM.', img: 'Some-and-themes@3x-1440x928.png' },
  { name: 'stintotap', title: 'Tap a phone, capture a lead', sub: 'StintoTap NFC business cards.', img: 'My-CArd-StintoTap-Mockup-720x558.png' },
];

const html = ({ title, sub, img, card }, src) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:C;src:url(${pathToFileURL(path.join(UP, 'CircularXXTT-Black.ttf'))});font-weight:800}
@font-face{font-family:C;src:url(${pathToFileURL(path.join(UP, 'CircularXXTT-Regular.ttf'))});font-weight:400}
html,body{margin:0;width:1200px;height:630px;overflow:hidden}
body{background:#0D4644;font-family:C,sans-serif;color:#fff;display:flex;position:relative}
body:before{content:"";position:absolute;right:-180px;bottom:-260px;width:720px;height:720px;border-radius:50%;background:#255957}
.txt{position:relative;z-index:1;padding:72px 0 64px 80px;width:${img ? 560 : 1000}px;display:flex;flex-direction:column}
.logo{height:52px;width:auto;align-self:flex-start}
h1{font-weight:800;font-size:${img ? 58 : 76}px;line-height:1.08;letter-spacing:-.01em;margin:auto 0 24px}
p{font-size:30px;line-height:1.3;margin:0;color:#1AEC7C}
.pic{position:relative;z-index:1;flex:1;display:flex;align-items:center;justify-content:center;padding:40px 48px 40px 0}
.pic img{max-width:100%;max-height:540px;object-fit:contain;filter:drop-shadow(0 20px 40px rgba(0,0,0,.35))}
.pic img.card{border-radius:24px}
</style></head><body><div class="txt"><img class="logo" src="${pathToFileURL(path.join(UP, 'Wordmark-Action-Green.png'))}" alt=""><h1>${title}</h1><p>${sub}</p></div>${img ? `<div class="pic"><img${card ? ' class="card"' : ''} src="${pathToFileURL(src)}" alt=""></div>` : ''}</body></html>`;

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  fs.mkdirSync(OUT, { recursive: true });
  const tmp = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'share-'));
  for (const s of SHARE) {
    // Animated GIFs: use a still first frame so the result is the same on every run.
    let src = s.img && path.join(UP, s.img);
    if (src && src.endsWith('.gif')) {
      const still = path.join(tmp, `${s.name}.png`);
      execFileSync('sips', ['-s', 'format', 'png', src, '--out', still], { stdio: 'ignore' });
      src = still;
    }
    const f = path.join(tmp, `${s.name}.html`);
    fs.writeFileSync(f, html(s, src));
    const out = path.join(OUT, `${s.name}.png`);
    execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
      '--window-size=1200,630', `--screenshot=${out}`, pathToFileURL(f).href], { stdio: 'ignore' });
    console.log(`wrote site/assets/share/${s.name}.png`);
  }
}
