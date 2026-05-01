const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('8. Advanced Grid Features', () => {
  test('Row and Column Drag and Drop', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await seedRows(appPage, ['R1', 'R2', 'R3']);
    await page.locator('#myGrid .tabulator-row').nth(0).dragTo(page.locator('#myGrid .tabulator-row').nth(2));
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(3);
    expectNoPageErrors(pageErrors);
  });
});
