import { CSharpConvertorOptions } from '@anywaydata/core/data_formats/csharp-convertor.js';
import { HtmlDataValues } from './html-options-data-utils.js';

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
          <label>Collection Type
            <select name="collectiontype">
              <option value="array">Array new[] { }</option>
              <option value="list">List new List&lt;object&gt; { }</option>
              <option value="ireadonlylist">IReadOnlyList new List&lt;object&gt; { }</option>
              <option value="ienumerable">IEnumerable new List&lt;object&gt; { }</option>
            </select>
          </label>
        </div>
        <div class="assigntovariable">
          <label><input type="checkbox" name="assigntovariable"> Assign to Variable</label>
        </div>
        <div class="variablename">
          <label>Variable Name <input type="text" name="variablename" value="data" style="width:8em"></label>
        </div>
        <div class="quotenumbers">
          <label><input type="checkbox" name="quotenumbers"> Number Convert (Quote Numbers)</label>
        </div>
        <div class="dictionaryvaluetype">
          <label>Dictionary Value Type
            <select name="dictionaryvaluetype">
              <option value="auto">Auto (String when Number Convert on)</option>
              <option value="object">object</option>
              <option value="string">string</option>
            </select>
          </label>
        </div>
        <div class="useanonymousobjects">
          <label><input type="checkbox" name="useanonymousobjects"> Anonymous Objects (Dictionary/Map)</label>
        </div>
        <div class="objectclassname">
          <label>Object Name <input type="text" name="objectclassname" value="Row" style="width:8em"></label>
        </div>
        <div class="prettyprint">
          <label><input type="checkbox" name="prettyprint"> Pretty Print</label>
        </div>
        <div class="prettydelimiter">
          <label>Delimiter
            <select name="prettydelimiter">
              <option value="tab">Tab [\t]</option>
              <option value="space">Space [ ]</option>
              <option value="custom">Custom Value</option>
            </select>
          </label>
        </div>
        <div class="custom-pretty-delimiter">
          <label>Custom Delimiter <input type="text" name="custom-pretty-delimiter" value="" style="width:8em"></label>
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
