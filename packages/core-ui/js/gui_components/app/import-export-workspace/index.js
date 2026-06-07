import { resolveDocumentObj, resolveWindowObj } from '../../shared/dom/default-objects.js';
import { createImportExportWorkspaceRuntime } from './create-import-export-workspace-runtime.js';

function createImportExportWorkspaceComponent({ root, props = {}, services = {}, documentObj, windowObj } = {}) {
  const resolvedDocumentObj = resolveDocumentObj(documentObj, root);
  const resolvedWindowObj = resolveWindowObj(windowObj, resolvedDocumentObj);

  return createImportExportWorkspaceRuntime({
    root,
    props,
    services,
    documentObj: resolvedDocumentObj,
    windowObj: resolvedWindowObj,
  });
}

export { createImportExportWorkspaceComponent };
