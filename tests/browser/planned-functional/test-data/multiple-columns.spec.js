const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('7. Test Data Generation', () => {
  test('Multiple Column Test Data', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.expectExpanded();
    await appPage.testDataPanel.addSchemaRow();
    await expect.poll(async () => appPage.testDataPanel.getSchemaRowCount()).toBeGreaterThan(0);
    await appPage.testDataPanel.setSchemaCell(0, 'columnName', 'First Name');
    await appPage.testDataPanel.setSchemaTypeValue(0, 'faker');
    await appPage.testDataPanel.setSchemaCell(0, 'value', 'faker.person.firstName');
    await appPage.testDataPanel.setGenerateCount(3);
    await appPage.testDataPanel.clickGenerate();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBeGreaterThan(0);
    expectNoPageErrors(pageErrors);
  });
});
