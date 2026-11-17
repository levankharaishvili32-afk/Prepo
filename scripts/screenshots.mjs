// ვიზუალური შემოწმება: იღებს სრულ გვერდს 375 / 768 / 1440 სიგანეზე და ამოწმებს ჰორიზონტალურ გადმოსვლას.
// ჯერ გაუშვი: npm run build && npm run preview   შემდეგ: node scripts/screenshots.mjs [url] [outDir]
import { chromium } from 'playwright';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const base = process.argv[2] ?? 'http://localhost:4321';
const out = process.argv[3] ?? '.cache/screenshots';
fs.mkdirSync(out, { recursive: true });

const targets = [
  { name: 'mobile-375', width: 375, height: 812, slice: 1624, scale: 1 },
  { name: 'tablet-768', width: 768, height: 1024, slice: 2048, scale: 0.6 },
  { name: 'desktop-1440', width: 1440, height: 900, slice: 1800, scale: 0.5 },
];
const pages = [
  { path: '/', label: 'home' },
  { path: '/404', label: '404' },
];

const browser = await chromium.launch();
for (const target of targets) {
  const context = await browser.newContext({ viewport: { width: target.width, height: target.height }, deviceScaleFactor: 1 });
  for (const item of pages) {
    const page = await context.newPage();
    await page.goto(base + item.path, { waitUntil: 'networkidle' });
    // მთელი გვერდის ჩამოსქროლვა, რომ lazy სურათები და reveal-ანიმაციები ჩაირთოს
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < total; y += target.height * 0.6) {
      await page.evaluate((top) => window.scrollTo(0, top), y);
      await page.waitForTimeout(160);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(900);

    const overflow = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const bad = [];
      for (const el of document.querySelectorAll('body *')) {
        if (el.closest('.marquee-track')) continue;
        const r = el.getBoundingClientRect();
        if (r.width > 0 && (r.right > vw + 1 || r.left < -1)) bad.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 50)} [${Math.round(r.left)}..${Math.round(r.right)}]`);
      }
      return { scrollWidth: document.documentElement.scrollWidth, vw, bad: bad.slice(0, 12) };
    });
    console.log(`${target.name} ${item.label}: scrollWidth=${overflow.scrollWidth} viewport=${overflow.vw}`, overflow.bad.length ? overflow.bad : 'no overflow');

    const full = await page.screenshot({ fullPage: true });
    const meta = await sharp(full).metadata();
    let index = 0;
    for (let top = 0; top < meta.height; top += target.slice) {
      const height = Math.min(target.slice, meta.height - top);
      await sharp(full)
        .extract({ left: 0, top, width: meta.width, height })
        .resize({ width: Math.round(meta.width * target.scale) })
        .jpeg({ quality: 82 })
        .toFile(path.join(out, `${target.name}-${item.label}-${String(++index).padStart(2, '0')}.jpg`));
    }
    await page.close();
  }
  await context.close();
}
await browser.close();
