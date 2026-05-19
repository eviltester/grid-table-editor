const { test } = require('@playwright/test');
const { openApp, expectNoPageErrors, expect } = require('../../abstractions/helpers/scenario-helpers');
const { assertNoCommonErrorPatterns } = require('../../abstractions/helpers/output-quality-helpers');

test.describe('7. Test Data Generation', () => {
  test('Multiple Column Test Data', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.expectExpanded();
    const beforeSchema = await appPage.testDataPanel.getSchemaRowCount();

    await appPage.testDataPanel.addSchemaRow();
    await expect.poll(async () => appPage.testDataPanel.getSchemaRowCount()).toBe(beforeSchema + 1);

    await appPage.testDataPanel.setSchemaCell(0, 'columnName', 'First Name');
    await appPage.testDataPanel.setSchemaTypeValue(0, 'person.firstName');
    await appPage.testDataPanel.addSchemaRow();
    await expect.poll(async () => appPage.testDataPanel.getSchemaRowCount()).toBe(beforeSchema + 2);
    await appPage.testDataPanel.setSchemaCell(1, 'columnName', 'Status');
    await appPage.testDataPanel.setSchemaTypeValue(1, 'literal');
    await appPage.testDataPanel.setSchemaCell(1, 'value', 'Active');
    await appPage.testDataPanel.setGenerateCount(5);

    await appPage.testDataPanel.clickGenerate();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(5);
    await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).toEqual(['First Name', 'Status']);

    const firstNameValues = await appPage.gridEditor.renderer.getColumnTextsByName('First Name');
    const statusValues = await appPage.gridEditor.renderer.getColumnTextsByName('Status');
    expect(firstNameValues).toHaveLength(5);
    assertNoCommonErrorPatterns(firstNameValues);
    for (const value of firstNameValues) {
      expect(value).toMatch(/[A-Za-z]/);
    }
    assertNoCommonErrorPatterns(statusValues);
    expect(statusValues).toEqual(['Active', 'Active', 'Active', 'Active', 'Active']);
    expectNoPageErrors(pageErrors);
  });
});
