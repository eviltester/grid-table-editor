import { RubyConvertorOptions } from '@anywaydata/core/data_formats/ruby-convertor.js';
import { HtmlDataValues } from './html-options-data-utils.js';

class RubyOptionsPanel {
  constructor(parentElement) {
    this.parent = parentElement;
    this.htmlData = new HtmlDataValues(this.parent);
  }

  addToGui() {
    this.parent.innerHTML = `
      <div class="ruby-options" style="width:100%">
        <div><p><strong>Options</strong> <span data-help="ruby-options" class="helpicon"></span></p></div>
        <div class="collectiontype">
          <label>Collection Type
            <select name="collectiontype">
              <option value="array">Array [ ]</option>
              <option value="list">List Array[ ]</option>
            </select>
          </label>
        </div>
        <div class="assigntovariable">
          <label><input type="checkbox" name="assigntovariable"> Assign to Variable</label>
        </div>
        <div class="variablename">
          <label>Variable Name <input type="text" name="variablename" value="data" style="width:8em"></label>
        </div>
        <div class="outputwrapper">
          <label>Output Wrapper
            <select name="outputwrapper">
              <option value="plain">Plain Assignment</option>
              <option value="rspec-let">RSpec let</option>
            </select>
          </label>
        </div>
        <div class="quotenumbers">
          <label><input type="checkbox" name="quotenumbers"> Number Convert (Quote Numbers)</label>
        </div>
        <div class="hashkeystyle">
          <label>Hash Key Style
            <select name="hashkeystyle">
              <option value="string">String Keys ('name' =>)</option>
              <option value="symbol">Symbol Keys (name:)</option>
            </select>
          </label>
        </div>
        <div class="useanonymousobjects">
          <label><input type="checkbox" name="useanonymousobjects"> Anonymous Objects (Hash/Map)</label>
        </div>
        <div class="objectclassname">
          <label>Object Name <input type="text" name="objectclassname" value="Row" style="width:8em"></label>
        </div>
        <div class="objectrepresentation">
          <label>Object Representation
            <select name="objectrepresentation">
              <option value="class">Class</option>
              <option value="struct">Struct</option>
              <option value="data">Data</option>
            </select>
          </label>
        </div>
        <div class="fieldnamestyle">
          <label>Field Name Style
            <select name="fieldnamestyle">
              <option value="preserve">Preserve</option>
              <option value="snake_case">snake_case</option>
            </select>
          </label>
        </div>
        <div class="prettyprint">
          <label><input type="checkbox" name="prettyprint"> Pretty Print</label>
        </div>
        <div class="hashprettystyle">
          <label>Hash Pretty Style
            <select name="hashprettystyle">
              <option value="compact">Compact</option>
              <option value="aligned">Aligned Multi-line</option>
            </select>
          </label>
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
    const newOptions = new RubyConvertorOptions();
    newOptions.options.collectionType = this.htmlData.getSelectedValueFrom("select[name='collectiontype']", 'array');
    newOptions.options.assignToVariable = this.htmlData.getCheckBoxValueFrom('.assigntovariable label input');
    newOptions.options.variableName = this.htmlData.getTextInputValueFrom('.variablename label input') || 'data';
    newOptions.options.outputWrapper = this.htmlData.getSelectedValueFrom("select[name='outputwrapper']", 'plain');
    newOptions.options.quoteNumbers = this.htmlData.getCheckBoxValueFrom('.quotenumbers label input');
    newOptions.options.hashKeyStyle = this.htmlData.getSelectedValueFrom("select[name='hashkeystyle']", 'string');
    newOptions.options.useAnonymousObjects = this.htmlData.getCheckBoxValueFrom('.useanonymousobjects label input');
    newOptions.options.objectClassName = this.htmlData.getTextInputValueFrom('.objectclassname label input') || 'Row';
    newOptions.options.objectRepresentation = this.htmlData.getSelectedValueFrom(
      "select[name='objectrepresentation']",
      'class'
    );
    newOptions.options.fieldNameStyle = this.htmlData.getSelectedValueFrom("select[name='fieldnamestyle']", 'preserve');
    newOptions.options.prettyPrint = this.htmlData.getCheckBoxValueFrom('.prettyprint label input');
    newOptions.options.hashPrettyStyle = this.htmlData.getSelectedValueFrom(
      "select[name='hashprettystyle']",
      'compact'
    );
    newOptions.options.prettyPrintDelimiter = this.htmlData.getSelectWithCustomInput(
      "select[name='prettydelimiter']",
      'custom',
      '.custom-pretty-delimiter label input',
      newOptions.delimiterMappings,
      '  '
    );
    return newOptions;
  }

  setFromOptions(mainOptions) {
    const options = mainOptions?.options ?? {};
    const delimiterMappings = mainOptions?.delimiterMappings ?? new RubyConvertorOptions().delimiterMappings;
    this.htmlData.setDropDownOptionToKeyValue("select[name='collectiontype']", options.collectionType, 'array');
    this.htmlData.setCheckBoxFrom('.assigntovariable label input', options.assignToVariable, true);
    this.htmlData.setTextFieldToValue('.variablename label input', options.variableName ?? 'data');
    this.htmlData.setDropDownOptionToKeyValue("select[name='outputwrapper']", options.outputWrapper, 'plain');
    this.htmlData.setCheckBoxFrom('.quotenumbers label input', options.quoteNumbers, false);
    this.htmlData.setDropDownOptionToKeyValue("select[name='hashkeystyle']", options.hashKeyStyle, 'string');
    this.htmlData.setCheckBoxFrom('.useanonymousobjects label input', options.useAnonymousObjects, true);
    this.htmlData.setTextFieldToValue('.objectclassname label input', options.objectClassName ?? 'Row');
    this.htmlData.setDropDownOptionToKeyValue(
      "select[name='objectrepresentation']",
      options.objectRepresentation,
      'class'
    );
    this.htmlData.setDropDownOptionToKeyValue("select[name='fieldnamestyle']", options.fieldNameStyle, 'preserve');
    this.htmlData.setCheckBoxFrom('.prettyprint label input', options.prettyPrint, true);
    this.htmlData.setDropDownOptionToKeyValue("select[name='hashprettystyle']", options.hashPrettyStyle, 'compact');
    this.htmlData.setSelectWithCustomInput(
      "select[name='prettydelimiter']",
      'custom',
      '.custom-pretty-delimiter label input',
      delimiterMappings,
      options.prettyPrintDelimiter
    );
  }
}

export { RubyOptionsPanel };
