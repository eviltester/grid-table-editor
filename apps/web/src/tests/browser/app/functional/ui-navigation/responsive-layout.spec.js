const { test } = require('@playwright/test');
const { openApp, expectNoPageErrors } = require('../../abstractions/helpers/scenario-helpers');

test.describe('10. User Interface and Navigation', () => {
  test('Responsive Layout', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await page.setViewportSize({ width: 390, height: 844 });
    await appPage.gridEditor.expectVisible();

    await page.setViewportSize({ width: 1280, height: 800 });
    await appPage.gridEditor.expectVisible();

    expectNoPageErrors(pageErrors);
  });
});
