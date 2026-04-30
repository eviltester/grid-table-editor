import { Page, Locator } from '@playwright/test';

export class ToolbarPage {
  readonly page: Page;
  readonly addRowButton: Locator;
  readonly addRowsAboveButton: Locator;
  readonly addRowsBelowButton: Locator;
  readonly deleteSelectedRowsButton: Locator;
  readonly clearFiltersButton: Locator;
  readonly resetTableButton: Locator;
  readonly filterTextbox: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addRowButton = page.getByRole('button', { name: 'Add Row', exact: true });
    this.addRowsAboveButton = page.getByRole('button', { name: 'Add Rows Above' });
    this.addRowsBelowButton = page.getByRole('button', { name: 'Add Rows Below' });
    this.deleteSelectedRowsButton = page.getByRole('button', { name: 'Delete Selected Rows' });
    this.clearFiltersButton = page.getByRole('button', { name: 'Clear Filters' });
    this.resetTableButton = page.getByRole('button', { name: 'Reset Table', exact: true });
    this.filterTextbox = page.getByRole('textbox', { name: 'Filter:' });
  }

  async clickAddRow(): Promise<void> {
    await this.addRowButton.click();
  }

  async clickAddRowsAbove(): Promise<void> {
    await this.addRowsAboveButton.click();
  }

  async clickAddRowsBelow(): Promise<void> {
    await this.addRowsBelowButton.click();
  }

  async clickDeleteSelectedRows(): Promise<void> {
    await this.deleteSelectedRowsButton.click();
  }

  async clickClearFilters(): Promise<void> {
    await this.clearFiltersButton.click();
  }

  async clickResetTable(): Promise<void> {
    await this.resetTableButton.click();
  }

  async enterGlobalFilter(text: string): Promise<void> {
    await this.filterTextbox.fill(text);
  }

  async clearGlobalFilter(): Promise<void> {
    await this.filterTextbox.clear();
  }
}
