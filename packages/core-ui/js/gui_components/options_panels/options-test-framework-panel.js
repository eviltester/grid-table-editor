import { TestFrameworkConvertorOptions } from '@anywaydata/core/data_formats/test-framework-convertor.js';
import { HtmlDataValues } from './html-options-data-utils.js';

class TestFrameworkOptionsPanel {
  constructor(parentElement) {
    this.parent = parentElement;
    this.htmlData = new HtmlDataValues(this.parent);
  }

  addToGui() {
    this.parent.innerHTML = `
      <div class="test-framework-options" style="width:100%">
        <div><p><strong>Options</strong> <span data-help="test-framework-options" class="helpicon"></span></p></div>

        <div class="suite-name">
          <label>Suite Name
            <input type="text" name="suite-name" value="GeneratedDataTests" style="width:12em">
          </label>
          <br>
        </div>

        <div class="test-name-prefix">
          <label>Test Name Prefix
            <input type="text" name="test-name-prefix" value="row" style="width:12em">
          </label>
          <br>
        </div>

        <div class="assertion-style">
          <label>Assertion Style
            <select name="assertion-style">
              <option value="strict">Strict</option>
              <option value="basic">Basic</option>
            </select>
          </label>
          <br>
        </div>

        <div class="data-source-strategy">
          <label>Data Source Strategy
            <select name="data-source-strategy">
              <option value="provider">Provider/Method</option>
              <option value="inline">Inline</option>
              <option value="csv">CSV Source (JUnit)</option>
            </select>
          </label>
          <br>
        </div>

        <div class="include-setup">
          <label>
            <input type="checkbox" name="include-setup" checked>
            Include Setup
          </label>
          <br>
        </div>

        <div class="pretty-print">
          <label>
            <input type="checkbox" name="pretty-print" checked>
            Pretty Print
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
    const newOptions = new TestFrameworkConvertorOptions();
    newOptions.options.suiteName =
      this.htmlData.getTextInputValueFrom("input[name='suite-name']") || newOptions.options.suiteName;
    newOptions.options.testNamePrefix =
      this.htmlData.getTextInputValueFrom("input[name='test-name-prefix']") || newOptions.options.testNamePrefix;
    newOptions.options.assertionStyle =
      this.htmlData.getSelectedValueFrom("select[name='assertion-style']", 'strict') || 'strict';
    newOptions.options.dataSourceStrategy =
      this.htmlData.getSelectedValueFrom("select[name='data-source-strategy']", 'provider') || 'provider';
    newOptions.options.includeSetup = this.htmlData.getCheckBoxValueFrom("input[name='include-setup']");
    newOptions.options.prettyPrint = this.htmlData.getCheckBoxValueFrom("input[name='pretty-print']");
    return newOptions;
  }

  setFromOptions(mainOptions) {
    const options = mainOptions?.options ?? {};
    this.htmlData.setTextFieldToValue("input[name='suite-name']", options.suiteName ?? 'GeneratedDataTests');
    this.htmlData.setTextFieldToValue("input[name='test-name-prefix']", options.testNamePrefix ?? 'row');
    this.htmlData.setDropDownOptionToKeyValue("select[name='assertion-style']", options.assertionStyle, 'strict');
    this.htmlData.setDropDownOptionToKeyValue(
      "select[name='data-source-strategy']",
      options.dataSourceStrategy,
      'provider'
    );
    this.htmlData.setCheckBoxFrom("input[name='include-setup']", options.includeSetup, true);
    this.htmlData.setCheckBoxFrom("input[name='pretty-print']", options.prettyPrint, true);
  }
}

export { TestFrameworkOptionsPanel };
