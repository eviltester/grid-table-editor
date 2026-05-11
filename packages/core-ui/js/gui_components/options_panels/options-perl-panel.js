import { PerlConvertorOptions } from '@anywaydata/core/data_formats/perl-convertor.js';
import { HtmlDataValues } from './html-options-data-utils.js';
import { applyUiPanelOnlyTips } from './options-help-tips-ui.js';

class PerlOptionsPanel {
  constructor(parentElement) {
    this.parent = parentElement;
    this.htmlData = new HtmlDataValues(this.parent);
  }

  addToGui() {
    this.parent.innerHTML = `
      <div class="perl-options" style="width:100%">
        <div><p><strong>Options</strong> <span data-help="perl-options" class="helpicon"></span></p></div>
        <div class="collectiontype">
          <label><span class="helpicon option-help-icon" data-help="perl-option-collection-type"></span>Collection Type
            <select name="collectiontype">
              <option value="array">Array Ref ([...])</option>
              <option value="list">List (...) </option>
            </select>
          </label>
        </div>
        <div class="assigntovariable">
          <label><span class="helpicon option-help-icon" data-help="perl-option-assign-variable"></span><input type="checkbox" name="assigntovariable"> Assign to Variable</label>
        </div>
        <div class="variablename option-child">
          <label><span class="helpicon option-help-icon" data-help="perl-option-variable-name"></span>Variable Name <input type="text" name="variablename" value="data" style="width:8em"></label>
        </div>
        <div class="quotenumbers">
          <label><span class="helpicon option-help-icon" data-help="perl-option-quote-numbers"></span><input type="checkbox" name="quotenumbers"> Number Convert (Quote Numbers)</label>
        </div>
        <div class="hashkeystyle">
          <label><span class="helpicon option-help-icon" data-help="perl-option-hash-key-style"></span>Hash Key Style
            <select name="hashkeystyle">
              <option value="quoted">Quoted Keys ('name' =>)</option>
              <option value="bareword">Bareword Keys (name =>)</option>
            </select>
          </label>
        </div>
        <div class="useanonymousobjects">
          <label><span class="helpicon option-help-icon" data-help="perl-option-anonymous-objects"></span><input type="checkbox" name="useanonymousobjects"> Anonymous Objects (Hash/Map)</label>
        </div>
        <div class="objectclassname option-child">
          <label><span class="helpicon option-help-icon" data-help="perl-option-class-name"></span>Object Name <input type="text" name="objectclassname" value="Row" style="width:8em"></label>
        </div>
        <div class="objectinstantiationstyle option-child">
          <label><span class="helpicon option-help-icon" data-help="perl-option-object-instantiation-style"></span>Object Instantiation
            <select name="objectinstantiationstyle">
              <option value="bless">bless(...)</option>
              <option value="constructor">Class-&gt;new(...)</option>
            </select>
          </label>
        </div>
        <div class="prettyprint">
          <label><span class="helpicon option-help-icon" data-help="perl-option-pretty-print"></span><input type="checkbox" name="prettyprint"> Pretty Print</label>
        </div>
        <div class="prettydelimiter option-child">
          <label><span class="helpicon option-help-icon" data-help="perl-option-delimiter"></span>Delimiter
            <select name="prettydelimiter">
              <option value="tab">Tab [\t]</option>
              <option value="space">Space [ ]</option>
              <option value="custom">Custom Value</option>
            </select>
          </label>
        </div>
        <div class="custom-pretty-delimiter option-child">
          <label><span class="helpicon option-help-icon" data-help="perl-option-custom-delimiter"></span>Custom Delimiter <input type="text" name="custom-pretty-delimiter" value="" style="width:8em"></label>
        </div>
        <div class="apply">
          <button class="apply-options">Apply</button>
        </div>
      </div>
    `;
    applyUiPanelOnlyTips(this.parent);
  }

  setApplyCallback(callbackFunc) {
    const button = this.parent.querySelector('.apply button');
    button.onclick = function () {
      callbackFunc(this.getOptionsFromGui());
    }.bind(this);
  }

  getOptionsFromGui() {
    const newOptions = new PerlConvertorOptions();
    newOptions.options.collectionType = this.htmlData.getSelectedValueFrom("select[name='collectiontype']", 'array');
    newOptions.options.assignToVariable = this.htmlData.getCheckBoxValueFrom('.assigntovariable label input');
    newOptions.options.variableName = this.htmlData.getTextInputValueFrom('.variablename label input') || 'data';
    newOptions.options.quoteNumbers = this.htmlData.getCheckBoxValueFrom('.quotenumbers label input');
    newOptions.options.hashKeyStyle = this.htmlData.getSelectedValueFrom("select[name='hashkeystyle']", 'quoted');
    newOptions.options.useAnonymousObjects = this.htmlData.getCheckBoxValueFrom('.useanonymousobjects label input');
    newOptions.options.objectClassName = this.htmlData.getTextInputValueFrom('.objectclassname label input') || 'Row';
    newOptions.options.objectInstantiationStyle = this.htmlData.getSelectedValueFrom(
      "select[name='objectinstantiationstyle']",
      'bless'
    );
    newOptions.options.prettyPrint = this.htmlData.getCheckBoxValueFrom('.prettyprint label input');
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
    const delimiterMappings = mainOptions?.delimiterMappings ?? new PerlConvertorOptions().delimiterMappings;
    this.htmlData.setDropDownOptionToKeyValue("select[name='collectiontype']", options.collectionType, 'array');
    this.htmlData.setCheckBoxFrom('.assigntovariable label input', options.assignToVariable, true);
    this.htmlData.setTextFieldToValue('.variablename label input', options.variableName ?? 'data');
    this.htmlData.setCheckBoxFrom('.quotenumbers label input', options.quoteNumbers, false);
    this.htmlData.setDropDownOptionToKeyValue("select[name='hashkeystyle']", options.hashKeyStyle, 'quoted');
    this.htmlData.setCheckBoxFrom('.useanonymousobjects label input', options.useAnonymousObjects, true);
    this.htmlData.setTextFieldToValue('.objectclassname label input', options.objectClassName ?? 'Row');
    this.htmlData.setDropDownOptionToKeyValue(
      "select[name='objectinstantiationstyle']",
      options.objectInstantiationStyle,
      'bless'
    );
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

export { PerlOptionsPanel };
