import { Page, Locator, expect } from '@playwright/test';

export class GridPage {
  readonly page: Page;
  readonly grid: Locator;
  readonly instructionsRow: Locator;
  readonly rows: Locator;
  readonly visibleRows: Locator;
  readonly headers: Locator;
  readonly selectedRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.grid = page.locator('#myGrid');
    this.instructionsRow = page.locator('#myGrid .tabulator-cell').getByText('[Reset Table] To clear all table data');
    this.rows = page.locator('#myGrid .tabulator-row');
    this.visibleRows = page.locator('#myGrid .tabulator-row:visible');
    this.headers = page.locator('#myGrid .tabulator-col[role="columnheader"]');
    this.selectedRows = page.locator('#myGrid .tabulator-row.tabulator-selected');
  }

  async waitForGridReady(): Promise<void> {
    await this.grid.waitFor({ state: 'visible', timeout: 10000 });
    await this.instructionsRow.waitFor({ state: 'visible', timeout: 10000 });
  }

  async getRowCount(): Promise<number> {
    return await this.rows.count();
  }

  async getVisibleRowCount(): Promise<number> {
    return await this.visibleRows.count();
  }

  async getCell(rowIndex: number, cellIndex: number = 0): Promise<Locator> {
    const row = this.rows.nth(rowIndex);
    return row.locator('.tabulator-cell').nth(cellIndex);
  }

  async getVisibleCell(rowIndex: number, cellIndex: number = 0): Promise<Locator> {
    const row = this.visibleRows.nth(rowIndex);
    return row.locator('.tabulator-cell').nth(cellIndex);
  }

  async editCell(rowIndex: number, cellIndex: number = 0, text: string): Promise<void> {
    const cell = await this.getCell(rowIndex, cellIndex);
    await cell.dblclick();
    await this.page.keyboard.press('Control+a');
    await this.page.keyboard.type(text);
    await this.page.keyboard.press('Enter');
  }

  async addColumnRight(columnName?: string): Promise<void> {
    await this.clickColumnControl('add-right');
    if (columnName) {
      await this.page.keyboard.type(columnName);
      await this.page.keyboard.press('Enter');
    }
  }

  async getColumnCount(): Promise<number> {
    return this.headers.count();
  }

  async clickFilterControl(columnIndex: number = 0): Promise<void> {
    const header = this.headers.nth(columnIndex);
    await header.click();
    await header.locator('[data-action="filter"]').evaluate((el) => (el as HTMLElement).click());
  }

  async clickSortAsc(columnIndex: number = 0): Promise<void> {
    const header = this.headers.nth(columnIndex);
    await header.click();
    await header.locator('[data-action="sort-asc"]').evaluate((el) => (el as HTMLElement).click());
  }

  async clickSortDesc(columnIndex: number = 0): Promise<void> {
    const header = this.headers.nth(columnIndex);
    await header.click();
    await header.locator('[data-action="sort-desc"]').evaluate((el) => (el as HTMLElement).click());
  }

  async clickSortNone(columnIndex: number = 0): Promise<void> {
    const header = this.headers.nth(columnIndex);
    await header.click();
    await header.locator('[data-action="sort-none"]').evaluate((el) => (el as HTMLElement).click());
  }

  async clickRow(rowIndex: number): Promise<void> {
    const row = this.rows.nth(rowIndex);
    await row.click();
  }

  async selectRowWithCtrl(rowIndex: number): Promise<void> {
    const row = this.rows.nth(rowIndex);
    await row.click({ modifiers: ['Control'] });
  }

  async selectRowWithShift(rowIndex: number): Promise<void> {
    const row = this.rows.nth(rowIndex);
    await row.click({ modifiers: ['Shift'] });
  }

  async clickColumnControl(
    columnNameOrAction: string,
    maybeAction?: 'add-left' | 'rename' | 'delete' | 'duplicate' | 'add-right'
  ): Promise<void> {
    const action = (maybeAction ?? columnNameOrAction) as 'add-left' | 'rename' | 'delete' | 'duplicate' | 'add-right';
    const columnName = maybeAction ? columnNameOrAction : undefined;
    const header = columnName
      ? this.page.locator(`#myGrid .tabulator-col[role="columnheader"]`, { hasText: columnName }).first()
      : this.headers.first();

    await header.waitFor({ state: 'visible' });
    await header.locator(`[data-action="${action}"]`).click();
  }

  async getColumnHeader(columnName: string): Promise<Locator> {
    return this.page.locator(`#myGrid .tabulator-col[role="columnheader"]:has-text("${columnName}")`);
  }

  async getFilterSearchbox(columnName: string): Promise<Locator> {
    const header = this.page.locator(`#myGrid .tabulator-col:has-text("${columnName}")`);
    return header.locator('searchbox');
  }

  async getFilterSearchboxByIndex(columnIndex: number): Promise<Locator> {
    const header = this.headers.nth(columnIndex);
    return header.locator('searchbox');
  }

  async sortColumnAsc(columnName: string): Promise<void> {
    const header = this.page.locator(`#myGrid .tabulator-col:has-text("${columnName}")`);
    await header.getByText('Sort Asc').click();
  }

  async sortColumnDesc(columnName: string): Promise<void> {
    const header = this.page.locator(`#myGrid .tabulator-col:has-text("${columnName}")`);
    await header.getByText('Sort Desc').click();
  }

  async clearSort(columnName: string): Promise<void> {
    const header = this.page.locator(`#myGrid .tabulator-col:has-text("${columnName}")`);
    await header.getByText('Clear Sort').click();
  }

  async dragRow(fromIndex: number, toIndex: number): Promise<void> {
    const fromRow = this.rows.nth(fromIndex);
    const toRow = this.rows.nth(toIndex);
    await fromRow.dragTo(toRow);
  }

  async dragColumn(fromName: string, toName: string): Promise<void> {
    const fromHeader = this.page.locator(`#myGrid .tabulator-col:has-text("${fromName}")`);
    const toHeader = this.page.locator(`#myGrid .tabulator-col:has-text("${toName}")`);
    await fromHeader.dragTo(toHeader);
  }

  async addRowAndEditFirstCell(text: string): Promise<void> {
    await this.page.getByRole('button', { name: 'Add Row', exact: true }).click();
    await this.page.waitForTimeout(300);
    await this.editCell((await this.getRowCount()) - 1, 0, text);
  }

  async getFirstCellText(rowIndex: number): Promise<string> {
    const cell = await this.getCell(rowIndex, 0);
    return (await cell.textContent())?.trim() ?? '';
  }

  async getSelectedRowCount(): Promise<number> {
    return this.selectedRows.count();
  }

  async getHeaderText(index: number): Promise<string> {
    return (await this.headers.nth(index).textContent())?.trim() ?? '';
  }
}
