// Lighthouse mobile-ზე. ჯერ: npm run build && npm run preview   შემდეგ: node scripts/lighthouse.mjs [url]
import lighthouse from 'lighthouse';
import { chromium } from 'playwright';
import fs from 'node:fs';

const url = process.argv[2] ?? 'http://localhost:4321/';
const port = 9333;
const browser = await chromium.launch({ args: [`--remote-debugging-port=${port}`] });
try {
  const result = await lighthouse(url, {
    port,
    output: 'html',
    logLevel: 'error',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
  }); // ნაგულისხმევი კონფიგურაცია = მობილური (Moto G Power, შენელებული 4G)
  const { lhr } = result;
  fs.mkdirSync('.cache', { recursive: true });
  fs.writeFileSync('.cache/lighthouse.html', result.report);

  for (const [key, category] of Object.entries(lhr.categories)) console.log(key.padEnd(16), Math.round(category.score * 100));
  for (const id of ['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift', 'speed-index']) {
    console.log(id.padEnd(26), lhr.audits[id].displayValue);
  }
  for (const [key, category] of Object.entries(lhr.categories)) {
    for (const ref of category.auditRefs) {
      const audit = lhr.audits[ref.id];
      if (audit.score !== null && audit.score < 0.9 && audit.scoreDisplayMode !== 'informative') {
        const items = (audit.details?.items ?? []).slice(0, 4).map((item) => item.node?.snippet ?? item.url ?? '');
        console.log('  !', key, ref.id, audit.score, audit.displayValue ?? '', JSON.stringify(items).slice(0, 500));
      }
    }
  }
} finally {
  await browser.close();
}
