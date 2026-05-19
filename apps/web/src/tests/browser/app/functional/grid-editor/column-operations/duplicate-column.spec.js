const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../../../abstractions/helpers/scenario-helpers');

test.describe('2. Column Operations', () => {
  test('Duplicate Column', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    const col = await seedRows(appPage, ['Alpha', 'Beta']);

    await appPage.gridEditor.header.duplicateColumn(col, 'Instructions Copy');
    await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).toContain('Instructions Copy');
    await expect
      .poll(async () => appPage.gridEditor.renderer.getColumnTextsByName('Instructions Copy'))
      .toEqual(['Alpha', 'Beta']);

    await appPage.gridEditor.renderer.setCellTextByColumnName('Instructions Copy', 0, 'Edited Copy');
    await expect.poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName(col, 0)).toBe('Alpha');

    expectNoPageErrors(pageErrors);
  });

  test('Duplicate Column shows error and does not add column when unique names enabled and name exists', async ({
    page,
  }) => {
    const { appPage, pageErrors } = await openApp(page);
    const originalColumn = await seedRows(appPage, ['Alpha', 'Beta']);
    const existingName = 'Existing Column';
    const gridError = page.locator('#grid-column-error');

    await appPage.gridEditor.header.addColumnRight(originalColumn, existingName);
    await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).toEqual([originalColumn, existingName]);

    await appPage.gridEditor.setUniqueColumnNames(true);
    await appPage.gridEditor.header.duplicateColumn(originalColumn, existingName);

    await expect(gridError).toBeVisible();
    await expect(gridError).toContainText(`A column with name ${existingName} already exists`);
    await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).toEqual([originalColumn, existingName]);

    expectNoPageErrors(pageErrors);
  });
});
