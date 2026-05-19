const { test } = require('@playwright/test');
const { openApp, expectNoPageErrors, expect } = require('../../abstractions/helpers/scenario-helpers');

test.describe('7. Test Data Generation', () => {
  test('Text schema syncs into the schema grid', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.expectExpanded();

    await appPage.testDataPanel.setSchemaText('First Name\nliteral(Alice)\nOrder Code\n[A-Z]{3}-\\d{2}');

    await expect.poll(async () => appPage.testDataPanel.getSchemaRowCount()).toBe(2);
    await expect.poll(async () => appPage.testDataPanel.getSchemaCell(0, 'columnName')).toBe('First Name');
    await expect.poll(async () => appPage.testDataPanel.getSchemaCell(0, 'type')).toBe('literal');
    await expect.poll(async () => appPage.testDataPanel.getSchemaCell(0, 'value')).toBe('Alice');
    await expect.poll(async () => appPage.testDataPanel.getSchemaCell(1, 'columnName')).toBe('Order Code');
    await expect.poll(async () => appPage.testDataPanel.getSchemaCell(1, 'type')).toBe('regex');
    await expect.poll(async () => appPage.testDataPanel.getSchemaCell(1, 'value')).toBe('[A-Z]{3}-\\d{2}');
    expectNoPageErrors(pageErrors);
  });

  test('Schema grid syncs into the text schema', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.expectExpanded();

    await appPage.testDataPanel.addSchemaRow();
    await expect.poll(async () => appPage.testDataPanel.getSchemaRowCount()).toBe(1);
    await appPage.testDataPanel.setSchemaCell(0, 'columnName', 'Status');
    await appPage.testDataPanel.setSchemaTypeValue(0, 'literal');
    await appPage.testDataPanel.setSchemaCell(0, 'value', 'Active');

    await expect.poll(async () => appPage.testDataPanel.getSchemaText()).toContain('Status');
    await expect.poll(async () => appPage.testDataPanel.getSchemaText()).toContain('literal(Active)');
    expectNoPageErrors(pageErrors);
  });

  test('Text schema edits after initial sync are reflected in the schema grid', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.expectExpanded();

    await appPage.testDataPanel.setSchemaText('Priority\nenum(low,medium,high)');
    await expect.poll(async () => appPage.testDataPanel.getSchemaRowCount()).toBe(1);
    await expect.poll(async () => appPage.testDataPanel.getSchemaCell(0, 'columnName')).toBe('Priority');

    await appPage.testDataPanel.setSchemaText('Priority\nenum(low,medium,high)\nEnabled\ndatatype.boolean');

    await expect.poll(async () => appPage.testDataPanel.getSchemaRowCount()).toBe(2);
    await expect.poll(async () => appPage.testDataPanel.getSchemaCell(1, 'columnName')).toBe('Enabled');
    await expect.poll(async () => appPage.testDataPanel.getSchemaCell(1, 'type')).toBe('datatype.boolean');
    await expect.poll(async () => appPage.testDataPanel.getSchemaCell(1, 'value')).toBe('');
    expectNoPageErrors(pageErrors);
  });

  test('Schema grid edits after initial sync are reflected in the text schema', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.expectExpanded();

    await appPage.testDataPanel.addSchemaRow();
    await expect.poll(async () => appPage.testDataPanel.getSchemaRowCount()).toBe(1);
    await appPage.testDataPanel.setSchemaCell(0, 'columnName', 'Code');
    await appPage.testDataPanel.setSchemaTypeValue(0, 'regex');
    await appPage.testDataPanel.setSchemaCell(0, 'value', 'CODE-\\d{3}');
    await expect.poll(async () => appPage.testDataPanel.getSchemaText()).toContain('CODE-\\d{3}');

    await appPage.testDataPanel.setSchemaCell(0, 'columnName', 'External Code');
    await appPage.testDataPanel.setSchemaTypeValue(0, 'literal');
    await appPage.testDataPanel.setSchemaCell(0, 'value', 'X-001');

    await expect.poll(async () => appPage.testDataPanel.getSchemaText()).toContain('External Code');
    await expect.poll(async () => appPage.testDataPanel.getSchemaText()).toContain('literal(X-001)');
    expectNoPageErrors(pageErrors);
  });
});
