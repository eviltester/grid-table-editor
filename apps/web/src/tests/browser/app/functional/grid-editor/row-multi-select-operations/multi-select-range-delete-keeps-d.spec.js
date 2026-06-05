const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../../../abstractions/helpers/scenario-helpers');

test.describe('8. Advanced Grid Features', () => {
  test('Multi-Select Operations - Range Delete Keeps D', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    const col = await seedRows(appPage, ['A', 'B', 'C', 'D']);

    await appPage.gridEditor.renderer.selectRowRange(0, 2);
    await expect.poll(async () => appPage.gridEditor.renderer.countSelectedRows()).toBeGreaterThanOrEqual(2);

    await appPage.gridEditor.deleteSelectedRows();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(1);
    await expect.poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName(col, 0)).toBe('D');

    expectNoPageErrors(pageErrors);
  });
});
