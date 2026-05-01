const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('3. Filtering and Sorting', () => {
  test('Column Sorting', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    const columnName = await seedRows(appPage, ['Banana', 'Apple', 'Cherry']);
    await appPage.gridEditor.header.sortAsc(columnName);
    await expect.poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName(columnName, 0)).toBe('Apple');
    await appPage.gridEditor.header.sortDesc(columnName);
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(3);
    await appPage.gridEditor.header.clearSort(columnName);
    expectNoPageErrors(pageErrors);
  });
});
