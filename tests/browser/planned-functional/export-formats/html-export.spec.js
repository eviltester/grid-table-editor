const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('5. Export Formats', () => {
  test('HTML Export', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await seedRows(appPage, ['Alpha', 'Beta']);
    await appPage.tabbedText.selectFormat('HTML');
    await appPage.importExportControls.setTextFromGrid();

    const text = await appPage.tabbedText.getOutputText().then((v) => v.toLowerCase());
    expect(text).toContain('<table');
    expect(text).toContain('<th');
    expect(text).toContain('<td');

    expectNoPageErrors(pageErrors);
  });
});
