const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../../abstractions/helpers/scenario-helpers');

test.describe('3. Filtering and Sorting', () => {
  test('Column Specific Filter', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    const col = await seedRows(appPage, ['Open', 'Closed', 'Open']);
    await appPage.gridEditor.expectTotalRows(3);

    await appPage.gridEditor.header.setColumnFilter(col, 'Open');
    await expect.poll(async () => appPage.gridEditor.header.getColumnFilterValue(col)).toBe('Open');
    await expect.poll(async () => appPage.gridEditor.renderer.countVisibleRows()).toBe(2);
    await appPage.gridEditor.expectFilteredVisibleRows({ totalRows: 3, visibleRows: 2 });

    await appPage.gridEditor.setQuickFilter('Open');
    await expect.poll(async () => appPage.gridEditor.renderer.countVisibleRows()).toBe(2);
    await appPage.gridEditor.expectFilteredVisibleRows({ totalRows: 3, visibleRows: 2 });

    expectNoPageErrors(pageErrors);
  });
});
