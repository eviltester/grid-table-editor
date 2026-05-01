const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('2. Column Operations', () => {
  test('Delete Column', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await appPage.gridEditor.header.addColumnRight('Instructions', 'ToDelete');
    await appPage.gridEditor.header.deleteColumn('ToDelete');
    await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).not.toContain('ToDelete');
    expectNoPageErrors(pageErrors);
  });
});
