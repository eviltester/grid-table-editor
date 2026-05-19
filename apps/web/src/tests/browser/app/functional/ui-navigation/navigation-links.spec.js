const { test } = require('@playwright/test');
const { openApp, expectNoPageErrors, expect } = require('../../abstractions/helpers/scenario-helpers');

test.describe('10. User Interface and Navigation', () => {
  test('Navigation Links', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await appPage.topNavigation.gotoGenerator();
    await expect(page).toHaveURL(/generator\.html/);
    await expect(page.locator('body')).toContainText('Data Generator');

    await page.goBack();
    await expect(page).toHaveURL(/app\.html/);
    await appPage.gridEditor.expectVisible();

    expect(await appPage.topNavigation.getDocsHref()).toBeTruthy();
    expect(await appPage.topNavigation.getBlogHref()).toBeTruthy();

    expectNoPageErrors(pageErrors);
  });
});
