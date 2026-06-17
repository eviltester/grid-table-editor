const fs = require('node:fs');
const { test } = require('@playwright/test');
const { openGenerator, expectNoPageErrors, expect } = require('../abstractions/helpers/scenario-helpers');
const {
  SCHEMA_ACCEPTANCE_SCENARIOS,
} = require('../../../../../../../tests/integration/support/schema-acceptance-fixtures.cjs');
const {
  normalizeUiDownloadedJson,
  normalizeUiErrorText,
} = require('../../../../../../../tests/integration/support/schema-acceptance-assertions.cjs');

async function downloadGeneratedDataText(generatorPage) {
  const download = await generatorPage.downloadGeneratedData();
  const filePath = await download.path();
  return fs.readFileSync(filePath, 'utf8');
}

test.describe('Generator schema acceptance', () => {
  for (const scenario of SCHEMA_ACCEPTANCE_SCENARIOS) {
    test(`${scenario.id} matches shared acceptance criteria`, async ({ page }) => {
      const { generatorPage, pageErrors } = await openGenerator(page);

      await generatorPage.schema.setSchemaText(scenario.schemaText);

      if (scenario.kind === 'good') {
        await generatorPage.generateOptions.setRowsCount(scenario.rowCount);
        await generatorPage.generateOptions.setOutputFormat(scenario.outputFormat);

        const outputText = await downloadGeneratedDataText(generatorPage);
        const normalized = normalizeUiDownloadedJson(outputText, scenario.expectedHeaders);
        scenario.assertAcceptance(expect, normalized);
      } else {
        await generatorPage.preview.clickPreview();
        await expect
          .poll(async () => (await generatorPage.schema.errorStatus.textContent())?.trim() || '')
          .not.toBe('');
        const normalized = normalizeUiErrorText((await generatorPage.schema.errorStatus.textContent())?.trim() || '');
        scenario.assertAcceptance(expect, normalized);
      }

      expectNoPageErrors(pageErrors);
    });
  }
});
