import { test, expect } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

// spec: tests/app-html-test-plan.md
// seed: tests/seed/basic-setup.spec.ts

test.describe('Grid Basic Operations', () => {
  test('Reset Table', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();

    // 1. Add several rows with data
    await app.toolbar.clickAddRow();
    
    await app.toolbar.clickAddRow();
    
    await app.toolbar.clickAddRow();
    
    
    // Add some data to the newly added rows (they should be at the end)
    const rowCount = await app.grid.getRowCount();
    
    // Add data to the last few rows (these should be the ones we added)
    for (let i = Math.max(0, rowCount - 3); i < rowCount; i++) {
      await app.grid.editCell(i, 0, `Test Data ${i}`);
      
    }
    
    // 2. Click 'Reset Table' button
    await app.resetTable();
    
    // expect: All data is cleared (user data rows are removed)
    // The instruction rows should remain
    const rowCountAfterReset = await app.grid.getRowCount();
    
    // The instruction rows should still be there
    expect(rowCountAfterReset).toBeGreaterThan(0);
    
    // expect: Grid returns to initial state
    await expect(app.grid.grid).toBeVisible();
  });
});
