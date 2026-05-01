const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('6. Export Options and Controls', () => {
  test('Preview and Copy Functions', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await seedRows(appPage, ['A', 'B', 'C']);
    await appPage.importExportControls.setTextFromGrid();
    await appPage.tabbedText.togglePreviewEdit(true);
    await appPage.tabbedText.togglePreviewEdit(true);
    await expect(await appPage.tabbedText.isCopyButtonVisible()).toBeTruthy();
    expectNoPageErrors(pageErrors);
  });
});
