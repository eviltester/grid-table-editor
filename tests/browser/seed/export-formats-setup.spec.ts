import { test } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

/**
 * Seed file for Export Formats tests
 * Sets up the grid with sample data for testing various export formats
 */
test.describe('Seed: Export Formats Setup', () => {
  test('setup grid with data for export format tests', async ({ page }) => {
    const app = new AppPage(page);

    await app.goto();
    await app.resetTable();
    await app.expectPageLoaded();
  });
});
