const { test, expect } = require('@playwright/test');
const { AppPage } = require('../../abstractions/app.page');
const { trackPageErrors, seedInstructionsRows } = require('../helpers/test-helpers');

test('global filter, column filter, sort, and clear filters produce expected visible state', async ({ page }) => {
  const seededValues = ['Apple', 'Banana', 'Cherry'];
  const pageErrors = trackPageErrors(page);
  const appPage = new AppPage(page);
  await appPage.goto();
  await seedInstructionsRows(appPage, seededValues);
  await appPage.gridEditor.header.expectHasAnyColumns();
  const [primaryColumnName] = await appPage.gridEditor.header.getColumnNames();
  const baselineActiveRowCount = seededValues.length;
  expect(primaryColumnName).toBeTruthy();

  await appPage.gridEditor.setQuickFilter('App');
  await expect.poll(async () => appPage.gridEditor.renderer.countVisibleRows()).toBe(1);
  await expect
    .poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName(primaryColumnName, 0))
    .toContain('Apple');

  await appPage.gridEditor.header.setColumnFilter(primaryColumnName, 'App');
  await expect.poll(async () => appPage.gridEditor.renderer.countVisibleRows()).toBe(1);

  await appPage.gridEditor.clearFilters({ expectedActiveRowCount: baselineActiveRowCount });
  await expect.poll(async () => appPage.gridEditor.renderer.getActiveRowCount()).toBe(baselineActiveRowCount);
  await expect.poll(async () => appPage.gridEditor.renderer.countVisibleRows()).toBe(3);
  await expect.poll(async () => appPage.gridEditor.quickFilterInput.inputValue()).toBe('');
  await expect.poll(async () => appPage.gridEditor.header.getColumnFilterValue(primaryColumnName)).toBe('');

  await appPage.gridEditor.header.sortAsc(primaryColumnName);
  await expect
    .poll(async () => appPage.gridEditor.renderer.getTopActiveColumnTextsByName(primaryColumnName, 3))
    .toEqual(['Apple', 'Banana', 'Cherry']);

  await appPage.gridEditor.header.sortDesc(primaryColumnName);
  await expect
    .poll(async () => appPage.gridEditor.renderer.getTopActiveColumnTextsByName(primaryColumnName, 3))
    .toEqual(['Cherry', 'Banana', 'Apple']);

  expect(pageErrors).toEqual([]);
});
