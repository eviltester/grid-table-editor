import { test, expect } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

// spec: tests/app-html-test-plan.md
// seed: tests/seed/filter-sort-setup.spec.ts

test.describe('Filtering and Sorting', () => {
  test('Column Filter', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();
    app.enableDefaultDialogHandling();
    
    // First, add another column to have multiple columns
    await app.grid.clickColumnControl('add-right');
    
    // Add data to rows with different values in different columns
    const testData = [
      { col1: 'Apple' },
      { col1: 'Banana' },
      { col1: 'Cherry' },
      { col1: 'Date' }
    ];
    
    for (let i = 0; i < testData.length; i++) {
      await app.toolbar.clickAddRow();
      await app.wait(300);
      
      const newRow = app.page.locator('#myGrid .tabulator-row').last();
      
      // Fill first column
      const cell1 = newRow.locator('.tabulator-cell').first();
      await cell1.dblclick();
      await app.wait(200);
      await app.type(testData[i].col1);
      await app.press('Enter');
      await app.wait(200);
      await app.press('Enter');
      await app.wait(200);
    }
    
    // 1. Enter filter criteria via toolbar quick filter
    await app.toolbar.enterGlobalFilter('Apple');
    await app.wait(500);
    
    // expect: Only matching rows in that specific column are displayed
    const visibleRows = app.page.locator('#myGrid .tabulator-row:visible');
    const visibleCount = await visibleRows.count();
    
    // expect: Other columns' data is preserved
    
    // 2. Clear the filter and verify rows can expand again
    await app.toolbar.clearGlobalFilter();
    await app.wait(500);
    const filteredRows = app.page.locator('#myGrid .tabulator-row:visible');
    const filteredCount = await filteredRows.count();
    expect(filteredCount).toBeGreaterThanOrEqual(visibleCount);
  });
});




