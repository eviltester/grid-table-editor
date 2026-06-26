const { test } = require('@playwright/test');
const { openGenerator, expectNoPageErrors, expect } = require('../abstractions/helpers/scenario-helpers');

async function getSchemaRowNames(generatorPage) {
  const count = await generatorPage.schema.getRowCount();
  const names = [];
  for (let index = 0; index < count; index += 1) {
    names.push(await generatorPage.schema.getRowName(index));
  }
  return names;
}

function expectOrderedSubstrings(text, values) {
  let previousIndex = -1;
  for (const value of values) {
    const nextIndex = text.indexOf(value, previousIndex + 1);
    expect(nextIndex).toBeGreaterThan(previousIndex);
    previousIndex = nextIndex;
  }
}

test.describe('Generator Schema Editing', () => {
  test('can edit as text then edit as schema', async ({ page }) => {
    const { generatorPage, pageErrors } = await openGenerator(page);

    await generatorPage.schema.setSchemaText('First Name\nliteral(Alice)\n\nStatus\nactive,inactive');
    await generatorPage.schema.setTextMode(false);

    await expect(generatorPage.schema.rows).toHaveCount(2);
    await expect(generatorPage.schema.row(0).locator('input[data-field="name"]')).toHaveValue('First Name');
    await expect(generatorPage.schema.row(0).locator('select[data-field="sourceType"]')).toHaveValue('literal');
    await expect(generatorPage.schema.row(0).locator('input[data-field="value"]')).toHaveValue('Alice');
    await expect(generatorPage.schema.row(1).locator('input[data-field="name"]')).toHaveValue('Status');
    await expect(generatorPage.schema.row(1).locator('select[data-field="sourceType"]')).toHaveValue('enum');
    await expect(generatorPage.schema.row(1).locator('input[data-field="value"]')).toHaveValue('active,inactive');

    expectNoPageErrors(pageErrors);
  });

  test('can edit as schema then edit as text', async ({ page }) => {
    const { generatorPage, pageErrors } = await openGenerator(page);

    await generatorPage.schema.setTextMode(false);
    await generatorPage.schema.setRowName(0, 'First Name');
    await generatorPage.schema.setRowSourceType(0, 'literal');
    await generatorPage.schema.setRowValue(0, 'Alice');

    await generatorPage.schema.addField();
    await expect(generatorPage.schema.rows).toHaveCount(2);

    await generatorPage.schema.setRowName(1, 'Last Name');
    await generatorPage.schema.setRowSourceType(1, 'literal');
    await generatorPage.schema.setRowValue(1, 'Smith');

    const schemaText = await generatorPage.schema.getSchemaText();
    expect(schemaText).toContain('First Name');
    expect(schemaText).toContain('literal(Alice)');
    expect(schemaText).toContain('Last Name');
    expect(schemaText).toContain('literal(Smith)');

    expectNoPageErrors(pageErrors);
  });

  test('switching enum rows to domain datatype.enum preserves the enum params in the generator editor', async ({
    page,
  }) => {
    const { generatorPage, pageErrors } = await openGenerator(page);

    await generatorPage.schema.setTextMode(false);
    await generatorPage.schema.setRowName(0, 'Status');
    await generatorPage.schema.setRowSourceType(0, 'enum');
    await generatorPage.schema.setRowValue(0, 'active,inactive,pending');

    await generatorPage.schema.editor.setRowTypeValue(0, 'datatype.enum');

    await expect(generatorPage.schema.row(0).locator('[data-action="pick-command"]')).toHaveText('datatype.enum');
    await expect(generatorPage.schema.row(0).locator('input[data-field="params"]')).toHaveValue(
      'active,inactive,pending'
    );
    await expect
      .poll(async () => generatorPage.schema.getSchemaText())
      .toContain('enum("active","inactive","pending")');

    expectNoPageErrors(pageErrors);
  });

  test('method picker keeps PageDown from scrolling the generator page background', async ({ page }) => {
    const { generatorPage, pageErrors } = await openGenerator(page);

    await page.keyboard.press('Home');
    await expect.poll(async () => page.evaluate(() => window.scrollY)).toBe(0);

    await generatorPage.schema.setTextMode(false);
    await generatorPage.schema.setRowSourceType(0, 'domain');
    await generatorPage.schema.editor.dismissOpenHelpTooltips();
    await generatorPage.schema.row(0).locator('[data-action="pick-command"]').click();
    await generatorPage.schema.editor.methodPicker.expectOpen();

    const scrollBeforePageDown = await page.evaluate(() => window.scrollY);
    await page.keyboard.press('PageDown');

    await expect.poll(async () => page.evaluate(() => window.scrollY)).toBe(scrollBeforePageDown);

    await page.keyboard.press('Escape');
    await expect(generatorPage.schema.editor.methodPicker.overlay).toHaveCount(0);
    expectNoPageErrors(pageErrors);
  });

  test('invalid domain command text preserves the domain row type in the generator editor', async ({ page }) => {
    const { generatorPage, pageErrors } = await openGenerator(page);

    await generatorPage.schema.setSchemaText('Name\nperson.fullName');
    await generatorPage.schema.setTextMode(false);

    await expect(generatorPage.schema.rows).toHaveCount(1);
    await expect(generatorPage.schema.row(0).locator('select[data-field="sourceType"]')).toHaveValue('domain');
    await expect(generatorPage.schema.row(0).locator('[data-action="pick-command"]')).toHaveText('person.fullName');

    await generatorPage.schema.setSchemaText('Name\nperson.fullNam');
    await generatorPage.schema.setTextMode(false);

    await expect(generatorPage.schema.row(0).locator('select[data-field="sourceType"]')).toHaveValue('domain');
    await expect(generatorPage.schema.row(0).locator('[data-action="pick-command"]')).toHaveText('person.fullNam');
    await expect(generatorPage.schema.row(0)).toHaveClass(/shared-schema-row-invalid/);
    await expect(generatorPage.schema.row(0).locator('.shared-schema-row-validation')).toContainText(
      'Row 1: unknown domain command "person.fullNam".'
    );

    await generatorPage.preview.clickPreview();
    await expect(generatorPage.schema.errorStatus).toContainText('Row 1: unknown domain command "person.fullNam".');

    expectNoPageErrors(pageErrors);
  });

  test('invalid enum text shows a schema error and remains in text mode when editing as schema', async ({ page }) => {
    const { generatorPage, pageErrors } = await openGenerator(page);

    await generatorPage.schema.setSchemaText('Status\ndatatype.enum(values="active,pending)');
    await generatorPage.schema.modeToggleButton.click();

    await expect(generatorPage.schema.errorStatus).toContainText(
      'Status failed domain validation - Invalid keyword arguments: unbalanced expression'
    );
    await expect.poll(async () => generatorPage.schema.editor.isRowEditorMode()).toBe(false);
    await expect(generatorPage.schema.modeToggleButton).toHaveText('Edit as Schema');

    expectNoPageErrors(pageErrors);
  });

  test('invalid enum text shows a schema error when previewing generator data', async ({ page }) => {
    const { generatorPage, pageErrors } = await openGenerator(page);

    await generatorPage.schema.setSchemaText('Status\ndatatype.enum(values="")');
    await generatorPage.preview.clickPreview();

    await expect(generatorPage.schema.errorStatus).toContainText(
      'Status failed domain validation - Invalid keyword arguments: argument "values" is required'
    );
    await expect.poll(async () => generatorPage.preview.getOutputPreviewText()).toBe('');

    expectNoPageErrors(pageErrors);
  });

  test('invalid enum text shows a schema error when generating data', async ({ page }) => {
    const { generatorPage, pageErrors } = await openGenerator(page);

    await generatorPage.schema.setSchemaText('Status\ndatatype.enum()');
    await generatorPage.generateOptions.clickGenerateData();

    await expect(generatorPage.schema.errorStatus).toContainText(
      'Status failed domain validation - Invalid keyword arguments: argument "values" is required'
    );

    expectNoPageErrors(pageErrors);
  });

  test('schema help shows tippy tooltip content for faker and literal', async ({ page }) => {
    const { generatorPage, pageErrors } = await openGenerator(page);

    await generatorPage.schema.setTextMode(false);
    await generatorPage.schema.setRowSourceType(0, 'faker');
    const helpIcon = generatorPage.page.locator('[data-field="faker-doc-link"]').first();

    await helpIcon.hover();
    await expect(
      generatorPage.page
        .locator('.tippy-content')
        .filter({ hasText: 'Faker helper commands allow use of more complex generation than the domain commands' })
        .filter({ hasText: 'helpers.rangeToNumber({ min: 1, max: 10 })' })
    ).toBeVisible();

    await generatorPage.schema.setRowSourceType(0, 'literal');
    await generatorPage.page.locator('[data-field="faker-doc-link"]').first().hover();
    await expect(
      generatorPage.page.locator('.tippy-content').filter({ hasText: 'Literal data repeats the exact text' })
    ).toBeVisible();

    expectNoPageErrors(pageErrors);
  });

  test('domain rows with invalid params show a schema error after text mode round-trip in the generator editor', async ({
    page,
  }) => {
    const { generatorPage, pageErrors } = await openGenerator(page);

    await generatorPage.schema.setTextMode(false);
    await generatorPage.schema.setRowName(0, 'Name');
    await generatorPage.schema.editor.setRowTypeValue(0, 'person.fullName');
    await generatorPage.schema.editor.setRowField(0, 'params', '(10)');

    await generatorPage.schema.setTextMode(true);
    await generatorPage.schema.modeToggleButton.click();

    await expect(generatorPage.schema.errorStatus).toContainText('Name failed domain validation');
    await expect.poll(async () => generatorPage.schema.editor.isRowEditorMode()).toBe(false);

    expectNoPageErrors(pageErrors);
  });

  test('focus change triggers semantic validation in the generator editor', async ({ page }) => {
    const { generatorPage, pageErrors } = await openGenerator(page);

    await generatorPage.schema.setTextMode(false);
    await generatorPage.schema.setRowName(0, 'Name');
    await generatorPage.schema.editor.setRowTypeValue(0, 'person.fullName');

    const paramsInput = generatorPage.schema.row(0).locator('input[data-field="params"]');
    await paramsInput.fill('(10)');
    await generatorPage.schema.row(0).locator('input[data-field="name"]').click();

    await expect(generatorPage.schema.row(0).locator('.shared-schema-row-validation')).toContainText(
      'invalid domain params',
      { timeout: 2000 }
    );

    expectNoPageErrors(pageErrors);
  });

  test('row validation clears when name editing blurs into the next field in the generator editor', async ({
    page,
  }) => {
    const { generatorPage, pageErrors } = await openGenerator(page);

    const row = generatorPage.page.locator('.shared-schema-row').first();
    await generatorPage.schema.setRowSourceType(0, 'literal');
    await generatorPage.schema.setRowValue(0, 'Active');
    await generatorPage.preview.clickPreview();
    await expect(row.locator('.shared-schema-row-validation')).toContainText('column name is required');

    const nameInput = row.locator('input[data-field="name"]');
    const valueInput = row.locator('input[data-field="value"]');
    await nameInput.fill('Status');
    await valueInput.click();

    await expect(row.locator('.shared-schema-row-validation')).toHaveCount(0);
    expectNoPageErrors(pageErrors);
  });

  test('domain params without brackets are normalized and preserved in the generator editor', async ({ page }) => {
    const { generatorPage, pageErrors } = await openGenerator(page);

    await generatorPage.schema.setTextMode(false);
    await generatorPage.schema.setRowName(0, 'Phone');
    await generatorPage.schema.editor.setRowTypeValue(0, 'string.alpha');
    await generatorPage.schema.editor.setRowField(0, 'params', 'length=4');

    await generatorPage.schema.setTextMode(true);
    await expect.poll(async () => generatorPage.schema.getSchemaText()).toContain('string.alpha(length=4)');
    await generatorPage.schema.setTextMode(false);

    await expect(generatorPage.schema.row(0).locator('select[data-field="sourceType"]')).toHaveValue('domain');
    await expect(generatorPage.schema.row(0).locator('[data-action="pick-command"]')).toHaveText('string.alpha');
    await expect(generatorPage.schema.row(0).locator('input[data-field="params"]')).toHaveValue('(length=4)');

    expectNoPageErrors(pageErrors);
  });

  test('documented command params can be edited through the guided params dialog', async ({ page }) => {
    const { generatorPage, pageErrors } = await openGenerator(page);

    await generatorPage.schema.setTextMode(false);
    await generatorPage.schema.setRowName(0, 'Status');
    await generatorPage.schema.editor.setRowTypeValue(0, 'datatype.enum');
    await generatorPage.schema.editor.editRowParamsWithDialog(0, {
      values: 'active,inactive,pending',
    });

    await expect(generatorPage.schema.row(0).locator('[data-action="pick-command"]')).toHaveText('datatype.enum');
    await expect(generatorPage.schema.row(0).locator('input[data-field="params"]')).toHaveValue(
      '(active,inactive,pending)'
    );
    await expect
      .poll(async () => generatorPage.schema.getSchemaText())
      .toContain('enum("active","inactive","pending")');

    expectNoPageErrors(pageErrors);
  });

  test('schema edit buttons states are correct across top middle and bottom rows', async ({ page }) => {
    const { generatorPage, pageErrors } = await openGenerator(page);

    await generatorPage.schema.addField();
    await generatorPage.schema.addField();
    await expect(generatorPage.schema.rows).toHaveCount(3);

    const top = generatorPage.schema.row(0);
    await expect(top.locator('button[data-action="add"]')).toBeEnabled();
    await expect(top.locator('button[data-action="remove"]')).toBeEnabled();
    await expect(top.locator('button[data-action="up"]')).toBeDisabled();
    await expect(top.locator('button[data-action="down"]')).toBeEnabled();

    const middle = generatorPage.schema.row(1);
    await expect(middle.locator('button[data-action="add"]')).toBeEnabled();
    await expect(middle.locator('button[data-action="remove"]')).toBeEnabled();
    await expect(middle.locator('button[data-action="up"]')).toBeEnabled();
    await expect(middle.locator('button[data-action="down"]')).toBeEnabled();

    const bottom = generatorPage.schema.row(2);
    await expect(bottom.locator('button[data-action="add"]')).toBeEnabled();
    await expect(bottom.locator('button[data-action="remove"]')).toBeEnabled();
    await expect(bottom.locator('button[data-action="up"]')).toBeEnabled();
    await expect(bottom.locator('button[data-action="down"]')).toBeDisabled();

    expectNoPageErrors(pageErrors);
  });

  test('can reorder rows in schema mode and text reflects new order', async ({ page }) => {
    const { generatorPage, pageErrors } = await openGenerator(page);

    await generatorPage.schema.setSchemaText(
      'A\nliteral(a)\n\nB\nliteral(b)\n\nC\nliteral(c)\n\nD\nliteral(d)\n\nE\nliteral(e)'
    );
    await generatorPage.schema.setTextMode(false);

    await expect(generatorPage.schema.rows).toHaveCount(5);

    await generatorPage.schema.clickRowAction(4, 'up');
    await generatorPage.schema.clickRowAction(3, 'up');
    await generatorPage.schema.clickRowAction(0, 'down');

    await expect.poll(async () => getSchemaRowNames(generatorPage)).toEqual(['B', 'A', 'E', 'C', 'D']);

    const schemaText = await generatorPage.schema.getSchemaText();
    expectOrderedSubstrings(schemaText, [
      'B\nliteral(b)',
      'A\nliteral(a)',
      'E\nliteral(e)',
      'C\nliteral(c)',
      'D\nliteral(d)',
    ]);

    expectNoPageErrors(pageErrors);
  });

  test('can drag schema rows directly to the top and bottom in the generator editor', async ({ page }) => {
    const { generatorPage, pageErrors } = await openGenerator(page);

    await generatorPage.schema.setSchemaText('A\nliteral(a)\n\nB\nliteral(b)\n\nC\nliteral(c)\n\nD\nliteral(d)');
    await generatorPage.schema.setTextMode(false);

    await generatorPage.schema.editor.dragRowToIndex(3, 0, { placement: 'before' });
    await expect.poll(async () => getSchemaRowNames(generatorPage)).toEqual(['D', 'A', 'B', 'C']);

    await generatorPage.schema.editor.dragRowToIndex(0, 3, { placement: 'after' });
    await expect.poll(async () => getSchemaRowNames(generatorPage)).toEqual(['A', 'B', 'C', 'D']);

    const schemaText = await generatorPage.schema.getSchemaText();
    expectOrderedSubstrings(schemaText, ['A\nliteral(a)', 'B\nliteral(b)', 'C\nliteral(c)', 'D\nliteral(d)']);

    expectNoPageErrors(pageErrors);
  });

  test('can remove a schema row in schema mode and text no longer contains it', async ({ page }) => {
    const { generatorPage, pageErrors } = await openGenerator(page);

    await generatorPage.schema.setSchemaText('First\nliteral(one)\n\nSecond\nliteral(two)\n\nThird\nliteral(three)');
    await generatorPage.schema.setTextMode(false);

    await expect(generatorPage.schema.rows).toHaveCount(3);
    await generatorPage.schema.clickRowAction(1, 'remove');
    await expect(generatorPage.schema.rows).toHaveCount(2);
    await expect.poll(async () => getSchemaRowNames(generatorPage)).toEqual(['First', 'Third']);

    const schemaText = await generatorPage.schema.getSchemaText();
    expect(schemaText).toContain('First\nliteral(one)');
    expect(schemaText).not.toContain('Second\nliteral(two)');
    expect(schemaText).toContain('Third\nliteral(three)');

    expectNoPageErrors(pageErrors);
  });

  test('can add a schema row in schema mode and text contains the new row', async ({ page }) => {
    const { generatorPage, pageErrors } = await openGenerator(page);

    await generatorPage.schema.setSchemaText('First\nliteral(one)\n\nSecond\nliteral(two)');
    await generatorPage.schema.setTextMode(false);

    await expect(generatorPage.schema.rows).toHaveCount(2);
    await generatorPage.schema.clickRowAction(1, 'add');
    await expect(generatorPage.schema.rows).toHaveCount(3);

    await generatorPage.schema.setRowName(2, 'Third');
    await generatorPage.schema.setRowSourceType(2, 'literal');
    await generatorPage.schema.setRowValue(2, 'three');

    const schemaText = await generatorPage.schema.getSchemaText();
    expectOrderedSubstrings(schemaText, ['First\nliteral(one)', 'Second\nliteral(two)', 'Third\nliteral(three)']);

    expectNoPageErrors(pageErrors);
  });

  test('empty schema text can switch back to schema mode without validation lock', async ({ page }) => {
    const { generatorPage, pageErrors } = await openGenerator(page);

    await generatorPage.schema.setSchemaText('');
    await generatorPage.schema.setTextMode(false);

    await expect.poll(async () => generatorPage.schema.editor.isRowEditorMode()).toBe(true);
    await expect(generatorPage.schema.errorStatus).not.toContainText('No rules defined. Provide column/rule pairs.');

    expectNoPageErrors(pageErrors);
  });
});
