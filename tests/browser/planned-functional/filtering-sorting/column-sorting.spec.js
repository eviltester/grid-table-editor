const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('3. Filtering and Sorting', () => {
  test('Column Sorting', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    const col = await seedRows(appPage, ['Banana', 'Apple', 'Cherry']);

    await appPage.gridEditor.header.sortAsc(col);
    await expect.poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName(col, 0)).toBe('Apple');
    await expect.poll(async () => appPage.gridEditor.header.getColumnSortState(col)).toContain('asc');

    await appPage.gridEditor.header.sortDesc(col);
    await expect.poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName(col, 0)).toBe('Cherry');
    await expect.poll(async () => appPage.gridEditor.header.getColumnSortState(col)).toContain('desc');

    expectNoPageErrors(pageErrors);
  });
});
