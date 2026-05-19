const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../../../abstractions/helpers/scenario-helpers');

test.describe('8. Advanced Grid Features', () => {
  test('Cell Editing', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    const col = await seedRows(appPage, ['Original']);

    await appPage.gridEditor.addRow();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(2);

    await appPage.gridEditor.renderer.doubleClickCellByColumnName(col, 0);
    const row0Editor = page.locator('#myGrid .tabulator-row').nth(0).locator('.tabulator-editing input').first();
    await row0Editor.waitFor({ state: 'visible' });
    await row0Editor.fill('Edited');
    await row0Editor.press('Tab');

    await expect.poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName(col, 0)).toBe('Edited');
    await page
      .locator('#myGrid .tabulator-row')
      .nth(1)
      .locator('.tabulator-editing input')
      .first()
      .waitFor({ state: 'visible' });

    expectNoPageErrors(pageErrors);
  });
});
