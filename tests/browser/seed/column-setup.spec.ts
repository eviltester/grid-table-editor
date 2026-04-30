import { test, expect } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

/**
 * Seed file for Column Operations tests
 * Sets up the grid with multiple columns for testing column operations
 */
test.describe('Seed: Column Setup', () => {
  test('setup grid with multiple columns', async ({ page }) => {
    const app = new AppPage(page);

    // Navigate to the app and wait for grid to be ready
    await app.goto();

    // Reset table to clear instructions
    await app.toolbar.clickResetTable();
    

    // Verify basic elements are present
    await app.expectPageLoaded();
  });
});
