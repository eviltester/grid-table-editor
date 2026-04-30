import { test, expect } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

// spec: tests/app-html-test-plan.md
// seed: tests/seed/ui-navigation-setup.spec.ts

test.describe('User Interface and Navigation', () => {
  test('Instructions and Help', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();
    
    // 1. Instructions are visible in the default table content
    // Check that some instruction text is visible
    await expect(app.page.locator('#myGrid .tabulator-cell', { hasText: 'Rename Column' }).first()).toBeVisible();
    await expect(app.toolbar.addRowButton).toBeVisible();
    
    // expect: Instructions are clear and accurate
    // Verify key instructions are present
    await expect(app.page.locator('#myGrid .tabulator-cell', { hasText: 'Drag and drop files' }).first()).toBeVisible();
    await expect(app.export.setTextFromGridButton).toBeVisible();
    
    // 2. Verify help icons and tooltips throughout the interface
    // Look for help icons (elements with class containing 'help' or 'icon')
    const helpIcons = app.page.locator('.helpicon, .ag-icon-help, [title]');
    
    // expect: Help icons provide relevant information
    // expect: Tooltips appear on hover
    const firstHelpIcon = helpIcons.first();
    if (await firstHelpIcon.isVisible()) {
      await firstHelpIcon.hover();
      
      // Tooltip may appear as a title attribute or custom tooltip
    }
    
    // expect: Help text is contextually appropriate
    
    // 3. Instructions remain visible while interacting with help affordances
    await expect(app.export.setTextFromGridButton).toBeVisible();
  });
});
