import { test, expect } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

// spec: tests/app-html-test-plan.md
// seed: tests/browser/seed/test-data-setup.spec.ts

test.describe('Test Data Generation', () => {
  test('Multiple Column Test Data', async ({ page }) => {
    // Navigate to the app and wait for grid to be ready
    const app = new AppPage(page);
    await app.goto();

    // 1. Expand 'Test Data' section if collapsed
    await app.testData.expandTestDataSection();

    // 2. Add multiple column definitions with different data types
    // Add First Name column
    await app.testData.addColumnDefinition('First Name', 'faker', 'faker.name.firstName');

    // Add Email column
    await app.testData.addColumnDefinition('Email', 'faker', 'faker.internet.email');

    // Add Status column with RegEx
    await app.testData.addColumnDefinition('Status', 'regex', '(Active|Inactive)');

    // expect: Multiple column definitions are created
    const defGrid = app.page.locator('#testDataGeneratorContainer .tabulator').first();
    const rowCount = await defGrid.locator('.tabulator-row').count();
    expect(rowCount).toBeGreaterThanOrEqual(3);

    // 3. Include RegEx and Faker definitions
    // expect: Mixed definition types are accepted

    // 4. Generate data with multiple columns
    await app.testData.setHowMany('5');
    await app.testData.clickGenerate();
    await app.wait(1500);

    // expect: All columns are populated
    const gridColumns = app.page.locator('#myGrid .tabulator-col');
    const columnCount = await gridColumns.count();
    expect(columnCount).toBeGreaterThanOrEqual(3);

    // expect: RegEx patterns produce valid variations
    // expect: Faker data matches expected types
    const rows = app.page.locator('#myGrid .tabulator-row:visible');
    const firstRowCells = rows.first().locator('.tabulator-cell');
    const cellCount = await firstRowCells.count();
    expect(cellCount).toBeGreaterThanOrEqual(3);

    // Verify first row data types
    const firstNameCell = await app.grid.getCell(0, 0);
    const emailCell = await app.grid.getCell(0, 1);
    const statusCell = await app.grid.getCell(0, 2);

    const firstName = await firstNameCell.textContent();
    const email = await emailCell.textContent();
    const status = await statusCell.textContent();

    expect(firstName?.trim().length).toBeGreaterThan(0);
    expect(email?.trim().length).toBeGreaterThan(0);
    expect(status).toMatch(/Active|Inactive/);
  });
});
