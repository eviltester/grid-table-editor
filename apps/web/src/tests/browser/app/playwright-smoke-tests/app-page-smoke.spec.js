const { test, expect } = require('@playwright/test');

function trackPageErrors(page) {
  const pageErrors = [];
  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });
  return pageErrors;
}

async function expectPageToInitialize(page, urlPath, config) {
  const pageErrors = trackPageErrors(page);

  await page.goto(urlPath, { waitUntil: 'domcontentloaded' });

  await expect(page.locator(config.loadingSelector)).toHaveCount(0);

  for (const selector of config.readySelectors) {
    await expect(page.locator(selector)).toBeVisible();
  }

  if (config.textSelector && config.textValue) {
    await expect(page.locator(config.textSelector)).toContainText(config.textValue);
  }

  expect(pageErrors).toEqual([]);
}

test('app page initializes without browser errors', async ({ page }) => {
  await expectPageToInitialize(page, '/app.html', {
    loadingSelector: '#initial-load',
    readySelectors: [
      '#main-grid-view',
      '#import-export-controls #filedownload',
      '#tabbedTextArea .conversionTypesList',
    ],
    textSelector: '#tabbedTextArea .conversionTypesList',
    textValue: 'CSV',
  });
});
