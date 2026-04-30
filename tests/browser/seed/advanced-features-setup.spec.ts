import { test } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

/**
 * Seed file for Advanced Grid Features tests
 * Sets up the grid with multiple rows and columns for testing advanced features
 */
test.describe('Seed: Advanced Features Setup', () => {
  test('setup grid with multiple rows and columns', async ({ page }) => {
    const app = new AppPage(page);

    await app.goto();
    await app.resetTable();
    await app.expectPageLoaded();
  });
});
