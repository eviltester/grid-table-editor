const { test, expect } = require('@playwright/test');
const { AppPage } = require('../abstractions/app.page');

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

test('add row button creates row in grid', async ({ page }) => {
  const pageErrors = trackPageErrors(page);
  const appPage = new AppPage(page);

  await appPage.goto();

  const initialRowCount = await appPage.gridEditor.renderer.countRows();
  await appPage.gridEditor.addRow();
  await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(initialRowCount + 1);
  const rowCountAfterAdd = await appPage.gridEditor.renderer.countRows();
  const [primaryColumnName] = await appPage.gridEditor.header.getColumnNames();

  const lastRowIndex = rowCountAfterAdd - 1;
  await expect
    .poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName(primaryColumnName, lastRowIndex))
    .toBe('');
  expect(pageErrors).toEqual([]);
});
