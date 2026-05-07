const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('7. Test Data Generation', () => {
  test('Generation Modes - Amend Selected', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    const baseColumn = await seedRows(appPage, ['Row A', 'Row B', 'Row C']);

    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.expectExpanded();

    await appPage.testDataPanel.addSchemaRow();
    await appPage.testDataPanel.setSchemaCell(0, 'columnName', 'Selected Flag');
    await appPage.testDataPanel.setSchemaTypeValue(0, 'literal');
    await appPage.testDataPanel.setSchemaCell(0, 'value', 'YES');
    await appPage.testDataPanel.setModeAmendSelected();
    await appPage.testDataPanel.setGenerateCount(1);

    await appPage.gridEditor.selectRow(1);
    await expect.poll(async () => appPage.gridEditor.renderer.countSelectedRows()).toBe(1);

    await appPage.testDataPanel.clickGenerate();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(3);
    await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).toEqual([baseColumn, 'Selected Flag']);

    await expect.poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName(baseColumn, 0)).toBe('Row A');
    await expect.poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName(baseColumn, 1)).toBe('Row B');
    await expect.poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName(baseColumn, 2)).toBe('Row C');
    await expect
      .poll(async () => appPage.gridEditor.renderer.getColumnTextsByName('Selected Flag'))
      .toEqual(['', 'YES', '']);

    expectNoPageErrors(pageErrors);
  });
});
