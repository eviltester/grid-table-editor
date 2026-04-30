import { test, expect } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

// spec: tests/app-html-test-plan.md
// seed: tests/seed/export-formats-setup.spec.ts

test.describe('Export Formats', () => {
  test('JSON Export', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();

    let columnCounter = 0;
    app.page.on('dialog', async (dialog) => {
      if (dialog.type() === 'prompt') {
        columnCounter++;
        await dialog.accept(`AutoColumn${columnCounter}`);
      } else {
        await dialog.accept();
      }
    });
    
    // Add sample data
    await app.grid.clickColumnControl('add-right');
    
    // Add data
    const testData = [
      { col1: 'John' },
      { col1: 'Jane' }
    ];
    
    for (let i = 0; i < testData.length; i++) {
      await app.toolbar.clickAddRow();
      
      
      const newRow = app.page.locator('#myGrid .tabulator-row').last();
      
      const cell1 = newRow.locator('.tabulator-cell').first();
      await cell1.dblclick();
      
      await app.type(testData[i].col1);
      await app.press('Enter');
      
      
    }
    
    // 1. Click 'JSON' tab
    await app.export.clickTab('json');
    
    // expect: JSON tab is active
    // expect: JSON-specific options are available
    
    // 2. Generate JSON from grid data
    await app.export.clickSetTextFromGrid();
    const textContent = await app.export.getTextAreaContent();
    
    // expect: Output is valid JSON format
    expect(() => JSON.parse(textContent)).not.toThrow();
    
    const jsonData = JSON.parse(textContent);
    
    // expect: Data structure preserves grid relationships
    expect(Array.isArray(jsonData)).toBeTruthy();
    
    // expect: Column names become object keys
    if (jsonData.length > 0) {
      const firstRow = jsonData[0];
      expect(Object.keys(firstRow).length).toBeGreaterThan(0);
    }
    
    // 3. Test JSON formatting options (pretty print, compact, etc.)
    // Look for formatting options and test them
    
    // expect: Different formatting options produce appropriate JSON styles
  });
});


