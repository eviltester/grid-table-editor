const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('8. Advanced Grid Features', () => {
  test('Cell Editing', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    const col = await seedRows(appPage, ['Original']);

    await appPage.gridEditor.renderer.doubleClickCellByColumnName(col, 0);
    await appPage.gridEditor.renderer.setCellTextByColumnName(col, 0, 'Edited');
    await expect.poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName(col, 0)).toBe('Edited');

    await appPage.gridEditor.addRow();
    await appPage.gridEditor.renderer.clickCellByColumnName(col, 0);
    await page.keyboard.press('Tab');
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(2);

    expectNoPageErrors(pageErrors);
  });
});
