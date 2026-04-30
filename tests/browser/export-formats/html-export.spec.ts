import { test, expect } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

// spec: tests/app-html-test-plan.md
// seed: tests/seed/export-formats-setup.spec.ts

test.describe('Export Formats', () => {
  test('HTML Export', async ({ page }) => {
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
    
    // 1. Click 'HTML' tab
    await app.export.clickTab('html');
    
    // expect: HTML tab is active
    // expect: HTML table options are available
    
    // 2. Generate HTML table
    await app.export.clickSetTextFromGrid();
    const textContent = await app.export.getTextAreaContent();
    
    // expect: Output is valid HTML table markup
    expect(textContent.toLowerCase()).toContain('<table');
    expect(textContent.toLowerCase()).toContain('</table>');
    
    // expect: Headers are in <th> elements
    expect(textContent.toLowerCase()).toContain('<th');
    
    // expect: Data is properly structured in <td> elements
    expect(textContent.toLowerCase()).toContain('<td');
    
    // Verify basic HTML structure
    expect(textContent).toMatch(/<table[^>]*>.*<\/table>/s);
  });
});


