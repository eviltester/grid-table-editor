import { test } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

/**
 * Seed file for User Interface and Navigation tests
 * Sets up the app for testing UI and navigation features
 */
test.describe('Seed: UI Navigation Setup', () => {
  test('setup for UI navigation tests', async ({ page }) => {
    const app = new AppPage(page);

    await app.goto();
    await app.resetTable();
    await app.expectPageLoaded();
  });
});
