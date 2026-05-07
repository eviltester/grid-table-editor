const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('1. Grid Basic Operations', () => {
  test('Add Multiple Rows Below', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    const columnName = await seedRows(appPage, ['A', 'B', 'C', 'D']);

    await appPage.gridEditor.selectRows([1, 2]);
    await expect.poll(async () => appPage.gridEditor.renderer.countSelectedRows()).toBe(2);

    const before = await appPage.gridEditor.renderer.countRows();
    await appPage.gridEditor.addRowsBelow();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(before + 2);

    await expect.poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName(columnName, 0)).toBe('A');
    await expect.poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName(columnName, 1)).toBe('B');
    await expect.poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName(columnName, 2)).toBe('C');
    await expect.poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName(columnName, 5)).toBe('D');

    expectNoPageErrors(pageErrors);
  });
});
