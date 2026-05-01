import { JavaConvertorOptions } from '@anywaydata/core/data_formats/java-convertor.js';
import { HtmlDataValues } from './html-options-data-utils.js';

class JavaOptionsPanel {
  constructor(parentElement) {
    this.parent = parentElement;
    this.htmlData = new HtmlDataValues(this.parent);
  }

  addToGui() {
    this.parent.innerHTML = `
        <div class="java-options" style="width:100%">
          <div><p><strong>Options</strong> <span data-help="java-options" class="helpicon"></span></p></div>

          <div class="collectiontype">
            <label>
              <span class="helpicon option-help-icon" data-help="java-option-collection-type" data-help-text="The Java collection type used for the outer container."></span>
              Collection Type
              <select name="collectiontype">
                <option value="list">List (ArrayList)</option>
                <option value="array">Array [ ]</option>
              </select>
            </label>
            <br>
          </div>

          <div class="assigntovariable">
            <label>
              <span class="helpicon option-help-icon" data-help="java-option-assign-variable" data-help-text="Assign the collection to a named Java variable."></span>
              <input type="checkbox" name="assigntovariable" value="assigntovariable" checked>
              Assign to Variable
            </label>
            <br>
          </div>

          <div class="variablename option-child">
            <label>
              <span class="helpicon option-help-icon" data-help="java-option-variable-name" data-help-text="Name of the Java variable the collection is assigned to."></span>
              Variable Name
              <input type="text" name="variablename" value="data" style="width:8em">
            </label>
            <br>
          </div>

          <div class="quotenumbers">
            <label>
              <span class="helpicon option-help-icon" data-help="java-option-quote-numbers" data-help-text="When checked, numeric values are output as quoted strings. When unchecked, they are output as numeric literals."></span>
              <input type="checkbox" name="quotenumbers" value="quotenumbers">
              Number Convert (Quote Numbers)
            </label>
            <br>
          </div>

          <div class="useanonymousmaps">
            <label>
              <span class="helpicon option-help-icon" data-help="java-option-anonymous-maps" data-help-text="When checked, each row is output as a Map. When unchecked, each row is output as a named class instance."></span>
              <input type="checkbox" name="useanonymousmaps" value="useanonymousmaps" checked>
              Use Anonymous Maps (Map.of)
            </label>
            <br>
          </div>

          <div class="objectclassname option-child">
            <label>
              <span class="helpicon option-help-icon" data-help="java-option-class-name" data-help-text="Class name used when Use Anonymous Maps is unchecked."></span>
              Class Name
              <input type="text" name="objectclassname" value="Row" style="width:8em">
            </label>
            <br>
          </div>

          <div class="blankvaluebehavior">
            <label>
              <span class="helpicon option-help-icon" data-help="java-option-blank-value" data-help-text="Choose how blank values are exported."></span>
              Blank Values
              <select name="blankvaluebehavior">
                <option value="null">null</option>
                <option value="empty-string">Empty String</option>
              </select>
            </label>
            <br>
          </div>

          <div class="includeimports">
            <label>
              <span class="helpicon option-help-icon" data-help="java-option-imports" data-help-text="Include import statements at the top of the output."></span>
              <input type="checkbox" name="includeimports" value="includeimports" checked>
              Include Imports
            </label>
            <br>
          </div>

          <div class="prettyprint">
            <label>
              <span class="helpicon option-help-icon" data-help="java-option-pretty-print" data-help-text="Format output with line breaks and indentation."></span>
              <input type="checkbox" name="prettyprint" value="prettyprint" checked>
              Pretty Print
            </label>
            <br>
          </div>

          <div class="prettydelimiter option-child">
            <label>
              <span class="helpicon option-help-icon" data-help="java-option-delimiter" data-help-text="Indentation character used when Pretty Print is enabled."></span>
              Delimiter
              <select name="prettydelimiter">
                <option value="tab">Tab [\t]</option>
                <option value="space">Space [ ]</option>
                <option value="custom">Custom Value</option>
              </select>
            </label>
            <br>
          </div>

          <div class="custom-pretty-delimiter option-child">
            <label>
              <span class="helpicon option-help-icon" data-help="java-option-custom-delimiter" data-help-text="When Delimiter is Custom Value, this value is used as indentation."></span>
              Custom Delimiter
              <input type="text" name="custom-pretty-delimiter" value="" style="width:8em">
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
    const newOptions = new JavaConvertorOptions();
    newOptions.options.collectionType = this.htmlData.getSelectedValueFrom("select[name='collectiontype']", 'list');
    newOptions.options.assignToVariable = this.htmlData.getCheckBoxValueFrom('.assigntovariable label input');
    newOptions.options.variableName = this.htmlData.getTextInputValueFrom('.variablename label input') || 'data';
    newOptions.options.quoteNumbers = this.htmlData.getCheckBoxValueFrom('.quotenumbers label input');
    newOptions.options.useAnonymousMaps = this.htmlData.getCheckBoxValueFrom('.useanonymousmaps label input');
    newOptions.options.objectClassName = this.htmlData.getTextInputValueFrom('.objectclassname label input') || 'Row';
    newOptions.options.blankValueBehavior = this.htmlData.getSelectedValueFrom(
      "select[name='blankvaluebehavior']",
      'null'
    );
    newOptions.options.includeImports = this.htmlData.getCheckBoxValueFrom('.includeimports label input');
    newOptions.options.prettyPrint = this.htmlData.getCheckBoxValueFrom('.prettyprint label input');
    newOptions.options.prettyPrintDelimiter = this.htmlData.getSelectWithCustomInput(
      "select[name='prettydelimiter']",
      'custom',
      '.custom-pretty-delimiter label input',
      newOptions.delimiterMappings,
      '    '
    );
    return newOptions;
  }

  setFromOptions(mainOptions) {
    const options = mainOptions?.options ?? {};
    const delimiterMappings = mainOptions?.delimiterMappings ?? new JavaConvertorOptions().delimiterMappings;
    this.htmlData.setDropDownOptionToKeyValue("select[name='collectiontype']", options.collectionType, 'list');
    this.htmlData.setCheckBoxFrom('.assigntovariable label input', options.assignToVariable, true);
    this.htmlData.setTextFieldToValue('.variablename label input', options.variableName ?? 'data');
    this.htmlData.setCheckBoxFrom('.quotenumbers label input', options.quoteNumbers, false);
    this.htmlData.setCheckBoxFrom('.useanonymousmaps label input', options.useAnonymousMaps, true);
    this.htmlData.setTextFieldToValue('.objectclassname label input', options.objectClassName ?? 'Row');
    this.htmlData.setDropDownOptionToKeyValue("select[name='blankvaluebehavior']", options.blankValueBehavior, 'null');
    this.htmlData.setCheckBoxFrom('.includeimports label input', options.includeImports, true);
    this.htmlData.setCheckBoxFrom('.prettyprint label input', options.prettyPrint, true);
    this.htmlData.setSelectWithCustomInput(
      "select[name='prettydelimiter']",
      'custom',
      '.custom-pretty-delimiter label input',
      delimiterMappings,
      options.prettyPrintDelimiter
    );
  }
}

export { JavaOptionsPanel };
