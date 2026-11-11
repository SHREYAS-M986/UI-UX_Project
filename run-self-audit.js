import puppeteer from 'puppeteer-core';
import axe from 'axe-core';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function checkPage(page, name) {
  console.log(`\n================ Testing ${name} ================`);
  // Inject axe-core into the live page
  await page.evaluate(axe.source);
  const results = await page.evaluate(async () => {
    // @ts-ignore
    return await window.axe.run(document, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
      },
    });
  });

  console.log(`Violations for ${name}: ${results.violations.length}`);
  if (results.violations.length > 0) {
    results.violations.forEach((v) => {
      console.log(`- [${v.impact?.toUpperCase()}] ${v.id}: ${v.help}`);
      console.log(`  Help URL: ${v.helpUrl}`);
      v.nodes.forEach((n) => {
        console.log(`  Selector: ${n.target.join(' > ')}`);
        console.log(`  HTML: ${n.html}`);
        console.log(`  Failure: ${n.failureSummary}`);
      });
    });
  }
  return results.violations;
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  // 1. Overview
  await checkPage(page, 'Overview Page');

  // 2. Open Modal
  const rerunBtn = await page.$('button[aria-label="Re-run accessibility audit"]');
  if (rerunBtn) {
    await rerunBtn.click();
    await new Promise((r) => setTimeout(r, 400));
    await checkPage(page, 'Run Audit Modal');
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 400));
  }

  // 3. Open Drawer
  const firstIssueRow = await page.$('[role="button"][aria-label*="remediation details"]');
  if (firstIssueRow) {
    await firstIssueRow.click();
    await new Promise((r) => setTimeout(r, 400));
    await checkPage(page, 'Issue Detail Drawer');
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 400));
  }

  // 4. Test tabs: Issues, Pages, Reports, Settings
  const navKeys = ['Issues', 'Pages', 'Reports', 'Settings'];
  for (const key of navKeys) {
    const navBtn = await page.$(`button[aria-label="${key}"]`);
    if (navBtn) {
      await navBtn.click();
      await new Promise((r) => setTimeout(r, 400));
      await checkPage(page, `${key} View`);
    }
  }

  await browser.close();
}

run().catch((err) => {
  console.error('Self audit runner failed:', err);
  process.exit(1);
});

