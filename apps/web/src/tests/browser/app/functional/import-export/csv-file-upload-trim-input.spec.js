const { test } = require('@playwright/test');
const { openApp, expectNoPageErrors, expect } = require('../../abstractions/helpers/scenario-helpers');
const fs = require('fs');
const os = require('os');
const path = require('path');

test.describe('4. Import Export Basic', () => {
  test('CSV file upload can trim selected imported fields', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gtev-upload-trim-'));
    const valid = path.join(tempDir, 'trimmed.csv');
    fs.writeFileSync(valid, 'Name,Role\n  Alice  ,  Engineer  \n');

    try {
      await appPage.importExportWorkspace.setTrimInputFieldsCsv('Name');
      await appPage.importExportWorkspace.uploadFile(valid);
      await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBeGreaterThanOrEqual(1);
      await appPage.importExportWorkspace.expectProgressStatusContains('Import complete');

      await appPage.importExportWorkspace.setTextFromGrid();
      await expect.poll(async () => appPage.textPreviewEditor.getOutputText()).toContain('"Alice"');
      await expect.poll(async () => appPage.textPreviewEditor.getOutputText()).toContain('"  Engineer  "');
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }

    expectNoPageErrors(pageErrors);
  });
});
