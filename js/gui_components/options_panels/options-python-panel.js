import { PythonConvertorOptions } from '../../data_formats/python-convertor.js';
import { HtmlDataValues } from './html-options-data-utils.js';

class PythonOptionsPanel {
  constructor(parentElement) {
    this.parent = parentElement;
    this.htmlData = new HtmlDataValues(this.parent);
  }

  addToGui() {
    this.parent.innerHTML = `
        <div class="python-options" style="width:100%">
          <div><p><strong>Options</strong> <span data-help="python-options" class="helpicon"></span></p></div>

          <div class="collectiontype">
            <label>
              <span class="helpicon option-help-icon" data-help="python-option-collection-type" data-help-text="The Python collection type used for the outer container."></span>
              Collection Type
              <select name="collectiontype">
                <option value="list">List [ ]</option>
                <option value="tuple">Tuple ( )</option>
              </select>
            </label>
            <br>
          </div>

          <div class="assigntovariable">
            <label>
              <span class="helpicon option-help-icon" data-help="python-option-assign-variable" data-help-text="Assign the collection to a named Python variable."></span>
              <input type="checkbox" name="assigntovariable" value="assigntovariable">
              Assign to Variable
            </label>
            <br>
          </div>

          <div class="variablename">
            <label>
              <span class="helpicon option-help-icon" data-help="python-option-variable-name" data-help-text="Name of the Python variable the collection is assigned to."></span>
              Variable Name
              <input type="text" name="variablename" value="data" style="width:8em">
            </label>
            <br>
          </div>

          <div class="quotenumbers">
            <label>
              <span class="helpicon option-help-icon" data-help="python-option-quote-numbers" data-help-text="When checked, numeric values are output as quoted strings. When unchecked, they are output as numeric literals."></span>
              <input type="checkbox" name="quotenumbers" value="quotenumbers">
              Quote Numbers
            </label>
            <br>
          </div>

          <div class="usedecimaltype">
            <label>
              <span class="helpicon option-help-icon" data-help="python-option-use-decimal" data-help-text="When checked, decimal-looking numeric values are output as Decimal values."></span>
              <input type="checkbox" name="usedecimaltype" value="usedecimaltype">
              Use Decimal Type
            </label>
            <br>
          </div>

          <div class="decimalcolumnscsv">
            <label>
              <span class="helpicon option-help-icon" data-help="python-option-decimal-columns" data-help-text="Comma-separated list of columns to treat as Decimal candidates. Example: Money, Column 2"></span>
              Decimal Columns (CSV)
              <input type="text" name="decimalcolumnscsv" value="" style="width:100%">
            </label>
            <br>
          </div>

          <div class="decimaltreatintegers">
            <label>
              <span class="helpicon option-help-icon" data-help="python-option-decimal-integers" data-help-text="When checked, integer-looking values in decimal columns are also output as Decimal values."></span>
              <input type="checkbox" name="decimaltreatintegers" value="decimaltreatintegers">
              Treat Integers As Decimal
            </label>
            <br>
          </div>

          <div class="blankvaluebehavior">
            <label>
              <span class="helpicon option-help-icon" data-help="python-option-blank-value" data-help-text="Choose how blank values are exported."></span>
              Blank Values
              <select name="blankvaluebehavior">
                <option value="empty-string">Empty String</option>
                <option value="none">None</option>
              </select>
            </label>
            <br>
          </div>

          <div class="quotestyle">
            <label>
              <span class="helpicon option-help-icon" data-help="python-option-quote-style" data-help-text="Choose single or double quotes for Python string output."></span>
              Quote Style
              <select name="quotestyle">
                <option value="double">Double Quotes</option>
                <option value="single">Single Quotes</option>
              </select>
            </label>
            <br>
          </div>

          <div class="prettyprint">
            <label>
              <span class="helpicon option-help-icon" data-help="python-option-pretty-print" data-help-text="Format output with line breaks and indentation."></span>
              <input type="checkbox" name="prettyprint" value="prettyprint">
              Pretty Print
            </label>
            <br>
          </div>

          <div class="prettydelimiter">
            <label>
              <span class="helpicon option-help-icon" data-help="python-option-delimiter" data-help-text="Indentation character used when Pretty Print is enabled."></span>
              Delimiter
              <select name="prettydelimiter">
                <option value="tab">Tab [\t]</option>
                <option value="space">Space [ ]</option>
                <option value="custom">Custom Value</option>
              </select>
            </label>
            <br>
          </div>

          <div class="custom-pretty-delimiter">
            <label>
              <span class="helpicon option-help-icon" data-help="python-option-custom-delimiter" data-help-text="When Delimiter is Custom Value, this value is used as indentation."></span>
              Custom Delimiter
              <input type="text" name="custom-pretty-delimiter" value="" style="width:8em">
            </label>
            <br>
          </div>

          <div class="includeimports">
            <label>
              <span class="helpicon option-help-icon" data-help="python-option-imports" data-help-text="Include import statements at the top of the output."></span>
              <input type="checkbox" name="includeimports" value="includeimports">
              Include Imports
            </label>
            <br>
          </div>

          <div class="importstatements">
            <label>
              <span class="helpicon option-help-icon" data-help="python-option-import-statements" data-help-text="One import statement per line, for example: from dataclasses import dataclass."></span>
              Import Statements
              <textarea name="importstatements" rows="3" style="width:100%"></textarea>
            </label>
            <br>
          </div>

          <div class="useanonymousdicts">
            <label>
              <span class="helpicon option-help-icon" data-help="python-option-anonymous-dicts" data-help-text="When checked, each row is output as a plain dictionary. When unchecked, each row is output as a named class instance."></span>
              <input type="checkbox" name="useanonymousdicts" value="useanonymousdicts">
              Anonymous Dicts
            </label>
            <br>
          </div>

          <div class="objectclassname">
            <label>
              <span class="helpicon option-help-icon" data-help="python-option-class-name" data-help-text="Class name used when Anonymous Dicts is unchecked."></span>
              Class Name
              <input type="text" name="objectclassname" value="Row" style="width:8em">
            </label>
            <br>
          </div>

          <div class="apply">
            <button class="apply-options">Apply</button>
          </div>
        </div>
        `;
  }

  setApplyCallback(callbackFunc) {
    const button = this.parent.querySelector('.apply button');
    button.onclick = function () {
      callbackFunc(this.getOptionsFromGui());
    }.bind(this);
  }

  getOptionsFromGui() {
    const newOptions = new PythonConvertorOptions();
    newOptions.options.collectionType = this.htmlData.getSelectedValueFrom("select[name='collectiontype']", 'list');
    newOptions.options.assignToVariable = this.htmlData.getCheckBoxValueFrom('.assigntovariable label input');
    newOptions.options.variableName = this.htmlData.getTextInputValueFrom('.variablename label input') || 'data';
    newOptions.options.quoteNumbers = this.htmlData.getCheckBoxValueFrom('.quotenumbers label input');
    newOptions.options.useDecimalType = this.htmlData.getCheckBoxValueFrom('.usedecimaltype label input');
    newOptions.options.decimalColumnsCsv = this.htmlData.getTextInputValueFrom('.decimalcolumnscsv label input') || '';
    newOptions.options.decimalTreatIntegersAsDecimal = this.htmlData.getCheckBoxValueFrom(
      '.decimaltreatintegers label input'
    );
    newOptions.options.blankValueBehavior = this.htmlData.getSelectedValueFrom(
      "select[name='blankvaluebehavior']",
      'empty-string'
    );
    newOptions.options.quoteStyle = this.htmlData.getSelectedValueFrom("select[name='quotestyle']", 'double');
    newOptions.options.prettyPrint = this.htmlData.getCheckBoxValueFrom('.prettyprint label input');
    newOptions.options.prettyPrintDelimiter = this.htmlData.getSelectWithCustomInput(
      "select[name='prettydelimiter']",
      'custom',
      '.custom-pretty-delimiter label input',
      newOptions.delimiterMappings,
      '    '
    );
    newOptions.options.includeImports = this.htmlData.getCheckBoxValueFrom('.includeimports label input');
    newOptions.options.importStatements = this.htmlData.getTextInputValueFrom('.importstatements label textarea') || '';
    newOptions.options.useAnonymousDicts = this.htmlData.getCheckBoxValueFrom('.useanonymousdicts label input');
    newOptions.options.objectClassName = this.htmlData.getTextInputValueFrom('.objectclassname label input') || 'Row';
    return newOptions;
  }

  setFromOptions(mainOptions) {
    const options = mainOptions?.options ?? {};
    const delimiterMappings = mainOptions?.delimiterMappings ?? new PythonConvertorOptions().delimiterMappings;
    this.htmlData.setDropDownOptionToKeyValue("select[name='collectiontype']", options.collectionType, 'list');
    this.htmlData.setCheckBoxFrom('.assigntovariable label input', options.assignToVariable, true);
    this.htmlData.setTextFieldToValue('.variablename label input', options.variableName ?? 'data');
    this.htmlData.setCheckBoxFrom('.quotenumbers label input', options.quoteNumbers, false);
    this.htmlData.setCheckBoxFrom('.usedecimaltype label input', options.useDecimalType, false);
    this.htmlData.setTextFieldToValue('.decimalcolumnscsv label input', options.decimalColumnsCsv ?? '');
    this.htmlData.setCheckBoxFrom('.decimaltreatintegers label input', options.decimalTreatIntegersAsDecimal, false);
    this.htmlData.setDropDownOptionToKeyValue(
      "select[name='blankvaluebehavior']",
      options.blankValueBehavior,
      'empty-string'
    );
    this.htmlData.setDropDownOptionToKeyValue("select[name='quotestyle']", options.quoteStyle, 'double');
    this.htmlData.setCheckBoxFrom('.prettyprint label input', options.prettyPrint, true);
    this.htmlData.setSelectWithCustomInput(
      "select[name='prettydelimiter']",
      'custom',
      '.custom-pretty-delimiter label input',
      delimiterMappings,
      options.prettyPrintDelimiter
    );
    this.htmlData.setCheckBoxFrom('.includeimports label input', options.includeImports, false);
    this.htmlData.setTextFieldToValue('.importstatements label textarea', options.importStatements ?? '');
    this.htmlData.setCheckBoxFrom('.useanonymousdicts label input', options.useAnonymousDicts, true);
    this.htmlData.setTextFieldToValue('.objectclassname label input', options.objectClassName ?? 'Row');
  }
}

export { PythonOptionsPanel };
