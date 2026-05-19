const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../../abstractions/helpers/scenario-helpers');

test.describe('6. Export Options and Controls', () => {
  test('CSV Options Unquote Safe Value', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await seedRows(appPage, ['Alpha']);

    await appPage.tabbedText.selectFormat('CSV');
    await appPage.importExportControls.setTextFromGrid();
    const before = await appPage.tabbedText.getOutputText();
    expect(before).toContain('"Alpha"');

    await appPage.formatOptionsPanel.setOption('quotes', false);
    await expect(await appPage.formatOptionsPanel.isApplyEnabled()).toBeTruthy();
    await appPage.formatOptionsPanel.apply();
    await appPage.importExportControls.setTextFromGrid();

    const after = await appPage.tabbedText.getOutputText();
    expect(after).not.toBe(before);
    expect(after).toContain('Alpha');
    expect(after).not.toContain('"Alpha"');

    expectNoPageErrors(pageErrors);
  });
});
