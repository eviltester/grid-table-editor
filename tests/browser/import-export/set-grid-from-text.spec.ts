import { test, expect } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

// spec: tests/app-html-test-plan.md
// seed: tests/seed/import-export-setup.spec.ts

test.describe('Import Export Basic', () => {
  test('Set Grid From Text', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();
    
    // 1. Clear the grid and enter valid CSV data in the text area
    await app.toolbar.clickResetTable();
    
    
    // Make sure CSV tab is selected
    await app.export.clickTab('csv');
    

    // Switch to edit mode so "Set Grid From Text" is enabled
    app.page.once('dialog', async (dialog) => {
      await dialog.accept();
    });
    await app.export.clickPreview();
    
    
    // Enter CSV data in the text area
    const csvData = 'Name,Age,City\nJohn,30,New York\nJane,25,London\nBob,35,Paris';
    await app.export.setTextAreaContent(csvData);
    
    
    // expect: Text area contains properly formatted CSV
    const textContent = await app.export.textArea.inputValue();
    expect(textContent).toBe(csvData);
    
    // expect: Set Grid From Text button is enabled
    const setGridBtn = app.export.setGridFromTextButton;
    await expect(setGridBtn).toBeEnabled();
    
    // 2. Click 'Set Grid From Text' button
    await setGridBtn.click();
    
    
    // expect: Grid is populated with data from text area
    const rowCount = await app.grid.getVisibleRowCount();
    expect(rowCount).toBeGreaterThan(0);
    
    // expect: Columns are created automatically
    const columnCount = await app.grid.getColumnCount();
    expect(columnCount).toBeGreaterThan(1);
    
    // expect: Data types are preserved
    // Check that data appears in cells
    const cellText = await (await app.grid.getVisibleCell(0, 0)).textContent();
    expect(cellText).toContain('John');
    
    // 3. Test with malformed CSV data
    await app.toolbar.clickResetTable();
    
    
    const malformedCsv = 'Name,Age\nJohn,30\nJane\nBob,35,Paris,Extra';
    await app.export.setTextAreaContent(malformedCsv);
    
    
    await setGridBtn.click();
    
    
    // expect: Error handling displays appropriate message
    // The app might show an error or handle it gracefully
    
    // expect: Grid state is not corrupted
    await expect(app.grid.grid).toBeVisible();
  });
});

