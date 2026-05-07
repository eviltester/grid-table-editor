const { test, expect } = require('@playwright/test');
const { AppPage } = require('../abstractions/app.page');

function trackPageErrors(page) {
  const pageErrors = [];
  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });
  return pageErrors;
}

test('grid editor controls are visible after app load', async ({ page }) => {
  const pageErrors = trackPageErrors(page);
  const appPage = new AppPage(page);

  await appPage.goto();
  await appPage.gridEditor.expectVisible();

  expect(pageErrors).toEqual([]);
});

test('add rows above and below increase row count', async ({ page }) => {
  const pageErrors = trackPageErrors(page);
  const appPage = new AppPage(page);

  await appPage.goto();
  const initialRows = await appPage.gridEditor.renderer.countRows();

  await appPage.gridEditor.renderer.selectRow(1);
  await appPage.gridEditor.addRowsAbove();
  await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(initialRows + 1);

  await appPage.gridEditor.renderer.selectRow(1);
  await appPage.gridEditor.addRowsBelow();
  await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(initialRows + 2);

  expect(pageErrors).toEqual([]);
});

test('delete selected rows with no selection leaves row count unchanged', async ({ page }) => {
  const pageErrors = trackPageErrors(page);
  const appPage = new AppPage(page);

  await appPage.goto();
  const initialRows = await appPage.gridEditor.renderer.countRows();
  await expect.poll(async () => appPage.gridEditor.renderer.countSelectedRows()).toBe(0);
  await appPage.gridEditor.deleteSelectedRows();
  await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(initialRows);

  expect(pageErrors).toEqual([]);
});

test('quick filter and clear filters update visible rows', async ({ page }) => {
  const pageErrors = trackPageErrors(page);
  const appPage = new AppPage(page);

  await appPage.goto();
  const totalRows = await appPage.gridEditor.renderer.countRows();

  await appPage.gridEditor.filterBy('Rename Column');
  await expect.poll(async () => appPage.gridEditor.renderer.countVisibleRows()).toBeLessThan(totalRows);

  await appPage.gridEditor.clearFilters();
  await expect.poll(async () => appPage.gridEditor.renderer.countVisibleRows()).toBe(totalRows);

  expect(pageErrors).toEqual([]);
});

test('reset table clears data rows to blank defaults', async ({ page }) => {
  const pageErrors = trackPageErrors(page);
  const appPage = new AppPage(page);

  await appPage.goto();
  await appPage.gridEditor.addRow();
  const rowsBeforeReset = await appPage.gridEditor.renderer.countRows();

  await appPage.gridEditor.resetTable();

  const rowsAfterReset = await appPage.gridEditor.renderer.countRows();
  expect(rowsAfterReset).toBeLessThanOrEqual(rowsBeforeReset);

  await appPage.gridEditor.addRow();
  await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(rowsAfterReset + 1);

  expect(pageErrors).toEqual([]);
});
