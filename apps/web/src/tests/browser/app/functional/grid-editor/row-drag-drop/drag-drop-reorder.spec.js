const { test } = require('@playwright/test');
const { openApp, expectNoPageErrors, expect } = require('../../../abstractions/helpers/scenario-helpers');

test.describe('8. Advanced Grid Features', () => {
  test('Row and Column Drag and Drop', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await appPage.gridEditor.resetTable();

    await appPage.gridEditor.addRow();
    await appPage.gridEditor.addRow();
    await appPage.gridEditor.addRow();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBeGreaterThanOrEqual(3);

    const [base] = await appPage.gridEditor.header.getColumnNames();
    await appPage.gridEditor.renderer.setCellTextByColumnName(base, 0, 'R1');
    await appPage.gridEditor.renderer.setCellTextByColumnName(base, 1, 'R2');
    await appPage.gridEditor.renderer.setCellTextByColumnName(base, 2, 'R3');

    const beforeTop = await appPage.gridEditor.renderer.getCellTextByColumnName(base, 0);
    await page.locator('#myGrid .tabulator-row').nth(0).dragTo(page.locator('#myGrid .tabulator-row').nth(2));
    await expect.poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName(base, 0)).not.toBe(beforeTop);

    expectNoPageErrors(pageErrors);
  });
});
