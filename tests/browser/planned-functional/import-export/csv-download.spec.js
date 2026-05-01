const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('4. Import Export Basic', () => {
  test('CSV Download', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await seedRows(appPage, ['Alpha', 'Beta']);

    await appPage.tabbedText.selectFormat('CSV');
    await appPage.importExportControls.setTextFromGrid();

    const download = await appPage.importExportControls.clickDownloadAndWaitForEvent();
    expect(download.suggestedFilename().toLowerCase()).toContain('.csv');

    expectNoPageErrors(pageErrors);
  });
});
