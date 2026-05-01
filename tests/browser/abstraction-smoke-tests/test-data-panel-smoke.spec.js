const { test, expect } = require('@playwright/test');
const { AppPage } = require('../abstractions/app.page');

function trackPageErrors(page) {
  const pageErrors = [];
  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });
  return pageErrors;
}

test('expanded test data panel exposes interactive controls', async ({ page }) => {
  const pageErrors = trackPageErrors(page);
  const appPage = new AppPage(page);

  await appPage.goto();
  await appPage.testDataPanel.expand();
  await appPage.testDataPanel.expectExpanded();

  const currentRows = await appPage.gridEditor.renderer.countRows();
  await appPage.testDataPanel.setModeAmendTable();
  await expect.poll(async () => appPage.testDataPanel.getGenerateCount()).toBe(String(currentRows));

  await appPage.testDataPanel.setModeAmendSelected();
  await expect.poll(async () => appPage.testDataPanel.getGenerateCount()).toBe('0');

  await appPage.testDataPanel.setModeNewTable();
  await appPage.testDataPanel.setGenerateCount(3);
  expect(await appPage.testDataPanel.getGenerateCount()).toBe('3');
  expect(pageErrors).toEqual([]);
});

test('test data panel generates rows from faker and regex schema', async ({ page }) => {
  const pageErrors = trackPageErrors(page);
  const appPage = new AppPage(page);

  await appPage.goto();
  await appPage.testDataPanel.expand();
  await appPage.testDataPanel.expectExpanded();
  await appPage.testDataPanel.setModeNewTable();
  await appPage.testDataPanel.setGenerateCount(3);

  await appPage.testDataPanel.setSchemaText(`Name
person.fullName
Code
[A-Z]{3}`);
  await page.waitForTimeout(1300);

  await appPage.testDataPanel.clickGenerate();
  await expect.poll(async () => appPage.testDataPanel.getStatusText()).toContain('complete');

  await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(3);
  const columnNames = await appPage.gridEditor.header.getColumnNames();
  expect(columnNames).toContain('Name');
  expect(columnNames).toContain('Code');
  expect((await appPage.gridEditor.renderer.getCellTextByColumnName('Name', 0)).length).toBeGreaterThan(0);
  expect((await appPage.gridEditor.renderer.getCellTextByColumnName('Code', 0)).length).toBeGreaterThan(0);
  expect(pageErrors).toEqual([]);
});

test('embedded schema grid editing syncs to schema text and generates data', async ({ page }) => {
  const pageErrors = trackPageErrors(page);
  const appPage = new AppPage(page);

  await appPage.goto();
  await appPage.testDataPanel.expand();
  await appPage.testDataPanel.expectExpanded();
  await appPage.testDataPanel.setModeNewTable();
  await appPage.testDataPanel.setGenerateCount(2);

  const initialSchemaRows = await appPage.testDataPanel.getSchemaRowCount();
  await appPage.testDataPanel.addSchemaRow();
  await expect.poll(async () => appPage.testDataPanel.getSchemaRowCount()).toBe(initialSchemaRows + 1);

  const targetRow = initialSchemaRows;
  await appPage.testDataPanel.setSchemaCell(targetRow, 'columnName', 'Code');
  await appPage.testDataPanel.setSchemaTypeValue(targetRow, 'RegEx');
  await appPage.testDataPanel.setSchemaCell(targetRow, 'value', '[A-Z]{3}');

  await expect.poll(async () => appPage.testDataPanel.getSchemaText()).toContain('Code');
  await expect.poll(async () => appPage.testDataPanel.getSchemaText()).toContain('[A-Z]{3}');

  await appPage.testDataPanel.clickGenerate();
  await expect.poll(async () => appPage.testDataPanel.getStatusText()).toContain('complete');
  await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(2);
  expect((await appPage.gridEditor.renderer.getCellTextByColumnName('Code', 0)).length).toBeGreaterThan(0);
  expect(pageErrors).toEqual([]);
});
