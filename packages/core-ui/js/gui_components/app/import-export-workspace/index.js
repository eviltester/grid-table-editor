import { ImportExportControls } from '../import-export-controls.js';
import { createFormatSelectorComponent } from '../format-selector/index.js';
import { createImportExportToolbarComponent } from '../import-export-toolbar/index.js';
import { createTextPreviewEditorComponent } from '../text-preview-editor/index.js';
import { ImportExportWorkspaceController } from './import-export-workspace-controller.js';
import { ImportExportWorkspaceView } from './import-export-workspace-view.js';
import { resolveDocumentObj } from '../../shared/dom/default-objects.js';

function createImportExportWorkspaceComponent({ root, props = {}, services = {}, documentObj } = {}) {
  const resolvedDocumentObj = resolveDocumentObj(documentObj, root);
  const controller = new ImportExportWorkspaceController({ props });
  const legacyControls =
    services.importExportControls || new ImportExportControls({ documentObj: resolvedDocumentObj });

  const syncPreviewRowLimit = (previewRowLimit) => {
    const normalizedPreviewRowLimit = legacyControls.setPreviewRowLimit?.(previewRowLimit) ?? previewRowLimit;
    controller.updateProps({ previewRowLimit: normalizedPreviewRowLimit });
    return normalizedPreviewRowLimit;
  };

  const view = new ImportExportWorkspaceView({
    root,
    controller,
    documentObj: resolvedDocumentObj,
    services: {
      createImportExportToolbarComponent:
        services.createImportExportToolbarComponent || createImportExportToolbarComponent,
      createTextPreviewEditorComponent: services.createTextPreviewEditorComponent || createTextPreviewEditorComponent,
      createFormatSelectorComponent: services.createFormatSelectorComponent || createFormatSelectorComponent,
      onFormatChange: (format) => {
        controller.updateProps({ selectedFormat: format });
        view.render();
        legacyControls.setFileFormatType();
        legacyControls.setOptionsViewForFormatType();
        legacyControls.renderTextFromGrid();
      },
      onToggleMode: async () => {
        const mode = (await legacyControls.toggleTextEditMode()) || 'preview';
        controller.updateProps({ mode });
        view.render();
      },
      onAutoPreviewChange: (enabled) => {
        controller.updateProps({ autoPreviewEnabled: enabled });
      },
      onPreviewRowLimitChange: (previewRowLimit) => {
        syncPreviewRowLimit(previewRowLimit);
        view.render();
      },
    },
  });

  view.mount();
  legacyControls.rootElement = view.root;
  legacyControls.bindExistingGui?.(view.root);
  syncPreviewRowLimit(controller.getState().previewRowLimit);
  legacyControls._syncGridFromTextButtonState?.();

  return {
    update(nextProps) {
      controller.updateProps(nextProps);
      if (Object.prototype.hasOwnProperty.call(nextProps, 'previewRowLimit')) {
        syncPreviewRowLimit(controller.getState().previewRowLimit);
      }
      view.render();
    },
    destroy() {
      legacyControls.destroy?.();
      view.destroy();
    },
    getState() {
      return controller.getState();
    },
    setExporter(exporter) {
      legacyControls.setExporter(exporter);
    },
    setImporter(importer) {
      legacyControls.setImporter(importer);
    },
    setGridChangeSource(gridChangeSource) {
      legacyControls.setGridChangeSource?.(gridChangeSource);
    },
    renderTextFromGrid() {
      legacyControls.renderTextFromGrid();
    },
    setFileFormatType() {
      legacyControls.setFileFormatType();
    },
    setOptionsViewForFormatType() {
      legacyControls.setOptionsViewForFormatType();
    },
    getImportExportControls() {
      return legacyControls;
    },
  };
}

export { createImportExportWorkspaceComponent, ImportExportWorkspaceController, ImportExportWorkspaceView };
