import { test } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

/**
 * Seed file for Error Handling and Edge Cases tests
 * Sets up the grid for testing error handling and edge cases
 */
test.describe('Seed: Error Handling Setup', () => {
  test('setup for error handling tests', async ({ page }) => {
    const app = new AppPage(page);

    await app.goto();
    await app.resetTable();
    await app.expectPageLoaded();
  });
});
