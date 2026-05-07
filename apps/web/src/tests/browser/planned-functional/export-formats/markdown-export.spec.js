const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('5. Export Formats', () => {
  test('Markdown Export', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await seedRows(appPage, ['Alpha', 'Beta']);
    await appPage.tabbedText.selectFormat('Markdown');
    await appPage.importExportControls.setTextFromGrid();

    const text = await appPage.tabbedText.getOutputText();
    expect(text).toContain('|');
    expect(text).toContain('Alpha');
    expect(text).toContain('Beta');

    expectNoPageErrors(pageErrors);
  });
});
