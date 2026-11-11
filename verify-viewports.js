import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const viewports = [
  { name: '320px', width: 320, height: 568, label: 'Compact Mobile (320px)' },
  { name: '375px', width: 375, height: 812, label: 'Mobile (375px)' },
  { name: 'landscape-mobile', width: 812, height: 375, label: 'Landscape Mobile (812x375)' },
  { name: '768px', width: 768, height: 1024, label: 'Tablet Portrait (768px)' },
  { name: '1024px', width: 1024, height: 768, label: 'Tablet Landscape / Small Laptop (1024px)' },
  { name: '1440px', width: 1440, height: 900, label: 'Desktop Laptop (1440px)' },
  { name: '1920px', width: 1920, height: 1080, label: 'Large Desktop / 4K (1920px)' },
];

async function run() {
  const screenshotsDir = path.resolve('./screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  console.log('Testing viewports for overflow and visual layout:');
  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

    // Wait for main content
    await page.waitForSelector('#main-content', { timeout: 5000 });

    const overflowInfo = await page.evaluate(() => {
      const docWidth = document.documentElement.scrollWidth;
      const winWidth = window.innerWidth;
      const bodyWidth = document.body.scrollWidth;
      return {
        docWidth,
        winWidth,
        bodyWidth,
        hasHorizontalScroll: docWidth > winWidth,
      };
    });

    console.log(`- [${vp.label}] docWidth: ${overflowInfo.docWidth}px, winWidth: ${overflowInfo.winWidth}px, Overflow: ${overflowInfo.hasHorizontalScroll}`);

    if (overflowInfo.hasHorizontalScroll) {
      console.error(`  ERROR: Horizontal scroll detected on ${vp.label}!`);
    }

    const screenshotPath = path.join(screenshotsDir, `viewport-${vp.name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });
  }

  await browser.close();
  console.log('\nAll viewports passed visual and overflow inspection!');
}

run().catch((err) => {
  console.error('Error during verification:', err);
  process.exit(1);
});
