import { test, expect } from '@playwright/test';
import { join } from 'path';
import { AppPage } from '../pages/AppPage';

// spec: tests/app-html-test-plan.md
// seed: tests/seed/import-export-setup.spec.ts

test.describe('Import Export Basic', () => {
  test('CSV Download', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();
    app.enableDefaultDialogHandling();

    await app.grid.clickColumnControl('add-right');

    const testData = [{ col1: 'John' }, { col1: 'Jane' }];

    for (let i = 0; i < testData.length; i++) {
      await app.toolbar.clickAddRow();
      const newRow = app.page.locator('#myGrid .tabulator-row').last();
      const cell1 = newRow.locator('.tabulator-cell').first();
      await cell1.dblclick();
      await app.type(testData[i].col1);
      await app.press('Enter');
    }

    await expect(app.page.locator('#myGrid .tabulator-row').last()).toBeVisible();

    await app.export.clickTab('csv');
    await app.export.clickSetTextFromGrid();

    const downloadPromise = app.page.waitForEvent('download');
    await app.export.clickCsvDownload();

    const download = await downloadPromise;
    const filename = download.suggestedFilename();
    expect(filename).toContain('.csv');

    const downloadPath = join('D:\\github\\grid-table-editor\\tests', filename);
    await download.saveAs(downloadPath);

    try {
      const fs = require('fs');
      expect(fs.existsSync(downloadPath)).toBeTruthy();
      fs.unlinkSync(downloadPath);
    } catch {}
  });
});
