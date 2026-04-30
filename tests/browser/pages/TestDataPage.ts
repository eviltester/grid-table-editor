import { Page, Locator } from '@playwright/test';

export class TestDataPage {
  readonly page: Page;
  readonly testDataSection: Locator;
  readonly addColumnButton: Locator;
  readonly generateButton: Locator;
  readonly howManyTextbox: Locator;
  readonly textSchemaTextarea: Locator;
  readonly refreshPreviewButton: Locator;
  readonly definitionGrid: Locator;
  readonly newTableMode: Locator;
  readonly amendTableMode: Locator;
  readonly amendSelectedMode: Locator;

  constructor(page: Page) {
    this.page = page;
    this.testDataSection = page.locator('summary', { hasText: 'Test Data' });
    this.addColumnButton = page.getByRole('button', { name: /Add Column/i });
    this.generateButton = page.getByRole('button', { name: 'Generate' });
    this.howManyTextbox = page.locator('#generateCount');
    this.textSchemaTextarea = page.locator('#testdatadefntext');
    this.refreshPreviewButton = page.getByRole('button', { name: /Refresh Text Preview/i });
    this.definitionGrid = page.locator('#defngrid .tabulator');
    this.newTableMode = page.locator('input[name="testDataGenerationMode"][value="new-table"]');
    this.amendTableMode = page.locator('input[name="testDataGenerationMode"][value="amend-table"]');
    this.amendSelectedMode = page.locator('input[name="testDataGenerationMode"][value="amend-selected"]');
  }

  async expandTestDataSection(): Promise<void> {
    if (await this.page.locator('#testDataGeneratorContainer:visible').count()) {
      return;
    }
    await this.testDataSection.click();
    await this.page.locator('#testDataGeneratorContainer').waitFor({ state: 'visible' });
  }

  async addColumnDefinition(columnName: string, type: string, value: string): Promise<void> {
    await this.addColumnButton.click();
    // Wait for the new row to be added
    await this.page.waitForTimeout(500);
    
    // Get the last row in the definition grid
    const lastRow = this.definitionGrid.locator('.tabulator-row').last();
    
    // Fill in the column name
    const nameCell = lastRow.locator('.tabulator-cell').nth(0);
    await nameCell.dblclick();
    await this.page.keyboard.type(columnName);
    await this.page.keyboard.press('Tab');
    
    // Fill in the type
    const typeCell = lastRow.locator('.tabulator-cell').nth(1);
    await typeCell.dblclick();
    await this.page.keyboard.type(type);
    await this.page.keyboard.press('Tab');
    
    // Fill in the value
    const valueCell = lastRow.locator('.tabulator-cell').nth(2);
    await valueCell.dblclick();
    await this.page.keyboard.type(value);
    await this.page.keyboard.press('Enter');
  }

  async setHowMany(count: string): Promise<void> {
    await this.howManyTextbox.fill(count);
  }

  async clickGenerate(): Promise<void> {
    await this.generateButton.click();
  }

  async getTextSchemaContent(): Promise<string> {
    return (await this.textSchemaTextarea.inputValue()).trim();
  }

  async setTextSchemaContent(text: string): Promise<void> {
    await this.textSchemaTextarea.fill(text);
  }

  async clickRefreshPreview(): Promise<void> {
    await this.refreshPreviewButton.click();
  }

  async selectGenerationMode(mode: 'New Table' | 'Amend Table' | 'Amend Selected'): Promise<void> {
    if (mode === 'New Table') {
      await this.newTableMode.check();
      return;
    }
    if (mode === 'Amend Table') {
      await this.amendTableMode.check();
      return;
    }
    await this.amendSelectedMode.check();
  }
}
