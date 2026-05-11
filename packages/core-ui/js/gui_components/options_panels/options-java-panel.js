import { JavaConvertorOptions } from '@anywaydata/core/data_formats/java-convertor.js';
import { HtmlDataValues } from './html-options-data-utils.js';
import { applySharedOptionTips } from './options-help-tips.js';
import { applyUiPanelOnlyTips } from './options-help-tips-ui.js';

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
              <span class="helpicon option-help-icon" data-help="java-option-collection-type"></span>
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
              <span class="helpicon option-help-icon" data-help="java-option-assign-variable"></span>
              <input type="checkbox" name="assigntovariable" value="assigntovariable" checked>
              Assign to Variable
            </label>
            <br>
          </div>

          <div class="variablename option-child">
            <label>
              <span class="helpicon option-help-icon" data-help="java-option-variable-name"></span>
              Variable Name
              <input type="text" name="variablename" value="data" style="width:8em">
            </label>
            <br>
          </div>

          <div class="quotenumbers">
            <label>
              <span class="helpicon option-help-icon" data-help="java-option-quote-numbers"></span>
              <input type="checkbox" name="quotenumbers" value="quotenumbers">
              Number Convert (Quote Numbers)
            </label>
            <br>
          </div>

          <div class="useanonymousmaps">
            <label>
              <span class="helpicon option-help-icon" data-help="java-option-anonymous-maps"></span>
              <input type="checkbox" name="useanonymousmaps" value="useanonymousmaps" checked>
              Use Anonymous Maps (Map.of)
            </label>
            <br>
          </div>

          <div class="objectclassname option-child">
            <label>
              <span class="helpicon option-help-icon" data-help="java-option-class-name"></span>
              Class Name
              <input type="text" name="objectclassname" value="Row" style="width:8em">
            </label>
            <br>
          </div>

          <div class="blankvaluebehavior">
            <label>
              <span class="helpicon option-help-icon" data-help="java-option-blank-value"></span>
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
              <span class="helpicon option-help-icon" data-help="java-option-imports"></span>
              <input type="checkbox" name="includeimports" value="includeimports" checked>
              Include Imports
            </label>
            <br>
          </div>

          <div class="prettyprint">
            <label>
              <span class="helpicon option-help-icon" data-help="java-option-pretty-print"></span>
              <input type="checkbox" name="prettyprint" value="prettyprint" checked>
              Pretty Print
            </label>
            <br>
          </div>

          <div class="prettydelimiter option-child">
            <label>
              <span class="helpicon option-help-icon" data-help="java-option-delimiter"></span>
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
              <span class="helpicon option-help-icon" data-help="java-option-custom-delimiter"></span>
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
    applySharedOptionTips(this.parent, 'java', [
      { selector: "[data-help='java-option-collection-type']", key: 'collectionType' },
      { selector: "[data-help='java-option-assign-variable']", key: 'assignToVariable' },
      { selector: "[data-help='java-option-variable-name']", key: 'variableName' },
      { selector: "[data-help='java-option-quote-numbers']", key: 'quoteNumbers' },
      { selector: "[data-help='java-option-anonymous-maps']", key: 'useAnonymousMaps' },
      { selector: "[data-help='java-option-class-name']", key: 'objectClassName' },
      { selector: "[data-help='java-option-blank-value']", key: 'blankValueBehavior' },
      { selector: "[data-help='java-option-imports']", key: 'includeImports' },
      { selector: "[data-help='java-option-pretty-print']", key: 'prettyPrint' },
      { selector: "[data-help='java-option-delimiter']", key: 'prettyPrintDelimiter' },
    ]);
    applyUiPanelOnlyTips(this.parent, ['java-option-custom-delimiter']);
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
