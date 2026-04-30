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
    
    
    // Set up dialog handler with unique column names
    app.page.on('dialog', async (dialog) => {
      if (dialog.type() === 'prompt') {
        columnCounter++;
        await dialog.accept(`TestColumn${columnCounter}`);
      } else if (dialog.type() === 'alert') {
        await dialog.accept();
      }
    });
  });

  test('Add Columns', async ({ page }) => {
    const app = new AppPage(page);
    columnCounter = 0; // Reset counter

    // Get initial column count
    const initialColumnCount = await app.grid.getColumnCount();

    // 1. Click '[<+] Add Column Left' control
    await app.grid.clickColumnControl('Instructions', 'add-left');
    

    // expect: New column is added to the left of current column
    const afterLeftColumnCount = await app.grid.getColumnCount();
    expect(afterLeftColumnCount).toBe(initialColumnCount + 1);

    // 2. Click '[+>] Add Column Right' control
    await app.grid.clickColumnControl('Instructions', 'add-right');
    

    // expect: New column is added to the right of current column
    const afterRightColumnCount = await app.grid.getColumnCount();
    expect(afterRightColumnCount).toBe(afterLeftColumnCount + 1);

    // expect: Existing data remains intact
    await expect(app.grid.grid).toBeVisible();
  });
});
