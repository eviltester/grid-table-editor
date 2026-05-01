const { test } = require('@playwright/test');
const { openApp, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('7. Test Data Generation', () => {
  test('Basic Test Data Generation', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.expectExpanded();
    const beforeSchema = await appPage.testDataPanel.getSchemaRowCount();

    await appPage.testDataPanel.addSchemaRow();
    await expect.poll(async () => appPage.testDataPanel.getSchemaRowCount()).toBe(beforeSchema + 1);

    const schemaRowIndex = beforeSchema;
    await appPage.testDataPanel.setSchemaCell(schemaRowIndex, 'columnName', 'First Name');
    await appPage.testDataPanel.setSchemaTypeValue(schemaRowIndex, 'faker');
    await appPage.testDataPanel.setSchemaCell(schemaRowIndex, 'value', 'faker.person.firstName');
    await appPage.testDataPanel.setGenerateCount(5);

    await appPage.testDataPanel.clickGenerate();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(5);
    await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).toContain('First Name');

    const values = await appPage.gridEditor.renderer.getColumnTextsByName('First Name');
    expect(values.filter(Boolean).length).toBe(5);
    expectNoPageErrors(pageErrors);
  });
});
