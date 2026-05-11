import { HtmlConvertorOptions } from '@anywaydata/core/data_formats/html-convertor.js';
import { HtmlDataValues } from './html-options-data-utils.js';
import { applySharedOptionTips } from './options-help-tips.js';
import { applyUiPanelOnlyTips } from './options-help-tips-ui.js';

class HtmlOptionsPanel {
  constructor(parentElement) {
    this.parent = parentElement;
    this.parentDivClass = 'html-options';
    this.htmlData = new HtmlDataValues(this.parent);
  }

  addToGui() {
    this.parent.innerHTML = `
        <div class="${this.parentDivClass}" style="width:100%">
          <div><p><strong>Options</strong> <span data-help="html-table-options" class="helpicon"></span></p></div>

      
          <div class="compacthtml">            
            <label>
              <span class="helpicon option-help-icon" data-help="html-option-compact"></span>
              <input type="checkbox" name="compacthtml" value="compacthtml">
              Compact
            </label>
            <br>
          </div>

          <div class="prettyprint">            
            <label>
              <span class="helpicon option-help-icon" data-help="html-option-pretty-print"></span>
              <input type="checkbox" name="prettyprint" value="prettyprint">
              Pretty Print
            </label>
            <br>
          </div>

          <div class="prettydelimiter option-child">
            <label><span class="helpicon option-help-icon" data-help="html-option-delimiter"></span>Delimiter
              <select name="prettydelimiter">
                <option value="tab">Tab [\\t]</option>
                <option value="space">Space [ ]</option>
                <option value="custom">Custom Value</option>
              </select>
            </label>
          <br>
          </div>
          <div class="custom-pretty-delimiter option-child">
            <label><span class="helpicon option-help-icon" data-help="html-option-custom-delimiter"></span>Custom
              <input type="text" name="custom-pretty-delimiter" value='' style="width:5em">
            </label>
            <br>
          </div>  

          <div class="addthead">            
            <label>
              <span class="helpicon option-help-icon" data-help="html-option-add-thead"></span>
              <input type="checkbox" name="addthead" value="addthead">
              Add &lt;thead&gt;
            </label>
            <br>
          </div>

          <div class="addtbody">            
            <label>
              <span class="helpicon option-help-icon" data-help="html-option-add-tbody"></span>
              <input type="checkbox" name="addtbody" value="addtbody">
              Add &lt;tbody&gt;
            </label>
            <br>
          </div>
  

          <div class="apply">
            <button class="apply-options">Apply</button>
          </div>
      
        </div>
        `;
    applySharedOptionTips(this.parent, 'html', [
      { selector: "[data-help='html-option-compact']", key: 'compact' },
      { selector: "[data-help='html-option-pretty-print']", key: 'prettyPrint' },
      { selector: "[data-help='html-option-delimiter']", key: 'prettyPrintDelimiter' },
      { selector: "[data-help='html-option-add-thead']", key: 'addTheadToTable' },
      { selector: "[data-help='html-option-add-tbody']", key: 'addTbodyToTable' },
    ]);
    applyUiPanelOnlyTips(this.parent, ['html-option-custom-delimiter']);
  }

  setApplyCallback(callbackFunc) {
    let button = this.parent.querySelector('.apply button');
    button.onclick = function () {
      callbackFunc(this.getOptionsFromGui());
    }.bind(this);
  }

  getOptionsFromGui() {
    let newOptions = new HtmlConvertorOptions();

    newOptions.options.compact = this.htmlData.getCheckBoxValueFrom('.compacthtml label input');
    newOptions.options.prettyPrint = this.htmlData.getCheckBoxValueFrom('.prettyprint label input');

    let prettyPrintDelimiter = this.htmlData.getSelectWithCustomInput(
      "select[name='prettydelimiter']",
      'custom',
      '.custom-pretty-delimiter label input',
      newOptions.delimiterMappings,
      '\t'
    );
    newOptions.options.prettyPrintDelimiter = prettyPrintDelimiter;

    newOptions.options.addTheadToTable = this.htmlData.getCheckBoxValueFrom('.addthead label input');
    newOptions.options.addTbodyToTable = this.htmlData.getCheckBoxValueFrom('.addtbody label input');

    return newOptions;
  }

  setFromOptions(mainOptions) {
    let options = mainOptions?.options ? mainOptions.options : {};

    // TODO: create 'defaults' in the main options class and use these in the panel settings
    this.htmlData.setCheckBoxFrom('.compacthtml label input', options?.compact, false);
    this.htmlData.setCheckBoxFrom('.prettyprint label input', options?.prettyPrint, false);
    this.htmlData.setCheckBoxFrom('.addthead label input', options?.addTheadToTable, false);
    this.htmlData.setCheckBoxFrom('.addtbody label input', options?.addTbodyToTable, false);

    this.htmlData.setSelectWithCustomInput(
      `select[name='prettydelimiter']`,
      'custom',
      '.custom-pretty-delimiter label input',
      mainOptions.delimiterMappings,
      options.prettyPrintDelimiter
    );
  }
}

export { HtmlOptionsPanel };
