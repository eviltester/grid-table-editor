const { test, expect } = require('@playwright/test');
const { AppPage } = require('./abstractions/app.page');

function trackPageErrors(page) {
  const pageErrors = [];
  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });
  return pageErrors;
}

test('app page object loads and reports ready components', async ({ page }) => {
  const pageErrors = trackPageErrors(page);
  const appPage = new AppPage(page);

  await appPage.goto();

  await expect(appPage.gridEditor.grid).toBeVisible();
  await expect(appPage.importExportControls.downloadButton).toBeVisible();
  await expect(appPage.tabbedText.tabsList).toContainText('CSV');
  expect(pageErrors).toEqual([]);
});

test('app component abstractions can interact without errors', async ({ page }) => {
  const pageErrors = trackPageErrors(page);
  const appPage = new AppPage(page);

  await appPage.goto();
  await appPage.gridEditor.addRow();
  await appPage.gridEditor.filterBy('Instructions');
  await appPage.gridEditor.clearFilters();
  await appPage.tabbedText.selectFormat('JSON');
  await expect(appPage.importExportControls.downloadButton).toContainText('.json');
  await appPage.testDataPanel.expand();
  await appPage.testDataPanel.expectExpanded();

  expect(pageErrors).toEqual([]);
});
