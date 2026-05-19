const { test } = require('@playwright/test');
const { openApp, seedRows, expectNoPageErrors, expect } = require('../../abstractions/helpers/scenario-helpers');

test.describe('1. Grid Basic Operations', () => {
  test('Reset Table', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    await seedRows(appPage, ['A', 'B']);

    await appPage.gridEditor.resetTable();
    await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(0);
    await expect.poll(async () => appPage.gridEditor.header.countColumns()).toBe(1);

    expectNoPageErrors(pageErrors);
  });
});
