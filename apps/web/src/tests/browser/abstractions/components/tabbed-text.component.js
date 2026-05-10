const { expect } = require('@playwright/test');

class TabbedTextComponent {
  constructor(page) {
    this.page = page;
    this.container = page.locator('#tabbedTextArea');
    this.tabsList = page.locator('#tabbedTextArea .conversionTypesList');
    this.outputTextArea = page.locator('#tabbedTextArea textarea.textrepresentation').first();
    this.previewOrEditButton = page.locator('#previewEditModeButton');
    this.copyButton = page.locator('#copyTextButton');
    this.subtasks = page.locator('#conversionSubtasks');

    this.formatMap = {
      Markdown: { main: 'Markdown' },
      CSV: { main: 'CSV' },
      Delimited: { main: 'Delimited' },
      JSON: { main: 'JSON' },
      JSONL: { main: 'JSONL' },
      XML: { main: 'XML' },
      SQL: { main: 'SQL' },
      'C#': { main: 'Code', sub: 'C#' },
      Java: { main: 'Code', sub: 'Java' },
      JavaScript: { main: 'Code', sub: 'JavaScript' },
      Kotlin: { main: 'Code', sub: 'Kotlin' },
      Perl: { main: 'Code', sub: 'Perl' },
      PHP: { main: 'Code', sub: 'PHP' },
      Python: { main: 'Code', sub: 'Python' },
      Ruby: { main: 'Code', sub: 'Ruby' },
      TypeScript: { main: 'Code', sub: 'TypeScript' },
      Gherkin: { main: 'Gherkin' },
      HTML: { main: 'HTML' },
      ASCII: { main: 'ASCII' },
    };
  }

  async expectVisible() {
    await expect(this.container).toBeVisible();
    await expect(this.tabsList).toBeVisible();
    await expect(this.copyButton).toBeVisible();
  }

  async expectReady() {
    await this.expectVisible();
  }

  async selectFormat(name) {
    const config = this.formatMap[name];
    if (!config) {
      throw new Error(`Unknown format "${name}"`);
    }

    await this.tabsList.getByRole('link', { name: config.main, exact: true }).click();
    if (config.sub) {
      await this.subtasks.getByRole('link', { name: config.sub, exact: true }).click();
    }
  }

  async preview() {
    this.page.once('dialog', async (dialog) => {
      await dialog.accept();
    });
    await this.previewOrEditButton.click();
  }

  async togglePreviewEdit(confirmPrompt = true) {
    if (confirmPrompt === true) {
      this.page.once('dialog', async (dialog) => {
        await dialog.accept();
      });
    } else if (confirmPrompt === false) {
      this.page.once('dialog', async (dialog) => {
        await dialog.dismiss();
      });
    }
    await this.previewOrEditButton.click();
  }

  async isCopyButtonVisible() {
    return this.copyButton.isVisible();
  }

  async getPreviewEditLabel() {
    return (await this.previewOrEditButton.innerText()).trim();
  }

  async expectPreviewEditLabel(value) {
    await expect(this.previewOrEditButton).toHaveText(value);
  }

  async expectPreviewEditLabelContains(value) {
    await expect(this.previewOrEditButton).toContainText(value);
  }

  async setOutputText(value) {
    await this.outputTextArea.fill(value);
    await this.outputTextArea.dispatchEvent('input');
    await this.outputTextArea.dispatchEvent('change');
  }

  async getOutputText() {
    return this.outputTextArea.inputValue();
  }

  async expectOutputContains(value) {
    await expect(this.outputTextArea).toHaveValue(new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
}

module.exports = { TabbedTextComponent };
