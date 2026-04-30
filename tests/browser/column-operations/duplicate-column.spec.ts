import { test, expect } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

test.describe('Column Operations', () => {
  let columnCounter = 0;

  test.beforeEach(async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();
    await app.toolbar.clickResetTable();
    await app.wait(500);

    app.page.on('dialog', async (dialog) => {
      if (dialog.type() === 'prompt') {
        columnCounter++;
        await dialog.accept(`TestColumn${columnCounter}`);
      } else if (dialog.type() === 'confirm') {
        await dialog.accept();
      } else if (dialog.type() === 'alert') {
        await dialog.accept();
      }
    });
  });

  test('Duplicate Column', async ({ page }) => {
    const app = new AppPage(page);
    columnCounter = 0;

    // Add data to a column first
    const firstCell = await app.grid.getCell(0, 0);
    await app.grid.editCell(0, 0, 'Original Data');
    await app.wait(500);

    // Get initial column count
    const initialColumnCount = await app.grid.getColumnCount();

    // Click '[+=] Duplicate Column' control
    await app.grid.clickColumnControl('duplicate');
    await app.wait(1500);

    // Verify new column was created
    const afterDuplicateColumnCount = await app.grid.getColumnCount();
    expect(afterDuplicateColumnCount).toBe(initialColumnCount + 1);

    // New column exists and is independently editable
    await app.grid.editCell(0, 1, 'Modified Data');
    await app.wait(500);

    const modifiedCell = await app.grid.getCell(0, 1);
    await expect(modifiedCell).toHaveText('Modified Data');
  });
});
