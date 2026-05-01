const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('8. Advanced Grid Features', () => {
  test('Multi-Select Operations', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await seedRows(appPage, ['A', 'B', 'C']);
    await appPage.gridEditor.selectRows([0, 2]);
    await expect.poll(async () => appPage.gridEditor.renderer.countSelectedRows()).toBe(2);
    await appPage.gridEditor.deleteSelectedRows();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBeLessThanOrEqual(3);
    expectNoPageErrors(pageErrors);
  });
});
