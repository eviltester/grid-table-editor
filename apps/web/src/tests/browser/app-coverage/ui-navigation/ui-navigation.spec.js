const { test, expect } = require('@playwright/test');
const { AppPage } = require('../../abstractions/app.page');
const { trackPageErrors } = require('../helpers/test-helpers');

test('top navigation supports generator navigation and app return', async ({ page }) => {
  const pageErrors = trackPageErrors(page);
  const appPage = new AppPage(page);
  await appPage.goto();

  await appPage.topNavigation.gotoGenerator();
  await expect(page).toHaveURL(/\/generator\.html$/);
  await page.goto('/app.html', { waitUntil: 'domcontentloaded' });
  await appPage.waitUntilReady();
  await expect(page).toHaveURL(/\/app\.html$/);

  expect(pageErrors).toEqual([]);
});

test('instructions panel expands and collapses with visible help content', async ({ page }) => {
  const pageErrors = trackPageErrors(page);
  const appPage = new AppPage(page);
  await appPage.goto();

  await appPage.topNavigation.expandInstructions();
  await appPage.topNavigation.expectInstructionsExpanded(true);
  await expect(
    page.locator('.instructions li', { hasText: 'Use tabs to switch between the type of text representation' })
  ).toBeVisible();

  await appPage.topNavigation.collapseInstructions();
  await appPage.topNavigation.expectInstructionsExpanded(false);

  expect(pageErrors).toEqual([]);
});
