import { test, expect } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

// spec: tests/app-html-test-plan.md
// seed: tests/seed/export-formats-setup.spec.ts

test.describe('Export Formats', () => {
  test('Markdown Export', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();
    app.enableDefaultDialogHandling();
    

    await app.grid.addColumnRight();
    

    const testData = [{ col1: 'Name' }, { col1: 'John' }, { col1: 'Jane' }];

    for (let i = 0; i < testData.length; i++) {
      if (i > 0) {
        await app.toolbar.clickAddRow();
        
      }
      const rowIndex = i >= 1 ? i + 10 : i;
      await app.grid.editCell(rowIndex, 0, testData[i].col1);
      
    }

    await expect(app.grid.grid).toBeVisible();
    await app.export.clickTab('markdown');
    

    await app.export.clickSetTextFromGrid();
    

    const textContent = await app.export.textArea.inputValue();
    expect(textContent).toContain('|');
    expect(textContent).toContain('Instructions');
    expect(textContent).toContain('AutoColumn1');
    expect(textContent).toMatch(/\|.*\|/);
  });
});
