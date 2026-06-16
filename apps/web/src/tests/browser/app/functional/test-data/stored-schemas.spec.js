const { test } = require('@playwright/test');
const { openApp, expectNoPageErrors, expect } = require('../../abstractions/helpers/scenario-helpers');
const { GeneratorPage } = require('../../../generator/abstractions/generator.page');

test.describe('Test Data Stored Schemas', () => {
  test('draft recovery restores schema text after a reload', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.setSchemaText('Draft Name\nliteral(Ada)\nDraft Status\nliteral(active)');
    await appPage.testDataPanel.expandStoredSchemas();
    await expect(appPage.testDataPanel.storedSchemasRecoverDraftButton).toBeEnabled();

    await appPage.goto();
    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.recoverDraft();

    expect(await appPage.testDataPanel.getSchemaText()).toContain('Draft Name');
    expect(await appPage.testDataPanel.getSchemaText()).toContain('Draft Status');
    expectNoPageErrors(pageErrors);
  });

  test('saved schemas created in the app can be loaded in the generator because storage is shared', async ({
    page,
  }) => {
    const { appPage, pageErrors } = await openApp(page);

    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.setSchemaText('Cross Surface\nliteral(shared)\nOrigin\nliteral(app)');
    await appPage.testDataPanel.saveSchemaAs('Cross Surface Schema');

    const generatorPage = new GeneratorPage(page);
    await generatorPage.goto();
    await generatorPage.schema.loadSavedSchemaByName('Cross Surface Schema');

    expect(await generatorPage.schema.getSchemaText()).toContain('Cross Surface');
    expect(await generatorPage.schema.getSchemaText()).toContain('Origin');
    expectNoPageErrors(pageErrors);
  });
});
