import { test } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

/**
 * Seed file for Import Export Basic tests
 * Sets up the grid for testing import/export functionality
 */
test.describe('Seed: Import Export Setup', () => {
  test('setup grid for import export tests', async ({ page }) => {
    const app = new AppPage(page);

    await app.goto();
    await app.resetTable();
    await app.expectPageLoaded();
  });
});
