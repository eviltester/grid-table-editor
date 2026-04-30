import { test, expect } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

// spec: tests/app-html-test-plan.md
// seed: tests/browser/seed/column-setup.spec.ts

test.describe('Column Operations', () => {
  let columnCounter = 0;

  test.beforeEach(async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();
    await app.toolbar.clickResetTable();
    

    // Set up dialog handler
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

  test('Rename Column', async ({ page }) => {
    const app = new AppPage(page);
    columnCounter = 0; // Reset counter.

    // 1. Click '[~] Rename Column' control
    await app.grid.clickColumnControl('rename');
    

    // expect: Column header updates with new name
    const headerText = await app.page.locator('#myGrid .tabulator-col').first().textContent();
    expect(headerText).toContain('TestColumn1');

    // 3. Verify change is reflected in export formats
    await app.export.clickTab('CSV');
    

    await app.export.clickSetTextFromGrid();
    

    const textAreaContent = await app.export.getTextAreaContent();
    expect(textAreaContent).toContain('TestColumn1');
  });
});
