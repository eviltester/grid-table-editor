const { test } = require('@playwright/test');
const { openApp, expectNoPageErrors, expect } = require('../../abstractions/helpers/scenario-helpers');
const { assertNoCommonErrorPatterns } = require('../../abstractions/helpers/output-quality-helpers');

test.describe('7. Test Data Generation', () => {
  test('Refresh Text Preview populates CSV preview after generation', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.expectExpanded();
    const beforeSchema = await appPage.testDataPanel.getSchemaRowCount();

    await appPage.testDataPanel.addSchemaRow();
    await expect.poll(async () => appPage.testDataPanel.getSchemaRowCount()).toBe(beforeSchema + 1);

    const schemaRowIndex = beforeSchema;
    await appPage.testDataPanel.setSchemaCell(schemaRowIndex, 'columnName', 'First Name');
    await appPage.testDataPanel.setSchemaTypeValue(schemaRowIndex, 'person.firstName');
    await appPage.testDataPanel.setGenerateCount(5);

    await appPage.testDataPanel.clickGenerate();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(5);
    await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).toContain('First Name');

    const values = await appPage.gridEditor.renderer.getColumnTextsByName('First Name');
    expect(values).toHaveLength(5);
    assertNoCommonErrorPatterns(values);

    await appPage.textPreviewEditor.selectFormat('CSV');
    await appPage.testDataPanel.clickRefreshTextPreview();

    await expect.poll(async () => appPage.textPreviewEditor.getOutputText()).toContain('First Name');
    await expect.poll(async () => appPage.textPreviewEditor.getOutputText()).toContain(values[0]);

    expectNoPageErrors(pageErrors);
  });
});
