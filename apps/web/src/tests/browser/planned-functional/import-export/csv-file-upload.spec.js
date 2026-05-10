const { test } = require('@playwright/test');
const { openApp, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');
const fs = require('fs');
const os = require('os');
const path = require('path');

test.describe('4. Import Export Basic', () => {
  test('CSV File Upload', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gtev-upload-'));
    const valid = path.join(tempDir, 'valid.csv');
    fs.writeFileSync(valid, 'C1,C2\nAlpha,1\nBeta,2\n');

    try {
      await appPage.importExportControls.uploadFile(valid);
      await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBeGreaterThanOrEqual(2);
      await appPage.importExportControls.expectProgressStatusContains('complete');

      const rowsBefore = await appPage.gridEditor.renderer.countRows();
      await appPage.importExportControls.uploadFile(path.resolve('README.md'));
      await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(rowsBefore);
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }

    expectNoPageErrors(pageErrors);
  });
});
