import { test, expect } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

// spec: tests/app-html-test-plan.md
// seed: tests/seed/ui-navigation-setup.spec.ts

test.describe('User Interface and Navigation', () => {
  test('Responsive Layout', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();
    
    // 1. Resize browser window to test responsive behavior
    // Test with a medium-sized window
    await app.setViewport(1024, 768);
    await app.wait(500);
    
    // expect: Layout adapts to different screen sizes
    await expect(app.grid.grid).toBeVisible();
    
    // expect: Grid remains usable
    const addRowBtn = app.toolbar.addRowButton;
    await expect(addRowBtn).toBeVisible();
    
    // expect: No horizontal scrolling issues
    // Check that the page content fits within the viewport
    const { bodyWidth, viewportWidth } = await app.getPageWidths();
    // Allow some tolerance
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20);
    
    // 2. Test interface on mobile viewport sizes
    await app.setViewport(375, 667); // iPhone SE size
    await app.wait(500);
    
    // expect: Interface remains functional on smaller screens
    await expect(app.grid.grid).toBeVisible();
    await expect(addRowBtn).toBeVisible();
    
    // expect: Touch interactions work appropriately
    // The grid should still be interactive
    const cell = await app.grid.getCell(0, 0);
    await expect(cell).toBeVisible();
    
    // Test that buttons are still accessible
    await expect(app.toolbar.resetTableButton).toBeVisible();
    
    // Reset to default size
    await app.setViewport(1280, 720);
    await app.wait(500);
    
    await expect(app.grid.grid).toBeVisible();
  });
});
