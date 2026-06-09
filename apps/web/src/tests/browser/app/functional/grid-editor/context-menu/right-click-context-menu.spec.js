const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../../../abstractions/helpers/scenario-helpers');

test.describe('1. Grid Basic Operations', () => {
  test('Right click context menu can add rows and sync unique column names to the toolbar', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await seedRows(appPage, ['Alpha', 'Beta']);

    const [columnName] = await appPage.gridEditor.header.getColumnNames();
    const initialRowCount = await appPage.gridEditor.renderer.countRows();

    await appPage.gridEditor.openContextMenuOnCell(columnName, 0);
    await appPage.gridEditor.contextMenuAddRow();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(initialRowCount + 1);

    await appPage.gridEditor.openContextMenuOnCell(columnName, 0);
    await appPage.gridEditor.contextMenuSetUniqueColumnNames(true);
    await expect(appPage.gridEditor.uniqueColumnNamesCheckbox).toBeChecked();
    await expect(appPage.gridEditor.contextMenu).toBeHidden();

    expectNoPageErrors(pageErrors);
  });
});
