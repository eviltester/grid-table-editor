import { describe, expect, jest, test } from '@jest/globals';
import { ImportExportWorkspaceController } from '../../../js/gui_components/app/import-export-workspace/import-export-workspace-controller.js';
import { createImportExportPreviewWorkflowService } from '../../../js/gui_components/app/import-export-workspace/create-import-export-preview-workflow-service.js';

function createHarness({ props = {}, importer = {}, exporter = {}, viewOverrides = {} } = {}) {
  const controller = new ImportExportWorkspaceController({ props });
  const view = {
    textValue: '',
    options: null,
    setTextValue: jest.fn((value) => {
      view.textValue = value;
    }),
    getTextValue: jest.fn(() => view.textValue),
    renderOptionsPanel: jest.fn(),
    getOptionsFromGui: jest.fn(() => view.options),
    ...viewOverrides,
  };
  const render = jest.fn();
  const syncSupportState = jest.fn();
  const setTextFromString = jest.fn((value) => {
    view.textValue = value;
  });
  const showError = jest.fn();

  const workflow = createImportExportPreviewWorkflowService({
    controller,
    getState: () => controller.getState(),
    getType: () => controller.getState().selectedFormat,
    view: () => view,
    importer: () => importer,
    exporter: () => exporter,
    requestConfirm: jest.fn(async () => true),
    render,
    syncSupportState,
    setTextFromString,
    showError,
  });

  return {
    controller,
    render,
    setTextFromString,
    showError,
    syncSupportState,
    view,
    workflow,
  };
}

describe('createImportExportPreviewWorkflowService', () => {
  test('updates format, support state, options view, and preview text', () => {
    const exporter = {
      canExport: jest.fn(() => true),
      getOptionsForType: jest.fn(() => ({ indent: 2 })),
      getGridAsGenericDataTable: jest.fn(() => ({ getRowCount: () => 2, getHeaders: () => [], getRow: () => [] })),
      getDataTableAs: jest.fn(() => '{"rows":2}'),
    };
    const workflowHarness = createHarness({
      props: { selectedFormat: 'csv', previewRowLimit: 2 },
      importer: { canImport: jest.fn(() => true) },
      exporter,
    });

    workflowHarness.workflow.handleFormatChange('json');

    expect(workflowHarness.controller.getState().selectedFormat).toBe('json');
    expect(workflowHarness.syncSupportState).toHaveBeenCalledTimes(1);
    expect(workflowHarness.view.renderOptionsPanel).toHaveBeenCalledWith({
      selectedFormat: 'json',
      currentOptions: { indent: 2 },
    });
    expect(workflowHarness.setTextFromString).toHaveBeenCalledWith('{"rows":2}', { previewTextDirty: false });
  });

  test('toggleTextEditMode confirms whether to seed text from grid', async () => {
    const requestConfirm = jest.fn(async () => false);
    const controller = new ImportExportWorkspaceController({ props: { mode: 'preview' } });
    const view = {};
    const setTextFromString = jest.fn();
    const render = jest.fn();
    const workflow = createImportExportPreviewWorkflowService({
      controller,
      getState: () => controller.getState(),
      getType: () => controller.getState().selectedFormat,
      view: () => view,
      importer: () => null,
      exporter: () => ({ canExport: jest.fn(() => true), getGridAs: jest.fn(() => 'full:csv') }),
      requestConfirm,
      render,
      syncSupportState: jest.fn(),
      setTextFromString,
      showError: jest.fn(),
    });

    const mode = await workflow.toggleTextEditMode();

    expect(mode).toBe('edit');
    expect(controller.getState().mode).toBe('edit');
    expect(requestConfirm).toHaveBeenCalledWith({
      title: 'Set Text From Grid',
      message: 'Do you want to Set Text From Grid?',
    });
    expect(setTextFromString).toHaveBeenCalledWith('', { previewTextDirty: false });
  });
});
