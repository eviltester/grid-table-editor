import { test } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

/**
 * Seed file for Test Data Generation tests
 * Sets up the grid for testing test data generation features
 */
test.describe('Seed: Test Data Setup', () => {
  test('setup for test data generation tests', async ({ page }) => {
    const app = new AppPage(page);

    await app.goto();
    await app.resetTable();
    await app.expectPageLoaded();
  });
});
