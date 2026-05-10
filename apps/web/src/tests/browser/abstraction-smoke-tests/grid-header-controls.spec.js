const { test, expect } = require('@playwright/test');
const { AppPage } = require('../abstractions/app.page');
const { trackPageErrors, seedInstructionsRows } = require('../app-coverage/helpers/test-helpers');

test('grid header actions rename/add/duplicate/delete columns', async ({ page }) => {
  const pageErrors = trackPageErrors(page);
  const appPage = new AppPage(page);

  await appPage.goto();
  await appPage.gridEditor.addRow();
  const targetColumnName = (await appPage.gridEditor.header.getColumnNames())[0];
  const initialColumnCount = await appPage.gridEditor.header.countColumns();

  await appPage.gridEditor.header.renameColumn(targetColumnName, 'Steps');
  await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).toContain('Steps');

  await appPage.gridEditor.header.addColumnRight('Steps', 'Right Added');
  await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).toContain('Right Added');

  await appPage.gridEditor.header.addColumnLeft('Steps', 'Left Added');
  await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).toContain('Left Added');

  await appPage.gridEditor.header.duplicateColumn('Steps', 'Steps Copy');
  await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).toContain('Steps Copy');

  await appPage.gridEditor.header.deleteColumn('Steps Copy');
  await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).not.toContain('Steps Copy');
  expect(await appPage.gridEditor.header.countColumns()).toBe(initialColumnCount + 2);
  expect(pageErrors).toEqual([]);
});

test('grid header sorting and per-column filter change visible results', async ({ page }) => {
  const pageErrors = trackPageErrors(page);
  const appPage = new AppPage(page);

  await appPage.goto();
  await seedInstructionsRows(appPage, ['Banana', 'Apple', 'Cherry']);
  const targetColumnName = (await appPage.gridEditor.header.getColumnNames())[0];

  await appPage.gridEditor.header.sortDesc(targetColumnName);
  await expect
    .poll(async () => appPage.gridEditor.renderer.getTopActiveColumnTextsByName(targetColumnName, 3))
    .toEqual(['Cherry', 'Banana', 'Apple']);

  await appPage.gridEditor.header.sortAsc(targetColumnName);
  await expect
    .poll(async () => appPage.gridEditor.renderer.getTopActiveColumnTextsByName(targetColumnName, 3))
    .toEqual(['Apple', 'Banana', 'Cherry']);

  await appPage.gridEditor.header.setColumnFilter(targetColumnName, 'Cherry');
  await expect.poll(async () => appPage.gridEditor.header.getColumnFilterValue(targetColumnName)).toBe('Cherry');
  await expect
    .poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName(targetColumnName, 0))
    .toBe('Cherry');

  await appPage.gridEditor.header.setColumnFilter(targetColumnName, '');
  await expect.poll(async () => appPage.gridEditor.header.getColumnFilterValue(targetColumnName)).toBe('');
  await expect
    .poll(async () => appPage.gridEditor.renderer.getTopActiveColumnTextsByName(targetColumnName, 3))
    .toEqual(['Apple', 'Banana', 'Cherry']);
  expect(pageErrors).toEqual([]);
});
