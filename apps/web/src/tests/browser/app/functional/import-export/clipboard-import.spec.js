const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../../abstractions/helpers/scenario-helpers');

test.describe('4. Import Export Basic', () => {
  test('From Clipboard imports copied preview text back into the grid', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const { appPage, pageErrors } = await openApp(page);

    await seedRows(appPage, ['Alpha', 'Beta', 'Gamma']);
    await appPage.textPreviewEditor.selectFormat('CSV');
    await appPage.importExportWorkspace.setTextFromGrid();

    const previewText = await appPage.textPreviewEditor.getOutputText();
    await appPage.textPreviewEditor.copyButton.click();
    await expect.poll(async () => page.evaluate(() => navigator.clipboard.readText())).toContain('Alpha');

    await appPage.gridEditor.resetTable();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(0);

    await appPage.importExportWorkspace.importFromClipboard();

    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(3);
    await expect.poll(async () => appPage.textPreviewEditor.getOutputText()).toContain('Alpha');
    await expect.poll(async () => appPage.importExportWorkspace.getProgressStatusText()).toBe('Import complete.');
    expect(previewText.length).toBeGreaterThan(0);

    expectNoPageErrors(pageErrors);
  });
});
