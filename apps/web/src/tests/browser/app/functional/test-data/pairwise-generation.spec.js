const { test } = require('@playwright/test');
const { openApp, expectNoPageErrors, expect } = require('../../abstractions/helpers/scenario-helpers');
const { assertStrictBooleanCell } = require('../../../shared/helpers/boolean-assertions');

test.describe('7. Test Data Generation', () => {
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
});
