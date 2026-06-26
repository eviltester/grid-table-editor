const { test } = require('@playwright/test');
const { openApp, expectNoPageErrors } = require('../../abstractions/helpers/scenario-helpers');

test.describe('6. Export Options and Controls', () => {
  test('CSV option accessible names exclude neighboring help button text', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await appPage.textPreviewEditor.selectFormat('CSV');
    await appPage.formatOptionsPanel.expectCsvOptionAccessibleNames();

    expectNoPageErrors(pageErrors);
  });
});
