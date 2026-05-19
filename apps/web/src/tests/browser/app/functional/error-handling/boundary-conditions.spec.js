const { test } = require('@playwright/test');
const {
  openApp,
  ensureTextEditMode,
  expectNoPageErrors,
  expect,
} = require('../../abstractions/helpers/scenario-helpers');

test.describe('9. Error Handling and Edge Cases', () => {
  test('Boundary Conditions', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    const [base] = await appPage.gridEditor.header.getColumnNames();

    for (let i = 0; i < 8; i += 1) {
      await appPage.gridEditor.header.addColumnRight(base, 'C' + i);
    }
    await expect.poll(async () => appPage.gridEditor.header.countColumns()).toBeGreaterThanOrEqual(9);

    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.expectExpanded();
    await appPage.testDataPanel.addSchemaRow();
    await appPage.testDataPanel.setSchemaCell(0, 'columnName', 'Boundary Value');
    await appPage.testDataPanel.setSchemaTypeValue(0, 'literal');
    await appPage.testDataPanel.setSchemaCell(0, 'value', 'BOUNDARY');
    await appPage.testDataPanel.setModeNewTable();
    await appPage.testDataPanel.setGenerateCount(50);
    await appPage.testDataPanel.clickGenerate();
    await expect.poll(async () => appPage.testDataPanel.getStatusText()).toContain('complete');
    await appPage.tabbedText.selectFormat('CSV');
    await ensureTextEditMode(appPage);
    await appPage.importExportControls.setTextFromGrid();
    await expect
      .poll(async () => {
        const csvText = await appPage.tabbedText.getOutputText();
        return csvText
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter((line) => line.length > 0).length;
      })
      .toBe(51);

    await appPage.gridEditor.resetTable();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(0);

    expectNoPageErrors(pageErrors);
  });
});
