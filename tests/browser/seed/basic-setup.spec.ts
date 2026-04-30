import { test, expect } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

/**
 * Seed file for Grid Basic Operations tests
 * Sets up the basic grid state for testing basic operations
 */
test.describe('Seed: Basic Setup', () => {
  test('setup basic grid', async ({ page }) => {
    const app = new AppPage(page);
    
    // Navigate to the app
    await app.goto();
    
    // Reset table to clear instructions from grid
    await app.resetTable();
    
    // Verify basic elements are present
    await app.expectPageLoaded();
  });
});
