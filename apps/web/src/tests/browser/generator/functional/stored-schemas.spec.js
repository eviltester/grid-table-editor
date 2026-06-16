const { test } = require('@playwright/test');
const { openGenerator, expectNoPageErrors, expect } = require('../abstractions/helpers/scenario-helpers');

test.describe('Generator Stored Schemas', () => {
  test('successful generation records the current schema in last used and can reload it', async ({ page }) => {
    const { generatorPage, pageErrors } = await openGenerator(page);

    await generatorPage.schema.setSchemaText('Generated Name\nliteral(Ada)\nGenerated Status\nliteral(active)');
    await generatorPage.generateOptions.setRowsCount(2);
    await generatorPage.downloadGeneratedData();

    await generatorPage.schema.setSchemaText('Replacement Name\nliteral(Bob)');
    await generatorPage.schema.loadLastUsed();

    expect(await generatorPage.schema.getSchemaText()).toContain('Generated Name');
    expect(await generatorPage.schema.getSchemaText()).toContain('Generated Status');
    expectNoPageErrors(pageErrors);
  });

  test('saved schemas can be loaded from the shared dialog on the generator surface', async ({ page }) => {
    const { generatorPage, pageErrors } = await openGenerator(page);

    await generatorPage.schema.setSchemaText('Dialog Name\nliteral(Ada)');
    await generatorPage.schema.saveSchemaAs('Dialog Schema');
    await generatorPage.schema.setSchemaText('Different Name\nliteral(Bob)');
    await generatorPage.schema.loadSavedSchemaByName('Dialog Schema');
    expect(await generatorPage.schema.getSchemaText()).toContain('Dialog Name');

    expectNoPageErrors(pageErrors);
  });
});
