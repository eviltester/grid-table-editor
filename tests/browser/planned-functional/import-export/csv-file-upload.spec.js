const { test } = require('@playwright/test');
const { openApp, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');
const fs = require('fs');
const os = require('os');
const path = require('path');

test.describe('4. Import Export Basic', () => {
  test('CSV File Upload', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    const valid = path.join(os.tmpdir(), 'gtev-valid.csv');
    fs.writeFileSync(valid, 'C1,C2\nAlpha,1\nBeta,2\n');

    await appPage.importExportControls.uploadFile(valid);
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBeGreaterThanOrEqual(2);
    await expect.poll(async () => appPage.importExportControls.getProgressStatusText()).toContain('complete');

    const rowsBefore = await appPage.gridEditor.renderer.countRows();
    await appPage.importExportControls.uploadFile(path.resolve('README.md'));
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(rowsBefore);

    expectNoPageErrors(pageErrors);
  });
});
