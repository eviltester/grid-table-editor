const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../../abstractions/helpers/scenario-helpers');

test.describe('4. Import Export Basic', () => {
  test('CSV Download', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await seedRows(appPage, ['Alpha', 'Beta']);

    await appPage.textPreviewEditor.selectFormat('CSV');
    await appPage.importExportWorkspace.setTextFromGrid();

    const download = await appPage.importExportWorkspace.clickDownloadAndWaitForEvent();
    expect(download.suggestedFilename()).toMatch(/\.csv$/i);

    expectNoPageErrors(pageErrors);
  });
});
