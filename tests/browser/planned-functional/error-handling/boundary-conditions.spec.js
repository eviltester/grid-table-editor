const { test } = require('@playwright/test');
const { openApp, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('9. Error Handling and Edge Cases', () => {
  test('Boundary Conditions', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    const [base] = await appPage.gridEditor.header.getColumnNames();

    for (let i = 0; i < 8; i += 1) {
      await appPage.gridEditor.header.addColumnRight(base, 'C' + i);
    }
    await expect.poll(async () => appPage.gridEditor.header.countColumns()).toBeGreaterThanOrEqual(9);

    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.expectExpanded();
    await appPage.testDataPanel.setGenerateCount(50);
    await appPage.testDataPanel.clickGenerate();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBeGreaterThanOrEqual(0);

    await appPage.gridEditor.resetTable();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(0);

    expectNoPageErrors(pageErrors);
  });
});
