import { test } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

/**
 * Seed file for Export Options and Controls tests
 * Sets up the grid for testing export options and controls
 */
test.describe('Seed: Export Options Setup', () => {
  test('setup grid for export options tests', async ({ page }) => {
    const app = new AppPage(page);

    await app.goto();
    await app.resetTable();
    await app.expectPageLoaded();
  });
});
