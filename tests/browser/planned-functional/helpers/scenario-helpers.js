const { expect } = require('@playwright/test');
const { AppPage } = require('../../abstractions/app.page');
const { trackPageErrors, seedInstructionsRows } = require('../../app-coverage/helpers/test-helpers');

async function openApp(page) {
  const pageErrors = trackPageErrors(page);
  const appPage = new AppPage(page);
  await appPage.goto();
  return { appPage, pageErrors };
}

async function seedRows(appPage, values) {
  await seedInstructionsRows(appPage, values);
  const [primaryColumnName] = await appPage.gridEditor.header.getColumnNames();
  return primaryColumnName;
}

async function ensureTextEditMode(appPage) {
  const enabled = await appPage.importExportControls.isSetGridFromTextEnabled();
  if (!enabled) {
    await appPage.tabbedText.togglePreviewEdit(true);
  }
  await expect.poll(async () => appPage.importExportControls.isSetGridFromTextEnabled()).toBeTruthy();
}

function expectNoPageErrors(pageErrors) {
  expect(pageErrors).toEqual([]);
}

module.exports = {
  openApp,
  seedRows,
  ensureTextEditMode,
  expectNoPageErrors,
  expect,
};
