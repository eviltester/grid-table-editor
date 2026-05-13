const { test, expect } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors } = require('../helpers/scenario-helpers');

test.describe('4. Import Export Basic', () => {
  test('Set Text From Grid', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await seedRows(appPage, ['A', 'B']);

    await appPage.tabbedText.selectFormat('CSV');
    await appPage.importExportControls.expectExtensionLabel('.csv');
    await appPage.importExportControls.setTextFromGrid();

    await appPage.tabbedText.expectOutputContains('A');
    await appPage.tabbedText.expectOutputContains('B');
    await appPage.tabbedText.expectOutputContains('\n');

    expectNoPageErrors(pageErrors);
  });

  test('Auto Preview updates text on grid edits in preview mode and is disabled in edit mode', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    const primaryColumnName = await seedRows(appPage, ['A', 'B']);

    await appPage.tabbedText.selectFormat('CSV');
    await appPage.tabbedText.setAutoPreview(true);
    await appPage.tabbedText.expectAutoPreviewEnabled(true);

    await appPage.gridEditor.renderer.setCellTextByColumnName(primaryColumnName, 0, 'A-updated');
    await appPage.tabbedText.expectOutputContains('A-updated');

    await appPage.tabbedText.togglePreviewEdit(true);
    await appPage.tabbedText.expectAutoPreviewEnabled(false);
    await appPage.tabbedText.setOutputText('manual-text');

    await appPage.gridEditor.renderer.setCellTextByColumnName(primaryColumnName, 1, 'B-updated');
    await expect(appPage.tabbedText.outputTextArea).toHaveValue('manual-text');

    expectNoPageErrors(pageErrors);
  });
});
