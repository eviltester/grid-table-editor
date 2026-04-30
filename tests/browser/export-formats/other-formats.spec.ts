import { test, expect } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

// spec: tests/app-html-test-plan.md
// seed: tests/seed/export-formats-setup.spec.ts

test.describe('Export Formats', () => {
  test('All Other Formats', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();
    app.enableDefaultDialogHandling();
    await app.wait(1000);

    await app.grid.addColumnRight();
    await app.wait(500);

    for (const value of ['John', 'Jane']) {
      await app.toolbar.clickAddRow();
      await app.wait(300);
      await app.grid.editCell((await app.grid.getRowCount()) - 1, 0, value);
      await app.wait(200);
    }

    for (const format of ['delimited', 'jsonl', 'code', 'gherkin', 'ascii']) {
      await app.export.clickTab(format);
      await app.wait(500);
      await app.export.clickSetTextFromGrid();
      await app.wait(500);
      const textContent = await app.export.textArea.inputValue();
      expect(textContent.length).toBeGreaterThan(0);
      expect(textContent).toBeTruthy();
    }
  });
});
