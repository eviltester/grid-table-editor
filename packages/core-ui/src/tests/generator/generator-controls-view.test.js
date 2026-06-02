import { describe, expect, jest, test } from '@jest/globals';
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
  test('renders controls, updates format options, and forwards actions', () => {
    const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
    global.document = dom.window.document;
    global.window = dom.window;

    const onFormatChanged = jest.fn();
    const onGenerateData = jest.fn();
    const onGeneratePairwise = jest.fn();
    const statusPresenter = { setStatus: jest.fn(), clear: jest.fn(), scheduleClear: jest.fn(), destroy: jest.fn() };
    const loadingStatusPresenter = { setStatus: jest.fn(), destroy: jest.fn() };
    const rowCountControl = { destroy: jest.fn() };
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
      },
      services: {
        createRowCountControl: jest.fn(() => rowCountControl),
        createFormatOptionsPanel: jest.fn(() => formatOptionsPanel),
        createStatusPresenter: jest.fn(() => statusPresenter),
        createLoadingStatusPresenter: jest.fn(() => loadingStatusPresenter),
        getOutputFormatGroups: createFormatGroups,
        canExportFormat: (type) => type !== 'python',
        updateHelpHints,
      },
      callbacks: {
        onFormatChanged,
        onGenerateData,
        onGeneratePairwise,
      },
    });

    const outputSelect = dom.window.document.getElementById('generatorOutputFormat');
    expect(outputSelect).not.toBeNull();
    expect(Array.from(outputSelect.querySelectorAll('option')).map((option) => option.value)).toEqual([
      'csv',
      'json',
      'jest',
    ]);
    const helpButtons = Array.from(dom.window.document.querySelectorAll('.generator-button-with-help .helpicon'));
    expect(helpButtons).toHaveLength(2);
    expect(helpButtons.every((element) => element.tagName === 'BUTTON')).toBe(true);
    expect(helpButtons.every((element) => element.getAttribute('type') === 'button')).toBe(true);
    expect(formatOptionsPanel.update).toHaveBeenCalledWith({
      selectedFormat: 'csv',
      currentOptions: { options: { header: true } },
    });
    expect(updateHelpHints).toHaveBeenCalled();

    outputSelect.value = 'json';
    outputSelect.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    expect(onFormatChanged).toHaveBeenCalledWith('json');

    dom.window.document.getElementById('generateDataButton').click();
    dom.window.document.getElementById('generateAllPairsButton').click();
    expect(onGenerateData).toHaveBeenCalled();
    expect(onGeneratePairwise).toHaveBeenCalled();

    component.update({
      selectedFormat: 'json',
      currentOptions: { options: { prettyPrint: true } },
      pairwiseVisible: true,
    });

    expect(dom.window.document.getElementById('generateAllPairsButtonWrapper').style.display).toBe('inline-flex');
    component.setGenerationButtonsBusy(true);
    expect(dom.window.document.getElementById('generateDataButton').disabled).toBe(true);

    component.setStatus('Applied.', { severity: 'info' });
    component.showLoadingStatus('Generating...');
    component.scheduleClearStatus(900);
    component.clearStatus();
    expect(statusPresenter.setStatus).toHaveBeenCalledWith('Applied.', { severity: 'info' });
    expect(loadingStatusPresenter.setStatus).toHaveBeenCalledWith('Generating...');
    expect(statusPresenter.scheduleClear).toHaveBeenCalledWith(900);
    expect(statusPresenter.clear).toHaveBeenCalled();
    expect(updateHelpHints).toHaveBeenCalledTimes(3);

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
          createLoadingStatusPresenter: jest.fn(() => ({ setStatus: jest.fn(), destroy: jest.fn() })),
          getOutputFormatGroups: createFormatGroups,
          canExportFormat: () => true,
          updateHelpHints: jest.fn(),
        },
      });

      expect(dom.window.document.getElementById('generatorOutputFormat')).not.toBeNull();
      component.destroy();
    } finally {
      global.document = originalDocument;
      global.window = originalWindow;
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
      createLoadingStatusPresenter: jest.fn(() => ({ setStatus: jest.fn(), destroy: jest.fn() })),
      getOutputFormatGroups: createFormatGroups,
      canExportFormat: () => true,
      updateHelpHints: jest.fn(),
    });

    const componentA = createGeneratorControlsComponent({
      root: dom.window.document.getElementById('root-a'),
      documentObj: dom.window.document,
      props: {
        selectedFormat: 'csv',
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
});
