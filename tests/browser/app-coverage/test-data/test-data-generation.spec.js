const { test, expect } = require('@playwright/test');
const { AppPage } = require('../../abstractions/app.page');
const { trackPageErrors } = require('../helpers/test-helpers');

test('test data panel can define faker/regex schema and generate rows', async ({ page }) => {
  const pageErrors = trackPageErrors(page);
  const appPage = new AppPage(page);
  await appPage.goto();

  await appPage.testDataPanel.expand();
  await appPage.testDataPanel.expectExpanded();
  await appPage.testDataPanel.setModeNewTable();
  await appPage.testDataPanel.setGenerateCount(5);
  await appPage.testDataPanel.setSchemaText('First Name\nfaker.person.fullName\nCode\n[A-Z]{3}');
  await expect.poll(async () => appPage.testDataPanel.getSchemaRowCount()).toBe(2);

  await appPage.testDataPanel.clickGenerate();
  await expect.poll(async () => appPage.testDataPanel.getStatusText()).toContain('complete');
  await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(5);
  await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).toContain('First Name');
  await expect.poll(async () => appPage.gridEditor.header.getColumnNames()).toContain('Code');

  expect(pageErrors).toEqual([]);
});

test('test data modes new table, amend table and amend selected produce expected state transitions', async ({
  page,
}) => {
  const pageErrors = trackPageErrors(page);
  const appPage = new AppPage(page);
  await appPage.goto();
  await appPage.testDataPanel.expand();
  await appPage.testDataPanel.expectExpanded();

  await appPage.testDataPanel.setSchemaText('Name\nfaker.person.fullName');
  await expect.poll(async () => appPage.testDataPanel.getSchemaRowCount()).toBe(1);

  await appPage.testDataPanel.setModeNewTable();
  await appPage.testDataPanel.setGenerateCount(2);
  await appPage.testDataPanel.clickGenerate();
  await expect.poll(async () => appPage.testDataPanel.getStatusText()).toContain('complete');
  await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBeGreaterThan(0);

  await appPage.testDataPanel.setModeAmendTable();
  const currentRows = await appPage.gridEditor.renderer.countRows();
  await expect.poll(async () => appPage.testDataPanel.getGenerateCount()).toBe(String(currentRows));

  await appPage.gridEditor.selectRows([0, 1]);
  await appPage.testDataPanel.setModeAmendSelected();
  await expect.poll(async () => Number(await appPage.testDataPanel.getGenerateCount())).toBeGreaterThan(0);
  await appPage.testDataPanel.clickGenerate();
  await expect.poll(async () => appPage.testDataPanel.getStatusText()).toContain('complete');

  expect(pageErrors).toEqual([]);
});
