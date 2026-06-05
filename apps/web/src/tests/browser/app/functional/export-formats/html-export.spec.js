const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../../abstractions/helpers/scenario-helpers');

test.describe('5. Export Formats', () => {
  test('HTML Export', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await seedRows(appPage, ['Alpha', 'Beta']);
    await appPage.textPreviewEditor.selectFormat('HTML');
    await appPage.importExportWorkspace.setTextFromGrid();

    const text = await appPage.textPreviewEditor.getOutputText().then((v) => v.toLowerCase());
    expect(text).toContain('<table');
    expect(text).toContain('<th');
    expect(text).toContain('<td');

    expectNoPageErrors(pageErrors);
  });
});
