const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('2. Column Operations', () => {
  test('Duplicate Column', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    const col = await seedRows(appPage, ['Alpha', 'Beta']);

    await appPage.gridEditor.header.duplicateColumn(col, 'Instructions Copy');
    await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).toContain('Instructions Copy');
    await expect
      .poll(async () => appPage.gridEditor.renderer.getColumnTextsByName('Instructions Copy'))
      .toEqual(['', '']);

    await appPage.gridEditor.renderer.setCellTextByColumnName('Instructions Copy', 0, 'Edited Copy');
    await expect.poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName(col, 0)).toBe('Alpha');

    expectNoPageErrors(pageErrors);
  });
});
