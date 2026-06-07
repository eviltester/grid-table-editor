import { JSDOM } from 'jsdom';
import {
  createFormatOptionPanel,
  getFormatOptionDefinition,
} from '../../../js/gui_components/shared/format-options-panel/format-option-panel-definition.js';
import * as generatorOptions from '../../../js/gui_components/generator/options/apply-generator-format-options.js';
import { getOptionPanelDefinitions } from '../../../js/gui_components/generator/options/options-ui-schema.js';

function createRoot() {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
  return {
    dom,
    root: dom.window.document.getElementById('root'),
  };
}

describe('format option panel definitions', () => {
  test('generator options public surface keeps catalog helpers direct-import-only', () => {
    expect(generatorOptions.createOptionsPanelsForParent).toBeUndefined();
    expect(generatorOptions.getOutputFormatGroups).toBeUndefined();
    expect(generatorOptions.getCodeLanguageSubtasks).toBeUndefined();
    expect(generatorOptions.getUnitTestLanguageSubtasks).toBeUndefined();
    expect(typeof generatorOptions.applyGeneratorFormatOptions).toBe('function');
  });

  test('every option definition exposes the component-compatible panel contract', () => {
    const { dom, root } = createRoot();
    const definitions = getOptionPanelDefinitions();

    Object.entries(definitions).forEach(([format, definition]) => {
      const panel = createFormatOptionPanel(definition, { root });

      expect(typeof panel.render).toBe('function');
      expect(typeof panel.read).toBe('function');
      expect(typeof panel.write).toBe('function');
      expect(typeof panel.validate).toBe('function');
      expect(typeof panel.setDirty).toBe('function');
      expect(typeof panel.destroy).toBe('function');
      expect(typeof panel.onApply).toBe('function');

      panel.render();
      panel.write({ outputFormat: format, options: {} });
      const payload = panel.read();

      expect(payload.outputFormat).toBeTruthy();
      expect(payload.options).toEqual(expect.any(Object));
      expect(root.querySelector('[data-role="apply-options-button"]')).not.toBeNull();
      expect(root.querySelector('[data-role="option-help-icon"]')).not.toBeNull();
      panel.destroy();
    });

    dom.window.close();
  });

  test('DSV definition reads mapped and custom delimiters through the shared contract', () => {
    const { dom, root } = createRoot();
    const panel = createFormatOptionPanel(getFormatOptionDefinition('dsv'), { root });

    panel.render();
    root.querySelector("select[name='delimiter']").value = 'pipe';
    expect(panel.read().options.delimiter).toBe('|');

    root.querySelector("select[name='delimiter']").value = 'custom';
    root.querySelector("input[name='custom-delimiter']").value = '||';
    expect(panel.read().options.delimiter).toBe('||');

    panel.write({ options: { delimiter: '#', quotes: true, header: true } });
    expect(root.querySelector("select[name='delimiter']").value).toBe('hash');
    expect(root.querySelector("input[name='quotes']").checked).toBe(true);
    expect(root.querySelector("input[name='header']").checked).toBe(true);

    dom.window.close();
  });

  test('select-custom fields keep a stable selected/custom shape when written with no explicit value', () => {
    const { dom, root } = createRoot();
    const panel = createFormatOptionPanel(
      {
        format: 'custom',
        panelClassName: 'custom-options',
        titleHelp: 'custom-options',
        createDefaultOptions: () => ({ options: {} }),
        fields: [
          {
            key: 'delimiter',
            name: 'delimiter',
            label: 'Delimiter',
            type: 'selectCustom',
            help: 'custom-option-delimiter',
            customHelp: 'custom-option-custom-delimiter',
            customName: 'custom-delimiter',
            customLabel: 'Custom',
            className: 'delimiter',
            customClassName: 'custom-delimiter',
            mappings: { tab: '\t' },
            options: [{ value: 'tab', label: 'Tab [\\t]' }],
          },
        ],
      },
      { root }
    );

    panel.render();
    panel.write({ options: { delimiter: null } });

    expect(root.querySelector("select[name='delimiter']").value).toBe('custom');
    expect(root.querySelector("input[name='custom-delimiter']").value).toBe('');

    dom.window.close();
  });

  test('JSONL definition emits JSON-lines options without JSON object-only controls', () => {
    const { dom, root } = createRoot();
    const panel = createFormatOptionPanel(getFormatOptionDefinition('jsonl'), { root });

    panel.render();
    root.querySelector("input[name='numbersnumeric']").checked = true;
    const payload = panel.read();

    expect(root.querySelector("input[name='propertynamed']")).toBeNull();
    expect(payload.outputFormat).toBe('jsonl');
    expect(payload.options).toEqual({
      asObject: false,
      asPropertyNamed: '',
      makeNumbersNumeric: true,
      outputAsJsonLines: true,
      prettyPrint: false,
    });

    dom.window.close();
  });

  test('Python definition renders long text and textarea controls with the shared block-width contract', () => {
    const { dom, root } = createRoot();
    const panel = createFormatOptionPanel(getFormatOptionDefinition('python'), { root });

    panel.render();

    const decimalColumnsInput = root.querySelector("input[name='decimalcolumnscsv']");
    const importStatementsTextarea = root.querySelector("textarea[name='importstatements']");

    expect(decimalColumnsInput).not.toBeNull();
    expect(importStatementsTextarea).not.toBeNull();
    expect(decimalColumnsInput.classList.contains('format-option-control')).toBe(true);
    expect(importStatementsTextarea.classList.contains('format-option-control')).toBe(true);
    expect(importStatementsTextarea.classList.contains('format-option-textarea')).toBe(true);
    expect(root.querySelectorAll('[data-role="option-help-icon"]').length).toBeGreaterThan(0);
    expect(decimalColumnsInput.closest('.format-option-field')).not.toBeNull();
    expect(importStatementsTextarea.closest('.format-option-field')).not.toBeNull();
    expect(decimalColumnsInput.closest('label')?.classList.contains('format-option-block-label')).toBe(true);
    expect(importStatementsTextarea.closest('label')?.classList.contains('format-option-block-label')).toBe(true);

    dom.window.close();
  });

  test('test-framework definition resolves selected framework as output format', () => {
    const { dom, root } = createRoot();
    const panel = createFormatOptionPanel(getOptionPanelDefinitions().jest, { root });

    panel.render();
    root.querySelector("select[name='framework-id']").value = 'vitest';
    root.querySelector("input[name='suite-name']").value = 'TableDrivenTests';
    const payload = panel.read();

    expect(payload.outputFormat).toBe('vitest');
    expect(payload.options.suiteName).toBe('TableDrivenTests');
    expect(payload.options).not.toHaveProperty('frameworkId');

    dom.window.close();
  });
});
