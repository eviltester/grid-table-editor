const { test, expect } = require('@playwright/test');
const { AppPage } = require('../abstractions/app.page');

function trackPageErrors(page) {
  const pageErrors = [];
  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });
  return pageErrors;
}

async function expectPageToInitialize(page, urlPath, config) {
  const pageErrors = trackPageErrors(page);
  const appPage = new AppPage(page);

  await appPage.goto(urlPath);

  if (config.textSelector && config.textValue) {
    await expect(page.locator(config.textSelector)).toContainText(config.textValue);
  }

  expect(pageErrors).toEqual([]);
  return appPage;
}

test('app page initializes without browser errors', async ({ page }) => {
  const appPage = await expectPageToInitialize(page, '/app.html', {
    textSelector: '[data-role="text-preview-editor-root"] [data-role="format-tabs-list"]',
    textValue: 'CSV',
  });

  await expect(appPage.textPreviewEditor.tabsList).toContainText('CSV');
});
