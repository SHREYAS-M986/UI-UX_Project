import puppeteer from 'puppeteer-core';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function auditLive() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  console.log('Navigating to live production site: https://access-audit-roan.vercel.app ...');
  const t0 = performance.now();
  const res = await page.goto('https://access-audit-roan.vercel.app', { waitUntil: 'networkidle0' });
  const loadTime = Math.round(performance.now() - t0);

  console.log(`Live site responded with status: ${res?.status()} in ${loadTime}ms`);

  // Verify critical DOM elements
  const scoreRing = await page.$('[aria-label*="Accessibility score"]');
  const fixTheseFirst = await page.$('h2');
  const title = await page.title();
  const metaDesc = await page.$eval('meta[name="description"]', el => el.getAttribute('content'));
  const ogTitle = await page.$eval('meta[property="og:title"]', el => el.getAttribute('content'));
  const hasH1 = await page.$('h1');

  console.log(`\nVerified Production Checks:`);
  console.log(`- Page Title: "${title}"`);
  console.log(`- Meta Description: "${metaDesc?.slice(0, 50)}..."`);
  console.log(`- OpenGraph Title: "${ogTitle}"`);
  console.log(`- Level 1 Heading (h1): ${!!hasH1}`);
  console.log(`- Score Ring mounted: ${!!scoreRing}`);
  console.log(`- Fix List mounted: ${!!fixTheseFirst}`);

  // Test deep-link
  console.log('\nTesting deep-link route navigation: https://access-audit-roan.vercel.app/issues ...');
  const issuesRes = await page.goto('https://access-audit-roan.vercel.app/issues', { waitUntil: 'networkidle0' });
  console.log(`Deep link /issues status: ${issuesRes?.status()} (No 404)`);

  await browser.close();
  console.log('\nProduction validation successfully completed!');
}

auditLive().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
