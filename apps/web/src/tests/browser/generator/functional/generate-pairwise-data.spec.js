const fs = require('fs');
const Papa = require('papaparse');
const { test } = require('@playwright/test');
const { openGenerator, expectNoPageErrors, expect } = require('../abstractions/helpers/scenario-helpers');
const { assertStrictBooleanCell } = require('../../shared/helpers/boolean-assertions');

function validatePairwiseRows(rows) {
  expect(rows.length).toBeGreaterThanOrEqual(9);

  const allowedBrowsers = new Set(['chrome', 'firefox', 'safari']);
  const allowedPlans = new Set(['free', 'pro', 'enterprise']);
  const expectedEnumPairs = new Set([
    'chrome|free',
    'chrome|pro',
    'chrome|enterprise',
    'firefox|free',
    'firefox|pro',
    'firefox|enterprise',
    'safari|free',
    'safari|pro',
    'safari|enterprise',
  ]);

  const actualEnumPairs = new Set();
  const observedBooleanValues = new Set();

  rows.forEach((row) => {
    const browser = String(row.Browser ?? '');
    const plan = String(row.Plan ?? '');
    const fixed = String(row.Fixed ?? '');
    const code = String(row.Code ?? '');
    const normalizedBoolean = assertStrictBooleanCell(row.Enabled);

    expect(allowedBrowsers.has(browser)).toBe(true);
    expect(allowedPlans.has(plan)).toBe(true);
    expect(fixed).toBe('CONSTANT');
    expect(code).toMatch(/^[A-Z]{2}[0-9]{2}$/);
    observedBooleanValues.add(normalizedBoolean);
    actualEnumPairs.add(`${browser}|${plan}`);
  });

  expect(actualEnumPairs).toEqual(expectedEnumPairs);
  expect(observedBooleanValues).toEqual(new Set(['true', 'false']));
}

async function setPairwiseSchema(generatorPage) {
  await generatorPage.schema.setSchemaText(
    'Browser\nchrome,firefox,safari\n\nPlan\nfree,pro,enterprise\n\nFixed\nliteral(CONSTANT)\n\nCode\n[A-Z]{2}[0-9]{2}\n\nEnabled\ndatatype.boolean'
  );
}

test.describe('Generator Pairwise Data', () => {
  test('can generate pairwise data as csv', async ({ page }) => {
    const { generatorPage, pageErrors } = await openGenerator(page);

    await setPairwiseSchema(generatorPage);
    await generatorPage.generateOptions.setOutputFormat('csv');
    const download = await generatorPage.downloadGeneratedPairwiseData();
    const fileText = fs.readFileSync(await download.path(), 'utf8');
    const parsed = Papa.parse(fileText, { header: true, skipEmptyLines: true });

    expect(parsed.errors).toEqual([]);
    validatePairwiseRows(parsed.data);
    expectNoPageErrors(pageErrors);
  });

  test('can generate pairwise data as json', async ({ page }) => {
    const { generatorPage, pageErrors } = await openGenerator(page);

    await setPairwiseSchema(generatorPage);
    await generatorPage.generateOptions.setOutputFormat('json');
    const download = await generatorPage.downloadGeneratedPairwiseData();
    const fileText = fs.readFileSync(await download.path(), 'utf8');
    const parsed = JSON.parse(fileText);

    expect(Array.isArray(parsed)).toBe(true);
    validatePairwiseRows(parsed);
    expectNoPageErrors(pageErrors);
  });
});
