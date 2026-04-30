import { test, expect } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

// spec: tests/app-html-test-plan.md
// seed: tests/browser/seed/test-data-setup.spec.ts

test.describe('Test Data Generation', () => {
  test('Basic Test Data Generation', async ({ page }) => {
    // Navigate to the app and wait for grid to be ready
    const app = new AppPage(page);
    await app.goto();

    // 1. Expand 'Test Data' section if collapsed
    await app.testData.expandTestDataSection();

    // expect: Test data generation interface is visible
    await expect(app.page.locator('#testDataGeneratorContainer')).toBeVisible();

    // expect: Definition grid and controls are available
    await expect(app.testData.definitionGrid).toBeVisible();

    // 2. Click '+ Add Column' in the definition grid
    // 3. Enter column definition: Name='First Name', Type='faker', Value='faker.name.firstName'
    await app.testData.addColumnDefinition('First Name', 'faker', 'faker.name.firstName');

    // expect: Definition is saved in the grid
    await expect(app.testData.definitionGrid.locator('.tabulator-cell').first()).toHaveText('First Name');

    // expect: Text schema area updates
    const schemaContent = await app.testData.textSchemaTextarea.inputValue();
    expect(schemaContent).toContain('First Name');

    // 4. Set 'How Many?' to 5 and click 'Generate' button
    await app.testData.setHowMany('5');
    await app.testData.clickGenerate();
    await app.wait(1500); // Wait for generation to complete

    // expect: 5 rows of test data are generated
    const rowCount = await app.grid.getVisibleRowCount();
    expect(rowCount).toBeGreaterThanOrEqual(5);

    // expect: Main grid is populated with faker-generated names
    const firstCell = await app.grid.getCell(0, 0);
    const firstName = await firstCell.textContent();
    expect(firstName).toBeTruthy();
    expect(firstName?.trim().length).toBeGreaterThan(0);

    // expect: Each row contains a different first name
    // Check that not all names are the same (we'll check the first two rows)
    const secondCell = await app.grid.getCell(1, 0);
    const secondName = await secondCell.textContent();
    expect(firstName).not.toEqual(secondName);
  });
});
