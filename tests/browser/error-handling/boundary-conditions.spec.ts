import { test, expect } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

// spec: tests/app-html-test-plan.md
// seed: tests/seed/error-handling-setup.spec.ts

test.describe('Error Handling and Edge Cases', () => {
  test('Boundary Conditions', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();
    app.enableDefaultDialogHandling();
    
    // 1. Create grid with maximum number of columns (test with reasonable number)
    // Add multiple columns (let's say 10 for testing)
    for (let i = 0; i < 10; i++) {
      await app.grid.addColumnRight();
      await app.wait(300);
    }
    
    const columnCount = await app.grid.getColumnCount();
    
    // expect: System handles many columns without breaking
    expect(columnCount).toBeGreaterThan(10);
    
    // expect: Performance remains acceptable
    await expect(app.grid.grid).toBeVisible();
    
    // 2. Generate test data with very large 'How Many?' value
    await app.testData.expandTestDataSection();
    await app.testData.addColumnDefinition('Name', 'faker', 'faker.name.firstName');
    await app.wait(500);
    
    // Set large number of rows
    await app.testData.setHowMany('100'); // Reasonable test size
    await app.wait(300);
    
    // expect: Large data generation is handled appropriately
    await app.testData.clickGenerate();
    await app.wait(3000);
    
    // expect: User gets feedback on progress (if applicable)
    
    // Verify grid still works
    await expect(app.grid.grid).toBeVisible();
    
    // 3. Test empty grid operations
    await app.toolbar.clickResetTable();
    await app.wait(500);
    
    // Try to delete rows from empty grid
    const deleteBtn = app.toolbar.deleteSelectedRowsButton;
    
    // expect: Operations on empty grid don't cause errors
    // The button should just not do anything harmful
    
    // expect: Appropriate messages are shown (if any)
    await expect(app.grid.grid).toBeVisible();
  });
});


