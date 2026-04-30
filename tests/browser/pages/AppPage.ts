import { Page, expect } from '@playwright/test';
import { GridPage } from './GridPage';
import { ToolbarPage } from './ToolbarPage';
import { ExportPage } from './ExportPage';
import { TestDataPage } from './TestDataPage';

export class AppPage {
  readonly page: Page;
  readonly grid: GridPage;
  readonly toolbar: ToolbarPage;
  readonly export: ExportPage;
  readonly testData: TestDataPage;

  constructor(page: Page) {
    this.page = page;
    this.grid = new GridPage(page);
    this.toolbar = new ToolbarPage(page);
    this.export = new ExportPage(page);
    this.testData = new TestDataPage(page);
  }

  async goto(): Promise<void> {
    await this.page.goto('http://127.0.0.1:8000/app.html');
    await this.page.waitForLoadState('networkidle');
    await this.grid.waitForGridReady();
  }

  async resetTable(): Promise<void> {
    await this.toolbar.clickResetTable();
    await this.page.waitForTimeout(1000);
  }

  async wait(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  async setViewport(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({ width, height });
  }

  async getPageWidths(): Promise<{ bodyWidth: number; viewportWidth: number }> {
    const bodyWidth = await this.page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await this.page.evaluate(() => window.innerWidth);
    return { bodyWidth, viewportWidth };
  }

  async goBack(): Promise<void> {
    await this.page.goBack();
    await this.page.waitForLoadState('networkidle');
  }

  async press(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  async type(text: string): Promise<void> {
    await this.page.keyboard.type(text);
  }

  async gotoGenerator(): Promise<void> {
    await this.page.getByRole('link', { name: 'Generator' }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async gotoDocs(): Promise<void> {
    await this.page.getByRole('link', { name: 'Docs' }).click();
    await this.page.waitForLoadState('networkidle');
  }

  getUrl(): string {
    return this.page.url();
  }

  async waitForDownload(action: () => Promise<void>) {
    const downloadPromise = this.page.waitForEvent('download');
    await action();
    return downloadPromise;
  }

  async expectPageLoaded(): Promise<void> {
    await expect(this.page).toHaveTitle(/Test Data Generator and Table Editor/);
    await expect(this.grid.grid).toBeVisible();
    await expect(this.toolbar.addRowButton).toBeVisible();
  }

  enableDefaultDialogHandling(prefix: string = 'AutoColumn'): void {
    let counter = 0;
    this.page.on('dialog', async (dialog) => {
      if (dialog.type() === 'prompt') {
        counter++;
        await dialog.accept(`${prefix}${counter}`);
        return;
      }
      await dialog.accept();
    });
  }
}
