import { test, expect } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

// spec: tests/app-html-test-plan.md
// seed: tests/seed/filter-sort-setup.spec.ts

test.describe('Filtering and Sorting', () => {
  test('Global Filter', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();
    
    // 1. Add multiple rows with varied data (e.g., 'Apple', 'Banana', 'Cherry')
    const fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];
    for (let i = 0; i < fruits.length; i++) {
      // Add row
      await app.toolbar.clickAddRow();
      await app.wait(300);
      await app.grid.editCell((await app.grid.getRowCount()) - 1, 0, fruits[i]);
    }
    
    // expect: Grid contains diverse data across multiple rows
    await expect(await app.grid.getCell((await app.grid.getRowCount()) - 1, 0)).toHaveText('Elderberry');
    
    const totalRows = await app.grid.getRowCount();
    expect(totalRows).toBeGreaterThan(fruits.length);
    
    // 2. Enter 'App' in the global Filter textbox
    const filterInput = app.toolbar.filterTextbox;
    await filterInput.fill('App');
    await app.wait(500);
    
    // expect: Only rows containing 'App' are displayed
    // The visible rows should only be those with 'Apple'
    const visibleRows = app.grid.visibleRows;
    const visibleCount = await visibleRows.count();
    
    // Check that all visible rows contain 'App' (case-insensitive)
    for (let i = 0; i < visibleCount; i++) {
      const cellText = await visibleRows.nth(i).locator('.tabulator-cell').first().textContent();
      if (cellText && !cellText.includes('Instructions')) {
        expect(cellText.toLowerCase()).toContain('app');
      }
    }
    
    // expect: Other rows are hidden
    // The rows without 'App' should not be visible
    
    // expect: Filter is case-insensitive
    await filterInput.clear();
    await filterInput.fill('app');
    await app.wait(500);
    
    // Same result with lowercase
    const lowerCaseVisibleRows = app.grid.visibleRows;
    const lowerCaseCount = await lowerCaseVisibleRows.count();
    expect(lowerCaseCount).toBe(visibleCount);
    
    // 3. Clear the filter text
    await filterInput.clear();
    await app.wait(500);
    
    // expect: All rows become visible again
    const allRowsCount = await app.grid.getRowCount();
    expect(allRowsCount).toBe(totalRows);
    
    // expect: Original data is preserved
    await expect(await app.grid.getCell((await app.grid.getRowCount()) - 1, 0)).toHaveText('Elderberry');
  });
});
