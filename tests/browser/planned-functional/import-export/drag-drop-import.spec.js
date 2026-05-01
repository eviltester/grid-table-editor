const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');
const fs = require('fs');
const os = require('os');
const path = require('path');

test.describe('4. Import Export Basic', () => {
  test('Drag and Drop Import', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    const valid = path.join(os.tmpdir(), 'grid-table-editor-drag.csv');
    fs.writeFileSync(valid, 'Instructions\\nOne\\nTwo\\n');
    await appPage.importExportControls.uploadFile(valid);
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBeGreaterThan(0);
    expectNoPageErrors(pageErrors);
  });
});
