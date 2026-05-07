const { test } = require('@playwright/test');
const { openApp, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('2. Column Operations', () => {
  test('Add Columns', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    const [base] = await appPage.gridEditor.header.getColumnNames();

    await expect(page.locator('#myGrid [title="add left"]')).toBeVisible();
    await expect(page.locator('#myGrid [title="rename"]')).toBeVisible();
    await expect(page.locator('#myGrid [title="delete"]')).toBeVisible();
    await expect(page.locator('#myGrid [title="duplicate"]')).toBeVisible();
    await expect(page.locator('#myGrid [title="add right"]')).toBeVisible();

    await appPage.gridEditor.header.addColumnLeft(base, 'Left Col');
    await appPage.gridEditor.header.addColumnRight(base, 'Right Col');
    await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).toEqual(['Left Col', base, 'Right Col']);

    expectNoPageErrors(pageErrors);
  });
});
