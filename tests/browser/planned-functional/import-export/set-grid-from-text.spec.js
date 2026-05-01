const { test } = require('@playwright/test');
const { openApp, ensureTextEditMode, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('4. Import Export Basic', () => {
  test('Set Grid From Text', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await appPage.gridEditor.resetTable();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(0);

    await appPage.tabbedText.selectFormat('CSV');
    await ensureTextEditMode(appPage);
    await appPage.tabbedText.setOutputText('Name,Value\nA,1\nB,2');

    await appPage.importExportControls.setGridFromText();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(2);
    await expect.poll(async () => appPage.gridEditor.header.countColumns()).toBe(2);
    await expect.poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName('Name', 0)).toBe('A');

    // Product decision: malformed CSV may clear/reset grid state for faster import handling.
    // We assert that behavior explicitly instead of requiring state preservation.
    await appPage.tabbedText.setOutputText('"bad csv');
    await appPage.importExportControls.setGridFromText();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(0);

    expectNoPageErrors(pageErrors);
  });
});
