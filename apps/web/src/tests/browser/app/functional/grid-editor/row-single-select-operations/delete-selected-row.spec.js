const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../../../abstractions/helpers/scenario-helpers');

test.describe('1. Grid Basic Operations', () => {
  test('Delete Rows', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await seedRows(appPage, ['A', 'B', 'C', 'D']);

    await appPage.gridEditor.selectRow(1);
    await expect.poll(async () => appPage.gridEditor.renderer.countSelectedRows()).toBe(1);
    const beforeSingleDelete = await appPage.gridEditor.renderer.countRows();
    await appPage.gridEditor.deleteSelectedRows();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(beforeSingleDelete - 1);

    await appPage.gridEditor.selectRows([0, 1]);
    await expect.poll(async () => appPage.gridEditor.renderer.countSelectedRows()).toBe(2);
    const beforeMultiDelete = await appPage.gridEditor.renderer.countRows();
    await appPage.gridEditor.deleteSelectedRows();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(beforeMultiDelete - 2);

    expectNoPageErrors(pageErrors);
  });
});
