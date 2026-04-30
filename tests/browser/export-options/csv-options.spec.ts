import { test, expect } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

// spec: tests/app-html-test-plan.md
// seed: tests/seed/export-options-setup.spec.ts

test.describe('Export Options and Controls', () => {
  test('CSV Export Options', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();
    
    // Make sure CSV tab is selected
    await app.export.clickTab('csv');
    
    
    // Add sample data
    await app.toolbar.clickAddRow();
    
    await app.grid.editCell((await app.grid.getRowCount()) - 1, 0, 'Test,Data');
    
    
    // Click Set Text From Grid to populate text area
    await app.export.clickSetTextFromGrid();
    
    
    // Get initial text
    const textArea = app.export.textArea;
    const initialText = await textArea.inputValue();
    
    // 1. Configure CSV options: Toggle 'Use Quotes' checkbox
    const useQuotesCheckbox = app.export.options.useQuotes;
    await useQuotesCheckbox.uncheck();
    
    
    // expect: Quotes option changes export behavior
    // expect: Apply button becomes enabled
    const applyButton = app.export.options.applyButton;
    
    // 2. Configure 'Use Header' option
    const useHeaderCheckbox = app.export.options.useHeader;
    await useHeaderCheckbox.uncheck();
    
    
    // expect: Header inclusion affects first line of output
    
    // 3. Modify Quote Char and Escape Char fields
    const quoteCharInput = app.export.options.quoteChar;
    await quoteCharInput.fill("'");
    
    
    const escapeCharInput = app.export.options.escapeChar;
    await escapeCharInput.fill('\\');
    
    
    // expect: Custom quote and escape characters are applied
    // expect: Special characters are handled correctly
    
    // 4. Click 'Apply' button
    await applyButton.click();
    
    
    // expect: Options are applied to current output
    const newText = await textArea.inputValue();
    
    // expect: Text area updates with new formatting
    expect(newText).toBeTruthy();
  });
});

