const { test, expect } = require('@playwright/test');
const { GeneratorPage } = require('../abstractions/generator.page');

function trackPageErrors(page) {
  const pageErrors = [];
  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });
  return pageErrors;
}

async function expectPageToInitialize(page, urlPath, config) {
  const pageErrors = trackPageErrors(page);
  const generatorPage = new GeneratorPage(page);

  await generatorPage.goto(urlPath);

  if (config.textSelector && config.textValue) {
    await expect(page.locator(config.textSelector)).toContainText(config.textValue);
  }

  expect(pageErrors).toEqual([]);
  return generatorPage;
}

test('generator page initializes without browser errors', async ({ page }) => {
  await expectPageToInitialize(page, '/generator.html', {
    textSelector: '.shared-generator-preview-head',
    textValue: 'Preview',
  });
});

test('generator schema help shows tippy tooltip content for faker and literal', async ({ page }) => {
  await expectPageToInitialize(page, '/generator.html', {});

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
