const { test } = require('@playwright/test');
const { openApp, expectNoPageErrors, expect } = require('../../abstractions/helpers/scenario-helpers');

test.describe('10. User Interface and Navigation', () => {
  test('Responsive Layout', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await page.setViewportSize({ width: 390, height: 844 });
    await appPage.gridEditor.expectVisible();

    await page.setViewportSize({ width: 1280, height: 800 });
    await appPage.gridEditor.expectVisible();

    expectNoPageErrors(pageErrors);
  });

  for (const viewportWidth of [390, 320]) {
    test(`App page does not overflow horizontally at ${viewportWidth}px`, async ({ page }) => {
      await page.setViewportSize({ width: viewportWidth, height: 844 });
      const { appPage, pageErrors } = await openApp(page);

      await appPage.gridEditor.expectVisible();

      await expect
        .poll(async () =>
          page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
        )
        .toBeLessThanOrEqual(0);

      expectNoPageErrors(pageErrors);
    });
  }
});
