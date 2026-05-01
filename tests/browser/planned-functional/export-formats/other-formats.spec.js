const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('5. Export Formats', () => {
  test('All Other Formats', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await seedRows(appPage, ['Alpha', 'Beta']);
    for (const format of ['Delimited', 'JSONL', 'JavaScript', 'Gherkin', 'ASCII']) {
      await appPage.tabbedText.selectFormat(format);
      await appPage.importExportControls.setTextFromGrid();
      await expect.poll(async () => (await appPage.tabbedText.getOutputText()).length).toBeGreaterThan(0);
    }
    expectNoPageErrors(pageErrors);
  });
});
