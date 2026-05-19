const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../../../abstractions/helpers/scenario-helpers');

test.describe('1. Grid Basic Operations', () => {
  test('Add Row Above Selected Row', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    const columnName = await seedRows(appPage, ['A', 'B', 'C']);

    await appPage.gridEditor.selectRow(1);
    await expect.poll(async () => appPage.gridEditor.renderer.countSelectedRows()).toBe(1);

    const before = await appPage.gridEditor.renderer.countRows();
    await appPage.gridEditor.addRowsAbove();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(before + 1);

    await expect.poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName(columnName, 0)).toBe('A');
    await expect.poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName(columnName, 2)).toBe('B');
    await expect.poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName(columnName, 3)).toBe('C');

    expectNoPageErrors(pageErrors);
  });
});
