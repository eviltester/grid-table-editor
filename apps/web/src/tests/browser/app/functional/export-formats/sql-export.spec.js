const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../../abstractions/helpers/scenario-helpers');

test.describe('5. Export Formats', () => {
  test('SQL Export', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await seedRows(appPage, ['Alpha', "O'Reilly"]);
    await appPage.tabbedText.selectFormat('SQL');
    await appPage.importExportControls.setTextFromGrid();

    const text = await appPage.tabbedText.getOutputText();
    expect(text.toLowerCase()).toContain('insert');
    expect(text).toContain("O''Reilly");

    expectNoPageErrors(pageErrors);
  });
});
