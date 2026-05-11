import { CSharpConvertorOptions } from '@anywaydata/core/data_formats/csharp-convertor.js';
import { HtmlDataValues } from './html-options-data-utils.js';
import { applySharedOptionTips } from './options-help-tips.js';
import { applyUiPanelOnlyTips } from './options-help-tips-ui.js';

class CSharpOptionsPanel {
  constructor(parentElement) {
    this.parent = parentElement;
    this.htmlData = new HtmlDataValues(this.parent);
  }

  addToGui() {
    this.parent.innerHTML = `
      <div class="csharp-options" style="width:100%">
        <div><p><strong>Options</strong> <span data-help="csharp-options" class="helpicon"></span></p></div>
        <div class="collectiontype">
          <label><span class="helpicon option-help-icon" data-help="csharp-option-collection-type"></span>Collection Type
            <select name="collectiontype">
              <option value="array">Array new[] { }</option>
              <option value="list">List new List&lt;object&gt; { }</option>
              <option value="ireadonlylist">IReadOnlyList new List&lt;object&gt; { }</option>
              <option value="ienumerable">IEnumerable new List&lt;object&gt; { }</option>
            </select>
          </label>
        </div>
        <div class="assigntovariable">
          <label><span class="helpicon option-help-icon" data-help="csharp-option-assign-variable"></span><input type="checkbox" name="assigntovariable"> Assign to Variable</label>
        </div>
        <div class="variablename option-child">
          <label><span class="helpicon option-help-icon" data-help="csharp-option-variable-name"></span>Variable Name <input type="text" name="variablename" value="data" style="width:8em"></label>
        </div>
        <div class="quotenumbers">
          <label><span class="helpicon option-help-icon" data-help="csharp-option-quote-numbers"></span><input type="checkbox" name="quotenumbers"> Number Convert (Quote Numbers)</label>
        </div>
        <div class="dictionaryvaluetype">
          <label><span class="helpicon option-help-icon" data-help="csharp-option-dictionary-value-type"></span>Dictionary Value Type
            <select name="dictionaryvaluetype">
              <option value="auto">Auto (String when Number Convert on)</option>
              <option value="object">object</option>
              <option value="string">string</option>
            </select>
          </label>
        </div>
        <div class="useanonymousobjects">
          <label><span class="helpicon option-help-icon" data-help="csharp-option-anonymous-objects"></span><input type="checkbox" name="useanonymousobjects"> Anonymous Objects (Dictionary/Map)</label>
        </div>
        <div class="objectclassname option-child">
          <label><span class="helpicon option-help-icon" data-help="csharp-option-class-name"></span>Object Name <input type="text" name="objectclassname" value="Row" style="width:8em"></label>
        </div>
        <div class="prettyprint">
          <label><span class="helpicon option-help-icon" data-help="csharp-option-pretty-print"></span><input type="checkbox" name="prettyprint"> Pretty Print</label>
        </div>
        <div class="prettydelimiter option-child">
          <label><span class="helpicon option-help-icon" data-help="csharp-option-delimiter"></span>Delimiter
            <select name="prettydelimiter">
              <option value="tab">Tab [\t]</option>
              <option value="space">Space [ ]</option>
              <option value="custom">Custom Value</option>
            </select>
          </label>
        </div>
        <div class="custom-pretty-delimiter option-child">
          <label><span class="helpicon option-help-icon" data-help="csharp-option-custom-delimiter"></span>Custom Delimiter <input type="text" name="custom-pretty-delimiter" value="" style="width:8em"></label>
        </div>
        <div class="apply">
          <button class="apply-options">Apply</button>
        </div>
      </div>
    `;
    applySharedOptionTips(this.parent, 'csharp', [
      { selector: "[data-help='csharp-option-collection-type']", key: 'collectionTargetType' },
      { selector: "[data-help='csharp-option-assign-variable']", key: 'assignToVariable' },
      { selector: "[data-help='csharp-option-variable-name']", key: 'variableName' },
      { selector: "[data-help='csharp-option-quote-numbers']", key: 'quoteNumbers' },
      { selector: "[data-help='csharp-option-dictionary-value-type']", key: 'dictionaryValueType' },
      { selector: "[data-help='csharp-option-anonymous-objects']", key: 'useAnonymousObjects' },
      { selector: "[data-help='csharp-option-class-name']", key: 'objectClassName' },
      { selector: "[data-help='csharp-option-pretty-print']", key: 'prettyPrint' },
      { selector: "[data-help='csharp-option-delimiter']", key: 'prettyPrintDelimiter' },
    ]);
    applyUiPanelOnlyTips(this.parent, ['csharp-option-custom-delimiter']);
  }

  setApplyCallback(callbackFunc) {
    const button = this.parent.querySelector('.apply button');
    button.onclick = function () {
      callbackFunc(this.getOptionsFromGui());
    }.bind(this);
  }

  getOptionsFromGui() {
    const newOptions = new CSharpConvertorOptions();
    const collectionType = this.htmlData.getSelectedValueFrom("select[name='collectiontype']", 'list');
    newOptions.options.collectionType = collectionType === 'array' ? 'array' : 'list';
    newOptions.options.collectionTargetType = collectionType;
    newOptions.options.assignToVariable = this.htmlData.getCheckBoxValueFrom('.assigntovariable label input');
    newOptions.options.variableName = this.htmlData.getTextInputValueFrom('.variablename label input') || 'data';
    newOptions.options.quoteNumbers = this.htmlData.getCheckBoxValueFrom('.quotenumbers label input');
    newOptions.options.dictionaryValueType = this.htmlData.getSelectedValueFrom(
      "select[name='dictionaryvaluetype']",
      'auto'
    );
    newOptions.options.useAnonymousObjects = this.htmlData.getCheckBoxValueFrom('.useanonymousobjects label input');
    newOptions.options.objectClassName = this.htmlData.getTextInputValueFrom('.objectclassname label input') || 'Row';
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
    const delimiterMappings = mainOptions?.delimiterMappings ?? new CSharpConvertorOptions().delimiterMappings;
    const selectedCollection = options.collectionTargetType ?? options.collectionType ?? 'list';
    this.htmlData.setDropDownOptionToKeyValue("select[name='collectiontype']", selectedCollection, 'list');
    this.htmlData.setCheckBoxFrom('.assigntovariable label input', options.assignToVariable, true);
    this.htmlData.setTextFieldToValue('.variablename label input', options.variableName ?? 'data');
    this.htmlData.setCheckBoxFrom('.quotenumbers label input', options.quoteNumbers, false);
    this.htmlData.setDropDownOptionToKeyValue(
      "select[name='dictionaryvaluetype']",
      options.dictionaryValueType,
      'auto'
    );
    this.htmlData.setCheckBoxFrom('.useanonymousobjects label input', options.useAnonymousObjects, true);
    this.htmlData.setTextFieldToValue('.objectclassname label input', options.objectClassName ?? 'Row');
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

export { CSharpOptionsPanel };
