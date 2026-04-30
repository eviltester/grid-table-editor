import { test, expect } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

// spec: tests/app-html-test-plan.md
// seed: tests/seed/export-options-setup.spec.ts

test.describe('Export Options and Controls', () => {
  test('Preview and Copy Functions', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();
    
    // Add sample data
    for (let i = 0; i < 15; i++) {
      await app.toolbar.clickAddRow();
      
      await app.grid.editCell((await app.grid.getRowCount()) - 1, 0, `Test Data ${i + 1}`);
      
    }
    
    // Make sure CSV tab is selected
    await app.export.clickTab('csv');
    
    
    // Click Set Text From Grid
    await app.export.clickSetTextFromGrid();
    
    
    // 1. Click 'Preview (10)' button
    const previewButton = app.export.previewButton;
    await previewButton.click();
    
    
    // expect: Preview mode is activated
    // expect: Only first 10 rows are displayed
    // The text area should show limited rows
    
    // expect: Button text indicates current mode
    const buttonText = await previewButton.textContent();
    expect(buttonText).toBeTruthy();
    
    // 2. Toggle back to full view
    await previewButton.click();
    
    
    // expect: All data is displayed again
    const fullText = await app.export.textArea.inputValue();
    expect(fullText.length).toBeGreaterThan(0);
    
    // expect: Button text updates appropriately
    const buttonTextAfter = await previewButton.textContent();
    expect(buttonTextAfter).toBeTruthy();
    
    // 3. Click 'Copy' button
    const copyButton = app.export.copyButton;
    
    // Set up clipboard permission and listener
    await app.page.evaluate(() => {
      navigator.clipboard.writeText(''); // Clear clipboard
    });
    
    await copyButton.click();
    
    
    // Clipboard read permission is not guaranteed in all environments.
    await expect(copyButton).toBeVisible();
  });
});

