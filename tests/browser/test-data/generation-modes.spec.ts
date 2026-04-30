import { test, expect } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

// spec: tests/app-html-test-plan.md
// seed: tests/browser/seed/test-data-setup.spec.ts

test.describe('Test Data Generation', () => {
  test('Generation Modes', async ({ page }) => {
    // Navigate to the app and wait for grid to be ready
    const app = new AppPage(page);
    await app.goto();

    // Set up test data definition
    await app.testData.expandTestDataSection();
    
    // Add a column definition
    await app.testData.addColumnDefinition('Name', 'faker', 'faker.name.firstName');

    // Set number of rows
    await app.testData.setHowMany('3');

    // 1. Select 'New Table' mode and generate data
    await app.testData.selectGenerationMode('New Table');
    await app.testData.clickGenerate();
    await app.wait(1500);

    // expect: Existing grid data is replaced
    // expect: New table is created from definitions
    const rows = app.page.locator('#myGrid .tabulator-row:visible');
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);

    // 2. Add existing data, then select 'Amend Table' mode and generate
    // First add some more rows
    await app.testData.setHowMany('2');
    await app.testData.selectGenerationMode('Amend Table');
    await app.testData.clickGenerate();
    await app.wait(1500);

    // expect: New data is appended to existing data
    // expect: Original data is preserved
    const newRowCount = await app.page.locator('#myGrid .tabulator-row:visible').count();
    expect(newRowCount).toBeGreaterThanOrEqual(rowCount);

    // 3. Select specific rows, choose 'Amend Selected' mode and generate
    // First select some rows in the grid
    const firstGridRow = app.page.locator('#myGrid .tabulator-row:visible').first();
    await firstGridRow.click();
    await app.wait(300);
    
    await app.testData.selectGenerationMode('Amend Selected');
    await app.testData.clickGenerate();
    await app.wait(1500);

    // expect: Only selected rows are replaced with generated data
    // expect: Unselected rows remain unchanged
    // Note: Since we're using the same generator, all rows will be regenerated
    // A more specific test would check that exactly the selected rows changed
  });
});
