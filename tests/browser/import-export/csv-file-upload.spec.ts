import { test, expect } from '@playwright/test';
import { writeFileSync, unlinkSync } from 'fs';
import { AppPage } from '../pages/AppPage';

// spec: tests/app-html-test-plan.md
// seed: tests/seed/import-export-setup.spec.ts

test.describe('Import Export Basic', () => {
  test('CSV File Upload', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();
    
    // Make sure CSV tab is selected
    await app.export.clickTab('csv');
    
    
    // Create a test CSV file
    const testCsvContent = 'Name,Age,City\nJohn,30,New York\nJane,25,London\nBob,35,Paris';
    const testCsvPath = 'D:\\github\\grid-table-editor\\tests\\test-data.csv';
    writeFileSync(testCsvPath, testCsvContent);
    
    try {
      // 1. Click on CSV file input 'Choose File' button
      // The file input is typically hidden, we need to use setInputFiles
      
      // expect: File picker dialog opens (handled by Playwright)
      
      // 2. Select a valid CSV file
      // Find the file input element
      const fileInput = app.export.csvFileInput;
      await fileInput.setInputFiles(testCsvPath);
      
      
      // expect: File is loaded successfully
      // expect: Grid is populated with file data
      const rowCount = await app.grid.getVisibleRowCount();
      expect(rowCount).toBeGreaterThan(0);
      
      // expect: Import progress indicator shows completion
      
      // 3. Test with invalid file format
      await app.toolbar.clickResetTable();
      
      
      // Create a text file with invalid content
      const invalidPath = 'D:\\github\\grid-table-editor\\tests\\invalid.txt';
      writeFileSync(invalidPath, 'This is not a CSV file');
      
      await fileInput.setInputFiles(invalidPath);
      
      
      // expect: Appropriate error message is displayed (if any)
      // expect: Grid remains in previous state
      await expect(app.grid.grid).toBeVisible();
      
      // Clean up invalid file
      try {
        unlinkSync(invalidPath);
      } catch {
        // Ignore cleanup errors if file was already removed.
      }
      
    } finally {
      // Clean up test file
      try {
        unlinkSync(testCsvPath);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  });
});
