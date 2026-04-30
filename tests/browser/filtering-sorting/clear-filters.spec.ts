import { test, expect } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

// spec: tests/app-html-test-plan.md
// seed: tests/seed/filter-sort-setup.spec.ts

test.describe('Filtering and Sorting', () => {
  test('Clear Filters', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();
    app.enableDefaultDialogHandling();
    
    // Add data to filter
    const fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];
    for (let i = 0; i < fruits.length; i++) {
      await app.toolbar.clickAddRow();
      await app.wait(300);
      
      const newRow = app.page.locator('#myGrid .tabulator-row').last();
      const cell = newRow.locator('.tabulator-cell').first();
      await cell.dblclick();
      await app.wait(200);
      await app.type(fruits[i]);
      await app.press('Enter');
      await app.wait(200);
    }
    
    // 1. Apply global filter and multiple column filters
    const filterInput = app.toolbar.filterTextbox;
    await filterInput.fill('a');  // Filters items containing 'a'
    await app.wait(500);
    
    // 2. Click 'Clear Filters' button
    await app.toolbar.clickClearFilters();
    await app.wait(500);
    
    // expect: Filter input is cleared and grid remains usable
    await expect(filterInput).toHaveValue('');
    await expect(app.grid.grid).toBeVisible();
  });
});

