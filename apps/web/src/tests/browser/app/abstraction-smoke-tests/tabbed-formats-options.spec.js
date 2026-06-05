const { test, expect } = require('@playwright/test');
const { AppPage } = require('../abstractions/app.page');

const ALL_FORMATS = [
  'Markdown',
  'CSV',
  'Delimited',
  'JSON',
  'JSONL',
  'XML',
  'SQL',
  'C#',
  'Java',
  'JavaScript',
  'Kotlin',
  'Perl',
  'PHP',
  'Python',
  'Ruby',
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
  await appPage.importExportWorkspace.setTextFromGrid();

  for (const format of ALL_FORMATS) {
    await appPage.textPreviewEditor.selectFormat(format);
    await appPage.formatOptionsPanel.expectReady();
    expect(await appPage.formatOptionsPanel.hasApplyButton()).toBe(true);
  }

  await appPage.textPreviewEditor.selectFormat('CSV');
  expect(await appPage.importExportWorkspace.getExtensionLabel()).toBe('.csv');
  expect(await appPage.importExportWorkspace.isDownloadVisible()).toBe(true);
  expect(await appPage.importExportWorkspace.isImportVisible()).toBe(true);

  await appPage.textPreviewEditor.selectFormat('JSON');
  expect(await appPage.importExportWorkspace.getExtensionLabel()).toBe('.json');
  expect(await appPage.importExportWorkspace.isDownloadVisible()).toBe(true);

  expect(pageErrors).toEqual([]);
});

test('all format options become dirty and apply cleanly', async ({ page }) => {
  const pageErrors = trackPageErrors(page);
  const appPage = new AppPage(page);

  await appPage.goto();
  await appPage.importExportWorkspace.setTextFromGrid();

  for (const format of ALL_FORMATS) {
    await appPage.textPreviewEditor.selectFormat(format);
    await appPage.formatOptionsPanel.expectReady();
    expect(await appPage.formatOptionsPanel.isApplyEnabled()).toBe(false);

    await appPage.formatOptionsPanel.setFirstEditableOption();
    await appPage.formatOptionsPanel.expectApplyEnabled(true);
    await appPage.formatOptionsPanel.apply();
    await appPage.formatOptionsPanel.expectApplyEnabled(false);
  }

  expect(pageErrors).toEqual([]);
});

test('preview edit mode and set-grid-from-text state transitions are correct', async ({ page }) => {
  const pageErrors = trackPageErrors(page);
  const appPage = new AppPage(page);

  await appPage.goto();
  expect(await appPage.importExportWorkspace.isSetGridFromTextEnabled()).toBe(false);
  expect(await appPage.textPreviewEditor.getPreviewEditLabel()).toContain('Preview');

  await appPage.textPreviewEditor.togglePreviewEdit(false);
  await appPage.textPreviewEditor.expectPreviewEditLabel('Edit');
  expect(await appPage.importExportWorkspace.isSetGridFromTextEnabled()).toBe(true);

  await appPage.textPreviewEditor.togglePreviewEdit();
  await appPage.textPreviewEditor.expectPreviewEditLabelContains('Preview');
  expect(await appPage.importExportWorkspace.isSetGridFromTextEnabled()).toBe(false);

  expect(pageErrors).toEqual([]);
});

test('cross-component flow updates text and format rendering', async ({ page }) => {
  const pageErrors = trackPageErrors(page);
  const appPage = new AppPage(page);

  await appPage.goto();
  await appPage.gridEditor.addRow();
  await appPage.importExportWorkspace.setTextFromGrid();
  const csvText = await appPage.textPreviewEditor.getOutputText();
  expect(csvText.length).toBeGreaterThan(0);

  await appPage.textPreviewEditor.selectFormat('JSON');
  const jsonTextBefore = await appPage.textPreviewEditor.getOutputText();
  await appPage.formatOptionsPanel.setOption('asobject', true);
  await appPage.formatOptionsPanel.setOption('propertynamed', 'records');
  await appPage.formatOptionsPanel.apply();

  const jsonTextAfter = await appPage.textPreviewEditor.getOutputText();
  expect(jsonTextAfter.length).toBeGreaterThan(0);
  expect(jsonTextAfter).not.toBe(jsonTextBefore);
  expect(await appPage.importExportWorkspace.getExtensionLabel()).toBe('.json');
  expect(pageErrors).toEqual([]);
});
