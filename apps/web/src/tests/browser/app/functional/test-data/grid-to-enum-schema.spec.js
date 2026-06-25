const { test } = require('@playwright/test');
const { openApp, expectNoPageErrors, expect } = require('../../abstractions/helpers/scenario-helpers');

async function seedEnumGrid(appPage) {
  await appPage.gridEditor.resetTable();
  await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(0);

  await appPage.gridEditor.header.renameColumn('~rename-me', 'Status');
  await appPage.gridEditor.header.addColumnRight('Status', 'Priority');

  for (let rowIndex = 0; rowIndex < 4; rowIndex += 1) {
    await appPage.gridEditor.addRow();
  }
  await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(4);

  const statusValues = ['active', 'pending', 'active', 'inactive'];
  const priorityValues = ['high', 'low', 'low', 'high'];

  for (let rowIndex = 0; rowIndex < statusValues.length; rowIndex += 1) {
    await appPage.gridEditor.renderer.setCellTextByColumnName('Status', rowIndex, statusValues[rowIndex]);
    await appPage.gridEditor.renderer.setCellTextByColumnName('Priority', rowIndex, priorityValues[rowIndex]);
  }

  await appPage.gridEditor.renderer.waitForGridSettle({ columnName: 'Status', sampleSize: 4 });
}

test.describe('7. Test Data Generation', () => {
  test('builds enum schema rows from the current grid', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await seedEnumGrid(appPage);
    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.openGridToEnumSchemaDialog();
    await appPage.testDataPanel.submitGridToEnumSchemaLimit(256);

    await expect.poll(async () => appPage.testDataPanel.getSchemaRowCount()).toBe(2);
    await expect
      .poll(async () => appPage.testDataPanel.getSchemaText())
      .toContain('Status\nenum("active","pending","inactive")');
    await expect(await appPage.testDataPanel.getSchemaCell(0, 'columnName')).toBe('Status');
    await expect(await appPage.testDataPanel.getSchemaCell(1, 'columnName')).toBe('Priority');
    expectNoPageErrors(pageErrors);
  });

  test('confirms truncation when the requested enum limit is lower than current unique counts', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await seedEnumGrid(appPage);
    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.openGridToEnumSchemaDialog();
    await appPage.testDataPanel.submitGridToEnumSchemaLimit(2);
    await appPage.testDataPanel.confirmDialog.confirm({ confirmLabel: /truncate schema/i });

    await expect.poll(async () => appPage.testDataPanel.getSchemaText()).toContain('Status\nenum("active","pending")');
    await expect.poll(async () => appPage.testDataPanel.getSchemaText()).not.toContain('inactive');
    expectNoPageErrors(pageErrors);
  });
});
