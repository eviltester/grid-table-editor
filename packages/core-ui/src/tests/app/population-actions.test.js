import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import * as populationActionsExports from '../../../js/gui_components/app/population-actions/index.js';
import { createPopulationActionsComponent } from '../../../js/gui_components/app/population-actions/index.js';

describe('PopulationActions', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
    global.window = dom.window;
    global.document = dom.window.document;
    global.Event = dom.window.Event;
  });

  afterEach(() => {
    dom.window.close();
    delete global.window;
    delete global.document;
    delete global.Event;
  });

  test('public barrel is component-factory-only', () => {
    expect(populationActionsExports.createPopulationActionsComponent).toBe(createPopulationActionsComponent);
    expect(populationActionsExports.PopulationActionsController).toBeUndefined();
    expect(populationActionsExports.PopulationActionsView).toBeUndefined();
  });

  test('renders actions, toggles pairwise visibility, and emits clicks', () => {
    const onGenerate = jest.fn();
    const onGeneratePairwise = jest.fn();
    const onGenerateSchemaFromGrid = jest.fn();

    const component = createPopulationActionsComponent({
      root: document.getElementById('root'),
      props: {
        pairwiseVisible: false,
        generateHelpHtml: '<p>Generate to grid.</p>',
        generatePairwiseLabel: 'Generate Combinations',
        generatePairwiseHelpHtml: '<p>Generate n-wise combinations to grid.</p>',
        generateSchemaHelpHtml: '<p>Generate enum-only schema from grid values.</p>',
        statusVisible: true,
      },
      callbacks: {
        onGenerate,
        onGeneratePairwise,
        onGenerateSchemaFromGrid,
      },
    });

    const root = document.getElementById('root');
    const generateButton = root.querySelector('[data-role="generate-button"]');
    const generatePairwiseButton = root.querySelector('[data-role="generate-pairwise-button"]');
    const generateSchemaButton = root.querySelector('[data-role="generate-schema-button"]');
    const generatePairwiseWrapper = root.querySelector('[data-role="generate-pairwise-button-wrapper"]');
    const helpButtons = root.querySelectorAll('[data-help-role="help-icon"]');
    const status = root.querySelector('[data-role="population-status"]');

    expect(generateButton?.id).toBe('');
    expect(generatePairwiseButton?.id).toBe('');
    expect(status?.id).toBe('');
    expect(document.getElementById('generatedata')).toBeNull();
    expect(document.getElementById('generateallpairs')).toBeNull();
    expect(document.getElementById('testdata-status')).toBeNull();
    expect(helpButtons).toHaveLength(3);
    expect(helpButtons[0].getAttribute('data-help-text')).toContain('Generate to grid.');
    expect(generatePairwiseButton.textContent).toContain('Generate Combinations');
    expect(helpButtons[1].getAttribute('data-help-text')).toContain('Generate n-wise combinations to grid.');
    expect(generateSchemaButton.textContent).toContain('Grid to Enum Schema');
    expect(helpButtons[2].getAttribute('data-help-text')).toContain('enum-only schema');
    expect(generateButton.getAttribute('aria-label')).toBe('Generate');
    expect(generatePairwiseButton.getAttribute('aria-label')).toBe('Generate Combinations');
    expect(generateSchemaButton.getAttribute('aria-label')).toBe('Grid to Enum Schema');
    expect(generateButton.querySelector('svg.shared-file-action-icon')).not.toBeNull();
    expect(generatePairwiseButton.querySelector('svg.shared-file-action-icon')).not.toBeNull();
    expect(generateSchemaButton.querySelector('svg.shared-file-action-icon')).not.toBeNull();

    expect(generatePairwiseWrapper.style.display).toBe('none');

    component.setPairwiseVisible(true);
    expect(generatePairwiseWrapper.style.display).toBe('inline-flex');

    component.setGenerateBusy(true);
    component.setGeneratePairwiseBusy(true);
    expect(generateButton.disabled).toBe(true);
    expect(generatePairwiseButton.disabled).toBe(true);
    expect(generateButton.getAttribute('aria-disabled')).toBe('true');
    expect(generatePairwiseButton.getAttribute('aria-disabled')).toBe('true');

    component.setGenerateBusy(false);
    component.setGeneratePairwiseBusy(false);
    expect(generateButton.getAttribute('aria-disabled')).toBe('false');
    expect(generatePairwiseButton.getAttribute('aria-disabled')).toBe('false');
    component.setGenerateSchemaBusy(true);
    expect(generateSchemaButton.disabled).toBe(true);
    component.setGenerateSchemaBusy(false);
    expect(generateSchemaButton.getAttribute('aria-disabled')).toBe('false');

    generateButton.click();
    generatePairwiseButton.click();
    generateSchemaButton.click();

    expect(onGenerate).toHaveBeenCalled();
    expect(onGeneratePairwise).toHaveBeenCalled();
    expect(onGenerateSchemaFromGrid).toHaveBeenCalled();
    component.destroy();
  });

  test('supports two instances in one document with distinct ids', () => {
    const onGenerateA = jest.fn();
    const onGenerateB = jest.fn();

    const rootA = document.getElementById('root');
    const componentA = createPopulationActionsComponent({
      root: rootA,
      props: {
        pairwiseVisible: true,
        statusVisible: true,
        ids: {
          generateButton: 'generatedata-a',
          generatePairwiseButtonWrapper: 'generateallpairs-wrapper-a',
          generatePairwiseButton: 'generateallpairs-a',
          status: 'testdata-status-a',
        },
      },
      callbacks: { onGenerate: onGenerateA },
    });

    const siblingRoot = document.createElement('div');
    siblingRoot.id = 'root-b';
    document.body.appendChild(siblingRoot);

    const componentB = createPopulationActionsComponent({
      root: siblingRoot,
      props: {
        pairwiseVisible: false,
        statusVisible: true,
        ids: {
          generateButton: 'generatedata-b',
          generatePairwiseButtonWrapper: 'generateallpairs-wrapper-b',
          generatePairwiseButton: 'generateallpairs-b',
          status: 'testdata-status-b',
        },
      },
      callbacks: { onGenerate: onGenerateB },
    });

    const generateButtonA = rootA.querySelector('[data-role="generate-button"]');
    const generatePairwiseWrapperA = rootA.querySelector('[data-role="generate-pairwise-button-wrapper"]');
    const generatePairwiseWrapperB = siblingRoot.querySelector('[data-role="generate-pairwise-button-wrapper"]');
    const statusA = rootA.querySelector('[data-role="population-status"]');
    const statusB = siblingRoot.querySelector('[data-role="population-status"]');

    expect(generateButtonA?.id).toBe('generatedata-a');
    expect(generatePairwiseWrapperA?.id).toBe('generateallpairs-wrapper-a');
    expect(statusA?.id).toBe('testdata-status-a');
    expect(siblingRoot.querySelector('[data-role="generate-button"]')?.id).toBe('generatedata-b');
    expect(generatePairwiseWrapperB?.id).toBe('generateallpairs-wrapper-b');
    expect(statusB?.id).toBe('testdata-status-b');

    generateButtonA.click();
    expect(onGenerateA).toHaveBeenCalledTimes(1);
    expect(onGenerateB).not.toHaveBeenCalled();
    expect(generatePairwiseWrapperA.style.display).toBe('inline-flex');
    expect(generatePairwiseWrapperB.style.display).toBe('none');

    componentA.destroy();
    componentB.destroy();
  });

  test('can hide the grid to enum schema action when a host does not support it', () => {
    const component = createPopulationActionsComponent({
      root: document.getElementById('root'),
      props: {
        generateSchemaVisible: false,
      },
    });

    expect(document.querySelector('[data-role="generate-schema-button"]')).toBeNull();

    component.destroy();
  });
});
