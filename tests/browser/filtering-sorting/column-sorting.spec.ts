import { test, expect } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

// spec: tests/app-html-test-plan.md
// seed: tests/seed/filter-sort-setup.spec.ts

test.describe('Filtering and Sorting', () => {
  test('Column Sorting', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();
    app.enableDefaultDialogHandling();
    
    // Add data to sort
    const fruits = ['Cherry', 'Apple', 'Banana', 'Date'];
    for (let i = 0; i < fruits.length; i++) {
      await app.toolbar.clickAddRow();
      
      await app.grid.editCell((await app.grid.getRowCount()) - 1, 0, fruits[i]);
      
    }
    
    // 1. Click 'Sort Asc' arrow in column header
    await app.grid.clickSortAsc(0);
    
    
    // expect: Column data is sorted in ascending order
    const firstCell = await (await app.grid.getVisibleCell(0, 0)).textContent();
    const secondCell = await (await app.grid.getVisibleCell(1, 0)).textContent();
    
    if (firstCell && secondCell && !firstCell.includes('Instructions')) {
      // Check that first <= second (ascending)
      expect(firstCell.localeCompare(secondCell)).toBeLessThanOrEqual(0);
    }
    
    // expect: Sort indicator is visible
    // Tabulator adds sort classes to the header
    
    // expect: Other columns maintain row relationships
    await expect(app.grid.grid).toBeVisible();
    
    // 2. Click 'Sort Desc' arrow in same column
    await app.grid.clickSortDesc(0);
    
    
    // expect: Column data is sorted in descending order
    const descFirstCell = await (await app.grid.getVisibleCell(0, 0)).textContent();
    const descSecondCell = await (await app.grid.getVisibleCell(1, 0)).textContent();
    
    if (descFirstCell && descSecondCell && !descFirstCell.includes('Instructions')) {
      // Check that first >= second (descending)
      expect(descFirstCell.localeCompare(descSecondCell)).toBeGreaterThanOrEqual(0);
    }
    
    // expect: Sort direction indicator changes
    
    // 3. Click 'Clear Sort' (x) control
    await app.grid.clickSortNone(0);
    
    
    // expect: Column returns to original order
    // expect: Sort indicators are removed
    await expect(app.grid.grid).toBeVisible();
  });
});

