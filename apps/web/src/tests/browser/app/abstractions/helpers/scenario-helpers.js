const { expect } = require('@playwright/test');
const { AppPage } = require('../../abstractions/app.page');
const { seedInstructionsRows } = require('./test-helpers');
const { trackPageErrors, expectNoPageErrors } = require('../../../shared/helpers/page-error-helpers');

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
  const enabled = await appPage.importExportWorkspace.isSetGridFromTextEnabled();
  if (!enabled) {
    await appPage.textPreviewEditor.togglePreviewEdit(true);
  }
  await appPage.importExportWorkspace.expectSetGridFromTextEnabled(true);
}

module.exports = {
  openApp,
  seedRows,
  ensureTextEditMode,
  expectNoPageErrors,
  expect,
};
