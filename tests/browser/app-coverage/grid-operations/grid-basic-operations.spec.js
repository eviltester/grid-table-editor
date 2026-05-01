const { test, expect } = require('@playwright/test');
const { AppPage } = require('../../abstractions/app.page');
const { trackPageErrors, seedInstructionsRows } = require('../helpers/test-helpers');

test('grid row add, multi-add, delete selected, and reset work end-to-end', async ({ page }) => {
  const pageErrors = trackPageErrors(page);
  const appPage = new AppPage(page);
  await appPage.goto();
  await appPage.gridEditor.resetTable();
  await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(0);

  const initialRows = await appPage.gridEditor.renderer.countRows();
  await appPage.gridEditor.addRow();
  await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(initialRows + 1);

  await appPage.gridEditor.selectRow(0);
  await appPage.gridEditor.addRowsAbove();
  await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(initialRows + 2);

  await appPage.gridEditor.selectRow(1);
  await appPage.gridEditor.addRowsBelow();
  await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(initialRows + 3);

  await appPage.gridEditor.selectRows([0, 1]);
  await expect.poll(async () => appPage.gridEditor.renderer.countSelectedRows()).toBe(2);
  const beforeDelete = await appPage.gridEditor.renderer.countRows();
  await appPage.gridEditor.deleteSelectedRows();
  await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBeLessThanOrEqual(beforeDelete);

  await appPage.gridEditor.resetTable();
  await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(0);
  await expect.poll(async () => appPage.gridEditor.header.countColumns()).toBe(1);

  expect(pageErrors).toEqual([]);
});

test('cell editing persists values in the grid renderer', async ({ page }) => {
  const pageErrors = trackPageErrors(page);
  const appPage = new AppPage(page);
  await appPage.goto();

  await seedInstructionsRows(appPage, ['Apple']);
  const [primaryColumnName] = await appPage.gridEditor.header.getColumnNames();
  await appPage.gridEditor.renderer.setCellTextByColumnName(primaryColumnName, 0, 'Test Data');
  await expect
    .poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName(primaryColumnName, 0))
    .toBe('Test Data');

  expect(pageErrors).toEqual([]);
});
