const { test } = require('@playwright/test');
const { openApp, expectNoPageErrors, expect } = require('../../abstractions/helpers/scenario-helpers');
const { assertNoCommonErrorPatterns } = require('../../abstractions/helpers/output-quality-helpers');

test.describe('7. Test Data Generation', () => {
  test('Test Data Text Schema', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.expectExpanded();
    const beforeSchema = await appPage.testDataPanel.getSchemaRowCount();

    await appPage.testDataPanel.setSchemaText(
      '# this comment should be ignored\n\nFirst Name\nperson.firstName\n\n# second comment\nStatus\nenum(active,inactive,pending)'
    );
    await expect.poll(async () => appPage.testDataPanel.getSchemaRowCount()).toBeGreaterThanOrEqual(beforeSchema + 1);
    await appPage.testDataPanel.setGenerateCount(5);

    await appPage.testDataPanel.clickGenerate();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(5);
    await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).toContain('First Name');
    await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).toContain('Status');
    // comments are not rendered as schema rows
    expect(await appPage.testDataPanel.getSchemaRowCount()).toBe(beforeSchema + 2);

    const firstNameValues = await appPage.gridEditor.renderer.getColumnTextsByName('First Name');
    const statusValues = await appPage.gridEditor.renderer.getColumnTextsByName('Status');
    expect(firstNameValues).toHaveLength(5);
    expect(statusValues).toHaveLength(5);
    assertNoCommonErrorPatterns(firstNameValues);
    assertNoCommonErrorPatterns(statusValues);
    for (const value of statusValues) {
      expect(['active', 'inactive', 'pending']).toContain(String(value).toLowerCase());
    }
    expectNoPageErrors(pageErrors);
  });
});
