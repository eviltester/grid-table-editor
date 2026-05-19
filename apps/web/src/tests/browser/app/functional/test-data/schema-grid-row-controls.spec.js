const { test } = require('@playwright/test');
const { openApp, expectNoPageErrors, expect } = require('../../abstractions/helpers/scenario-helpers');

test.describe('7. Test Data Generation', () => {
  test('Add Column adds an editable schema row', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.expectExpanded();

    const beforeCount = await appPage.testDataPanel.getSchemaRowCount();
    await appPage.testDataPanel.addSchemaRow();
    await expect.poll(async () => appPage.testDataPanel.getSchemaRowCount()).toBe(beforeCount + 1);

    const newRowIndex = beforeCount;
    await appPage.testDataPanel.setSchemaCell(newRowIndex, 'columnName', 'New Column');
    await appPage.testDataPanel.setSchemaTypeValue(newRowIndex, 'literal');

    const schemaText = await appPage.testDataPanel.getSchemaText();
    expect(schemaText).toContain('New Column');
    expect(schemaText).toContain('literal()');
    expectNoPageErrors(pageErrors);
  });

  test('Delete Selected removes selected schema row', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.expectExpanded();

    const initialCount = await appPage.testDataPanel.getSchemaRowCount();
    await appPage.testDataPanel.addSchemaRow();
    await expect.poll(async () => appPage.testDataPanel.getSchemaRowCount()).toBe(initialCount + 1);
    await appPage.testDataPanel.setSchemaCell(initialCount, 'columnName', 'Delete Me');
    await appPage.testDataPanel.setSchemaTypeValue(initialCount, 'literal');

    await appPage.testDataPanel.selectSchemaRow(initialCount);
    await appPage.testDataPanel.deleteSelectedSchemaRows();

    await expect.poll(async () => appPage.testDataPanel.getSchemaRowCount()).toBe(initialCount);
    const schemaText = await appPage.testDataPanel.getSchemaText();
    expect(schemaText).not.toContain('Delete Me');
    expectNoPageErrors(pageErrors);
  });
});
