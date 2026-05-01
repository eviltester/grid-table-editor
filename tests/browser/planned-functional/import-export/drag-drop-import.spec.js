const { test } = require('@playwright/test');
const { openApp, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');
const fs = require('fs');
const os = require('os');
const path = require('path');

test.describe('4. Import Export Basic', () => {
  test('Drag and Drop Import', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    const valid = path.join(os.tmpdir(), 'gtev-drop.csv');
    fs.writeFileSync(valid, 'Name\nOne\nTwo\n');

    await expect(appPage.importExportControls.dropZone).toBeVisible();
    await appPage.importExportControls.uploadFile(valid);
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBeGreaterThanOrEqual(2);

    const before = await appPage.gridEditor.renderer.countRows();
    await appPage.importExportControls.uploadFile(path.resolve('README.md'));
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(before);

    expectNoPageErrors(pageErrors);
  });
});
