const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../../abstractions/helpers/scenario-helpers');

test.describe('5. Export Formats', () => {
  test('All Other Formats', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await seedRows(appPage, ['Alpha', 'Beta']);

    for (const format of ['Delimited', 'JSONL', 'JavaScript', 'Gherkin', 'ASCII']) {
      await appPage.textPreviewEditor.selectFormat(format);
      await appPage.importExportWorkspace.setTextFromGrid();
      const text = await appPage.textPreviewEditor.getOutputText();
      expect(text.length).toBeGreaterThan(0);
      expect(text).toContain('Alpha');
    }

    expectNoPageErrors(pageErrors);
  });
});
