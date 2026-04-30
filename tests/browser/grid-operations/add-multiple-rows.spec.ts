import { test, expect } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

// spec: tests/app-html-test-plan.md
// seed: tests/browser/seed/basic-setup.spec.ts

test.describe('Grid Basic Operations', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app and wait for grid to be ready
    const app = new AppPage(page);
    await app.goto();
    await app.toolbar.clickResetTable();
    await app.wait(500);
  });

  test('Add Multiple Rows', async ({ page }) => {
    const app = new AppPage(page);

    // Get initial row count (should be 0 after reset)
    const initialRowCount = await app.grid.getRowCount();

    // 1. Click 'Add Rows Above' button
    // First, click on a row to select it (if any rows exist)
    if (initialRowCount > 0) {
      await app.grid.clickRow(0);
    }

    await app.toolbar.clickAddRowsAbove();
    await app.wait(500);

    // expect: New row is added above current selection
    const afterAboveCount = await app.grid.getRowCount();
    expect(afterAboveCount).toBe(initialRowCount + 1);

    // expect: Grid reorders properly
    await expect(app.page.locator('#myGrid .tabulator-row').first()).toBeVisible();

    // 2. Click 'Add Rows Below' button
    await app.grid.clickRow(0);
    await app.wait(300);

    await app.toolbar.clickAddRowsBelow();
    await app.wait(500);

    // expect: New row is added below current selection
    const afterBelowCount = await app.grid.getRowCount();
    expect(afterBelowCount).toBe(afterAboveCount + 1);

    // expect: Grid maintains proper order
    await expect(app.page.locator('#myGrid .tabulator-row').nth(1)).toBeVisible();

    // 3. Add multiple rows and verify positioning
    await app.grid.clickRow(0);
    await app.wait(300);

    // Add a few more rows
    await app.toolbar.clickAddRowsBelow();
    await app.wait(300);
    await app.toolbar.clickAddRowsBelow();
    await app.wait(500);

    // expect: All rows are added in correct positions
    const finalCount = await app.grid.getRowCount();
    expect(finalCount).toBeGreaterThan(initialRowCount + 2);

    // expect: Grid layout remains intact
    await expect(app.grid.grid).toBeVisible();
  });
});