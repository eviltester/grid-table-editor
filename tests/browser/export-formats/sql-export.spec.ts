import { test, expect } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

// spec: tests/app-html-test-plan.md
// seed: tests/seed/export-formats-setup.spec.ts

test.describe('Export Formats', () => {
  test('SQL Export', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();
    app.enableDefaultDialogHandling();
    

    await app.grid.addColumnRight();
    

    for (const value of ['John', 'Jane']) {
      await app.toolbar.clickAddRow();
      
      await app.grid.editCell((await app.grid.getRowCount()) - 1, 0, value);
      
    }

    await app.export.clickTab('sql');
    
    await app.export.clickSetTextFromGrid();
    

    const textContent = await app.export.textArea.inputValue();
    expect(textContent.toLowerCase()).toContain('insert');
    expect(textContent.toLowerCase()).toContain('into');
    expect(textContent).toContain("'");
  });
});
