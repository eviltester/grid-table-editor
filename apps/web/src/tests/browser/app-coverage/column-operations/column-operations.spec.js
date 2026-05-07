const { test, expect } = require('@playwright/test');
const { AppPage } = require('../../abstractions/app.page');
const { trackPageErrors, seedInstructionsRows } = require('../helpers/test-helpers');

test('column add, rename, duplicate and delete controls update table shape and data', async ({ page }) => {
  const pageErrors = trackPageErrors(page);
  const appPage = new AppPage(page);
  await appPage.goto();
  await seedInstructionsRows(appPage, ['A1', 'A2']);
  const [primaryColumnName] = await appPage.gridEditor.header.getColumnNames();

  await appPage.gridEditor.header.addColumnLeft(primaryColumnName, 'Left Col');
  await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).toContain('Left Col');

  await appPage.gridEditor.header.addColumnRight(primaryColumnName, 'Right Col');
  await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).toContain('Right Col');

  await appPage.gridEditor.header.renameColumn(primaryColumnName, 'New Column Name');
  await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).toContain('New Column Name');

  await appPage.gridEditor.renderer.setCellTextByColumnName('New Column Name', 0, 'Seed Value');
  const sourceValuesBeforeDuplicate = await appPage.gridEditor.renderer.getColumnTextsByName('New Column Name');
  await appPage.gridEditor.header.duplicateColumn('New Column Name', 'New Column Copy');
  await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).toContain('New Column Copy');
  await expect
    .poll(async () => appPage.gridEditor.renderer.getColumnTextsByName('New Column Copy'))
    .toEqual(sourceValuesBeforeDuplicate);
  await appPage.gridEditor.renderer.setCellTextByColumnName('New Column Copy', 0, 'Copied Value');
  await expect
    .poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName('New Column Copy', 0))
    .toBe('Copied Value');

  await appPage.gridEditor.header.deleteColumn('Right Col');
  await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).not.toContain('Right Col');

  expect(pageErrors).toEqual([]);
});
