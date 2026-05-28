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

  test('invalid domain command text preserves the domain row type in the app editor', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.expectExpanded();

    await appPage.testDataPanel.setSchemaText('Name\nperson.fullName');
    await expect.poll(async () => appPage.testDataPanel.getSchemaRowCount()).toBe(1);
    await expect.poll(async () => appPage.testDataPanel.getSchemaCell(0, 'type')).toBe('person.fullName');
    await expect
      .poll(async () =>
        appPage.testDataPanel.page
          .locator('#testDataSchemaRows .generator-schema-row')
          .first()
          .locator('select[data-field="sourceType"]')
          .inputValue()
      )
      .toBe('domain');

    await appPage.testDataPanel.setSchemaText('Name\nperson.fullNam');

    await expect.poll(async () => appPage.testDataPanel.getSchemaCell(0, 'type')).toBe('person.fullNam');
    await expect
      .poll(async () =>
        appPage.testDataPanel.page
          .locator('#testDataSchemaRows .generator-schema-row')
          .first()
          .locator('select[data-field="sourceType"]')
          .inputValue()
      )
      .toBe('domain');

    await expect(appPage.testDataPanel.page.locator('#testDataSchemaRows .generator-schema-row').first()).toHaveClass(
      /generator-schema-row-invalid/
    );

    await appPage.testDataPanel.clickGenerate();
    await expect
      .poll(async () => appPage.testDataPanel.getSchemaErrorText())
      .toContain('Row 1: unknown domain command "person.fullNam".');

    expectNoPageErrors(pageErrors);
  });

  test('domain rows with invalid params stay domain after text mode round-trip in the app editor', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.expectExpanded();

    await appPage.testDataPanel.addSchemaRow();
    await expect.poll(async () => appPage.testDataPanel.getSchemaRowCount()).toBe(1);
    await appPage.testDataPanel.setSchemaCell(0, 'columnName', 'Name');
    await appPage.testDataPanel.setSchemaTypeValue(0, 'person.fullName');
    await appPage.testDataPanel.setSchemaCell(0, 'params', '(10)');

    await appPage.testDataPanel.setSchemaTextMode(true);
    await appPage.testDataPanel.setSchemaTextMode(false);

    await expect.poll(async () => appPage.testDataPanel.getSchemaCell(0, 'type')).toBe('person.fullName');
    await expect
      .poll(async () =>
        appPage.testDataPanel.page
          .locator('#testDataSchemaRows .generator-schema-row')
          .first()
          .locator('select[data-field="sourceType"]')
          .inputValue()
      )
      .toBe('domain');
    await expect.poll(async () => appPage.testDataPanel.getSchemaCell(0, 'params')).toBe('(10)');
    await expect(
      appPage.testDataPanel.page
        .locator('#testDataSchemaRows .generator-schema-row')
        .first()
        .locator('.generator-schema-row-validation')
    ).toContainText('invalid domain params');

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

    const paramsInput = appPage.testDataPanel.page
      .locator('#testDataSchemaRows .generator-schema-row')
      .first()
      .locator('input[data-field="params"]');
    await paramsInput.fill('(10)');

    await expect
      .poll(
        async () =>
          await appPage.testDataPanel.page
            .locator('#testDataSchemaRows .generator-schema-row')
            .first()
            .locator('.generator-schema-row-validation')
            .textContent(),
        { timeout: 2500 }
      )
      .toContain('invalid domain params');

    expectNoPageErrors(pageErrors);
  });

  test('row validation clears when name editing blurs into the next field in the app editor', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.expectExpanded();

    await appPage.testDataPanel.addSchemaRow();
    await expect.poll(async () => appPage.testDataPanel.getSchemaRowCount()).toBe(1);
    const row = appPage.testDataPanel.page.locator('#testDataSchemaRows .generator-schema-row').first();
    await appPage.testDataPanel.setSchemaTypeValue(0, 'literal');
    await appPage.testDataPanel.setSchemaCell(0, 'value', 'Active');
    await appPage.testDataPanel.clickGenerate();
    await expect(row.locator('.generator-schema-row-validation')).toContainText('column name is required');

    const nameInput = row.locator('input[data-field="name"]');
    const valueInput = row.locator('input[data-field="value"]');
    await nameInput.fill('Status');
    await valueInput.click();

    await expect(row.locator('.generator-schema-row-validation')).toHaveCount(0);
    expectNoPageErrors(pageErrors);
  });

  test('domain params without brackets are normalized and preserved in the app editor', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.expectExpanded();

    await appPage.testDataPanel.addSchemaRow();
    await expect.poll(async () => appPage.testDataPanel.getSchemaRowCount()).toBe(1);
    await appPage.testDataPanel.setSchemaCell(0, 'columnName', 'Phone');
    await appPage.testDataPanel.setSchemaTypeValue(0, 'phone.number');
    await appPage.testDataPanel.setSchemaCell(0, 'params', 'style=13');

    await appPage.testDataPanel.setSchemaTextMode(true);
    await expect.poll(async () => appPage.testDataPanel.getSchemaText()).toContain('phone.number(style=13)');
    await appPage.testDataPanel.setSchemaTextMode(false);

    await expect.poll(async () => appPage.testDataPanel.getSchemaCell(0, 'type')).toBe('phone.number');
    await expect
      .poll(async () =>
        appPage.testDataPanel.page
          .locator('#testDataSchemaRows .generator-schema-row')
          .first()
          .locator('select[data-field="sourceType"]')
          .inputValue()
      )
      .toBe('domain');
    await expect.poll(async () => appPage.testDataPanel.getSchemaCell(0, 'params')).toBe('(style=13)');

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
    await expect.poll(async () => appPage.testDataPanel.getSchemaText()).toContain('enum(active,inactive,pending)');

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
