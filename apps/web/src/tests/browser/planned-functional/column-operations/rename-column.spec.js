const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('2. Column Operations', () => {
  test('Rename Column', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    const oldName = await seedRows(appPage, ['x']);

    await appPage.gridEditor.header.renameColumn(oldName, 'New Column Name');
    await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).toContain('New Column Name');

    await appPage.importExportControls.setTextFromGrid();
    await expect.poll(async () => appPage.tabbedText.getOutputText()).toContain('New Column Name');
    expectNoPageErrors(pageErrors);
  });
});
