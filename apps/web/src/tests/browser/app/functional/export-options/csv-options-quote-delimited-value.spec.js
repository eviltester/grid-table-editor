const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../../abstractions/helpers/scenario-helpers');

test.describe('6. Export Options and Controls', () => {
  test('CSV Options Keep Quotes For Delimited Value', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await seedRows(appPage, ['A,Quoted']);

    await appPage.textPreviewEditor.selectFormat('CSV');
    await appPage.importExportWorkspace.setTextFromGrid();
    const before = await appPage.textPreviewEditor.getOutputText();
    expect(before).toContain('"A,Quoted"');

    await appPage.formatOptionsPanel.setOption('quotes', false);
    await expect(await appPage.formatOptionsPanel.isApplyEnabled()).toBeTruthy();
    await appPage.formatOptionsPanel.apply();
    await appPage.importExportWorkspace.setTextFromGrid();

    const after = await appPage.textPreviewEditor.getOutputText();
    expect(after).toContain('A,Quoted');
    expect(after).toContain('"A,Quoted"');

    expectNoPageErrors(pageErrors);
  });
});
