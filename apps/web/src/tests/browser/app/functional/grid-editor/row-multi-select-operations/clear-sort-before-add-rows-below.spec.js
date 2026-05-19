const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../../../abstractions/helpers/scenario-helpers');

test.describe('1. Grid Basic Operations', () => {
  test('Clear Sort Before Add Rows Below', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    const columnName = await seedRows(appPage, ['A', 'B', 'C', 'D']);

    await appPage.gridEditor.header.sortDesc(columnName);
    await expect
      .poll(async () => appPage.gridEditor.renderer.getTopActiveColumnTextsByName(columnName, 4))
      .toEqual(['D', 'C', 'B', 'A']);

    await appPage.gridEditor.clearSort();
    await expect
      .poll(async () => appPage.gridEditor.renderer.getTopActiveColumnTextsByName(columnName, 4))
      .toEqual(['A', 'B', 'C', 'D']);

    await appPage.gridEditor.selectRows([1, 2]);
    await expect.poll(async () => appPage.gridEditor.renderer.countSelectedRows()).toBe(2);

    const before = await appPage.gridEditor.renderer.countRows();
    await appPage.gridEditor.addRowsBelow();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(before + 2);
    await expect.poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName(columnName, 1)).toBe('B');
    await expect.poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName(columnName, 2)).toBe('C');
    await expect.poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName(columnName, 5)).toBe('D');

    expectNoPageErrors(pageErrors);
  });
});
