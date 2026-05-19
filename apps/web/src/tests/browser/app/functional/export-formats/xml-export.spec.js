const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../../abstractions/helpers/scenario-helpers');

test.describe('5. Export Formats', () => {
  test('XML Export', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await seedRows(appPage, ['Alpha', 'Beta']);
    await appPage.tabbedText.selectFormat('XML');
    await appPage.importExportControls.setTextFromGrid();

    const text = await appPage.tabbedText.getOutputText();
    expect(text).toContain('Alpha');
    const isValidXml = await page.evaluate((xml) => {
      const doc = new DOMParser().parseFromString(xml, 'application/xml');
      return !doc.querySelector('parsererror');
    }, text);
    expect(isValidXml).toBe(true);

    expectNoPageErrors(pageErrors);
  });
});
