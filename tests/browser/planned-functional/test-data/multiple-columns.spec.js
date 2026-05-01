const { test } = require('@playwright/test');
const { openApp, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('7. Test Data Generation', () => {
  test('Multiple Column Test Data', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.expectExpanded();
    const beforeSchema = await appPage.testDataPanel.getSchemaRowCount();

    await appPage.testDataPanel.addSchemaRow();
    await expect.poll(async () => appPage.testDataPanel.getSchemaRowCount()).toBe(beforeSchema + 1);

    await appPage.testDataPanel.setSchemaCell(0, 'columnName', 'First Name');
    await appPage.testDataPanel.setSchemaTypeValue(0, 'faker');
    await appPage.testDataPanel.setSchemaCell(0, 'value', 'faker.person.firstName');
    await appPage.testDataPanel.setGenerateCount(5);

    await appPage.testDataPanel.clickGenerate();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(5);
    await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).toContain('First Name');

    const values = await appPage.gridEditor.renderer.getColumnTextsByName('First Name');
    expect(values.filter(Boolean).length).toBe(5);
    expectNoPageErrors(pageErrors);
  });
});
