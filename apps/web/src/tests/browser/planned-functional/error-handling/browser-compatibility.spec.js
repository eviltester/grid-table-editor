const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('9. Error Handling and Edge Cases', () => {
  test('Browser Compatibility', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const { appPage, pageErrors } = await openApp(page);

    await seedRows(appPage, ['Clip']);
    await appPage.importExportControls.setTextFromGrid();
    await appPage.tabbedText.copyButton.click();
    await expect.poll(async () => page.evaluate(() => navigator.clipboard.readText())).toContain('Clip');

    const download = await appPage.importExportControls.clickDownloadAndWaitForEvent();
    expect(download.suggestedFilename().length).toBeGreaterThan(3);

    expectNoPageErrors(pageErrors);
  });
});
