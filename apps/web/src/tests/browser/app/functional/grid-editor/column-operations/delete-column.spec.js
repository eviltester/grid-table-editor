const { test } = require('@playwright/test');
const { openApp, expectNoPageErrors, expect } = require('../../../abstractions/helpers/scenario-helpers');

test.describe('2. Column Operations', () => {
  test('Delete Column', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await appPage.gridEditor.resetTable();
    const [base] = await appPage.gridEditor.header.getColumnNames();
    await appPage.gridEditor.addRow();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBeGreaterThanOrEqual(1);

    await appPage.gridEditor.header.addColumnRight(base, 'ToDelete');
    await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).toContain('ToDelete');
    await appPage.gridEditor.renderer.setCellTextByColumnName('ToDelete', 0, 'gone');
    await appPage.gridEditor.renderer.setCellTextByColumnName(base, 0, 'keep');

    await appPage.gridEditor.header.deleteColumn('ToDelete');
    await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).not.toContain('ToDelete');
    await expect.poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName(base, 0)).toBe('keep');

    expectNoPageErrors(pageErrors);
  });

  test('Cannot delete the only column', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await appPage.gridEditor.resetTable();
    const [onlyColumn] = await appPage.gridEditor.header.getColumnNames();
    const gridError = appPage.gridEditor.errorStatus;

    await appPage.gridEditor.header.deleteColumn(onlyColumn);
    await expect(gridError).toContainText('Cannot Delete The Only Column');
    await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).toEqual([onlyColumn]);
    await expect.poll(async () => appPage.gridEditor.header.countColumns()).toBe(1);

    expectNoPageErrors(pageErrors);
  });
});
