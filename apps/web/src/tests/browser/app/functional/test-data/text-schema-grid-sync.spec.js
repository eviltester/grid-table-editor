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

    await appPage.testDataPanel.setSchemaText('Priority\nlow,medium,high');
    await expect.poll(async () => appPage.testDataPanel.getSchemaRowCount()).toBe(1);
    await expect.poll(async () => appPage.testDataPanel.getSchemaCell(0, 'columnName')).toBe('Priority');

    await appPage.testDataPanel.setSchemaText('Priority\nlow,medium,high\nEnabled\ndatatype.boolean');

    await expect.poll(async () => appPage.testDataPanel.getSchemaRowCount()).toBe(2);
    await expect.poll(async () => appPage.testDataPanel.getSchemaCell(1, 'columnName')).toBe('Enabled');
    await expect.poll(async () => appPage.testDataPanel.getSchemaCell(1, 'type')).toBe('datatype.boolean');
    await expect.poll(async () => appPage.testDataPanel.getSchemaCell(1, 'value')).toBe('');
    expectNoPageErrors(pageErrors);
  });

  test('invalid command text prompts before converting to literal rows in the app editor', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.expectExpanded();

    await appPage.testDataPanel.setSchemaText('Name\nperson.fullName');
    await expect.poll(async () => appPage.testDataPanel.getSchemaRowCount()).toBe(1);
    await expect.poll(async () => appPage.testDataPanel.getSchemaCell(0, 'type')).toBe('person.fullName');
    await expect.poll(async () => appPage.testDataPanel.getSchemaSourceType(0)).toBe('domain');

    await appPage.testDataPanel.setSchemaText('Name\nperson.fullNam');
    await appPage.testDataPanel.schemaEditor.modeToggleButton.click();
    await appPage.testDataPanel.confirmDialog.expectVisible();
    await expect(appPage.testDataPanel.confirmDialog.backdrop).toContainText(
      'Syntax errors are present that can not be edited in Schema UI. Allow editing by converting invalid definitions to literal?'
    );
    await appPage.testDataPanel.confirmDialog.cancel({ cancelLabel: /^no$/i });

    await expect.poll(async () => appPage.testDataPanel.isRowEditorMode()).toBe(false);
    await expect
      .poll(async () => appPage.testDataPanel.getSchemaErrorText())
      .toContain('Unknown keyword: person.fullNam');

    await appPage.testDataPanel.clickGenerate();
    await expect
      .poll(async () => appPage.testDataPanel.getSchemaErrorText())
      .toContain('Unknown keyword: person.fullNam');

    await appPage.testDataPanel.schemaEditor.modeToggleButton.click();
    await appPage.testDataPanel.confirmDialog.confirm({ confirmLabel: /^yes$/i });

    await expect.poll(async () => appPage.testDataPanel.isRowEditorMode()).toBe(true);
    await expect.poll(async () => appPage.testDataPanel.getSchemaSourceType(0)).toBe('literal');
    await expect.poll(async () => appPage.testDataPanel.getSchemaCell(0, 'value')).toBe('person.fullNam');

    expectNoPageErrors(pageErrors);
  });

  test('regex shorthand and literal shorthand sync into the app schema grid', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.expectExpanded();

    await appPage.testDataPanel.setSchemaText('Order Code\n[A-Z]{3}\nCity\nLondon');
    await appPage.testDataPanel.schemaEditor.modeToggleButton.click();

    await expect.poll(async () => appPage.testDataPanel.getSchemaRowCount()).toBe(2);
    await expect.poll(async () => appPage.testDataPanel.getSchemaSourceType(0)).toBe('regex');
    await expect.poll(async () => appPage.testDataPanel.getSchemaCell(0, 'value')).toBe('[A-Z]{3}');
    await expect.poll(async () => appPage.testDataPanel.getSchemaSourceType(1)).toBe('literal');
    await expect.poll(async () => appPage.testDataPanel.getSchemaCell(1, 'value')).toBe('London');

    expectNoPageErrors(pageErrors);
  });

  test('invalid enum text shows a schema error and remains in text mode when editing as schema in the app', async ({
    page,
  }) => {
    const { appPage, pageErrors } = await openApp(page);

    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.expectExpanded();

    await appPage.testDataPanel.setSchemaText('Status\ndatatype.enum(values="active,pending)');
    await appPage.testDataPanel.schemaEditor.modeToggleButton.click();

    await expect
      .poll(async () => appPage.testDataPanel.getSchemaErrorText())
      .toContain('Status failed domain validation - Invalid keyword arguments: unbalanced expression');
    await expect.poll(async () => appPage.testDataPanel.isRowEditorMode()).toBe(false);
    await expect(appPage.testDataPanel.schemaEditor.modeToggleButton).toHaveText('Edit as Schema');

    expectNoPageErrors(pageErrors);
  });

  test('invalid enum text shows a schema error and leaves the grid unchanged when generating in the app', async ({
    page,
  }) => {
    const { appPage, pageErrors } = await openApp(page);

    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.expectExpanded();

    const totalRowsBefore = await appPage.gridEditor.totalRows.textContent();
    await appPage.testDataPanel.setSchemaText('Status\ndatatype.enum()');
    await appPage.testDataPanel.clickGenerate();

    await expect
      .poll(async () => appPage.testDataPanel.getSchemaErrorText())
      .toContain('Status failed domain validation - Invalid keyword arguments: argument "values" is required');
    await expect(appPage.gridEditor.totalRows).toHaveText(totalRowsBefore || '');

    expectNoPageErrors(pageErrors);
  });

  test('domain rows with invalid params show a schema error after text mode round-trip in the app editor', async ({
    page,
  }) => {
    const { appPage, pageErrors } = await openApp(page);

    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.expectExpanded();

    await appPage.testDataPanel.addSchemaRow();
    await expect.poll(async () => appPage.testDataPanel.getSchemaRowCount()).toBe(1);
    await appPage.testDataPanel.setSchemaCell(0, 'columnName', 'Name');
    await appPage.testDataPanel.setSchemaTypeValue(0, 'person.fullName');
    await appPage.testDataPanel.setSchemaCell(0, 'params', '(10)');

    await appPage.testDataPanel.setSchemaTextMode(true);
    await appPage.testDataPanel.schemaEditor.modeToggleButton.click();

    await expect
      .poll(async () => appPage.testDataPanel.getSchemaErrorText())
      .toContain('Name failed domain validation');
    await expect.poll(async () => appPage.testDataPanel.isRowEditorMode()).toBe(false);

    expectNoPageErrors(pageErrors);
  });

  test('debounced semantic validation appears after typing stops in the app editor', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.expectExpanded();

    await appPage.testDataPanel.addSchemaRow();
    await expect.poll(async () => appPage.testDataPanel.getSchemaRowCount()).toBe(1);
    await appPage.testDataPanel.setSchemaCell(0, 'columnName', 'Name');
    await appPage.testDataPanel.setSchemaTypeValue(0, 'person.fullName');

    const paramsInput = appPage.testDataPanel.getSchemaRow(0).locator('input[data-field="params"]');
    await paramsInput.fill('(10)');

    await expect
      .poll(async () => await appPage.testDataPanel.getSchemaValidationMessage(0).textContent(), { timeout: 2500 })
      .toContain('invalid domain params');

    expectNoPageErrors(pageErrors);
  });

  test('row validation clears when name editing blurs into the next field in the app editor', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.expectExpanded();

    await appPage.testDataPanel.addSchemaRow();
    await expect.poll(async () => appPage.testDataPanel.getSchemaRowCount()).toBe(1);
    const row = appPage.testDataPanel.getSchemaRow(0);
    await appPage.testDataPanel.setSchemaTypeValue(0, 'literal');
    await appPage.testDataPanel.setSchemaCell(0, 'value', 'Active');
    await appPage.testDataPanel.clickGenerate();
    await expect(row.locator('.shared-schema-row-validation')).toContainText('column name is required');

    const nameInput = row.locator('input[data-field="name"]');
    const valueInput = row.locator('input[data-field="value"]');
    await nameInput.fill('Status');
    await valueInput.click();

    await expect(row.locator('.shared-schema-row-validation')).toHaveCount(0);
    expectNoPageErrors(pageErrors);
  });

  test('domain params without brackets are normalized and preserved in the app editor', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.expectExpanded();

    await appPage.testDataPanel.addSchemaRow();
    await expect.poll(async () => appPage.testDataPanel.getSchemaRowCount()).toBe(1);
    await appPage.testDataPanel.setSchemaCell(0, 'columnName', 'Code');
    await appPage.testDataPanel.setSchemaTypeValue(0, 'string.alpha');
    await appPage.testDataPanel.setSchemaCell(0, 'params', 'length=4');

    await appPage.testDataPanel.setSchemaTextMode(true);
    await expect.poll(async () => appPage.testDataPanel.getSchemaText()).toContain('string.alpha(length=4)');
    await appPage.testDataPanel.setSchemaTextMode(false);

    await expect.poll(async () => appPage.testDataPanel.getSchemaCell(0, 'type')).toBe('string.alpha');
    await expect.poll(async () => appPage.testDataPanel.getSchemaSourceType(0)).toBe('domain');
    await expect.poll(async () => appPage.testDataPanel.getSchemaCell(0, 'params')).toBe('(length=4)');

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

  test('schema rows can be dragged to the top and bottom in the app editor', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.expectExpanded();

    await appPage.testDataPanel.setSchemaText('A\nliteral(a)\n\nB\nliteral(b)\n\nC\nliteral(c)\n\nD\nliteral(d)');
    await expect.poll(async () => appPage.testDataPanel.getSchemaRowCount()).toBe(4);

    await appPage.testDataPanel.schemaEditor.dragRowToIndex(3, 0, { placement: 'before' });
    await expect.poll(async () => appPage.testDataPanel.getSchemaCell(0, 'columnName')).toBe('D');
    await expect.poll(async () => appPage.testDataPanel.getSchemaCell(1, 'columnName')).toBe('A');

    await appPage.testDataPanel.schemaEditor.dragRowToIndex(0, 3, { placement: 'after' });
    await expect.poll(async () => appPage.testDataPanel.getSchemaCell(0, 'columnName')).toBe('A');
    await expect.poll(async () => appPage.testDataPanel.getSchemaCell(3, 'columnName')).toBe('D');

    await expect
      .poll(async () => appPage.testDataPanel.getSchemaText())
      .toContain('A\nliteral(a)\nB\nliteral(b)\nC\nliteral(c)\nD\nliteral(d)');
    expectNoPageErrors(pageErrors);
  });

  test('switching enum rows to domain datatype.enum preserves the enum params in the app editor', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.expectExpanded();

    await appPage.testDataPanel.addSchemaRow();
    await expect.poll(async () => appPage.testDataPanel.getSchemaRowCount()).toBe(1);
    await appPage.testDataPanel.setSchemaCell(0, 'columnName', 'Status');
    await appPage.testDataPanel.setSchemaTypeValue(0, 'enum', { assertSchemaTextIncludesType: false });
    await appPage.testDataPanel.setSchemaCell(0, 'value', 'active,inactive,pending');

    await appPage.testDataPanel.setSchemaTypeValue(0, 'datatype.enum', { assertSchemaTextIncludesType: false });

    await expect.poll(async () => appPage.testDataPanel.getSchemaCell(0, 'type')).toBe('datatype.enum');
    await expect.poll(async () => appPage.testDataPanel.getSchemaCell(0, 'value')).toBe('active,inactive,pending');
    await expect
      .poll(async () => appPage.testDataPanel.getSchemaText())
      .toContain('enum("active","inactive","pending")');

    expectNoPageErrors(pageErrors);
  });

  test('empty schema text can switch back to schema mode without locking', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.expectExpanded();

    await appPage.testDataPanel.setSchemaText('');
    await appPage.testDataPanel.setSchemaTextMode(false);

    await expect.poll(async () => appPage.testDataPanel.isRowEditorMode()).toBe(true);
    await expect
      .poll(async () =>
        (await appPage.testDataPanel.getSchemaErrorText()).includes('No rules defined. Provide column/rule pairs.')
      )
      .toBe(false);
    expectNoPageErrors(pageErrors);
  });
});
