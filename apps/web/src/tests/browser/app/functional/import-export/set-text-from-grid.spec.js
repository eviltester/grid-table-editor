const { test, expect } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors } = require('../../abstractions/helpers/scenario-helpers');

test.describe('4. Import Export Basic', () => {
  test('Set Text From Grid', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await seedRows(appPage, ['A', 'B']);

    await appPage.textPreviewEditor.selectFormat('CSV');
    await appPage.importExportWorkspace.expectExtensionLabel('.csv');
    await appPage.importExportWorkspace.setTextFromGrid();

    await appPage.textPreviewEditor.expectOutputContains('A');
    await appPage.textPreviewEditor.expectOutputContains('B');
    await appPage.textPreviewEditor.expectOutputContains('\n');

    expectNoPageErrors(pageErrors);
  });

  test('Auto Preview updates text on grid edits in preview mode and is disabled in edit mode', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    const primaryColumnName = await seedRows(appPage, ['A', 'B']);

    await appPage.textPreviewEditor.selectFormat('CSV');
    await appPage.textPreviewEditor.setAutoPreview(true);
    await appPage.textPreviewEditor.expectAutoPreviewInteractive(true);
    await appPage.textPreviewEditor.expectAutoPreviewChecked(true);

    await appPage.gridEditor.renderer.setCellTextByColumnName(primaryColumnName, 0, 'A-updated');
    await appPage.textPreviewEditor.expectOutputContains('A-updated');

    await appPage.textPreviewEditor.togglePreviewEdit(true);
    await appPage.textPreviewEditor.expectAutoPreviewInteractive(false);
    await appPage.textPreviewEditor.expectAutoPreviewChecked(true);
    await appPage.textPreviewEditor.setOutputText('manual-text');

    await appPage.gridEditor.renderer.setCellTextByColumnName(primaryColumnName, 1, 'B-updated');
    await expect(appPage.textPreviewEditor.outputTextArea).toHaveValue('manual-text');

    expectNoPageErrors(pageErrors);
  });
});
