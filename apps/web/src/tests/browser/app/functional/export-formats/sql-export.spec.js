const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../../abstractions/helpers/scenario-helpers');

test.describe('5. Export Formats', () => {
  test('SQL Export', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await seedRows(appPage, ['Alpha', "O'Reilly"]);
    await appPage.textPreviewEditor.selectFormat('SQL');
    await appPage.importExportWorkspace.setTextFromGrid();

    const text = await appPage.textPreviewEditor.getOutputText();
    expect(text.toLowerCase()).toContain('insert');
    expect(text).toContain("O''Reilly");

    expectNoPageErrors(pageErrors);
  });
});
