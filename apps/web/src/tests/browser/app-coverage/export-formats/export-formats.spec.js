const { test, expect } = require('@playwright/test');
const { AppPage } = require('../../abstractions/app.page');
const { trackPageErrors, seedInstructionsRows } = require('../helpers/test-helpers');

const FORMAT_EXPECTATIONS = [
  { format: 'Markdown' },
  { format: 'CSV' },
  { format: 'Delimited' },
  { format: 'JSON' },
  { format: 'JSONL' },
  { format: 'XML' },
  { format: 'SQL' },
  { format: 'C#' },
  { format: 'Java' },
  { format: 'JavaScript' },
  { format: 'Kotlin' },
  { format: 'Perl' },
  { format: 'PHP' },
  { format: 'Python' },
  { format: 'Ruby' },
  { format: 'TypeScript' },
  { format: 'Gherkin' },
  { format: 'HTML' },
  { format: 'ASCII' },
];

test('all export formats can render output text via page abstractions', async ({ page }) => {
  const pageErrors = trackPageErrors(page);
  const appPage = new AppPage(page);
  await appPage.goto();
  await seedInstructionsRows(appPage, ['Alpha', 'Beta']);

  for (const { format } of FORMAT_EXPECTATIONS) {
    await appPage.tabbedText.selectFormat(format);
    await appPage.formatOptionsPanel.expectReady();
    await appPage.importExportControls.setTextFromGrid();
    await expect.poll(async () => (await appPage.tabbedText.getOutputText()).length).toBeGreaterThan(0);
  }

  await appPage.tabbedText.selectFormat('CSV');
  await expect.poll(async () => appPage.importExportControls.getExtensionLabel()).toBe('.csv');
  await appPage.tabbedText.selectFormat('JSON');
  await expect.poll(async () => appPage.importExportControls.getExtensionLabel()).toBe('.json');

  expect(pageErrors).toEqual([]);
});
