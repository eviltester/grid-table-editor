const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('10. User Interface and Navigation', () => {
  test('Navigation Links', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await appPage.topNavigation.gotoGenerator();
    await expect(page).toHaveURL(/generator.html/);
    await page.goBack();
    await expect(page).toHaveURL(/app.html/);
    await expect(await appPage.topNavigation.getDocsHref()).toBeTruthy();
    await expect(await appPage.topNavigation.getBlogHref()).toBeTruthy();
    expectNoPageErrors(pageErrors);
  });
});
