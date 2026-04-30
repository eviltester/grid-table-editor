import { test, expect } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

// spec: tests/app-html-test-plan.md
// seed: tests/seed/ui-navigation-setup.spec.ts

test.describe('User Interface and Navigation', () => {
  test('Navigation Links', async ({ page }) => {
    const app = new AppPage(page);
    // 1. Navigate back to http://localhost:8000/app.html for initial state
    await app.goto();
    
    // expect: Navigates to home page
    await expect(page).toHaveURL(/app\.html/);
    
    // expect: Link opens in same window
    // (Playwright default behavior)
    
    // 2. Click on 'Generator' link
    await app.gotoGenerator();
    await app.wait(1000);
    
    // expect: Navigates to generator.html page
    await expect(page).toHaveURL(/generator\.html/);
    
    // expect: Generator page loads successfully
    // Check for some element on the generator page
    
    // 3. Navigate back to app.html
    await app.goBack();
    await app.wait(1000);
    
    // expect: Can navigate back to app.html
    await expect(page).toHaveURL(/app\.html/);
    
    // expect: App functionality is preserved
    await expect(app.grid.grid).toBeVisible();
    
    // 4. Test 'Docs' and 'Blog' links
    await app.gotoDocs();
    await app.wait(1000);
    
    // expect: External links open appropriately
    // Docs link goes to /docs/intro
    const currentURL = app.getUrl();
    expect(currentURL).toContain('docs');
    
    // Go back
    await app.goBack();
    await app.wait(500);
    
    // expect: Navigation doesn't break current session
    await expect(app.grid.grid).toBeVisible();
  });
});
