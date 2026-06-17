const { test } = require('@playwright/test');
const { openApp, expectNoPageErrors, expect } = require('../../abstractions/helpers/scenario-helpers');
const {
  SCHEMA_ACCEPTANCE_SCENARIOS,
} = require('../../../../../../../../tests/integration/support/schema-acceptance-fixtures.cjs');
const {
  normalizeUiGridResult,
  normalizeUiErrorText,
} = require('../../../../../../../../tests/integration/support/schema-acceptance-assertions.cjs');

async function readGridRows(appPage, headers) {
  const rowCount = await appPage.gridEditor.renderer.countRows();
  const columns = await Promise.all(headers.map((header) => appPage.gridEditor.renderer.getColumnTextsByName(header)));
  const rows = [];
  for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
    rows.push(columns.map((column) => column[rowIndex]));
  }
  return rows;
}

test.describe('App test-data schema acceptance', () => {
  for (const scenario of SCHEMA_ACCEPTANCE_SCENARIOS) {
    test(`${scenario.id} matches shared acceptance criteria`, async ({ page }) => {
      const { appPage, pageErrors } = await openApp(page);

      await appPage.testDataPanel.expand();
      await appPage.testDataPanel.expectExpanded();
      await appPage.testDataPanel.setSchemaText(scenario.schemaText);

      if (scenario.kind === 'good') {
        await appPage.testDataPanel.setGenerateCount(scenario.rowCount);
        await appPage.testDataPanel.clickGenerate();

        await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(scenario.rowCount);
        await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).toEqual(scenario.expectedHeaders);

        const rows = await readGridRows(appPage, scenario.expectedHeaders);
        const normalized = normalizeUiGridResult({
          headers: scenario.expectedHeaders,
          rows,
        });
        scenario.assertAcceptance(expect, normalized);
      } else {
        await appPage.testDataPanel.clickGenerate();
        await expect.poll(async () => await appPage.testDataPanel.getSchemaErrorText()).not.toBe('');
        const normalized = normalizeUiErrorText(await appPage.testDataPanel.getSchemaErrorText());
        scenario.assertAcceptance(expect, normalized);
      }

      expectNoPageErrors(pageErrors);
    });
  }
});
