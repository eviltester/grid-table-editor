const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('5. Export Formats', () => {
  test('XML Export', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await seedRows(appPage, ['Alpha', 'Beta']);
    await appPage.tabbedText.selectFormat('XML');
    await appPage.importExportControls.setTextFromGrid();
    await expect.poll(async () => (await appPage.tabbedText.getOutputText()).length).toBeGreaterThan(0);
    expectNoPageErrors(pageErrors);
  });
});
