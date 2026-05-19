const fs = require('fs');
const Papa = require('papaparse');
const { openGenerator, expectNoPageErrors, expect } = require('../abstractions/helpers/scenario-helpers');
const { test } = require('@playwright/test');

async function generateAndReadDownloadText(generatorPage) {
  const download = await generatorPage.downloadGeneratedData();
  const downloadedFilePath = await download.path();
  return fs.readFileSync(downloadedFilePath, 'utf8');
}

test.describe('Generator Generate Data', () => {
  test('can export csv', async ({ page }) => {
    const { generatorPage, pageErrors } = await openGenerator(page);

    await generatorPage.schema.setSchemaText('First Name\nliteral(Alice)\nStatus\nliteral(active)');
    await generatorPage.generateOptions.setRowsCount(15);
    await generatorPage.generateOptions.setOutputFormat('csv');

    const csvText = await generateAndReadDownloadText(generatorPage);
    const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    expect(parsed.errors).toEqual([]);
    expect(parsed.data).toHaveLength(15);
    parsed.data.forEach((row) => {
      expect(row['First Name']).toBe('Alice');
      expect(row.Status).toBe('active');
    });

    expectNoPageErrors(pageErrors);
  });

  test('can export json', async ({ page }) => {
    const { generatorPage, pageErrors } = await openGenerator(page);

    await generatorPage.schema.setSchemaText('First Name\nliteral(Alice)\nStatus\nliteral(active)');
    await generatorPage.generateOptions.setRowsCount(105);
    await generatorPage.generateOptions.setOutputFormat('json');

    const jsonText = await generateAndReadDownloadText(generatorPage);
    const parsed = JSON.parse(jsonText);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed).toHaveLength(105);
    parsed.forEach((row) => {
      expect(row['First Name']).toBe('Alice');
      expect(row.Status).toBe('active');
    });

    expectNoPageErrors(pageErrors);
  });
});
