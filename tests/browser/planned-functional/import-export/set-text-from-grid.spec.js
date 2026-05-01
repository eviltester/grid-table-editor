const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('4. Import Export Basic', () => {
  test('Set Text From Grid', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await seedRows(appPage, ['A', 'B']);

    await appPage.tabbedText.selectFormat('CSV');
    await expect.poll(async () => appPage.importExportControls.getExtensionLabel()).toBe('.csv');
    await appPage.importExportControls.setTextFromGrid();

    const text = await appPage.tabbedText.getOutputText();
    expect(text).toContain('A');
    expect(text).toContain('B');
    expect(text).toContain('\n');

    expectNoPageErrors(pageErrors);
  });
});
