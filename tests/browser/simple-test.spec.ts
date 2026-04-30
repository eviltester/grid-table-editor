import { test, expect } from '@playwright/test';

test('simple test', async ({ page }) => {
  await page.goto('http://127.0.0.1:8000/app.html');
  await expect(page).toHaveTitle(/Test Data Generator/);
});
