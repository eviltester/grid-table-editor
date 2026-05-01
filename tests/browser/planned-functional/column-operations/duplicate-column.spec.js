const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('2. Column Operations', () => {
  test('Duplicate Column', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await seedRows(appPage, ['Alpha']);
    const [columnName] = await appPage.gridEditor.header.getColumnNames();
    await appPage.gridEditor.header.duplicateColumn(columnName, `${columnName} Copy`);
    await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).toContain(`${columnName} Copy`);
    expectNoPageErrors(pageErrors);
  });
});
