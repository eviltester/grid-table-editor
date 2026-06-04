import { TEST_FRAMEWORK_GROUPS, getTestFrameworkLabel } from '../../../generator/options/options-catalog-adapter.js';
import { createPlainOptions } from '../format-option-panel-definition-shared.js';
import { optionHtml, selectorForName, setSelectValue } from '../format-option-panel-dom.js';

function getFrameworkGroupName(frameworkId) {
  return (
    Object.keys(TEST_FRAMEWORK_GROUPS).find((groupName) => TEST_FRAMEWORK_GROUPS[groupName].includes(frameworkId)) ||
    'java'
  );
}

function getFrameworkOptions(frameworkId) {
  return TEST_FRAMEWORK_GROUPS[getFrameworkGroupName(frameworkId)].map((value) => ({
    value,
    label: getTestFrameworkLabel(value),
  }));
}

function getDataSourceStrategyOptions(frameworkId) {
  if (
    [
      'junit4',
      'junit5',
      'junit6',
      'testng',
      'pytest',
      'unittest',
      'nose2',
      'jest',
      'vitest',
      'mocha',
      'xunit',
      'nunit',
      'mstest',
    ].includes(frameworkId)
  ) {
    return [
      { value: 'provider', label: 'Provider/Method' },
      { value: 'inline', label: 'Inline' },
    ];
  }

  return [{ value: 'provider', label: 'Provider/Method' }];
}

function createTestFrameworkDefinition(frameworkId) {
  return {
    format: frameworkId,
    outputFormat: frameworkId,
    group: 'unitTest',
    label: getTestFrameworkLabel(frameworkId),
    panelClassName: 'test-framework-options',
    titleHelp: 'test-framework-options',
    createDefaultOptions: createPlainOptions,
    fields: [
      {
        key: 'frameworkId',
        name: 'framework-id',
        label: 'Framework',
        type: 'select',
        help: 'test-framework-option-framework',
        tipKey: 'framework',
        className: 'framework-id',
        options: getFrameworkOptions(frameworkId),
        defaultValue: frameworkId,
        disabled: getFrameworkOptions(frameworkId).length <= 1,
      },
      {
        key: 'suiteName',
        name: 'suite-name',
        label: 'Suite Name',
        type: 'text',
        help: 'test-framework-option-suite-name',
        className: 'suite-name',
        defaultValue: 'GeneratedDataTests',
        width: '12em',
      },
      {
        key: 'testNamePrefix',
        name: 'test-name-prefix',
        label: 'Test Name Prefix',
        type: 'text',
        help: 'test-framework-option-test-name-prefix',
        className: 'test-name-prefix',
        defaultValue: 'row',
        width: '12em',
      },
      {
        key: 'dataSourceStrategy',
        name: 'data-source-strategy',
        label: 'Data Source Strategy',
        type: 'select',
        help: 'test-framework-option-data-source-strategy',
        className: 'data-source-strategy',
        options: getDataSourceStrategyOptions(frameworkId),
        defaultValue: 'provider',
      },
      {
        key: 'includeSetup',
        name: 'include-setup',
        label: 'Include Setup',
        type: 'checkbox',
        help: 'test-framework-option-include-setup',
        className: 'include-setup',
        defaultValue: true,
      },
      {
        key: 'prettyPrint',
        name: 'pretty-print',
        label: 'Pretty Print',
        type: 'checkbox',
        help: 'test-framework-option-pretty-print',
        className: 'pretty-print',
        defaultValue: true,
      },
    ],
    afterRead(options, payload) {
      payload.outputFormat = options.frameworkId || frameworkId;
      delete options.frameworkId;
    },
    afterWrite(options, _mainOptions, panel) {
      const selectedFramework =
        options?.outputFormat || panel.root.querySelector(selectorForName('framework-id'))?.value || frameworkId;
      const strategy = panel.root.querySelector(selectorForName('data-source-strategy'));
      if (strategy) {
        const current = strategy.value;
        strategy.innerHTML = optionHtml(getDataSourceStrategyOptions(selectedFramework));
        setSelectValue(strategy, current, getDataSourceStrategyOptions(selectedFramework)[0]?.value || 'provider');
      }
    },
    afterRender(panel) {
      const frameworkSelect = panel.root.querySelector(selectorForName('framework-id'));
      frameworkSelect?.addEventListener('change', () => {
        const strategy = panel.root.querySelector(selectorForName('data-source-strategy'));
        if (strategy) {
          strategy.innerHTML = optionHtml(getDataSourceStrategyOptions(frameworkSelect.value));
        }
      });
    },
  };
}

export { createTestFrameworkDefinition };
