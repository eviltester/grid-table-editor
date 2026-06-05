const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../../abstractions/helpers/scenario-helpers');

test.describe('5. Export Formats', () => {
  test('Markdown Export', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await seedRows(appPage, ['Alpha', 'Beta']);
    await appPage.textPreviewEditor.selectFormat('Markdown');
    await appPage.importExportWorkspace.setTextFromGrid();

    const text = await appPage.textPreviewEditor.getOutputText();
    expect(text).toContain('|');
    expect(text).toContain('Alpha');
    expect(text).toContain('Beta');

    expectNoPageErrors(pageErrors);
  });
});
