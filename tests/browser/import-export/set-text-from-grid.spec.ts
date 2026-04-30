import { test, expect } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

// spec: tests/app-html-test-plan.md
// seed: tests/seed/import-export-setup.spec.ts

test.describe('Import Export Basic', () => {
  test('Set Text From Grid', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();
    app.enableDefaultDialogHandling();

    await app.grid.clickColumnControl('add-right');

    const testData = [{ col1: 'John' }, { col1: 'Jane' }, { col1: 'Bob' }];

    for (let i = 0; i < testData.length; i++) {
      await app.toolbar.clickAddRow();
      const newRow = app.page.locator('#myGrid .tabulator-row').last();
      const cell1 = newRow.locator('.tabulator-cell').first();
      await cell1.dblclick();
      await app.type(testData[i].col1);
      await app.press('Enter');
    }

    await app.export.clickTab('csv');
    await expect(app.page.getByText('Use Quotes')).toBeVisible();

    await app.export.clickSetTextFromGrid();

    const textContent = await app.export.getTextAreaContent();
    expect(textContent.length).toBeGreaterThan(0);
    expect(textContent).toContain('Instructions');
  });
});
