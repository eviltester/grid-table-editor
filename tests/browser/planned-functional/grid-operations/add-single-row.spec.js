const { test } = require('@playwright/test');
const { openApp, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('1. Grid Basic Operations', () => {
  test('Add Single Row', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await appPage.gridEditor.resetTable();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(0);
    await appPage.gridEditor.addRow();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(1);
    const [col] = await appPage.gridEditor.header.getColumnNames();
    await appPage.gridEditor.renderer.setCellTextByColumnName(col, 0, 'Test Data');
    await expect.poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName(col, 0)).toBe('Test Data');
    expectNoPageErrors(pageErrors);
  });
});
