import puppeteer from 'puppeteer-core';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 850 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  // 1. Capture Modal Open
  console.log('Testing "Re-run audit" modal...');
  const rerunButtons = await page.$$('button');
  for (const btn of rerunButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Re-run audit')) {
      await btn.click();
      break;
    }
  }

  await page.waitForSelector('[role="dialog"]', { timeout: 3000 });
  await page.screenshot({ path: path.resolve('./screenshots/modal-open.png') });
  console.log('Saved screenshots/modal-open.png');

  // Close modal via Escape
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 400));

  // 2. Capture Issue Detail Drawer
  console.log('Testing Issue Detail Drawer...');
  const issueRows = await page.$$('[role="button"]');
  for (const row of issueRows) {
    const label = await page.evaluate(el => el.getAttribute('aria-label'), row);
    if (label && label.includes('remediation details')) {
      await row.click();
      break;
    }
  }

  await page.waitForSelector('#drawer-title', { timeout: 3000 });
  await page.screenshot({ path: path.resolve('./screenshots/drawer-open.png') });
  console.log('Saved screenshots/drawer-open.png');

  // Close drawer via Escape
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 400));

  // 3. Navigate to Issues View
  console.log('Testing Navigation to Issues View...');
  const navButtons = await page.$$('button');
  for (const btn of navButtons) {
    const label = await page.evaluate(el => el.getAttribute('aria-label'), btn);
    if (label === 'Issues') {
      await btn.click();
      break;
    }
  }

  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.resolve('./screenshots/issues-view.png') });
  console.log('Saved screenshots/issues-view.png');

  await browser.close();
  console.log('Interactions successfully verified!');
}

run().catch((err) => {
  console.error('Error during interaction verification:', err);
  process.exit(1);
});

