const { test } = require('@playwright/test');
const { openApp, expectNoPageErrors, expect } = require('../../abstractions/helpers/scenario-helpers');
const { assertStrictBooleanCell } = require('../../../shared/helpers/boolean-assertions');

test.describe('7. Test Data Generation', () => {
  test('Generate Combinations dialog cancel leaves the grid unchanged', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.expectExpanded();

    await appPage.testDataPanel.setSchemaText(
      'Browser\nenum(chrome,firefox,safari)\n\nPlan\nenum(free,pro,enterprise)\n\nFixed\nliteral(CONSTANT)'
    );

    const initialRowCount = await appPage.gridEditor.renderer.countRows();

    await appPage.testDataPanel.openGenerateCombinationsDialog();
    await appPage.testDataPanel.cancelGenerateCombinationsDialog();

    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(initialRowCount);
    expectNoPageErrors(pageErrors);
  });

  test('Pairwise generation covers all enum combinations with valid values', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.expectExpanded();

    await appPage.testDataPanel.setSchemaText(
      'Browser\nenum(chrome,firefox,safari)\n\nPlan\nenum(free,pro,enterprise)\n\nFixed\nliteral(CONSTANT)\n\nCode\n[A-Z]{2}[0-9]{2}\n\nEnabled\ndatatype.boolean'
    );

    await appPage.testDataPanel.clickGeneratePairwise();

    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBeGreaterThanOrEqual(9);

    const browserValues = await appPage.gridEditor.renderer.getColumnTextsByName('Browser');
    const planValues = await appPage.gridEditor.renderer.getColumnTextsByName('Plan');
    const fixedValues = await appPage.gridEditor.renderer.getColumnTextsByName('Fixed');
    const codeValues = await appPage.gridEditor.renderer.getColumnTextsByName('Code');
    const enabledValues = await appPage.gridEditor.renderer.getColumnTextsByName('Enabled');

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
    for (let i = 0; i < browserValues.length; i += 1) {
      const browser = browserValues[i];
      const plan = planValues[i];
      const fixed = fixedValues[i];
      const code = codeValues[i];
      const enabled = enabledValues[i];

      expect(allowedBrowsers.has(browser)).toBe(true);
      expect(allowedPlans.has(plan)).toBe(true);
      expect(fixed).toBe('CONSTANT');
      expect(code).toMatch(/^[A-Z]{2}[0-9]{2}$/);
      const normalizedBoolean = assertStrictBooleanCell(enabled);
      observedBooleanValues.add(normalizedBoolean);
      actualEnumPairs.add(`${browser}|${plan}`);
    }

    expect(actualEnumPairs).toEqual(expectedEnumPairs);
    expect(observedBooleanValues).toEqual(new Set(['true', 'false']));
    expectNoPageErrors(pageErrors);
  });

  test('Generate Combinations dialog can use a different strategy and strength', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.expectExpanded();

    await appPage.testDataPanel.setSchemaText(
      'Browser\nenum(chrome,firefox,safari)\n\nPlan\nenum(free,pro,enterprise)\n\nRegion\nenum(amer,emea,apac)\n\nFixed\nliteral(CONSTANT)'
    );

    await appPage.testDataPanel.openGenerateCombinationsDialog();
    await appPage.testDataPanel.setCombinationStrength(3);
    await appPage.testDataPanel.chooseCombinationStrategy('Cartesian Product');
    await appPage.testDataPanel.submitGenerateCombinationsDialog();

    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(27);

    const browserValues = await appPage.gridEditor.renderer.getColumnTextsByName('Browser');
    const planValues = await appPage.gridEditor.renderer.getColumnTextsByName('Plan');
    const regionValues = await appPage.gridEditor.renderer.getColumnTextsByName('Region');
    const fixedValues = await appPage.gridEditor.renderer.getColumnTextsByName('Fixed');

    const expectedTriples = new Set();
    ['chrome', 'firefox', 'safari'].forEach((browser) => {
      ['free', 'pro', 'enterprise'].forEach((plan) => {
        ['amer', 'emea', 'apac'].forEach((region) => {
          expectedTriples.add(`${browser}|${plan}|${region}`);
        });
      });
    });

    const actualTriples = new Set();
    for (let i = 0; i < browserValues.length; i += 1) {
      expect(fixedValues[i]).toBe('CONSTANT');
      actualTriples.add(`${browserValues[i]}|${planValues[i]}|${regionValues[i]}`);
    }

    expect(actualTriples).toEqual(expectedTriples);
    expectNoPageErrors(pageErrors);
  });

  test('large cartesian combination runs require confirmation before generating', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.expectExpanded();

    await appPage.testDataPanel.setSchemaText(
      'A\nenum(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)\n\nB\nenum(b1,b2,b3,b4,b5,b6,b7,b8,b9,b10,b11)\n\nC\nenum(c1,c2,c3,c4,c5,c6,c7,c8,c9,c10,c11)\n\nD\nenum(d1,d2,d3,d4,d5,d6,d7,d8,d9,d10,d11)'
    );

    const initialRowCount = await appPage.gridEditor.renderer.countRows();

    await appPage.testDataPanel.openGenerateCombinationsDialog();
    await appPage.testDataPanel.setCombinationStrength(4);
    await appPage.testDataPanel.chooseCombinationStrategy('Cartesian Product');
    await appPage.testDataPanel.submitGenerateCombinationsDialog();

    const confirmDialog = page.getByRole('dialog', { name: 'Cartesian product generation' });
    await expect(confirmDialog).toBeVisible();
    await expect(confirmDialog.getByText(/14,641 data rows/i)).toBeVisible();
    await confirmDialog.getByRole('button', { name: 'Skip cartesian product' }).click();

    await expect(confirmDialog).toBeHidden();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(initialRowCount);
    await expect
      .poll(async () => appPage.testDataPanel.getStatusText())
      .toContain('Cartesian product generation skipped.');
    expectNoPageErrors(pageErrors);
  });
});
