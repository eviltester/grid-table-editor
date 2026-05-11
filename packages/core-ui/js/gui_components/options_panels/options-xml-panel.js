import { XmlConvertorOptions } from '@anywaydata/core/data_formats/xml-convertor.js';
import { HtmlDataValues } from './html-options-data-utils.js';
import { applySharedOptionTips } from './options-help-tips.js';

class XmlOptionsPanel {
  constructor(parentElement) {
    this.parent = parentElement;
    this.htmlData = new HtmlDataValues(this.parent);
  }

  addToGui() {
    this.parent.innerHTML = `
      <div class="xml-options" style="width:100%">
        <div><p><strong>Options</strong> <span data-help="xml-options" class="helpicon"></span></p></div>

        <div class="root-element-name">
          <label><span class="helpicon option-help-icon" data-help="xml-option-root-element"></span>Root Element
            <input type="text" name="root-element-name" value="" style="width:10em">
          </label>
          <br>
        </div>

        <div class="item-element-name">
          <label><span class="helpicon option-help-icon" data-help="xml-option-item-element"></span>Item Element
            <input type="text" name="item-element-name" value="" style="width:10em">
          </label>
          <br>
        </div>

        <div class="attributes-columns-csv">
          <label><span class="helpicon option-help-icon" data-help="xml-option-attributes"></span>Attributes
            <input type="text" name="attribute-columns-csv" value="" style="width:15em">
          </label>
          <br>
        </div>

        <div class="xml-header">
          <label>
            <span class="helpicon option-help-icon" data-help="xml-option-header"></span>
            <input type="checkbox" name="include-xml-header" value="include-xml-header">
            XML Header
          </label>
          <br>
        </div>

        <div class="xml-namespace">
          <label><span class="helpicon option-help-icon" data-help="xml-option-xmlns"></span>XMLNS
            <input type="text" name="xml-namespace" value="" style="width:15em">
          </label>
          <br>
        </div>

        <div class="apply">
          <button class="apply-options">Apply</button>
        </div>
      </div>
    `;
    applySharedOptionTips(this.parent, 'xml', [
      { selector: "[data-help='xml-option-root-element']", key: 'rootElementName' },
      { selector: "[data-help='xml-option-item-element']", key: 'itemElementName' },
      { selector: "[data-help='xml-option-attributes']", key: 'attributeColumnsCsv' },
      { selector: "[data-help='xml-option-header']", key: 'includeXmlHeader' },
      { selector: "[data-help='xml-option-xmlns']", key: 'xmlns' },
    ]);
  }

  setApplyCallback(callbackFunc) {
    let button = this.parent.querySelector('.xml-options .apply button');
    button.onclick = function () {
      callbackFunc(this.getOptionsFromGui());
    }.bind(this);
  }

  getOptionsFromGui() {
    const newOptions = new XmlConvertorOptions();
    newOptions.options.rootElementName = this.htmlData.getTextInputValueFrom("input[name='root-element-name']");
    newOptions.options.itemElementName = this.htmlData.getTextInputValueFrom("input[name='item-element-name']");
    newOptions.options.attributeColumnsCsv = this.htmlData.getTextInputValueFrom("input[name='attribute-columns-csv']");
    newOptions.options.includeXmlHeader = this.htmlData.getCheckBoxValueFrom("input[name='include-xml-header']");
    newOptions.options.xmlns = this.htmlData.getTextInputValueFrom("input[name='xml-namespace']");
    return newOptions;
  }

  setFromOptions(mainOptions) {
    const options = mainOptions?.options ? mainOptions.options : {};
    this.htmlData.setTextFieldToValue("input[name='root-element-name']", options?.rootElementName);
    this.htmlData.setTextFieldToValue("input[name='item-element-name']", options?.itemElementName);
    this.htmlData.setTextFieldToValue("input[name='attribute-columns-csv']", options?.attributeColumnsCsv);
    this.htmlData.setCheckBoxFrom("input[name='include-xml-header']", options?.includeXmlHeader, true);
    this.htmlData.setTextFieldToValue("input[name='xml-namespace']", options?.xmlns);
  }
}

export { XmlOptionsPanel };
