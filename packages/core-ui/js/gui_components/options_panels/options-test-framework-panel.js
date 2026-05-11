import { TestFrameworkConvertorOptions } from '@anywaydata/core/data_formats/test-framework-convertor.js';
import { getTipsForFormat } from '@anywaydata/core';
import { HtmlDataValues } from './html-options-data-utils.js';
import { applyUiPanelOnlyTips } from './options-help-tips-ui.js';
import { TEST_FRAMEWORK_GROUPS, getTestFrameworkLabel } from '../options-catalog-adapter.js';

class TestFrameworkOptionsPanel {
  constructor(parentElement, frameworkId = 'junit4') {
    this.parent = parentElement;
    this.htmlData = new HtmlDataValues(this.parent);
    this.frameworkId = frameworkId;
  }

  getFrameworkGroupName() {
    const frameworkId = this.frameworkId;
    return (
      Object.keys(TEST_FRAMEWORK_GROUPS).find((groupName) => TEST_FRAMEWORK_GROUPS[groupName].includes(frameworkId)) ||
      'java'
    );
  }

  getFrameworkOptions() {
    const groupName = this.getFrameworkGroupName();
    return TEST_FRAMEWORK_GROUPS[groupName].map((frameworkId) => ({
      value: frameworkId,
      label: getTestFrameworkLabel(frameworkId),
    }));
  }

  getDataSourceStrategyOptions() {
    const selectedFrameworkId =
      this.parent?.querySelector?.("select[name='framework-id']")?.value?.trim?.() || this.frameworkId;

    if (selectedFrameworkId === 'junit5' || selectedFrameworkId === 'junit6') {
      return [
        { value: 'provider', label: 'Provider/Method' },
        { value: 'inline', label: 'Inline' },
      ];
    }
    if (selectedFrameworkId === 'junit4' || selectedFrameworkId === 'testng') {
      return [
        { value: 'provider', label: 'Provider/Method' },
        { value: 'inline', label: 'Inline' },
      ];
    }
    if (
      selectedFrameworkId === 'pytest' ||
      selectedFrameworkId === 'unittest' ||
      selectedFrameworkId === 'nose2' ||
      selectedFrameworkId === 'jest' ||
      selectedFrameworkId === 'vitest' ||
      selectedFrameworkId === 'mocha' ||
      selectedFrameworkId === 'xunit' ||
      selectedFrameworkId === 'nunit' ||
      selectedFrameworkId === 'mstest'
    ) {
      return [
        { value: 'provider', label: 'Provider/Method' },
        { value: 'inline', label: 'Inline' },
      ];
    }
    return [{ value: 'provider', label: 'Provider/Method' }];
  }

  addToGui() {
    const frameworkOptions = this.getFrameworkOptions();
    const dataSourceOptions = this.getDataSourceStrategyOptions()
      .map((option) => `<option value="${option.value}">${option.label}</option>`)
      .join('');
    const frameworkOptionsHtml = frameworkOptions
      .map((option) => `<option value="${option.value}">${option.label}</option>`)
      .join('');

    this.parent.innerHTML = `
      <div class="test-framework-options" style="width:100%">
        <div><p><strong>Options</strong> <span data-help="test-framework-options" class="helpicon"></span></p></div>

        <div class="framework-id">
          <label><span class="helpicon option-help-icon" data-help="test-framework-option-framework"></span>Framework
            <select name="framework-id" ${frameworkOptions.length <= 1 ? 'disabled' : ''}>
              ${frameworkOptionsHtml}
            </select>
          </label>
          <br>
        </div>

        <div class="suite-name">
          <label><span class="helpicon option-help-icon" data-help="test-framework-option-suite-name"></span>Suite Name
            <input type="text" name="suite-name" value="GeneratedDataTests" style="width:12em">
          </label>
          <br>
        </div>

        <div class="test-name-prefix">
          <label><span class="helpicon option-help-icon" data-help="test-framework-option-test-name-prefix"></span>Test Name Prefix
            <input type="text" name="test-name-prefix" value="row" style="width:12em">
          </label>
          <br>
        </div>

        <div class="data-source-strategy">
          <label><span class="helpicon option-help-icon" data-help="test-framework-option-data-source-strategy"></span>Data Source Strategy
            <select name="data-source-strategy">
              ${dataSourceOptions}
            </select>
          </label>
          <br>
        </div>

        <div class="include-setup">
          <label>
            <span class="helpicon option-help-icon" data-help="test-framework-option-include-setup"></span>
            <input type="checkbox" name="include-setup" checked>
            Include Setup
          </label>
          <br>
        </div>

        <div class="pretty-print">
          <label>
            <span class="helpicon option-help-icon" data-help="test-framework-option-pretty-print"></span>
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

    const frameworkSelect = this.parent.querySelector("select[name='framework-id']");
    if (frameworkSelect) {
      frameworkSelect.value = frameworkOptions.some((option) => option.value === this.frameworkId)
        ? this.frameworkId
        : frameworkOptions[0]?.value;
      frameworkSelect.addEventListener('change', () => {
        this.frameworkId = frameworkSelect.value || this.frameworkId;
        this.refreshDataSourceStrategyOptions();
        this.refreshHelpTipsForSelectedFramework();
      });
    }
    this.refreshDataSourceStrategyOptions();
    applyUiPanelOnlyTips(this.parent, ['test-framework-option-framework']);
    this.refreshHelpTipsForSelectedFramework();
  }

  refreshHelpTipsForSelectedFramework() {
    const selectedFrameworkId =
      this.parent?.querySelector?.("select[name='framework-id']")?.value?.trim?.() || this.frameworkId;
    const tips = getTipsForFormat(selectedFrameworkId);
    const tipBindings = [
      { selector: "[data-help='test-framework-option-suite-name']", key: 'suiteName' },
      { selector: "[data-help='test-framework-option-test-name-prefix']", key: 'testNamePrefix' },
      { selector: "[data-help='test-framework-option-data-source-strategy']", key: 'dataSourceStrategy' },
      { selector: "[data-help='test-framework-option-include-setup']", key: 'includeSetup' },
      { selector: "[data-help='test-framework-option-pretty-print']", key: 'prettyPrint' },
    ];

    for (const binding of tipBindings) {
      const elem = this.parent?.querySelector?.(binding.selector);
      if (elem && tips?.[binding.key]) {
        elem.setAttribute('data-help-text', tips[binding.key]);
      }
      if (elem) {
        elem.setAttribute('data-option-key', binding.key);
        elem.setAttribute('data-option-format', selectedFrameworkId);
      }
    }
  }

  refreshDataSourceStrategyOptions() {
    const strategySelect = this.parent.querySelector("select[name='data-source-strategy']");
    if (!strategySelect) {
      return;
    }
    const currentValue = strategySelect.value;
    const options = this.getDataSourceStrategyOptions();
    strategySelect.innerHTML = options
      .map((option) => `<option value="${option.value}">${option.label}</option>`)
      .join('');
    strategySelect.value = options.some((option) => option.value === currentValue) ? currentValue : options[0]?.value;
  }

  setApplyCallback(callbackFunc) {
    const button = this.parent.querySelector('.apply button');
    button.onclick = function () {
      callbackFunc(this.getOptionsFromGui());
    }.bind(this);
  }

  getOptionsFromGui() {
    const newOptions = new TestFrameworkConvertorOptions();
    newOptions.outputFormat =
      this.htmlData.getSelectedValueFrom("select[name='framework-id']", this.frameworkId) || this.frameworkId;
    newOptions.options.suiteName =
      this.htmlData.getTextInputValueFrom("input[name='suite-name']") || newOptions.options.suiteName;
    newOptions.options.testNamePrefix =
      this.htmlData.getTextInputValueFrom("input[name='test-name-prefix']") || newOptions.options.testNamePrefix;
    newOptions.options.dataSourceStrategy =
      this.htmlData.getSelectedValueFrom("select[name='data-source-strategy']", 'provider') || 'provider';
    newOptions.options.includeSetup = this.htmlData.getCheckBoxValueFrom("input[name='include-setup']");
    newOptions.options.prettyPrint = this.htmlData.getCheckBoxValueFrom("input[name='pretty-print']");
    return newOptions;
  }

  setFromOptions(mainOptions) {
    const options = mainOptions?.options ?? {};
    const selectedFramework = mainOptions?.outputFormat || this.frameworkId;
    const selectedDataSourceStrategy =
      (selectedFramework === 'junit5' || selectedFramework === 'junit6') && options.dataSourceStrategy === 'csv'
        ? 'inline'
        : options.dataSourceStrategy;
    this.htmlData.setDropDownOptionToKeyValue("select[name='framework-id']", selectedFramework, this.frameworkId);
    this.frameworkId = selectedFramework;
    this.refreshDataSourceStrategyOptions();
    this.htmlData.setTextFieldToValue("input[name='suite-name']", options.suiteName ?? 'GeneratedDataTests');
    this.htmlData.setTextFieldToValue("input[name='test-name-prefix']", options.testNamePrefix ?? 'row');
    this.htmlData.setDropDownOptionToKeyValue(
      "select[name='data-source-strategy']",
      selectedDataSourceStrategy,
      this.getDataSourceStrategyOptions()[0]?.value || 'provider'
    );
    this.htmlData.setCheckBoxFrom("input[name='include-setup']", options.includeSetup, true);
    this.htmlData.setCheckBoxFrom("input[name='pretty-print']", options.prettyPrint, true);
    this.refreshHelpTipsForSelectedFramework();
  }
}

export { TestFrameworkOptionsPanel };
