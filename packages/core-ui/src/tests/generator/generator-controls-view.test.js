import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { createGeneratorControlsComponent } from '../../../js/gui_components/generator/controls/index.js';

function createFormatGroups() {
  return {
    core: [
      { type: 'csv', label: 'CSV' },
      { type: 'json', label: 'JSON' },
    ],
    code: [{ type: 'python', label: 'Python' }],
    unitTest: [{ type: 'jest', label: 'Jest' }],
  };
}

describe('GeneratorControlsView', () => {
  function getOutputFormatSelect(documentObj) {
    return documentObj.querySelector('[data-role="generator-output-format-select"]');
  }

  function getGenerateDataButton(documentObj) {
    return documentObj.querySelector('[data-role="generator-generate-data-button"]');
  }

  function getGeneratePairwiseButton(documentObj) {
    return documentObj.querySelector('[data-role="generator-generate-pairwise-button"]');
  }

  function getGenerateSchemaButton(documentObj) {
    return documentObj.querySelector('[data-role="generate-schema-button"]');
  }

  function getGeneratePairwiseButtonWrapper(documentObj) {
    return documentObj.querySelector('[data-role="generator-pairwise-button-wrapper"]');
  }

  function getStatusText(documentObj) {
    return documentObj.querySelector('[data-role="generator-status-text"]');
  }

  function getGenerateRowsInput(documentObj) {
    return documentObj.querySelector('[data-role="generate-rows-count-control"] input');
  }

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders controls, updates format options, and forwards actions', () => {
    const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
    global.document = dom.window.document;
    global.window = dom.window;

    const onFormatChanged = jest.fn();
    const onGenerateData = jest.fn();
    const onGeneratePairwise = jest.fn();
    const statusPresenter = { setStatus: jest.fn(), clear: jest.fn(), scheduleClear: jest.fn(), destroy: jest.fn() };
    const loadingStatusPresenter = { setStatus: jest.fn(), clear: jest.fn(), destroy: jest.fn() };
    const rowCountControl = {
      destroy: jest.fn(),
      getParsedValue: jest.fn(() => ({
        value: 1000,
        valid: true,
        errors: [],
      })),
    };
    const formatOptionsPanel = {
      update: jest.fn(),
      destroy: jest.fn(),
      getPanels: jest.fn(() => ({ csv: {} })),
    };
    const updateHelpHints = jest.fn();

    const component = createGeneratorControlsComponent({
      root: dom.window.document.getElementById('root'),
      documentObj: dom.window.document,
      props: {
        selectedFormat: 'csv',
        currentOptions: { options: { header: true } },
        pairwiseVisible: false,
        generationButtonsBusy: false,
      },
      services: {
        createRowCountControl: jest.fn(({ root, props }) => {
          root.innerHTML = `<input${props.inputId ? ` id="${props.inputId}"` : ''} min="${props.min}" value="${props.value}" />`;
          return rowCountControl;
        }),
        createFormatOptionsPanel: jest.fn(() => formatOptionsPanel),
        createStatusPresenter: jest.fn(() => statusPresenter),
        createLoadingStatusPresenter: jest.fn(() => loadingStatusPresenter),
        getOutputFormatGroups: createFormatGroups,
        canExportFormat: (type) => type !== 'python',
        getCurrentOptionsForFormat: (type) =>
          type === 'json' ? { options: { prettyPrint: true } } : { options: { header: true } },
        updateHelpHints,
      },
      callbacks: {
        onFormatChanged,
        onGenerateData,
        onGeneratePairwise,
      },
    });

    const outputSelect = getOutputFormatSelect(dom.window.document);
    const lineEndingSelect = dom.window.document.querySelector('[data-role="line-ending-select"]');
    const includeBomCheckbox = dom.window.document.querySelector('[data-role="include-bom-checkbox"]');
    expect(outputSelect).not.toBeNull();
    expect(Array.from(outputSelect.querySelectorAll('option')).map((option) => option.value)).toEqual([
      'csv',
      'json',
      'jest',
    ]);
    expect(dom.window.document.querySelector('.shared-generator-controls')).not.toBeNull();
    expect(dom.window.document.querySelector('.shared-generator-controls-head')).not.toBeNull();
    expect(dom.window.document.querySelector('.shared-generator-options-wrapper')).not.toBeNull();
    expect(dom.window.document.querySelector('.shared-generator-options-panel')).not.toBeNull();
    expect(dom.window.document.querySelector('.shared-generator-status-text')).not.toBeNull();
    expect(dom.window.document.querySelector('[data-role="generator-output-format-select"]')).not.toBeNull();
    expect(dom.window.document.querySelector('[data-role="generator-generate-data-button"]')).not.toBeNull();
    expect(dom.window.document.querySelector('[data-role="generator-generate-pairwise-button"]')).not.toBeNull();
    expect(dom.window.document.querySelector('[data-role="generator-pairwise-button-wrapper"]')).not.toBeNull();
    expect(getGenerateSchemaButton(dom.window.document)).toBeNull();
    expect(dom.window.document.querySelector('[data-role="generator-status-text"]')).not.toBeNull();
    expect(lineEndingSelect).not.toBeNull();
    expect(includeBomCheckbox).not.toBeNull();
    expect(lineEndingSelect.value).toBe('lf');
    expect(includeBomCheckbox.checked).toBe(false);
    const helpButtons = Array.from(
      dom.window.document.querySelectorAll('.shared-button-with-help [data-help-role="help-icon"]')
    );
    expect(helpButtons).toHaveLength(2);
    expect(helpButtons.every((element) => element.tagName === 'BUTTON')).toBe(true);
    expect(helpButtons.every((element) => element.getAttribute('type') === 'button')).toBe(true);
    expect(helpButtons.map((element) => element.getAttribute('data-help-text'))).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Generate data for the current schema and output format to a file.'),
        expect.stringContaining('Generate n-wise combinations from enum columns in the current schema.'),
      ])
    );
    expect(getGenerateDataButton(dom.window.document).querySelector('svg.shared-file-action-icon')).not.toBeNull();
    expect(getGeneratePairwiseButton(dom.window.document).querySelector('svg.shared-file-action-icon')).not.toBeNull();
    expect(getGenerateRowsInput(dom.window.document).id).toBe('');
    expect(outputSelect.id).toBe('');
    expect(getGenerateDataButton(dom.window.document).id).toBe('');
    expect(getGeneratePairwiseButtonWrapper(dom.window.document).id).toBe('');
    expect(getGeneratePairwiseButton(dom.window.document).id).toBe('');
    expect(getStatusText(dom.window.document).id).toBe('');
    expect(component.getGenerateRowCount()).toEqual({
      value: 1000,
      valid: true,
      errors: [],
    });
    expect(rowCountControl.getParsedValue).toHaveBeenCalledTimes(1);
    expect(formatOptionsPanel.update).toHaveBeenCalledWith({
      selectedFormat: 'csv',
      currentOptions: { options: { header: true } },
    });
    expect(updateHelpHints).toHaveBeenCalled();

    outputSelect.value = 'json';
    outputSelect.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    expect(onFormatChanged).toHaveBeenCalledWith('json');
    expect(formatOptionsPanel.update).toHaveBeenLastCalledWith({
      selectedFormat: 'json',
      currentOptions: { options: { prettyPrint: true } },
    });

    getGenerateDataButton(dom.window.document).click();
    getGeneratePairwiseButton(dom.window.document).click();
    expect(onGenerateData).toHaveBeenCalled();
    expect(onGeneratePairwise).toHaveBeenCalled();

    lineEndingSelect.value = 'crlf';
    lineEndingSelect.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    includeBomCheckbox.click();
    expect(component.getState().exportEncodingSettings).toEqual({
      lineEnding: 'crlf',
      includeBom: true,
    });

    component.update({
      selectedFormat: 'json',
      currentOptions: { options: { prettyPrint: true } },
      pairwiseVisible: true,
    });

    expect(getGeneratePairwiseButtonWrapper(dom.window.document).style.display).toBe('inline-flex');
    component.setPairwiseVisible(false);
    expect(getGeneratePairwiseButtonWrapper(dom.window.document).style.display).toBe('none');
    component.setPairwiseVisible(true);
    expect(getGeneratePairwiseButtonWrapper(dom.window.document).style.display).toBe('inline-flex');
    component.setGenerationButtonsBusy(true);
    expect(getGenerateDataButton(dom.window.document).disabled).toBe(true);
    expect(component.getState().generationButtonsBusy).toBe(true);
    component.setGenerationButtonsBusy(false);
    expect(getGenerateDataButton(dom.window.document).disabled).toBe(false);
    expect(component.getState().generationButtonsBusy).toBe(false);

    component.setStatus('Applied.', { severity: 'info' });
    expect(component.getState()).toEqual(
      expect.objectContaining({
        statusMessage: 'Applied.',
        statusOptions: { severity: 'info' },
        loadingStatusMessage: '',
      })
    );
    component.showLoadingStatus('Generating...');
    expect(component.getState()).toEqual(
      expect.objectContaining({
        statusMessage: '',
        statusOptions: {},
        loadingStatusMessage: 'Generating...',
      })
    );
    component.scheduleClearStatus(900);
    jest.advanceTimersByTime(900);
    expect(component.getState()).toEqual(
      expect.objectContaining({
        statusMessage: '',
        statusOptions: {},
        loadingStatusMessage: '',
      })
    );
    component.clearStatus();
    expect(statusPresenter.setStatus).toHaveBeenCalledWith('Applied.', { severity: 'info' });
    expect(loadingStatusPresenter.setStatus).toHaveBeenCalledWith('Generating...');
    expect(statusPresenter.scheduleClear).toHaveBeenCalledWith(900);
    expect(statusPresenter.clear).toHaveBeenCalled();
    expect(updateHelpHints).toHaveBeenCalled();

    component.destroy();
    expect(formatOptionsPanel.destroy).toHaveBeenCalled();
    expect(rowCountControl.destroy).toHaveBeenCalled();
    expect(statusPresenter.destroy).toHaveBeenCalled();
    expect(loadingStatusPresenter.destroy).toHaveBeenCalled();

    dom.window.close();
  });

  test('can mount from the root ownerDocument without a global document', () => {
    const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
    const originalDocument = global.document;
    const originalWindow = global.window;
    delete global.document;
    delete global.window;

    try {
      const component = createGeneratorControlsComponent({
        root: dom.window.document.getElementById('root'),
        props: {
          selectedFormat: 'csv',
          currentOptions: { options: {} },
          pairwiseVisible: false,
          generationButtonsBusy: false,
        },
        services: {
          createRowCountControl: jest.fn(() => ({ destroy: jest.fn() })),
          createFormatOptionsPanel: jest.fn(() => ({ update: jest.fn(), destroy: jest.fn() })),
          createStatusPresenter: jest.fn(() => ({
            setStatus: jest.fn(),
            clear: jest.fn(),
            scheduleClear: jest.fn(),
            destroy: jest.fn(),
          })),
          createLoadingStatusPresenter: jest.fn(() => ({
            setStatus: jest.fn(),
            clear: jest.fn(),
            destroy: jest.fn(),
          })),
          getOutputFormatGroups: createFormatGroups,
          canExportFormat: () => true,
          updateHelpHints: jest.fn(),
        },
      });

      expect(getOutputFormatSelect(dom.window.document)).not.toBeNull();
      expect(dom.window.document.querySelector('[data-role="line-ending-select"]')).not.toBeNull();
      component.destroy();
    } finally {
      global.document = originalDocument;
      global.window = originalWindow;
      dom.window.close();
    }
  });

  test('uses injected timer callbacks for scheduled status clearing instead of ambient globals', () => {
    const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
    global.document = dom.window.document;
    global.window = dom.window;

    const statusPresenter = { setStatus: jest.fn(), clear: jest.fn(), scheduleClear: jest.fn(), destroy: jest.fn() };
    const loadingStatusPresenter = { setStatus: jest.fn(), clear: jest.fn(), destroy: jest.fn() };
    const setTimeoutFn = jest.fn((callback) => {
      callback();
      return 123;
    });
    const clearTimeoutFn = jest.fn();

    const originalSetTimeout = global.setTimeout;
    const originalClearTimeout = global.clearTimeout;
    global.setTimeout = jest.fn(() => {
      throw new Error('ambient setTimeout should not be used');
    });
    global.clearTimeout = jest.fn(() => {
      throw new Error('ambient clearTimeout should not be used');
    });

    try {
      const component = createGeneratorControlsComponent({
        root: dom.window.document.getElementById('root'),
        documentObj: dom.window.document,
        props: {
          selectedFormat: 'csv',
          currentOptions: { options: {} },
          pairwiseVisible: false,
          generationButtonsBusy: false,
        },
        services: {
          createRowCountControl: jest.fn(() => ({ destroy: jest.fn() })),
          createFormatOptionsPanel: jest.fn(() => ({ update: jest.fn(), destroy: jest.fn() })),
          createStatusPresenter: jest.fn(() => statusPresenter),
          createLoadingStatusPresenter: jest.fn(() => loadingStatusPresenter),
          getOutputFormatGroups: createFormatGroups,
          canExportFormat: () => true,
          updateHelpHints: jest.fn(),
          setTimeoutFn,
          clearTimeoutFn,
        },
      });

      component.setStatus('Applied');
      component.scheduleClearStatus(900);

      expect(statusPresenter.scheduleClear).toHaveBeenCalledWith(900);
      expect(setTimeoutFn).toHaveBeenCalledWith(expect.any(Function), 900);
      expect(clearTimeoutFn).not.toHaveBeenCalled();
      expect(component.getState()).toEqual(
        expect.objectContaining({
          statusMessage: '',
          loadingStatusMessage: '',
        })
      );

      component.destroy();
    } finally {
      global.setTimeout = originalSetTimeout;
      global.clearTimeout = originalClearTimeout;
      dom.window.close();
    }
  });

  test('supports two instances in one document with distinct ids', () => {
    const dom = new JSDOM('<!doctype html><html><body><div id="root-a"></div><div id="root-b"></div></body></html>');
    global.document = dom.window.document;
    global.window = dom.window;

    const onGenerateDataA = jest.fn();
    const onGenerateDataB = jest.fn();
    const onFormatChangedA = jest.fn();
    const onFormatChangedB = jest.fn();

    const createServices = () => ({
      createRowCountControl: jest.fn(() => ({ destroy: jest.fn() })),
      createFormatOptionsPanel: jest.fn(() => ({ update: jest.fn(), destroy: jest.fn() })),
      createStatusPresenter: jest.fn(() => ({
        setStatus: jest.fn(),
        clear: jest.fn(),
        scheduleClear: jest.fn(),
        destroy: jest.fn(),
      })),
      createLoadingStatusPresenter: jest.fn(() => ({
        setStatus: jest.fn(),
        clear: jest.fn(),
        destroy: jest.fn(),
      })),
      getOutputFormatGroups: createFormatGroups,
      canExportFormat: () => true,
      updateHelpHints: jest.fn(),
    });

    const componentA = createGeneratorControlsComponent({
      root: dom.window.document.getElementById('root-a'),
      documentObj: dom.window.document,
      props: {
        selectedFormat: 'csv',
        generationButtonsBusy: false,
        ids: {
          outputFormatSelect: 'generatorOutputFormatA',
          generateDataButton: 'generateDataButtonA',
          generatePairwiseButtonWrapper: 'generateAllPairsButtonWrapperA',
          generatePairwiseButton: 'generateAllPairsButtonA',
          status: 'generatorStatusTextA',
          rowCountInput: 'generateRowsCountA',
        },
      },
      services: createServices(),
      callbacks: {
        onFormatChanged: onFormatChangedA,
        onGenerateData: onGenerateDataA,
      },
    });

    const componentB = createGeneratorControlsComponent({
      root: dom.window.document.getElementById('root-b'),
      documentObj: dom.window.document,
      props: {
        selectedFormat: 'json',
        generationButtonsBusy: false,
        ids: {
          outputFormatSelect: 'generatorOutputFormatB',
          generateDataButton: 'generateDataButtonB',
          generatePairwiseButtonWrapper: 'generateAllPairsButtonWrapperB',
          generatePairwiseButton: 'generateAllPairsButtonB',
          status: 'generatorStatusTextB',
          rowCountInput: 'generateRowsCountB',
        },
      },
      services: createServices(),
      callbacks: {
        onFormatChanged: onFormatChangedB,
        onGenerateData: onGenerateDataB,
      },
    });

    const selectA = dom.window.document.getElementById('generatorOutputFormatA');
    const selectB = dom.window.document.getElementById('generatorOutputFormatB');
    expect(selectA.value).toBe('csv');
    expect(selectB.value).toBe('json');

    selectA.value = 'jest';
    selectA.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    dom.window.document.getElementById('generateDataButtonA').click();

    expect(onFormatChangedA).toHaveBeenCalledWith('jest');
    expect(onFormatChangedB).not.toHaveBeenCalled();
    expect(onGenerateDataA).toHaveBeenCalledTimes(1);
    expect(onGenerateDataB).not.toHaveBeenCalled();

    componentA.destroy();
    componentB.destroy();
    dom.window.close();
  });

  test('exposes parsed generate row count through the component API', () => {
    const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
    global.document = dom.window.document;
    global.window = dom.window;

    const component = createGeneratorControlsComponent({
      root: dom.window.document.getElementById('root'),
      documentObj: dom.window.document,
      props: {
        selectedFormat: 'csv',
        currentOptions: { options: {} },
        pairwiseVisible: false,
        generationButtonsBusy: false,
      },
      services: {
        createFormatOptionsPanel: jest.fn(() => ({ update: jest.fn(), destroy: jest.fn() })),
        createStatusPresenter: jest.fn(() => ({
          setStatus: jest.fn(),
          clear: jest.fn(),
          scheduleClear: jest.fn(),
          destroy: jest.fn(),
        })),
        createLoadingStatusPresenter: jest.fn(() => ({
          setStatus: jest.fn(),
          clear: jest.fn(),
          destroy: jest.fn(),
        })),
        getOutputFormatGroups: createFormatGroups,
        canExportFormat: () => true,
        updateHelpHints: jest.fn(),
      },
    });

    const rowCountInput = getGenerateRowsInput(dom.window.document);
    rowCountInput.value = 'twelve';
    rowCountInput.dispatchEvent(new dom.window.Event('input', { bubbles: true }));

    expect(component.getGenerateRowCount()).toEqual({
      value: 0,
      valid: false,
      errors: ['Generate Rows must be a number greater than or equal to 0.'],
    });

    component.destroy();
    dom.window.close();
  });

  test('reads generate row count only through the mounted row-count component API', () => {
    const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
    global.document = dom.window.document;
    global.window = dom.window;

    const rowCountControl = {
      destroy: jest.fn(),
      getParsedValue: jest.fn(() => ({
        value: 42,
        valid: true,
        errors: [],
      })),
    };

    const component = createGeneratorControlsComponent({
      root: dom.window.document.getElementById('root'),
      documentObj: dom.window.document,
      props: {
        selectedFormat: 'csv',
        currentOptions: { options: {} },
        pairwiseVisible: false,
        generationButtonsBusy: false,
      },
      services: {
        createRowCountControl: jest.fn(() => rowCountControl),
        createFormatOptionsPanel: jest.fn(() => ({ update: jest.fn(), destroy: jest.fn() })),
        createStatusPresenter: jest.fn(() => ({
          setStatus: jest.fn(),
          clear: jest.fn(),
          scheduleClear: jest.fn(),
          destroy: jest.fn(),
        })),
        createLoadingStatusPresenter: jest.fn(() => ({
          setStatus: jest.fn(),
          clear: jest.fn(),
          destroy: jest.fn(),
        })),
        getOutputFormatGroups: createFormatGroups,
        canExportFormat: () => true,
        updateHelpHints: jest.fn(),
      },
    });

    expect(component.getGenerateRowCount()).toEqual({
      value: 42,
      valid: true,
      errors: [],
    });
    expect(rowCountControl.getParsedValue).toHaveBeenCalledTimes(1);
    expect(getGenerateRowsInput(dom.window.document)).toBeNull();

    component.destroy();
    dom.window.close();
  });

  test('creates status presenters from the rooted generator status surface instead of page-global id lookup', () => {
    const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
    global.document = dom.window.document;
    global.window = dom.window;

    const createStatusPresenter = jest.fn(() => ({
      setStatus: jest.fn(),
      clear: jest.fn(),
      scheduleClear: jest.fn(),
      destroy: jest.fn(),
    }));
    const createLoadingStatusPresenter = jest.fn(() => ({
      setStatus: jest.fn(),
      clear: jest.fn(),
      destroy: jest.fn(),
    }));

    const component = createGeneratorControlsComponent({
      root: dom.window.document.getElementById('root'),
      documentObj: dom.window.document,
      props: {
        selectedFormat: 'csv',
        currentOptions: { options: {} },
        pairwiseVisible: false,
        generationButtonsBusy: false,
      },
      services: {
        createRowCountControl: jest.fn(() => ({ destroy: jest.fn() })),
        createFormatOptionsPanel: jest.fn(() => ({ update: jest.fn(), destroy: jest.fn() })),
        createStatusPresenter,
        createLoadingStatusPresenter,
        getOutputFormatGroups: createFormatGroups,
        canExportFormat: () => true,
        updateHelpHints: jest.fn(),
      },
    });

    const statusPresenterArgs = createStatusPresenter.mock.calls[0][0];
    const loadingStatusPresenterArgs = createLoadingStatusPresenter.mock.calls[0][0];

    expect(statusPresenterArgs.elementId).toBeUndefined();
    expect(loadingStatusPresenterArgs.elementId).toBeUndefined();
    expect(statusPresenterArgs.resolveElement()).toBe(
      dom.window.document.querySelector('[data-role="generator-status-text"]')
    );
    expect(loadingStatusPresenterArgs.resolveElement()).toBe(
      dom.window.document.querySelector('[data-role="generator-status-text"]')
    );

    component.destroy();
    dom.window.close();
  });

  test('exposes an explicit format-state sync API for runtime orchestration', () => {
    const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
    global.document = dom.window.document;
    global.window = dom.window;

    const formatOptionsPanel = {
      update: jest.fn(),
      destroy: jest.fn(),
    };

    const component = createGeneratorControlsComponent({
      root: dom.window.document.getElementById('root'),
      documentObj: dom.window.document,
      props: {
        selectedFormat: 'csv',
        currentOptions: { options: { header: true } },
        pairwiseVisible: false,
        generationButtonsBusy: false,
      },
      services: {
        createRowCountControl: jest.fn(() => ({ destroy: jest.fn() })),
        createFormatOptionsPanel: jest.fn(() => formatOptionsPanel),
        createStatusPresenter: jest.fn(() => ({
          setStatus: jest.fn(),
          clear: jest.fn(),
          scheduleClear: jest.fn(),
          destroy: jest.fn(),
        })),
        createLoadingStatusPresenter: jest.fn(() => ({
          setStatus: jest.fn(),
          clear: jest.fn(),
          destroy: jest.fn(),
        })),
        getOutputFormatGroups: createFormatGroups,
        canExportFormat: () => true,
        getCurrentOptionsForFormat: (type) =>
          type === 'json' ? { options: { prettyPrint: true } } : { options: { header: true } },
        updateHelpHints: jest.fn(),
      },
    });

    component.syncFormatState('json');

    expect(component.getState()).toEqual(
      expect.objectContaining({
        selectedFormat: 'json',
        currentOptions: { options: { prettyPrint: true } },
      })
    );
    expect(getOutputFormatSelect(dom.window.document).value).toBe('json');
    expect(formatOptionsPanel.update).toHaveBeenLastCalledWith({
      selectedFormat: 'json',
      currentOptions: { options: { prettyPrint: true } },
    });

    component.destroy();
    dom.window.close();
  });
});
