const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('8. Advanced Grid Features', () => {
  test('Cell Editing', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await seedRows(appPage, ['Original']);
    const [columnName] = await appPage.gridEditor.header.getColumnNames();
    await appPage.gridEditor.renderer.doubleClickCellByColumnName(columnName, 0);
    await appPage.gridEditor.renderer.setCellTextByColumnName(columnName, 0, 'Edited');
    await expect.poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName(columnName, 0)).toBe('Edited');
    expectNoPageErrors(pageErrors);
  });
});
