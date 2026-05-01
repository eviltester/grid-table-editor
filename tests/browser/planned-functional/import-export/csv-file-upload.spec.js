const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');
const fs = require('fs');
const os = require('os');
const path = require('path');

test.describe('4. Import Export Basic', () => {
  test('CSV File Upload', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    const valid = path.join(os.tmpdir(), 'grid-table-editor-valid.csv');
    fs.writeFileSync(valid, 'Instructions\\nAlpha\\nBeta\\n');
    await appPage.importExportControls.uploadFile(valid);
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBeGreaterThan(0);
    const before = await appPage.gridEditor.renderer.countRows();
    const invalid = path.resolve('README.md');
    await appPage.importExportControls.uploadFile(invalid);
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(before);
    expectNoPageErrors(pageErrors);
  });
});
