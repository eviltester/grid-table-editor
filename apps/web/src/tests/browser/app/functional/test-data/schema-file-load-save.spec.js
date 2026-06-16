const fs = require('fs');
const { test } = require('@playwright/test');
const { openApp, expectNoPageErrors, expect } = require('../../abstractions/helpers/scenario-helpers');

test.describe('Test Data Schema File Load Save', () => {
  test('loads schema text from a file and saves the current schema back to a file', async ({ page }) => {
    const { appPage, pageErrors } = await openApp(page);

    await appPage.testDataPanel.expand();
    await appPage.testDataPanel.loadSchemaFile({
      name: 'schema.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('Loaded Name\nliteral(Ada)\nLoaded Status\nenum(active,inactive)'),
    });

    await expect.poll(async () => appPage.testDataPanel.getSchemaText()).toContain('Loaded Name');
    await expect.poll(async () => appPage.testDataPanel.getSchemaText()).toContain('Loaded Status');

    const download = await appPage.testDataPanel.saveSchemaFileAndWaitForDownload();
    expect(download.suggestedFilename()).toBe('schema.txt');

    const fileText = fs.readFileSync(await download.path(), 'utf8');
    expect(fileText).toContain('Loaded Name');
    expect(fileText).toContain('Loaded Status');
    expectNoPageErrors(pageErrors);
  });
});
