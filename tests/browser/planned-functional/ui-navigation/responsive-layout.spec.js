const { test } = require('@playwright/test');
const { openApp, expectNoPageErrors, expect } = require('../helpers/scenario-helpers');

test.describe('10. User Interface and Navigation', () => {
  test('Responsive Layout', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await page.setViewportSize({ width: 390, height: 844 });
    await appPage.gridEditor.expectVisible();
    await expect(page.locator('#myGrid')).toBeVisible();
    const mobileHasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(mobileHasOverflow).toBe(false);

    await page.setViewportSize({ width: 1280, height: 800 });
    await appPage.gridEditor.expectVisible();
    await expect(page.locator('#myGrid')).toBeVisible();
    const desktopHasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(desktopHasOverflow).toBe(false);

    expectNoPageErrors(pageErrors);
  });
});
