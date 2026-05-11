import { SqlConvertorOptions } from '@anywaydata/core/data_formats/sql-convertor.js';
import { HtmlDataValues } from './html-options-data-utils.js';
import { applySharedOptionTips } from './options-help-tips.js';

class SqlOptionsPanel {
  constructor(parentElement) {
    this.parent = parentElement;
    this.htmlData = new HtmlDataValues(this.parent);
  }

  addToGui() {
    this.parent.innerHTML = `
      <div class="sql-options" style="width:100%">
        <div><p><strong>Options</strong> <span data-help="sql-options" class="helpicon"></span></p></div>

        <div class="table-name">
          <label><span class="helpicon option-help-icon" data-help="sql-option-table-name" data-help-text="Name of the table used in INSERT statements."></span>Table Name
            <input type="text" name="table-name" value="" style="width:10em">
          </label>
          <br>
        </div>

        <div class="max-values-per-insert">
          <label><span class="helpicon option-help-icon" data-help="sql-option-max-values" data-help-text="Maximum number of value tuples per INSERT statement. Additional rows create more INSERT statements."></span>Max Values
            <input type="number" name="max-values-per-insert" min="1" value="100" style="width:6em">
          </label>
          <br>
        </div>

        <div class="quote-numeric">
          <label>
            <span class="helpicon option-help-icon" data-help="sql-option-quote-numeric" data-help-text="When checked, numeric-looking values are quoted as strings. When unchecked, numeric-looking values are emitted without quotes."></span>
            <input type="checkbox" name="quote-numeric" value="quote-numeric">
            Quote Numeric
          </label>
          <br>
        </div>

        <div class="sql-dialect">
          <label><span class="helpicon option-help-icon" data-help="sql-option-dialect" data-help-text="SQL dialect controls identifier quoting style and transaction wrapper syntax."></span>Dialect
            <select name="sql-dialect">
              <option value="ansi">ANSI SQL</option>
              <option value="postgresql">PostgreSQL</option>
              <option value="mysql">MySQL</option>
              <option value="sqlserver">SQL Server</option>
            </select>
          </label>
          <br>
        </div>

        <div class="quote-identifiers">
          <label>
            <span class="helpicon option-help-icon" data-help="sql-option-quote-identifiers" data-help-text="Quote table and column identifiers using the selected SQL dialect."></span>
            <input type="checkbox" name="quote-identifiers" value="quote-identifiers">
            Quote Identifiers
          </label>
          <br>
        </div>

        <div class="null-handling">
          <label><span class="helpicon option-help-icon" data-help="sql-option-null-handling" data-help-text="Choose how empty values and NULL literals are exported."></span>Null Handling
            <select name="null-handling">
              <option value="empty-string">Keep Empty As ''</option>
              <option value="empty-as-null">Empty As NULL</option>
              <option value="empty-or-literal-null">Empty Or NULL Literal As NULL</option>
            </select>
          </label>
          <br>
        </div>

        <div class="wrap-transaction">
          <label>
            <span class="helpicon option-help-icon" data-help="sql-option-wrap-transaction" data-help-text="Wrap generated INSERT statements with BEGIN/COMMIT transaction statements."></span>
            <input type="checkbox" name="wrap-transaction" value="wrap-transaction">
            Wrap Transaction
          </label>
          <br>
        </div>

        <div class="apply">
          <button class="apply-options">Apply</button>
        </div>
      </div>
    `;
    applySharedOptionTips(this.parent, 'sql', [
      { selector: "[data-help='sql-option-table-name']", key: 'tableName' },
      { selector: "[data-help='sql-option-max-values']", key: 'maxValuesPerInsert' },
      { selector: "[data-help='sql-option-quote-numeric']", key: 'quoteNumeric' },
      { selector: "[data-help='sql-option-dialect']", key: 'sqlDialect' },
      { selector: "[data-help='sql-option-quote-identifiers']", key: 'quoteIdentifiers' },
      { selector: "[data-help='sql-option-null-handling']", key: 'nullHandling' },
      { selector: "[data-help='sql-option-wrap-transaction']", key: 'wrapTransaction' },
    ]);
  }

  setApplyCallback(callbackFunc) {
    const button = this.parent.querySelector('.sql-options .apply button');
    button.onclick = function () {
      callbackFunc(this.getOptionsFromGui());
    }.bind(this);
  }

  getOptionsFromGui() {
    const newOptions = new SqlConvertorOptions();
    const rawMaxValues = this.htmlData.getTextInputValueFrom("input[name='max-values-per-insert']");
    const maxValuesPerInsert = Number.parseInt(rawMaxValues, 10);

    newOptions.options.tableName = this.htmlData.getTextInputValueFrom("input[name='table-name']");
    newOptions.options.maxValuesPerInsert = Number.isNaN(maxValuesPerInsert) ? 100 : maxValuesPerInsert;
    newOptions.options.quoteNumeric = this.htmlData.getCheckBoxValueFrom("input[name='quote-numeric']");
    newOptions.options.sqlDialect = this.htmlData.getSelectedValueFrom("select[name='sql-dialect']", 'ansi');
    newOptions.options.quoteIdentifiers = this.htmlData.getCheckBoxValueFrom("input[name='quote-identifiers']");
    newOptions.options.nullHandling = this.htmlData.getSelectedValueFrom(
      "select[name='null-handling']",
      'empty-string'
    );
    newOptions.options.wrapTransaction = this.htmlData.getCheckBoxValueFrom("input[name='wrap-transaction']");
    return newOptions;
  }

  setFromOptions(mainOptions) {
    const options = mainOptions?.options ? mainOptions.options : {};
    this.htmlData.setTextFieldToValue("input[name='table-name']", options?.tableName);
    this.htmlData.setTextFieldToValue("input[name='max-values-per-insert']", options?.maxValuesPerInsert);
    this.htmlData.setCheckBoxFrom("input[name='quote-numeric']", options?.quoteNumeric, true);
    this.htmlData.setDropDownOptionToKeyValue("select[name='sql-dialect']", options?.sqlDialect, 'ansi');
    this.htmlData.setCheckBoxFrom("input[name='quote-identifiers']", options?.quoteIdentifiers, true);
    this.htmlData.setDropDownOptionToKeyValue("select[name='null-handling']", options?.nullHandling, 'empty-string');
    this.htmlData.setCheckBoxFrom("input[name='wrap-transaction']", options?.wrapTransaction, false);
  }
}

export { SqlOptionsPanel };
