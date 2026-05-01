const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('2. Column Operations', () => {
  test('Add Columns', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await appPage.gridEditor.header.addColumnLeft('Instructions', 'Left Col');
    await appPage.gridEditor.header.addColumnRight('Instructions', 'Right Col');
    await expect.poll(async () => appPage.gridEditor.header.countColumns()).toBe(3);
    expectNoPageErrors(pageErrors);
  });
});
