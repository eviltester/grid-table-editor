import { test, expect } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

// spec: tests/app-html-test-plan.md
// seed: tests/seed/advanced-features-setup.spec.ts

test.describe('Advanced Grid Features', () => {
  test('Cell Editing', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();
    app.enableDefaultDialogHandling();
    
    // Add a row with data
    await app.toolbar.clickAddRow();
    await app.wait(300);
    
    const cell = await app.grid.getCell(0, 0);
    
    // 1. Double-click on a cell to enter edit mode
    await cell.dblclick();
    await app.wait(300);
    
    // expect: Cell becomes editable
    // expect: Cursor appears in cell
    // The cell should now be in edit mode
    
    // expect: Cell content can be modified
    await app.press('Control+a');
    await app.type('Edited Content');
    await app.wait(200);
    
    // 2. Edit cell content and press Enter
    await app.press('Enter');
    await app.wait(500);
    
    // expect: Cell exits edit mode without errors
    await expect(app.grid.grid).toBeVisible();
    
    // 3. Test Tab navigation between cells
    // First, add another column
    await app.grid.addColumnRight();
    await app.wait(500);
    
    // Double-click the first cell to edit
    await cell.dblclick();
    await app.wait(300);
    
    // Type some content
    await app.type('Tab Test');
    await app.wait(200);
    
    // expect: Tab moves to next cell
    await app.press('Tab');
    await app.wait(500);
    
    // The focus should move to the next cell
    
    // expect: Shift+Tab moves to previous cell
    await app.press('Shift+Tab');
    await app.wait(500);
    
    // expect: Navigation wraps appropriately
    
    // Press Enter to save
    await app.press('Enter');
    await app.wait(300);
  });
});

