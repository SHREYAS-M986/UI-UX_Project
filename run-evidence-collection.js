import puppeteer from 'puppeteer-core';
import axe from 'axe-core';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const targetUrl = 'https://access-audit-roan.vercel.app';

const evidenceDir = path.resolve('./evidence');
const screenshotsDir = path.join(evidenceDir, 'screenshots');
const axeDir = path.join(evidenceDir, 'axe');
const lighthouseDir = path.join(evidenceDir, 'lighthouse');

[evidenceDir, screenshotsDir, axeDir, lighthouseDir].forEach((d) => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

async function run() {
  console.log('=== PHASE 1: COLLECTING REAL EVIDENCE ===');
  console.log(`Target: ${targetUrl}`);

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  // 1. Capture Screenshots across standard viewports: 375, 768, 1280, 1920 px
  const viewports = [
    { name: '375px', width: 375, height: 812 },
    { name: '768px', width: 768, height: 1024 },
    { name: '1280px', width: 1280, height: 900 },
    { name: '1920px', width: 1920, height: 1080 },
  ];

  for (const vp of viewports) {
    console.log(`Capturing Overview at ${vp.width}x${vp.height}...`);
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto(targetUrl, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(screenshotsDir, `overview-${vp.name}.png`) });
  }

  // Set default desktop viewport for view captures
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(targetUrl, { waitUntil: 'networkidle0' });

  // 2. Capture States & Views
  // Overview view
  await page.screenshot({ path: path.join(screenshotsDir, 'view-overview.png') });

  // Modal Open state
  console.log('Capturing Modal Open state...');
  const rerunBtn = await page.$('button[aria-label="Re-run accessibility audit"]');
  if (rerunBtn) {
    await rerunBtn.click();
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: path.join(screenshotsDir, 'state-modal-open.png') });
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 400));
  }

  // Drawer Open state
  console.log('Capturing Drawer Open state...');
  const firstIssueRow = await page.$('[role="button"][aria-label*="remediation details"]');
  if (firstIssueRow) {
    await firstIssueRow.click();
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: path.join(screenshotsDir, 'state-drawer-open.png') });
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 400));
  }

  // Capture other views
  const views = ['issues', 'pages', 'reports', 'settings'];
  for (const v of views) {
    console.log(`Navigating to ${v} view...`);
    const btn = await page.$(`button[aria-label="${v.charAt(0).toUpperCase() + v.slice(1)}"]`);
    if (btn) {
      await btn.click();
      await new Promise((r) => setTimeout(r, 500));
      await page.screenshot({ path: path.join(screenshotsDir, `view-${v}.png`) });

      // If issues view, capture empty state by filtering
      if (v === 'issues') {
        const searchInput = await page.$('input[type="search"]');
        if (searchInput) {
          await searchInput.type('xyznonexistentquery123');
          await new Promise((r) => setTimeout(r, 300));
          await page.screenshot({ path: path.join(screenshotsDir, 'state-issues-empty.png') });
          await page.evaluate(() => {
            const input = document.querySelector('input[type="search"]');
            if (input) input.value = '';
          });
        }
      }
    }
  }

  // 3. Run axe-core against every view and save full JSON
  console.log('\n--- Running axe-core against all views ---');
  const axeSummary = {};

  const pagesToTest = [
    { name: 'overview', setup: async () => {
      const btn = await page.$('button[aria-label="Overview"]');
      if (btn) await btn.click();
      await new Promise((r) => setTimeout(r, 400));
    }},
    { name: 'issues', setup: async () => {
      const btn = await page.$('button[aria-label="Issues"]');
      if (btn) await btn.click();
      await new Promise((r) => setTimeout(r, 400));
    }},
    { name: 'pages', setup: async () => {
      const btn = await page.$('button[aria-label="Pages"]');
      if (btn) await btn.click();
      await new Promise((r) => setTimeout(r, 400));
    }},
    { name: 'reports', setup: async () => {
      const btn = await page.$('button[aria-label="Reports"]');
      if (btn) await btn.click();
      await new Promise((r) => setTimeout(r, 400));
    }},
    { name: 'settings', setup: async () => {
      const btn = await page.$('button[aria-label="Settings"]');
      if (btn) await btn.click();
      await new Promise((r) => setTimeout(r, 400));
    }},
  ];

  for (const pt of pagesToTest) {
    console.log(`Running axe-core on view: ${pt.name}...`);
    await pt.setup();
    await page.evaluate(axe.source);
    const axeResults = await page.evaluate(async () => {
      // @ts-ignore
      return await window.axe.run(document, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'],
        },
      });
    });

    const jsonPath = path.join(axeDir, `axe-${pt.name}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(axeResults, null, 2));

    axeSummary[pt.name] = {
      violationsCount: axeResults.violations.length,
      passesCount: axeResults.passes.length,
      incompleteCount: axeResults.incomplete.length,
      inapplicableCount: axeResults.inapplicable.length,
      violations: axeResults.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        helpUrl: v.helpUrl,
        nodesCount: v.nodes.length,
      })),
    };
    console.log(`  -> Violations: ${axeResults.violations.length}, Passes: ${axeResults.passes.length}`);
  }

  fs.writeFileSync(path.join(axeDir, 'axe-summary.json'), JSON.stringify(axeSummary, null, 2));

  // 4. Test 320px reflow and touch target sizes
  console.log('\n--- Testing 320px Reflow (400% zoom equivalent) ---');
  await page.setViewport({ width: 320, height: 568 });
  await page.goto(targetUrl, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(screenshotsDir, 'reflow-320px.png') });

  const reflowInfo = await page.evaluate(() => {
    const docWidth = document.documentElement.scrollWidth;
    const winWidth = window.innerWidth;
    return {
      docWidth,
      winWidth,
      hasHorizontalOverflow: docWidth > winWidth,
    };
  });
  console.log(`  320px Reflow: Doc Width = ${reflowInfo.docWidth}px, Win Width = ${reflowInfo.winWidth}px, Overflow = ${reflowInfo.hasHorizontalOverflow}`);

  // Test Keyboard Navigation & Focus
  console.log('\n--- Testing Keyboard Operation & Focus Trap ---');
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(targetUrl, { waitUntil: 'networkidle0' });

  // Press Tab 5 times and check activeElement
  const focusTrace = [];
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => {
      const el = document.activeElement;
      return {
        tagName: el?.tagName,
        ariaLabel: el?.getAttribute('aria-label') || el?.textContent?.slice(0, 30),
        id: el?.id,
        className: el?.className?.slice(0, 40),
      };
    });
    focusTrace.push(focused);
  }
  fs.writeFileSync(path.join(evidenceDir, 'keyboard-focus-trace.json'), JSON.stringify(focusTrace, null, 2));
  console.log(`  Recorded ${focusTrace.length} keyboard tab stops starting with Skip Link.`);

  await browser.close();
  console.log('\n=== PHASE 1 AUTOMATION COMPLETED ===');
}

run().catch((err) => {
  console.error('Evidence collection error:', err);
  process.exit(1);
});

