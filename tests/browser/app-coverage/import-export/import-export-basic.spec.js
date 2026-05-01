const fs = require('fs');
const os = require('os');
const path = require('path');
const { test, expect } = require('@playwright/test');
const { AppPage } = require('../../abstractions/app.page');
const { trackPageErrors, seedInstructionsRows } = require('../helpers/test-helpers');

test('set text from grid and set grid from text round trip with csv', async ({ page }) => {
  const pageErrors = trackPageErrors(page);
  const appPage = new AppPage(page);
  await appPage.goto();

  await seedInstructionsRows(appPage, ['One', 'Two']);
  await appPage.tabbedText.selectFormat('CSV');
  await appPage.importExportControls.setTextFromGrid();
  await expect.poll(async () => appPage.tabbedText.getOutputText()).toContain('One');

  await appPage.tabbedText.togglePreviewEdit(false);
  await expect.poll(async () => appPage.importExportControls.isSetGridFromTextEnabled()).toBe(true);

  await appPage.tabbedText.setOutputText('Name,Code\nAlice,A1\nBob,B2');
  await appPage.importExportControls.setGridFromText();
  await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).toEqual(['Name', 'Code']);
  await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(2);
  await expect.poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName('Name', 0)).toBe('Alice');

  expect(pageErrors).toEqual([]);
});

test('csv file upload imports into the grid and malformed csv does not crash page', async ({ page }) => {
  const pageErrors = trackPageErrors(page);
  const appPage = new AppPage(page);
  await appPage.goto();

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'app-html-upload-'));
  const goodCsvPath = path.join(tempDir, 'good.csv');
  fs.writeFileSync(goodCsvPath, 'ColA,ColB\nA1,B1\nA2,B2', 'utf8');

  await appPage.importExportControls.uploadFile(goodCsvPath);
  await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).toEqual(['ColA', 'ColB']);
  await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(2);

  await appPage.tabbedText.togglePreviewEdit(false);
  await appPage.tabbedText.setOutputText('"unterminated,quote\nfoo,bar');
  await appPage.importExportControls.setGridFromText();
  await expect.poll(async () => (await appPage.gridEditor.header.getColumnNames()).length).toBeGreaterThan(0);

  expect(pageErrors).toEqual([]);
});
