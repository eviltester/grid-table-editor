const { test, expect } = require('@playwright/test');
const { AppPage } = require('../../abstractions/app.page');
const { trackPageErrors } = require('../helpers/test-helpers');

test('app remains interactive on desktop and mobile viewport sizes', async ({ page }) => {
  const pageErrors = trackPageErrors(page);
  const appPage = new AppPage(page);

  await page.setViewportSize({ width: 1280, height: 900 });
  await appPage.goto();
  await appPage.gridEditor.resetTable();
  await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(0);
  await appPage.gridEditor.addRow();
  await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(1);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/app.html', { waitUntil: 'domcontentloaded' });
  await appPage.waitUntilReady();
  await appPage.gridEditor.resetTable();
  await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(0);
  await appPage.gridEditor.addRow();
  await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(1);

  expect(pageErrors).toEqual([]);
});
