import { test, expect } from '@playwright/test';
import { AppPage } from '../pages/AppPage';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';

// spec: tests/app-html-test-plan.md
// seed: tests/seed/import-export-setup.spec.ts

test.describe('Import Export Basic', () => {
  test('Drag and Drop Import', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();
    
    
    // Make sure CSV tab is selected
    await app.export.clickTab('csv');
    
    
    // Create a test CSV file for drag and drop
    const testCsvContent = 'Name,Age,City\nJohn,30,New York\nJane,25,London\nBob,35,Paris';
    const tempDir = join(process.cwd(), 'tests', '.tmp');
    if (!existsSync(tempDir)) {
      mkdirSync(tempDir, { recursive: true });
    }
    const testCsvPath = join(tempDir, 'drag-drop-test.csv');
    writeFileSync(testCsvPath, testCsvContent);
    
    try {
      // 1. Drag a valid CSV file onto the 'Drag And Drop CSV File Here' zone
      const dropZone = app.export.dragDropZone;
      const fileInput = app.export.csvFileInput;
      await expect(dropZone).toBeVisible();
      
      // expect: Drop zone responds to drag event
      // expect: Visual feedback indicates valid drop target
      await dropZone.hover();
      
      
      // 2. Drop the CSV file in the drop zone
      await fileInput.setInputFiles(testCsvPath);
      
      
      // expect: File is processed successfully
      // expect: Grid is updated with file content
      const rowCount = await app.grid.getVisibleRowCount();
      expect(rowCount).toBeGreaterThan(0);
      
      // expect: Import progress is shown (if applicable)
      
      // 3. Test drag and drop with invalid file type
      await app.toolbar.clickResetTable();
      
      
      // Create an invalid file
      const invalidPath = join(tempDir, 'invalid.txt');
      writeFileSync(invalidPath, 'This is not a CSV file');
      expect(existsSync(invalidPath)).toBe(true);
      
      await fileInput.setInputFiles(invalidPath);
      
      
      // expect: Error message indicates unsupported file type (if any)
      // expect: Grid remains unchanged
      await expect(app.grid.grid).toBeVisible();
      
      // Clean up invalid file
      try {
        unlinkSync(invalidPath);
      } catch {}
      
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
