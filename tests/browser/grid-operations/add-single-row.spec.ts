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

  test('Add Single Row', async ({ page }) => {
    const app = new AppPage(page);
    
    // 1. Navigate and verify page loads
    await app.expectPageLoaded();
    
    // Get initial row count
    const initialRowCount = await app.grid.getRowCount();
    
    // 2. Click 'Add Row' button
    await app.toolbar.clickAddRow();
    await app.wait(500);
    
    // expect: A new empty row is added to the grid
    const newRowCount = await app.grid.getRowCount();
    expect(newRowCount).toBe(initialRowCount + 1);
    
    // The new row should be at the end
    const newRow = app.page.locator('#myGrid .tabulator-row').last();
    await expect(newRow).toBeVisible();
    
    // 3. Click in the new row's cell and enter text 'Test Data'
    const cell = await app.grid.getCell(newRowCount - 1, 0);
    
    // expect: Cell becomes editable
    await cell.dblclick();
    await app.wait(300);
    
    // expect: Text is entered successfully
    await app.type('Test Data');
    await app.press('Enter');
    await app.wait(500);
    
    // expect: Cell content is saved
    await expect(cell).toHaveText('Test Data');
  });
});
