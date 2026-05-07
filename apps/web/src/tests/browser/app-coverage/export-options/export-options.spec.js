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

  await expect.poll(async () => appPage.formatOptionsPanel.isApplyEnabled()).toBe(false);
  await appPage.formatOptionsPanel.setFirstEditableOption();
  await expect.poll(async () => appPage.formatOptionsPanel.isApplyEnabled()).toBe(true);
  await appPage.formatOptionsPanel.apply();
  await expect.poll(async () => appPage.formatOptionsPanel.isApplyEnabled()).toBe(false);

  const after = await appPage.tabbedText.getOutputText();
  expect(after.length).toBeGreaterThan(0);
  expect(after).not.toBe(before);
  expect(pageErrors).toEqual([]);
});

test('preview edit mode toggles and controls set-grid-from-text availability', async ({ page }) => {
  const pageErrors = trackPageErrors(page);
  const appPage = new AppPage(page);
  await appPage.goto();

  await expect.poll(async () => appPage.importExportControls.isSetGridFromTextEnabled()).toBe(false);
  await appPage.tabbedText.togglePreviewEdit(false);
  await expect.poll(async () => appPage.tabbedText.getPreviewEditLabel()).toBe('Edit');
  await expect.poll(async () => appPage.importExportControls.isSetGridFromTextEnabled()).toBe(true);
  await appPage.tabbedText.togglePreviewEdit();
  await expect.poll(async () => appPage.tabbedText.getPreviewEditLabel()).toContain('Preview');

  expect(pageErrors).toEqual([]);
});
