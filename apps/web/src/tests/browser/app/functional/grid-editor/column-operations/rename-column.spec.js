const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../../../abstractions/helpers/scenario-helpers');

test.describe('2. Column Operations', () => {
  test('Rename Column', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    const oldName = await seedRows(appPage, ['x']);

    await appPage.gridEditor.header.renameColumn(oldName, 'New Column Name');
    await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).toContain('New Column Name');

    await appPage.importExportWorkspace.setTextFromGrid();
    await expect.poll(async () => appPage.textPreviewEditor.getOutputText()).toContain('New Column Name');
    expectNoPageErrors(pageErrors);
  });

  test('Rename Column shows error when unique names enabled and target exists', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    const originalName = await seedRows(appPage, ['x']);
    const duplicateName = 'Existing Left Column';
    const gridError = appPage.gridEditor.errorStatus;

    await appPage.gridEditor.header.addColumnLeft(originalName, duplicateName);
    await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).toContain(duplicateName);
    const namesBeforeRejectedRename = await appPage.gridEditor.header.getColumnNames();

    await appPage.gridEditor.setUniqueColumnNames(true);
    await appPage.gridEditor.header.renameColumn(originalName, duplicateName);
    await expect(gridError).toBeVisible();
    await expect(gridError).toContainText(`A column with name ${duplicateName} already exists`);
    await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).toEqual(namesBeforeRejectedRename);

    expectNoPageErrors(pageErrors);
  });
});
