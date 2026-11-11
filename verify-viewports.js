import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const viewports = [
  { name: '375px', width: 375, height: 812, label: 'Mobile' },
  { name: '768px', width: 768, height: 1024, label: 'Tablet' },
  { name: '1280px', width: 1280, height: 850, label: 'Desktop' },
  { name: '1920px', width: 1920, height: 1080, label: 'Large-Desktop-4K' },
];

async function run() {
  const screenshotsDir = path.resolve('./screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('Launching Chrome via puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  for (const vp of viewports) {
    console.log(`Setting viewport: ${vp.name} (${vp.width}x${vp.height})...`);
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

    // Wait for main content
    await page.waitForSelector('#main-content', { timeout: 5000 });

    // Check horizontal scroll
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

    console.log(`[Viewport ${vp.name}] Document width: ${overflowInfo.docWidth}px, Window: ${overflowInfo.winWidth}px, Overflow: ${overflowInfo.hasHorizontalScroll}`);

    const screenshotPath = path.join(screenshotsDir, `viewport-${vp.name.replace('px', '')}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`Saved screenshot: ${screenshotPath}`);
  }

  await browser.close();
  console.log('All viewports captured successfully!');
}

run().catch((err) => {
  console.error('Error during verification:', err);
  process.exit(1);
});

