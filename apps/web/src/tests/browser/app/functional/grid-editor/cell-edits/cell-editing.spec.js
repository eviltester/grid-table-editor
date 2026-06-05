const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../../../abstractions/helpers/scenario-helpers');

test.describe('8. Advanced Grid Features', () => {
  test('Cell Editing', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    const col = await seedRows(appPage, ['Original']);

    await appPage.gridEditor.addRow();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(2);

    await appPage.gridEditor.renderer.doubleClickCellByColumnName(col, 0);
    const row0Editor = await appPage.gridEditor.renderer.waitForRowEditor(0);
    await row0Editor.waitFor({ state: 'visible' });
    await row0Editor.fill('Edited');
    await row0Editor.press('Tab');

    await expect.poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName(col, 0)).toBe('Edited');
    await appPage.gridEditor.renderer.waitForRowEditor(1);

    expectNoPageErrors(pageErrors);
  });
});
