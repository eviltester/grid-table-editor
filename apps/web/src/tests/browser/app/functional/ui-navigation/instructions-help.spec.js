const { test } = require('@playwright/test');
const { openApp, expectNoPageErrors, expect } = require('../../abstractions/helpers/scenario-helpers');

test.describe('10. User Interface and Navigation', () => {
  test('Instructions and Help', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await appPage.topNavigation.expandInstructions();
    await expect(await appPage.topNavigation.isInstructionsExpanded()).toBeTruthy();
    await expect(page.locator('.instructions details')).toContainText('Grid');

    await appPage.topNavigation.collapseInstructions();
    await expect(await appPage.topNavigation.isInstructionsExpanded()).toBeFalsy();
    await appPage.topNavigation.expandInstructions();
    await expect(await appPage.topNavigation.isInstructionsExpanded()).toBeTruthy();

    expectNoPageErrors(pageErrors);
  });
});
