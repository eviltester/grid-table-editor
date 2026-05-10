const { test, expect } = require('@playwright/test');
const { AppPage } = require('../../abstractions/app.page');
const { trackPageErrors, seedInstructionsRows } = require('../helpers/test-helpers');

test('format options become dirty, apply, and update output state', async ({ page }) => {
  const pageErrors = trackPageErrors(page);
  const appPage = new AppPage(page);
  await appPage.goto();
  await seedInstructionsRows(appPage, ['Alpha', 'Beta']);
  await appPage.tabbedText.selectFormat('CSV');
  await appPage.importExportControls.setTextFromGrid();
  const before = await appPage.tabbedText.getOutputText();

  await appPage.formatOptionsPanel.expectApplyEnabled(false);
  await appPage.formatOptionsPanel.setFirstEditableOption();
  await appPage.formatOptionsPanel.expectApplyEnabled(true);
  await appPage.formatOptionsPanel.apply();
  await appPage.formatOptionsPanel.expectApplyEnabled(false);

  const after = await appPage.tabbedText.getOutputText();
  expect(after.length).toBeGreaterThan(0);
  expect(after).not.toBe(before);
  expect(pageErrors).toEqual([]);
});

test('preview edit mode toggles and controls set-grid-from-text availability', async ({ page }) => {
  const pageErrors = trackPageErrors(page);
  const appPage = new AppPage(page);
  await appPage.goto();

  await appPage.importExportControls.expectSetGridFromTextEnabled(false);
  await appPage.tabbedText.togglePreviewEdit(false);
  await appPage.tabbedText.expectPreviewEditLabel('Edit');
  await appPage.importExportControls.expectSetGridFromTextEnabled(true);
  await appPage.tabbedText.togglePreviewEdit();
  await appPage.tabbedText.expectPreviewEditLabelContains('Preview');

  expect(pageErrors).toEqual([]);
});
