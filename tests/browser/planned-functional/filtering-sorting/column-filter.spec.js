const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('3. Filtering and Sorting', () => {
  test('Column Specific Filter', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await seedRows(appPage, ['A', 'B', 'C']);
    const [columnName] = await appPage.gridEditor.header.getColumnNames();
    await appPage.gridEditor.header.addColumnRight(columnName, 'Status');
    await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).toContain('Status');
    await appPage.gridEditor.renderer.setCellTextByColumnName('Status', 0, 'Open');
    await appPage.gridEditor.renderer.setCellTextByColumnName('Status', 1, 'Closed');
    await appPage.gridEditor.renderer.setCellTextByColumnName('Status', 2, 'Open');
    await appPage.gridEditor.header.setColumnFilter('Status', 'Open');
    await expect.poll(async () => appPage.gridEditor.header.getColumnFilterValue('Status')).toBe('Open');
    expectNoPageErrors(pageErrors);
  });
});
