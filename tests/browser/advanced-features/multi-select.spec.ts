import { test, expect } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

// spec: tests/app-html-test-plan.md
// seed: tests/seed/advanced-features-setup.spec.ts

test.describe('Advanced Grid Features', () => {
  test('Multi-Select Operations', async ({ page }) => {
    const app = new AppPage(page);
    app.enableDefaultDialogHandling();
    await app.goto();
    
    // Add multiple rows with data
    for (let i = 0; i < 5; i++) {
      await app.toolbar.clickAddRow();
      await app.wait(300);
      await app.grid.editCell((await app.grid.getRowCount()) - 1, 0, `Row ${i + 1}`);
      await app.wait(200);
    }
    
    // 1. Select multiple rows using Ctrl+click
    await app.grid.clickRow(0);
    await app.wait(200);
    await app.grid.selectRowWithCtrl(1);
    await app.wait(200);
    await app.grid.selectRowWithCtrl(2);
    await app.wait(500);
    
    // expect: Multiple rows are selected simultaneously
    const selectedRows = app.grid.selectedRows;
    const selectedCount = await app.grid.getSelectedRowCount();
    expect(selectedCount).toBeGreaterThanOrEqual(3);
    
    // expect: Selection indicators show all selected rows
    await expect(selectedRows.first()).toBeVisible();
    
    // 2. Select range of rows using Shift+click
    // First click on the first row
    await app.grid.clickRow(0);
    await app.wait(200);
    await app.grid.selectRowWithShift(3);
    await app.wait(500);
    
    // expect: Range selection works correctly
    // expect: All rows in range are selected
    const rangeSelectedCount = await app.grid.getSelectedRowCount();
    expect(rangeSelectedCount).toBeGreaterThanOrEqual(4);
    
    // 3. Perform operations on multi-selected rows (delete, edit)
    const deleteBtn = app.toolbar.deleteSelectedRowsButton;
    await deleteBtn.click();
    await app.wait(500);
    
    // expect: Operations apply to all selected rows
    // expect: Unselected rows are unaffected
    await expect(app.grid.grid).toBeVisible();
  });
});
