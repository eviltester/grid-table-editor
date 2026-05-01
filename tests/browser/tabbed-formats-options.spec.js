const { test, expect } = require('@playwright/test');
const { AppPage } = require('./abstractions/app.page');

const ALL_FORMATS = [
  'Markdown',
  'CSV',
  'Delimited',
  'JSON',
  'JSONL',
  'XML',
  'SQL',
  'Java',
  'JavaScript',
  'Python',
  'TypeScript',
  'Gherkin',
  'HTML',
  'ASCII',
];

function trackPageErrors(page) {
  const pageErrors = [];
  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });
  return pageErrors;
}

test('all format tabs render options and update extension labels', async ({ page }) => {
  const pageErrors = trackPageErrors(page);
  const appPage = new AppPage(page);

  await appPage.goto();
  await appPage.importExportControls.setTextFromGrid();

  for (const format of ALL_FORMATS) {
    await appPage.tabbedText.selectFormat(format);
    await appPage.formatOptionsPanel.expectReady();
    expect(await appPage.formatOptionsPanel.hasApplyButton()).toBe(true);
  }

  await appPage.tabbedText.selectFormat('CSV');
  expect(await appPage.importExportControls.getExtensionLabel()).toBe('.csv');
  expect(await appPage.importExportControls.isDownloadVisible()).toBe(true);
  expect(await appPage.importExportControls.isImportVisible()).toBe(true);

  await appPage.tabbedText.selectFormat('JSON');
  expect(await appPage.importExportControls.getExtensionLabel()).toBe('.json');
  expect(await appPage.importExportControls.isDownloadVisible()).toBe(true);

  expect(pageErrors).toEqual([]);
});

test('all format options become dirty and apply cleanly', async ({ page }) => {
  const pageErrors = trackPageErrors(page);
  const appPage = new AppPage(page);

  await appPage.goto();
  await appPage.importExportControls.setTextFromGrid();

  for (const format of ALL_FORMATS) {
    await appPage.tabbedText.selectFormat(format);
    await appPage.formatOptionsPanel.expectReady();
    expect(await appPage.formatOptionsPanel.isApplyEnabled()).toBe(false);

    await appPage.formatOptionsPanel.setFirstEditableOption();
    await expect.poll(async () => appPage.formatOptionsPanel.isApplyEnabled()).toBe(true);
    await appPage.formatOptionsPanel.apply();
    await expect.poll(async () => appPage.formatOptionsPanel.isApplyEnabled()).toBe(false);
  }

  expect(pageErrors).toEqual([]);
});

test('preview edit mode and set-grid-from-text state transitions are correct', async ({ page }) => {
  const pageErrors = trackPageErrors(page);
  const appPage = new AppPage(page);

  await appPage.goto();
  expect(await appPage.importExportControls.isSetGridFromTextEnabled()).toBe(false);
  expect(await appPage.tabbedText.getPreviewEditLabel()).toContain('Preview');

  await appPage.tabbedText.togglePreviewEdit(false);
  await expect.poll(async () => appPage.tabbedText.getPreviewEditLabel()).toBe('Edit');
  expect(await appPage.importExportControls.isSetGridFromTextEnabled()).toBe(true);

  await appPage.tabbedText.togglePreviewEdit();
  await expect.poll(async () => appPage.tabbedText.getPreviewEditLabel()).toContain('Preview');
  expect(await appPage.importExportControls.isSetGridFromTextEnabled()).toBe(false);

  expect(pageErrors).toEqual([]);
});

test('cross-component flow updates text and format rendering', async ({ page }) => {
  const pageErrors = trackPageErrors(page);
  const appPage = new AppPage(page);

  await appPage.goto();
  await appPage.gridEditor.addRow();
  await appPage.importExportControls.setTextFromGrid();
  const csvText = await appPage.tabbedText.getOutputText();
  expect(csvText.length).toBeGreaterThan(0);

  await appPage.tabbedText.selectFormat('JSON');
  const jsonTextBefore = await appPage.tabbedText.getOutputText();
  await appPage.formatOptionsPanel.setOption('asobject', true);
  await appPage.formatOptionsPanel.setOption('propertynamed', 'records');
  await appPage.formatOptionsPanel.apply();

  const jsonTextAfter = await appPage.tabbedText.getOutputText();
  expect(jsonTextAfter.length).toBeGreaterThan(0);
  expect(jsonTextAfter).not.toBe(jsonTextBefore);
  expect(await appPage.importExportControls.getExtensionLabel()).toBe('.json');
  expect(pageErrors).toEqual([]);
});
