const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('3. Filtering and Sorting', () => {
  test('Global Filter', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await seedRows(appPage, ['Apple', 'Banana', 'Cherry']);

    await appPage.gridEditor.setQuickFilter('App');
    await expect.poll(async () => appPage.gridEditor.renderer.countVisibleRows()).toBe(1);
    await appPage.gridEditor.setQuickFilter('app');
    await expect.poll(async () => appPage.gridEditor.renderer.countVisibleRows()).toBe(1);

    await appPage.gridEditor.setQuickFilter('');
    await expect.poll(async () => appPage.gridEditor.renderer.countVisibleRows()).toBe(3);

    expectNoPageErrors(pageErrors);
  });
});
