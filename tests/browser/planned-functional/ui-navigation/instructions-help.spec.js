const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('10. User Interface and Navigation', () => {
  test('Instructions and Help', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await appPage.topNavigation.expandInstructions();
    await expect(await appPage.topNavigation.isInstructionsExpanded()).toBeTruthy();
    await appPage.topNavigation.collapseInstructions();
    await expect(await appPage.topNavigation.isInstructionsExpanded()).toBeFalsy();
    expectNoPageErrors(pageErrors);
  });
});
