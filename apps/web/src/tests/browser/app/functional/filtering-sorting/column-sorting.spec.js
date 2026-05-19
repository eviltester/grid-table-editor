const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../../abstractions/helpers/scenario-helpers');

test.describe('3. Filtering and Sorting', () => {
  test('Column Sorting', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    const col = await seedRows(appPage, ['Banana', 'Apple', 'Cherry']);

    await appPage.gridEditor.header.sortAsc(col);
    await expect
      .poll(async () => appPage.gridEditor.renderer.getTopActiveColumnTextsByName(col, 3))
      .toEqual(['Apple', 'Banana', 'Cherry']);
    await expect.poll(async () => appPage.gridEditor.header.getColumnSortState(col)).toContain('asc');

    await appPage.gridEditor.header.sortDesc(col);
    await expect
      .poll(async () => appPage.gridEditor.renderer.getTopActiveColumnTextsByName(col, 3))
      .toEqual(['Cherry', 'Banana', 'Apple']);
    await expect.poll(async () => appPage.gridEditor.header.getColumnSortState(col)).toContain('desc');

    await appPage.gridEditor.header.clearSort(col);
    await expect.poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName(col, 0)).toBe('Banana');
    await expect.poll(async () => appPage.gridEditor.header.getColumnSortState(col)).toBe('none');

    expectNoPageErrors(pageErrors);
  });
});
