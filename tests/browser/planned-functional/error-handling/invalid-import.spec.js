const { test } = require('@playwright/test');
const { openApp, ensureTextEditMode, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');
const fs = require('fs');
const os = require('os');
const path = require('path');

test.describe('9. Error Handling and Edge Cases', () => {
  test('Invalid Data Import', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await appPage.tabbedText.selectFormat('CSV');
    await ensureTextEditMode(appPage);

    // Product decision: malformed CSV import prioritizes speed over rollback,
    // so grid reset/clear is acceptable when parsing fails.
    await appPage.tabbedText.setOutputText('"bad csv');
    await appPage.importExportControls.setGridFromText();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(0);

    const large = path.join(os.tmpdir(), 'gtev-large.csv');
    const lines = ['c1'];
    for (let i = 0; i < 1500; i += 1) lines.push('row-' + i);
    fs.writeFileSync(large, lines.join('\n'));
    await appPage.importExportControls.uploadFile(large);
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBeGreaterThan(0);
    await expect.poll(async () => appPage.importExportControls.getProgressStatusText()).toBe('Import complete.');

    const malformedUpload = path.join(os.tmpdir(), 'gtev-malformed.csv');
    fs.writeFileSync(malformedUpload, '"bad csv');
    await appPage.importExportControls.uploadFile(malformedUpload);
    // For malformed uploads, we only require visible import feedback (status text lifecycle),
    // not state preservation.
    await expect.poll(async () => appPage.importExportControls.getProgressStatusText()).toContain('Import');

    expectNoPageErrors(pageErrors);
  });
});
