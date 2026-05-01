const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('9. Error Handling and Edge Cases', () => {
  test('Invalid Data Import', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    const before = await appPage.gridEditor.renderer.countRows();
    await appPage.tabbedText.selectFormat('CSV');
    await appPage.tabbedText.setOutputText('"bad csv');
    await expect.poll(async () => appPage.importExportControls.isSetGridFromTextEnabled()).toBeFalsy();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBeGreaterThanOrEqual(before);
    expectNoPageErrors(pageErrors);
  });
});
