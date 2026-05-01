const { test, expect } = require('@playwright/test');
const { AppPage } = require('../../abstractions/app.page');
const { trackPageErrors, seedInstructionsRows } = require('../helpers/test-helpers');

test('global filter, column filter, sort, and clear filters produce expected visible state', async ({ page }) => {
  const pageErrors = trackPageErrors(page);
  const appPage = new AppPage(page);
  await appPage.goto();
  await seedInstructionsRows(appPage, ['Apple', 'Banana', 'Cherry']);
  const [primaryColumnName] = await appPage.gridEditor.header.getColumnNames();

  await appPage.gridEditor.setQuickFilter('App');
  await expect.poll(async () => appPage.gridEditor.renderer.countVisibleRows()).toBe(1);
  await expect
    .poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName(primaryColumnName, 0))
    .toContain('Apple');

  await appPage.gridEditor.header.setColumnFilter(primaryColumnName, 'Ban');
  await expect.poll(async () => appPage.gridEditor.renderer.countVisibleRows()).toBe(1);

  await appPage.gridEditor.clearFilters();
  await expect.poll(async () => appPage.gridEditor.renderer.countVisibleRows()).toBe(3);
  await expect.poll(async () => appPage.gridEditor.header.getColumnFilterValue(primaryColumnName)).toBe('');

  await appPage.gridEditor.header.sortAsc(primaryColumnName);
  await expect
    .poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName(primaryColumnName, 0))
    .toBe('Apple');

  await appPage.gridEditor.header.sortDesc(primaryColumnName);
  await expect
    .poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName(primaryColumnName, 0))
    .toBe('Cherry');

  await appPage.gridEditor.header.clearSort(primaryColumnName);
  await expect
    .poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName(primaryColumnName, 0))
    .toBe('Apple');

  expect(pageErrors).toEqual([]);
});
