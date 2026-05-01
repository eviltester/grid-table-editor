const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('4. Import Export Basic', () => {
  test('Set Grid From Text', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await appPage.gridEditor.resetTable();
    await appPage.tabbedText.selectFormat('CSV');
    await appPage.tabbedText.setOutputText('Instructions\nA\nB');
    await expect.poll(async () => appPage.importExportControls.isSetGridFromTextEnabled()).toBeFalsy();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(0);
    await appPage.tabbedText.setOutputText('bad\"csv');
    await expect.poll(async () => appPage.importExportControls.isSetGridFromTextEnabled()).toBeFalsy();
    expectNoPageErrors(pageErrors);
  });
});
