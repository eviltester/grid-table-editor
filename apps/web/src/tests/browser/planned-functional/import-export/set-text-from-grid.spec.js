const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors } = require('../helpers/scenario-helpers');

test.describe('4. Import Export Basic', () => {
  test('Set Text From Grid', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await seedRows(appPage, ['A', 'B']);

    await appPage.tabbedText.selectFormat('CSV');
    await appPage.importExportControls.expectExtensionLabel('.csv');
    await appPage.importExportControls.setTextFromGrid();

    await appPage.tabbedText.expectOutputContains('A');
    await appPage.tabbedText.expectOutputContains('B');
    await appPage.tabbedText.expectOutputContains('\n');

    expectNoPageErrors(pageErrors);
  });
});
