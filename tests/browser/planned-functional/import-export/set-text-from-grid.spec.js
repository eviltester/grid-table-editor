const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('4. Import Export Basic', () => {
  test('Set Text From Grid', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await seedRows(appPage, ['A', 'B']);
    await appPage.tabbedText.selectFormat('CSV');
    await appPage.importExportControls.setTextFromGrid();
    await expect.poll(async () => (await appPage.tabbedText.getOutputText()).length).toBeGreaterThan(0);
    expectNoPageErrors(pageErrors);
  });
});
