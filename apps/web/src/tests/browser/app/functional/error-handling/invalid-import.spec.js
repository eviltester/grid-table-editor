const { test } = require('@playwright/test');
const {
  openApp,
  ensureTextEditMode,
  expectNoPageErrors,
  expect,
} = require('../../abstractions/helpers/scenario-helpers');
const fs = require('fs');
const os = require('os');
const path = require('path');

test.describe('9. Error Handling and Edge Cases', () => {
  test('Invalid Data Import', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gtev-invalid-import-'));

    try {
      await appPage.textPreviewEditor.selectFormat('CSV');
      await ensureTextEditMode(appPage);

      // Product decision: malformed CSV import prioritizes speed over rollback,
      // so grid reset/clear is acceptable when parsing fails.
      await appPage.textPreviewEditor.setOutputText('"bad csv');
      await appPage.importExportWorkspace.setGridFromText();
      await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(0);

      const large = path.join(tempDir, 'large.csv');
      const lines = ['c1'];
      for (let i = 0; i < 1500; i += 1) lines.push('row-' + i);
      fs.writeFileSync(large, lines.join('\n'));
      await appPage.importExportWorkspace.uploadFile(large);
      await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBeGreaterThan(0);
      await appPage.importExportWorkspace.expectProgressStatusContains('Import complete.');

      const malformedUpload = path.join(tempDir, 'malformed.csv');
      fs.writeFileSync(malformedUpload, '"bad csv');
      const rowsBeforeMalformedUpload = await appPage.gridEditor.renderer.countRows();
      await appPage.importExportWorkspace.uploadFile(malformedUpload);
      // For malformed uploads, product permits fast-fail without rollback/preservation.
      // Assert an upload-driven outcome (grid reset), not stale status text.
      expect(rowsBeforeMalformedUpload).toBeGreaterThan(0);
      await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(0);
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }

    expectNoPageErrors(pageErrors);
  });
});
