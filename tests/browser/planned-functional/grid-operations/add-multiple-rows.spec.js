const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('1. Grid Basic Operations', () => {
  test('Add Multiple Rows', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await seedRows(appPage, ['A']);
    await appPage.gridEditor.selectRow(0);
    await appPage.gridEditor.addRowsAbove();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(2);
    await appPage.gridEditor.selectRow(1);
    await appPage.gridEditor.addRowsBelow();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(3);
    expectNoPageErrors(pageErrors);
  });
});
