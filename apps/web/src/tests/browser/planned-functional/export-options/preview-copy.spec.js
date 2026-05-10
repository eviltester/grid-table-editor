const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('6. Export Options and Controls', () => {
  test('Preview and Copy Functions', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const { appPage, pageErrors } = await openApp(page);
    await seedRows(
      appPage,
      Array.from({ length: 12 }, (_, i) => 'Row-' + (i + 1))
    );

    await appPage.importExportControls.setTextFromGrid();
    await appPage.tabbedText.getOutputText();

    await appPage.tabbedText.togglePreviewEdit(true);
    await appPage.tabbedText.expectPreviewEditLabelContains('Edit');
    const previewText = await appPage.tabbedText.getOutputText();
    expect(previewText.length).toBeGreaterThan(0);

    await appPage.tabbedText.copyButton.click();
    await expect
      .poll(async () => page.evaluate(() => navigator.clipboard.readText()))
      .toContain(previewText.split('\n')[0]);

    await appPage.tabbedText.togglePreviewEdit(true);
    await appPage.tabbedText.expectPreviewEditLabelContains('Preview');

    expectNoPageErrors(pageErrors);
  });
});
