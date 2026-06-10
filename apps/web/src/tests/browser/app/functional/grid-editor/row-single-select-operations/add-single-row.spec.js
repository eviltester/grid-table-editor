const { test } = require('@playwright/test');
const { openApp, expectNoPageErrors, expect } = require('../../../abstractions/helpers/scenario-helpers');

test.describe('1. Grid Basic Operations', () => {
  test('Add Single Row', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await appPage.gridEditor.expectVisible();
    const before = await appPage.gridEditor.renderer.countRows();
    await appPage.gridEditor.expectTotalRows(before);
    await appPage.gridEditor.addRow();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(before + 1);
    await appPage.gridEditor.expectTotalRows(before + 1);

    const [columnName] = await appPage.gridEditor.header.getColumnNames();
    await appPage.gridEditor.renderer.setCellTextByColumnName(columnName, before, 'Test Data');
    await expect
      .poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName(columnName, before))
      .toBe('Test Data');

    expectNoPageErrors(pageErrors);
  });
});
