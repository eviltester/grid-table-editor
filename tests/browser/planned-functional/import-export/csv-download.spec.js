const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('4. Import Export Basic', () => {
  test('CSV Download', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await seedRows(appPage, ['A']);
    await appPage.tabbedText.selectFormat('CSV');
    await appPage.importExportControls.setTextFromGrid();
    const download = await appPage.importExportControls.clickDownloadAndWaitForEvent();
    await expect(await download.suggestedFilename()).toContain('.csv');
    expectNoPageErrors(pageErrors);
  });
});
