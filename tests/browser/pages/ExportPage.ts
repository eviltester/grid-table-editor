import { Page, Locator } from '@playwright/test';

export class ExportPage {
  readonly page: Page;
  readonly setTextFromGridButton: Locator;
  readonly setGridFromTextButton: Locator;
  readonly csvDownloadButton: Locator;
  readonly csvImportButton: Locator;
  readonly csvFileInput: Locator;
  readonly dragDropZone: Locator;
  readonly previewButton: Locator;
  readonly copyButton: Locator;
  readonly textArea: Locator;
  readonly tabs: {
    markdown: Locator;
    csv: Locator;
    delimited: Locator;
    json: Locator;
    jsonl: Locator;
    xml: Locator;
    sql: Locator;
    code: Locator;
    gherkin: Locator;
    html: Locator;
    ascii: Locator;
  };
  readonly options: {
    useQuotes: Locator;
    useHeader: Locator;
    quoteChar: Locator;
    escapeChar: Locator;
    applyButton: Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.setTextFromGridButton = page.getByRole('button', { name: /Set Text From Grid/ });
    this.setGridFromTextButton = page.getByRole('button', { name: /Set Grid From Text/ });
    this.csvDownloadButton = page.locator('#filedownload');
    this.csvImportButton = page.getByRole('button', { name: /csv import/i });
    this.csvFileInput = page.locator('#csvinput');
    this.dragDropZone = page.locator('#dropzone');
    this.previewButton = page.locator('#previewEditModeButton');
    this.copyButton = page.getByRole('button', { name: 'Copy' });
    this.textArea = page.locator('#markdownarea');

    this.tabs = {
      markdown: page.getByRole('link', { name: 'Markdown', exact: true }),
      csv: page.getByRole('link', { name: 'CSV', exact: true }),
      delimited: page.getByRole('link', { name: 'Delimited', exact: true }),
      json: page.getByRole('link', { name: 'JSON', exact: true }),
      jsonl: page.getByRole('link', { name: 'JSONL', exact: true }),
      xml: page.getByRole('link', { name: 'XML', exact: true }),
      sql: page.getByRole('link', { name: 'SQL', exact: true }),
      code: page.getByRole('link', { name: 'Code', exact: true }),
      gherkin: page.getByRole('link', { name: 'Gherkin', exact: true }),
      html: page.getByRole('link', { name: 'HTML', exact: true }),
      ascii: page.getByRole('link', { name: 'ASCII', exact: true }),
    };

    this.options = {
      useQuotes: page.getByRole('checkbox', { name: 'Use Quotes' }),
      useHeader: page.getByRole('checkbox', { name: 'Use Header' }),
      quoteChar: page.getByRole('textbox', { name: 'Quote Char' }),
      escapeChar: page.getByRole('textbox', { name: 'Escape Char' }),
      applyButton: page.getByRole('button', { name: 'Apply' }),
    };
  }

  async clickTab(tabName: keyof typeof this.tabs | string): Promise<void> {
    const key = tabName.toString().toLowerCase() as keyof typeof this.tabs;
    const tab = this.tabs[key];
    if (!tab) {
      throw new Error(`Tab ${tabName} not found in tabs object`);
    }
    await tab.click();
  }

  async clickSetTextFromGrid(): Promise<void> {
    await this.setTextFromGridButton.click();
  }

  async clickSetGridFromText(): Promise<void> {
    await this.setGridFromTextButton.click();
  }

  async clickCsvDownload(): Promise<void> {
    await this.csvDownloadButton.click();
  }

  async uploadCsvFile(filePath: string): Promise<void> {
    await this.csvFileInput.setInputFiles(filePath);
  }

  async getTextAreaContent(): Promise<string> {
    return (await this.textArea.inputValue()).trim();
  }

  async setTextAreaContent(text: string): Promise<void> {
    await this.textArea.fill(text);
  }

  async clickCopy(): Promise<void> {
    await this.copyButton.click();
  }

  async clickPreview(): Promise<void> {
    await this.previewButton.click();
  }

  async toggleUseQuotes(): Promise<void> {
    await this.options.useQuotes.click();
  }

  async toggleUseHeader(): Promise<void> {
    await this.options.useHeader.click();
  }

  async setQuoteChar(char: string): Promise<void> {
    await this.options.quoteChar.fill(char);
  }

  async setEscapeChar(char: string): Promise<void> {
    await this.options.escapeChar.fill(char);
  }

  async clickApply(): Promise<void> {
    await this.options.applyButton.click();
  }
}
