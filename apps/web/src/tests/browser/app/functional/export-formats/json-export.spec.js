const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../../abstractions/helpers/scenario-helpers');

test.describe('5. Export Formats', () => {
  test('JSON Export', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await seedRows(appPage, ['Alpha', 'Beta']);
    await appPage.textPreviewEditor.selectFormat('JSON');
    await appPage.importExportWorkspace.setTextFromGrid();

    const text = await appPage.textPreviewEditor.getOutputText();
    const parsed = JSON.parse(text);
    expect(Array.isArray(parsed)).toBe(true);
    expect(text).toContain('Alpha');

    expectNoPageErrors(pageErrors);
  });
});
