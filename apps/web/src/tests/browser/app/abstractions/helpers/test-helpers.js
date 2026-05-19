const { expect } = require('@playwright/test');
const { trackPageErrors } = require('../../../shared/helpers/page-error-helpers');

async function seedInstructionsRows(appPage, values) {
  await appPage.gridEditor.resetTable();
  await expect.poll(async () => appPage.gridEditor.renderer.countRows()).toBe(0);

  const startingRows = await appPage.gridEditor.renderer.countRows();
  for (let i = 0; i < values.length; i += 1) {
    await appPage.gridEditor.addRow();
  }
  await expect
    .poll(async () => appPage.gridEditor.renderer.countRows(), { message: 'rows should be added before data entry' })
    .toBe(startingRows + values.length);

  const [primaryColumnName] = await appPage.gridEditor.header.getColumnNames();
  for (let i = 0; i < values.length; i += 1) {
    await appPage.gridEditor.renderer.setCellTextByColumnName(primaryColumnName, i, values[i]);
    await expect
      .poll(async () => appPage.gridEditor.renderer.getCellTextByColumnName(primaryColumnName, i))
      .toBe(values[i]);
  }

  await appPage.gridEditor.renderer.waitForGridSettle({ columnName: primaryColumnName, sampleSize: values.length });
}

module.exports = {
  trackPageErrors,
  seedInstructionsRows,
};
