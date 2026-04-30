import { test, expect } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

// spec: tests/app-html-test-plan.md
// seed: tests/browser/seed/column-setup.spec.ts/

test.describe('Column Operations', () => {
  let columnCounter = 0;

  test.beforeEach(async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();
    await app.toolbar.clickResetTable();
    await app.wait(500);

    // Set up dialog handler
    app.page.on('dialog', async (dialog) => {
      if (dialog.type() === 'prompt') {
        columnCounter++;
        await dialog.accept(`TestColumn${columnCounter}`);
      } else if (dialog.type() === 'confirm') {
        await dialog.accept();
      } else if (dialog.type() === 'alert') {
        await dialog.accept();
      }
    });
  });

  test('Delete Column', async ({ page }) => {
    const app = new AppPage(page);
    columnCounter = 0; // Reset counter.

    // First, add a column to have multiple columns.
    await app.grid.clickColumnControl('Instructions', 'add-right');
    await app.wait(1000);

    // Get initial column count.
    const initialColumnCount = await app.page.locator('#myGrid .tabulator-col').count();

    // 1. Click '[x] Delete Column' control.
    await app.grid.clickColumnControl('Instructions', 'delete');
    await app.wait(1000);

    // expect: Target column is removed.
    const afterDeleteColumnCount = await app.page.locator('#myGrid .tabulator-col').count();
    expect(afterDeleteColumnCount).toBe(initialColumnCount - 1);

    // expect: Grid layout adjusts properly.
    await expect(app.grid.grid).toBeVisible();
  });
});
