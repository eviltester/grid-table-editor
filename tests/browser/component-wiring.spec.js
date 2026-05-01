const { test, expect } = require('@playwright/test');
const { AppPage } = require('./abstractions/app.page');

function trackPageErrors(page) {
  const pageErrors = [];
  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });
  return pageErrors;
}

test('all page-object components are wired and interactive at smoke level', async ({ page }) => {
  const pageErrors = trackPageErrors(page);
  const appPage = new AppPage(page);

  await appPage.goto();
  await appPage.gridEditor.addRow();
  await appPage.importExportControls.setTextFromGrid();
  await appPage.tabbedText.selectFormat('JSON');
  await appPage.formatOptionsPanel.expectReady();
  await appPage.testDataPanel.expand();
  await appPage.testDataPanel.expectExpanded();

  expect(await appPage.tabbedText.isCopyButtonVisible()).toBe(true);
  expect(await appPage.importExportControls.getExtensionLabel()).toBe('.json');
  expect(pageErrors).toEqual([]);
});
