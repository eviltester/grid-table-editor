const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('8. Advanced Grid Features', () => {
  test('Multi-Select Operations - B C Delete Leaves A D', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    const col = await seedRows(appPage, ['A', 'B', 'C', 'D']);

    await appPage.gridEditor.selectRows([1, 2]);
    await expect.poll(async () => appPage.gridEditor.renderer.countSelectedRows()).toBe(2);

    await appPage.gridEditor.deleteSelectedRows();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(2);
    await expect.poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName(col, 0)).toBe('A');
    await expect.poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName(col, 1)).toBe('D');

    expectNoPageErrors(pageErrors);
  });
});
