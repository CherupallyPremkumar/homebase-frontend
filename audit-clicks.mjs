import { chromium } from 'playwright';
import { readdir } from 'fs/promises';
import { join } from 'path';

const BASE = '/Users/premkumar/homebase-frontend/design-prototype';
const results = [];

async function auditPage(filePath, pageName) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const issues = [];
  
  try {
    await page.goto('file://' + filePath, { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(800);

    // Count clickable elements
    const buttons = await page.$$('button');
    const links = await page.$$('a[href]');
    const onclicks = await page.$$('[onclick]');
    
    // Check dead links (href="#" without onclick)
    const deadLinks = await page.$$eval('a[href="#"]', els => 
      els.filter(a => !a.onclick && !a.getAttribute('onclick'))
        .map(a => a.textContent?.trim().substring(0, 40))
        .filter(t => t)
    );

    // Check buttons without handlers
    const deadButtons = await page.$$eval('button', els =>
      els.filter(b => !b.onclick && !b.getAttribute('onclick') && !b.closest('form') && !b.closest('[onclick]') && !b.closest('.dropdown'))
        .map(b => b.textContent?.trim().substring(0, 40))
        .filter(t => t && t !== '')
    );

    // Check sidebar exists (shared layout loaded)
    const sidebarLoaded = await page.$('#admin-sidebar li, #seller-sidebar li, #warehouse-sidebar li, aside li');
    
    // Check header exists
    const headerLoaded = await page.$('#admin-header .dropdown, #seller-header .dropdown, #warehouse-header .dropdown, header .dropdown');

    const total = buttons.length + links.length + onclicks.length;
    
    if (deadLinks.length > 0 || deadButtons.length > 0 || !sidebarLoaded || !headerLoaded) {
      issues.push({
        deadLinks: deadLinks.slice(0, 5),
        deadButtons: deadButtons.slice(0, 5),
        sidebarMissing: !sidebarLoaded,
        headerMissing: !headerLoaded,
      });
    }

    results.push({
      page: pageName,
      total,
      buttons: buttons.length,
      links: links.length,
      onclicks: onclicks.length,
      deadLinks: deadLinks.length,
      deadButtons: deadButtons.length,
      sidebarOk: !!sidebarLoaded,
      headerOk: !!headerLoaded,
      issues: issues.length > 0 ? issues : null,
    });
  } catch(e) {
    results.push({ page: pageName, error: e.message.substring(0, 80) });
  }
  
  await browser.close();
}

// Get all HTML files
const apps = ['admin', 'seller', 'warehouse', 'customer'];
for (const app of apps) {
  const dir = join(BASE, app);
  const files = (await readdir(dir)).filter(f => f.endsWith('.html'));
  for (const file of files) {
    await auditPage(join(dir, file), app + '/' + file);
  }
}

// Print report
console.log('\n=== CLICKABLE ELEMENT AUDIT ===\n');
let totalIssues = 0;
for (const r of results) {
  if (r.error) {
    console.log(`❌ ${r.page} — ERROR: ${r.error}`);
    totalIssues++;
  } else if (r.deadLinks > 0 || r.deadButtons > 0 || !r.sidebarOk || !r.headerOk) {
    console.log(`⚠️  ${r.page} — ${r.total} clickables, ${r.deadLinks} dead links, ${r.deadButtons} dead buttons${!r.sidebarOk?' [SIDEBAR MISSING]':''}${!r.headerOk?' [HEADER MISSING]':''}`);
    if (r.issues) {
      for (const iss of r.issues) {
        if (iss.deadLinks.length) console.log(`   Dead links: ${iss.deadLinks.join(', ')}`);
        if (iss.deadButtons.length) console.log(`   Dead buttons: ${iss.deadButtons.join(', ')}`);
      }
    }
    totalIssues++;
  } else {
    console.log(`✅ ${r.page} — ${r.total} clickables, all working`);
  }
}
console.log(`\nTotal: ${results.length} pages, ${totalIssues} with issues`);
