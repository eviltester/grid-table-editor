import { test } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

/**
 * Seed file for Filtering and Sorting tests
 * Sets up the grid with sample data for testing filter and sort operations
 */
test.describe('Seed: Filter Sort Setup', () => {
  test('setup grid with sample data for filtering and sorting', async ({ page }) => {
    const app = new AppPage(page);

    await app.goto();
    await app.resetTable();
    await app.expectPageLoaded();
  });
});
