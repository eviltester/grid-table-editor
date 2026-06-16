const fs = require('fs');
const { test } = require('@playwright/test');
const { openGenerator, expectNoPageErrors, expect } = require('../abstractions/helpers/scenario-helpers');

test.describe('Generator Schema File Load Save', () => {
  test('loads schema text from a file and saves the current generator schema to a file', async ({ page }) => {
    const { generatorPage, pageErrors } = await openGenerator(page);

    await generatorPage.schema.loadSchemaFile({
      name: 'schema.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('Generated Name\nliteral(Ada)\nGenerated Status\nenum(active,inactive)'),
    });

    expect(await generatorPage.schema.getSchemaText()).toContain('Generated Name');
    expect(await generatorPage.schema.getSchemaText()).toContain('Generated Status');

    const download = await generatorPage.schema.saveSchemaFileAndWaitForDownload();
    expect(download.suggestedFilename()).toBe('schema.txt');

    const fileText = fs.readFileSync(await download.path(), 'utf8');
    expect(fileText).toContain('Generated Name');
    expect(fileText).toContain('Generated Status');
    expectNoPageErrors(pageErrors);
  });
});
