const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../../abstractions/helpers/scenario-helpers');

test.describe('6. Export Options and Controls', () => {
  test('Preview and Copy Functions', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const { appPage, pageErrors } = await openApp(page);
    await seedRows(
      appPage,
      Array.from({ length: 12 }, (_, i) => 'Row-' + (i + 1))
    );

    await appPage.importExportWorkspace.setTextFromGrid();
    await appPage.textPreviewEditor.getOutputText();

    await appPage.textPreviewEditor.togglePreviewEdit(true);
    await appPage.textPreviewEditor.expectPreviewEditLabelContains('Edit');
    const previewText = await appPage.textPreviewEditor.getOutputText();
    expect(previewText.length).toBeGreaterThan(0);

    await appPage.textPreviewEditor.copyButton.click();
    await expect
      .poll(async () => page.evaluate(() => navigator.clipboard.readText()))
      .toContain(previewText.split('\n')[0]);

    await appPage.textPreviewEditor.togglePreviewEdit(true);
    await appPage.textPreviewEditor.expectPreviewEditLabelContains('Preview');

    expectNoPageErrors(pageErrors);
  });
});
