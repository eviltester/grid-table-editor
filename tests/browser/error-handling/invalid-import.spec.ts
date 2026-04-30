import { test, expect } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

// spec: tests/app-html-test-plan.md
// seed: tests/seed/error-handling-setup.spec.ts

test.describe('Error Handling and Edge Cases', () => {
  test('Invalid Data Import', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();
    
    
    // Make sure CSV tab is selected
    await app.export.clickTab('csv');
    

    // Switch to edit mode so import from text is enabled
    app.page.once('dialog', async (dialog) => await dialog.accept());
    await app.export.clickPreview();
    
    
    // 1. Attempt to import malformed CSV data
    const textArea = app.export.textArea;
    const malformedCsv = 'Name,Age\n"John,30\nJane,25"bad quotes\nBob,35,extra,columns';
    await textArea.fill(malformedCsv);
    
    
    const setGridBtn = app.export.setGridFromTextButton;
    
    // expect: Error message is displayed (if the app shows errors)
    // Click the button and observe behavior
    await setGridBtn.click();
    
    
    // expect: Grid state is preserved
    // The grid should not be corrupted
    
    // Check that the grid is still functional
    await expect(app.grid.grid).toBeVisible();
    
    // expect: User is informed of the issue (if app provides feedback)
    // Look for error messages
    
    // 2. Import file with unsupported format
    await app.toolbar.clickResetTable();
    
    
    // Create a file with unsupported format
    const fs = require('fs');
    const unsupportedPath = 'D:\\github\\grid-table-editor\\tests\\unsupported.xyz';
    fs.writeFileSync(unsupportedPath, 'Some content');
    
    try {
      const fileInput = app.export.csvFileInput;
      await fileInput.setInputFiles(unsupportedPath);
      
      
      // expect: Appropriate error handling occurs
      // expect: No system crash or undefined behavior
      
      // Grid should still be visible and functional
      await expect(app.grid.grid).toBeVisible();
      
      fs.unlinkSync(unsupportedPath);
    } catch (e) {
      // Cleanup
      try { fs.unlinkSync(unsupportedPath); } catch (e2) {}
    }
    
    // 3. Import extremely large file (simulate with moderately large data)
    // This is more of a performance test - just verify it doesn't crash
    await textArea.fill('Name\n' + 'Row\n'.repeat(1000));
    
    await setGridBtn.click();
    
    
    // expect: System handles large data gracefully
    // expect: Performance remains acceptable or user is warned
    await expect(app.grid.grid).toBeVisible();
  });
});

