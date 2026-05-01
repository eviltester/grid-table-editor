const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('7. Test Data Generation', () => {
  test('Generation Modes - New Table', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await seedRows(appPage, ['Old A', 'Old B']);
    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.expectExpanded();

    await appPage.testDataPanel.addSchemaRow();
    await appPage.testDataPanel.setSchemaCell(0, 'columnName', 'Mode Value');
    await appPage.testDataPanel.setSchemaTypeValue(0, 'literal');
    await appPage.testDataPanel.setSchemaCell(0, 'value', 'NEW');
    await appPage.testDataPanel.setModeNewTable();
    await appPage.testDataPanel.setGenerateCount(3);

    await appPage.testDataPanel.clickGenerate();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(3);
    await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).toEqual(['Mode Value']);
    await expect
      .poll(async () => appPage.gridEditor.renderer.getColumnTextsByName('Mode Value'))
      .toEqual(['NEW', 'NEW', 'NEW']);

    expectNoPageErrors(pageErrors);
  });
});
