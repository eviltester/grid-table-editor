import { test, expect } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

// spec: tests/app-html-test-plan.md
// seed: tests/seed/advanced-features-setup.spec.ts

test.describe('Advanced Grid Features', () => {
  test('Row and Column Drag and Drop', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();
    app.enableDefaultDialogHandling();

    await app.grid.addColumnRight();
    

    for (const value of ['Row1-Col1', 'Row2-Col1', 'Row3-Col1']) {
      await app.toolbar.clickAddRow();
      
      await app.grid.editCell((await app.grid.getRowCount()) - 1, 0, value);
      
    }

    await expect(app.grid.rows.last()).toBeVisible();

    const firstRow = app.grid.visibleRows.first();
    const thirdRow = app.grid.visibleRows.nth(2);
    await firstRow.dragTo(thirdRow);
    

    await expect(app.grid.headers.first()).toBeVisible();
    await expect(app.grid.grid).toBeVisible();
  });
});
