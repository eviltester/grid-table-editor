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

test('generator page initializes without browser errors', async ({ page }) => {
  await expectPageToInitialize(page, '/generator.html', {
    loadingSelector: '#generator-initial-load',
    readySelectors: ['#generator-app .generator-page', '#generatorOutputFormat', '#generator-preview-grid'],
    textSelector: '#generatorPreviewHeading',
    textValue: 'Preview',
  });
});

test('generator schema help shows tippy tooltip content for faker and literal', async ({ page }) => {
  await expectPageToInitialize(page, '/generator.html', {
    loadingSelector: '#generator-initial-load',
    readySelectors: ['#generator-app .generator-page', '#generatorOutputFormat', '#generator-preview-grid'],
  });

  await page.selectOption('[data-field="sourceType"]', 'faker');
  const helpIcon = page.locator('[data-field="faker-doc-link"]').first();

  await helpIcon.hover();
  await expect(
    page.locator('.tippy-content').filter({ hasText: 'Faker commands generate realistic random values' })
  ).toBeVisible();

  await page.selectOption('[data-field="sourceType"]', 'literal');
  await page.locator('[data-field="faker-doc-link"]').first().hover();
  await expect(page.locator('.tippy-content').filter({ hasText: 'Literal data repeats the exact text' })).toBeVisible();
});
