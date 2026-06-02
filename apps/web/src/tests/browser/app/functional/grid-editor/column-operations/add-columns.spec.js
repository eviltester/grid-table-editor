const { test } = require('@playwright/test');
const { openApp, expectNoPageErrors, expect } = require('../../../abstractions/helpers/scenario-helpers');

test.describe('2. Column Operations', () => {
  test('Add Column Left', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    const [base] = await appPage.gridEditor.header.getColumnNames();

    await expect(page.locator('#myGrid [aria-label="Add column left"]')).toBeVisible();
    await expect(page.locator('#myGrid [aria-label="Rename column"]')).toBeVisible();
    await expect(page.locator('#myGrid [aria-label="Delete column"]')).toBeVisible();
    await expect(page.locator('#myGrid [aria-label="Duplicate column"]')).toBeVisible();
    await expect(page.locator('#myGrid [aria-label="Add column right"]')).toBeVisible();

    await appPage.gridEditor.header.addColumnLeft(base, 'Left Col');
    await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).toEqual(['Left Col', base]);

    expectNoPageErrors(pageErrors);
  });

  test('Add Column Right', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    const [base] = await appPage.gridEditor.header.getColumnNames();

    await appPage.gridEditor.header.addColumnRight(base, 'Right Col');
    await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).toEqual([base, 'Right Col']);

    expectNoPageErrors(pageErrors);
  });

  test('Unique Column Names prevents duplicate name when adding column left', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    const [base] = await appPage.gridEditor.header.getColumnNames();
    const gridError = page.locator('#grid-column-error');

    await appPage.gridEditor.setUniqueColumnNames(true);
    await appPage.gridEditor.header.addColumnLeft(base, base);
    await expect(gridError).toContainText(`A column with name ${base} already exists`);
    await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).toEqual([base]);

    expectNoPageErrors(pageErrors);
  });

  test('Unique Column Names prevents duplicate name when adding column right', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);
    const [base] = await appPage.gridEditor.header.getColumnNames();
    const gridError = page.locator('#grid-column-error');

    await appPage.gridEditor.setUniqueColumnNames(true);
    await appPage.gridEditor.header.addColumnRight(base, 'Right Col');
    await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).toEqual([base, 'Right Col']);
    await appPage.gridEditor.header.addColumnRight(base, base);
    await expect(gridError).toContainText(`A column with name ${base} already exists`);
    await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).toEqual([base, 'Right Col']);

    expectNoPageErrors(pageErrors);
  });
});
