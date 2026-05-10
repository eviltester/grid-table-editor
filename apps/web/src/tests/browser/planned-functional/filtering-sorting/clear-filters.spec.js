const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('3. Filtering and Sorting', () => {
  test('Clear All Filters', async ({ page }) => {
    const seededValues = ['Apple', 'Banana'];
    const { appPage, pageErrors } = await openApp(page);
    const col = await seedRows(appPage, seededValues);

    await appPage.gridEditor.setQuickFilter('Apple');
    await appPage.gridEditor.header.setColumnFilter(col, 'Apple');
    await expect.poll(async () => appPage.gridEditor.renderer.countVisibleRows()).toBe(1);

    await appPage.gridEditor.clearFilters({ expectedActiveRowCount: seededValues.length });
    await expect.poll(async () => appPage.gridEditor.renderer.countVisibleRows()).toBe(seededValues.length);
    await expect(appPage.gridEditor.quickFilterInput).toHaveValue('');

    expectNoPageErrors(pageErrors);
  });
});
