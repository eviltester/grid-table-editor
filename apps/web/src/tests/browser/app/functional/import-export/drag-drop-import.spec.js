const { test } = require('@playwright/test');
const { openApp, expectNoPageErrors, expect } = require('../../abstractions/helpers/scenario-helpers');
const fs = require('fs');
const os = require('os');
const path = require('path');

test.describe('4. Import Export Basic', () => {
  test('Drag and Drop Import', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gtev-drop-'));
    const valid = path.join(tempDir, 'drop.csv');
    fs.writeFileSync(valid, 'Name\nOne\nTwo\n');

    try {
      await expect(appPage.importExportWorkspace.dropZone).toBeVisible();
      await appPage.importExportWorkspace.uploadFile(valid);
      await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBeGreaterThanOrEqual(2);
      await appPage.importExportWorkspace.expectProgressStatusContains('Import complete');
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }

    expectNoPageErrors(pageErrors);
  });
});
