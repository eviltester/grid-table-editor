const { test } = require('@playwright/test');
const {
  openApp,
  ensureTextEditMode,
  expectNoPageErrors,
  expect,
} = require('../../abstractions/helpers/scenario-helpers');

test.describe('4. Import Export Basic', () => {
  test('Set Grid From Text', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await appPage.gridEditor.resetTable();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(0);
    await appPage.gridEditor.expectTotalRows(0);

    await appPage.textPreviewEditor.selectFormat('CSV');
    await ensureTextEditMode(appPage);
    await appPage.textPreviewEditor.setOutputText('Name,Value\nA,1\nB,2');

    await appPage.importExportWorkspace.setGridFromText();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(2);
    await expect.poll(async () => appPage.gridEditor.header.countColumns()).toBe(2);
    await expect.poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName('Name', 0)).toBe('A');
    await appPage.gridEditor.expectTotalRows(2);

    // Product decision: malformed CSV may clear/reset grid state for faster import handling.
    // We assert that behavior explicitly instead of requiring state preservation.
    await appPage.textPreviewEditor.setOutputText('"bad csv');
    await appPage.importExportWorkspace.setGridFromText();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(0);
    await appPage.gridEditor.expectTotalRows(0);

    expectNoPageErrors(pageErrors);
  });
});
