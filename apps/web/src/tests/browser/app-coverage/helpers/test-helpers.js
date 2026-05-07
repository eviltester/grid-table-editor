const { expect } = require('@playwright/test');

function trackPageErrors(page) {
  const pageErrors = [];
  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });
  return pageErrors;
}

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
}

module.exports = {
  trackPageErrors,
  seedInstructionsRows,
};
