import { test, expect } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

// spec: tests/app-html-test-plan.md
// seed: tests/browser/seed/test-data-setup.spec.ts

test.describe('Test Data Generation', () => {
  test('Test Data Text Schema', async ({ page }) => {
    // Navigate to the app and wait for grid to be ready
    const app = new AppPage(page);
    await app.goto();

    // 1. Expand 'Test Data' section if collapsed
    await app.testData.expandTestDataSection();

    // 2. Enter test data definition directly in 'Test Data Text Schema' textarea
    const schemaTextArea = app.page.locator('#testDataGeneratorContainer textarea').first();
    await expect(schemaTextArea).toBeVisible();

    // Enter a text schema definition
    const schemaDefinition = `First Name|faker|faker.name.firstName
Email|faker|faker.internet.email
Status|regex|(Active|Inactive)`;

    await schemaTextArea.fill(schemaDefinition);
    await app.wait(500);

    // expect: Text schema accepts manual input
    const textContent = await schemaTextArea.inputValue();
    expect(textContent).toContain('First Name');

    // expect: Definition grid updates to match text input
    await app.testData.clickRefreshPreview();
    await app.wait(500);

    // 3. Use complex faker expressions and RegEx patterns
    const complexSchema = `Product|faker|faker.commerce.productName
Price|faker|faker.commerce.price
Category|(Electronics|Clothing|Food|Books)`;

    await schemaTextArea.fill(complexSchema);
    await app.wait(500);

    // expect: Complex expressions are parsed correctly
    // expect: Generated data matches complex patterns

    // Click 'Refresh Text Preview' button
    await app.testData.clickRefreshPreview();
    await app.wait(500);

    // expect: Text schema is synchronized with definition grid
    // expect: Preview reflects current definitions

    // Generate data to verify
    await app.testData.setHowMany('3');
    await app.testData.clickGenerate();
    await app.wait(1500);

    // Verify data was generated
    const rows = app.page.locator('#myGrid .tabulator-row:visible');
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);
  });
});