const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('6. Export Options and Controls', () => {
  test('CSV Export Options', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await seedRows(appPage, ['A']);
    await appPage.tabbedText.selectFormat('CSV');
    await appPage.formatOptionsPanel.setFirstEditableOption();
    await appPage.formatOptionsPanel.apply();
    await appPage.importExportControls.setTextFromGrid();
    await expect.poll(async () => (await appPage.tabbedText.getOutputText()).length).toBeGreaterThan(0);
    expectNoPageErrors(pageErrors);
  });
});
