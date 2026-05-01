const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('3. Filtering and Sorting', () => {
  test('Clear All Filters', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await seedRows(appPage, ['Apple', 'Banana']);
    await appPage.gridEditor.setQuickFilter('Apple');
    await appPage.gridEditor.clearFilters();
    await expect.poll(async () => appPage.gridEditor.renderer.countVisibleRows()).toBe(2);
    expectNoPageErrors(pageErrors);
  });
});
