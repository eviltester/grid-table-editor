const Papa = require('papaparse');
const { test } = require('@playwright/test');
const { openGenerator, expectNoPageErrors, expect } = require('../abstractions/helpers/scenario-helpers');

test.describe('Generator Preview Data', () => {
  test('can preview csv', async ({ page }) => {
    const { generatorPage, pageErrors } = await openGenerator(page);

    await generatorPage.schema.setSchemaText('First Name\nliteral(Alice)\nStatus\nliteral(active)');
    await generatorPage.generateOptions.setOutputFormat('csv');
    await generatorPage.preview.setRowsCount(10);
    await generatorPage.preview.clickPreview();

    await expect.poll(async () => generatorPage.preview.getOutputPreviewText()).toContain('First Name');
    const csvText = await generatorPage.preview.getOutputPreviewText();
    const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    expect(parsed.errors).toEqual([]);
    expect(parsed.data).toHaveLength(10);
    parsed.data.forEach((row) => {
      expect(row['First Name']).toBe('Alice');
      expect(row.Status).toBe('active');
    });

    await expect.poll(async () => generatorPage.preview.getColumnNames()).toContain('First Name');
    await expect.poll(async () => generatorPage.preview.getColumnNames()).toContain('Status');
    await expect.poll(async () => generatorPage.preview.getColumnTextsByName('First Name')).toHaveLength(10);
    await expect.poll(async () => generatorPage.preview.getColumnTextsByName('Status')).toHaveLength(10);

    const firstNameValues = await generatorPage.preview.getColumnTextsByName('First Name');
    const statusValues = await generatorPage.preview.getColumnTextsByName('Status');
    firstNameValues.forEach((value) => expect(value).toBe('Alice'));
    statusValues.forEach((value) => expect(value).toBe('active'));

    expectNoPageErrors(pageErrors);
  });

  test('can preview json', async ({ page }) => {
    const { generatorPage, pageErrors } = await openGenerator(page);

    await generatorPage.schema.setSchemaText('First Name\nliteral(Alice)\nStatus\nliteral(active)');
    await generatorPage.generateOptions.setOutputFormat('json');
    await generatorPage.preview.setRowsCount(10);
    await generatorPage.preview.clickPreview();

    await expect.poll(async () => generatorPage.preview.getOutputPreviewText()).toContain('First Name');
    const jsonText = await generatorPage.preview.getOutputPreviewText();
    const parsed = JSON.parse(jsonText);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed).toHaveLength(10);
    parsed.forEach((row) => {
      expect(row['First Name']).toBe('Alice');
      expect(row.Status).toBe('active');
    });

    await expect.poll(async () => generatorPage.preview.getColumnNames()).toContain('First Name');
    await expect.poll(async () => generatorPage.preview.getColumnNames()).toContain('Status');
    await expect.poll(async () => generatorPage.preview.getColumnTextsByName('First Name')).toHaveLength(10);
    await expect.poll(async () => generatorPage.preview.getColumnTextsByName('Status')).toHaveLength(10);

    const firstNameValues = await generatorPage.preview.getColumnTextsByName('First Name');
    const statusValues = await generatorPage.preview.getColumnTextsByName('Status');
    firstNameValues.forEach((value) => expect(value).toBe('Alice'));
    statusValues.forEach((value) => expect(value).toBe('active'));

    expectNoPageErrors(pageErrors);
  });
});
