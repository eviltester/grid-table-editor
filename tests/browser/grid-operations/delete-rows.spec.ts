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

  test('Delete Rows', async ({ page }) => {
    const app = new AppPage(page);

    // Handle any dialogs (confirmation, alerts)
    app.page.on('dialog', async dialog => {
      await dialog.accept();
    });

    // Get initial row count (should be 0 after reset)
    const initialRowCount = await app.grid.getRowCount();

    // Add a new row
    await app.toolbar.clickAddRow();
    await app.wait(500);

    const rowCountAfterAdd = await app.grid.getRowCount();
    expect(rowCountAfterAdd).toBe(initialRowCount + 1);

    // Click on the last row (the one we just added)
    await app.grid.clickRow(rowCountAfterAdd - 1);
    await app.wait(500);

    // Verify row is selected
    const selectedRow = app.page.locator('#myGrid .tabulator-row.tabulator-selected');
    await expect(selectedRow).toBeVisible();

    // Click 'Delete Selected Rows' button
    await app.toolbar.clickDeleteSelectedRows();
    await app.wait(500);

    // Verify the row was deleted
    const afterDeleteCount = await app.grid.getRowCount();
    expect(afterDeleteCount).toBe(initialRowCount);

    // Verify grid is still visible
    await expect(app.grid.grid).toBeVisible();
  });
});
