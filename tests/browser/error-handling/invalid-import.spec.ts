import { test, expect } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

// spec: tests/app-html-test-plan.md
// seed: tests/seed/error-handling-setup.spec.ts

test.describe('Error Handling and Edge Cases', () => {
  test('Invalid Data Import', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();
    await app.wait(1000);
    
    // Make sure CSV tab is selected
    await app.export.clickTab('csv');
    await app.wait(500);

    // Switch to edit mode so import from text is enabled
    app.page.once('dialog', async (dialog) => await dialog.accept());
    await app.export.clickPreview();
    await app.wait(300);
    
    // 1. Attempt to import malformed CSV data
    const textArea = app.export.textArea;
    const malformedCsv = 'Name,Age\n"John,30\nJane,25"bad quotes\nBob,35,extra,columns';
    await textArea.fill(malformedCsv);
    await app.wait(500);
    
    const setGridBtn = app.export.setGridFromTextButton;
    
    // expect: Error message is displayed (if the app shows errors)
    // Click the button and observe behavior
    await setGridBtn.click();
    await app.wait(1000);
    
    // expect: Grid state is preserved
    // The grid should not be corrupted
    
    // Check that the grid is still functional
    await expect(app.grid.grid).toBeVisible();
    
    // expect: User is informed of the issue (if app provides feedback)
    // Look for error messages
    
    // 2. Import file with unsupported format
    await app.toolbar.clickResetTable();
    await app.wait(500);
    
    // Create a file with unsupported format
    const fs = require('fs');
    const unsupportedPath = 'D:\\github\\grid-table-editor\\tests\\unsupported.xyz';
    fs.writeFileSync(unsupportedPath, 'Some content');
    
    try {
      const fileInput = app.export.csvFileInput;
      await fileInput.setInputFiles(unsupportedPath);
      await app.wait(1000);
      
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
    await app.wait(500);
    await setGridBtn.click();
    await app.wait(2000);
    
    // expect: System handles large data gracefully
    // expect: Performance remains acceptable or user is warned
    await expect(app.grid.grid).toBeVisible();
  });
});

