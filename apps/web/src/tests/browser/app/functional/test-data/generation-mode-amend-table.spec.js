const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../../abstractions/helpers/scenario-helpers');

test.describe('7. Test Data Generation', () => {
  test('Generation Modes - Amend Table', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    const baseColumn = await seedRows(appPage, ['Old A', 'Old B']);

    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.expectExpanded();

    await appPage.testDataPanel.addSchemaRow();
    await appPage.testDataPanel.setSchemaCell(0, 'columnName', 'Generated Status');
    await appPage.testDataPanel.setSchemaTypeValue(0, 'literal');
    await appPage.testDataPanel.setSchemaCell(0, 'value', 'APPENDED');
    await appPage.testDataPanel.setModeAmendTable();
    await appPage.testDataPanel.setGenerateCount(4);

    await appPage.testDataPanel.clickGenerate();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(4);
    await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).toEqual([baseColumn, 'Generated Status']);

    await expect.poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName(baseColumn, 0)).toBe('Old A');
    await expect.poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName(baseColumn, 1)).toBe('Old B');
    await expect
      .poll(async () => appPage.gridEditor.renderer.getColumnTextsByName('Generated Status'))
      .toEqual(['APPENDED', 'APPENDED', 'APPENDED', 'APPENDED']);

    expectNoPageErrors(pageErrors);
  });
});
