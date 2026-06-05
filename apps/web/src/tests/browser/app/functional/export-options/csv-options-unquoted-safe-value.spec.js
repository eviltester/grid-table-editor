const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../../abstractions/helpers/scenario-helpers');

test.describe('6. Export Options and Controls', () => {
  test('CSV Options Unquote Safe Value', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await seedRows(appPage, ['Alpha']);

    await appPage.textPreviewEditor.selectFormat('CSV');
    await appPage.importExportWorkspace.setTextFromGrid();
    const before = await appPage.textPreviewEditor.getOutputText();
    expect(before).toContain('"Alpha"');

    await appPage.formatOptionsPanel.setOption('quotes', false);
    await expect(await appPage.formatOptionsPanel.isApplyEnabled()).toBeTruthy();
    await appPage.formatOptionsPanel.apply();
    await appPage.importExportWorkspace.setTextFromGrid();

    const after = await appPage.textPreviewEditor.getOutputText();
    expect(after).not.toBe(before);
    expect(after).toContain('Alpha');
    expect(after).not.toContain('"Alpha"');

    expectNoPageErrors(pageErrors);
  });
});
