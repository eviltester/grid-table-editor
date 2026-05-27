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

    await generatorPage.schema.setSchemaText('First Name\nliteral(Alice)\n\nStatus\nenum(active,inactive)');
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
});
