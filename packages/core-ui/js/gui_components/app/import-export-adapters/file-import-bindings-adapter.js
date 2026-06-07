import { createDragDropAdapter } from '../drag-drop-control.js';

class FileImportBindingsAdapter {
  constructor({ root, onFileSelected, createDragDropAdapterFn } = {}) {
    this.root = root;
    this.onFileSelected = onFileSelected;
    this.createDragDropAdapterFn = createDragDropAdapterFn || ((onFileDrop) => createDragDropAdapter({ onFileDrop }));
    this.fileInputElement = null;
    this.dragDropAdapter = null;
    this.handleFileInputClick = (event) => {
      event.currentTarget.value = '';
    };
    this.handleFileInputChange = (event) => {
      this.onFileSelected?.(event?.currentTarget?.files?.[0] || null);
    };
  }

  bind() {
    this.fileInputElement = this.root?.querySelector?.('[data-role="file-input"]') || null;
    if (this.fileInputElement) {
      this.fileInputElement.addEventListener('click', this.handleFileInputClick, false);
      this.fileInputElement.addEventListener('change', this.handleFileInputChange, false);
    }

    const dropZone = this.root?.querySelector?.('[data-role="drop-zone"]') || null;
    if (dropZone) {
      this.dragDropAdapter = this.createDragDropAdapterFn((file) => this.onFileSelected?.(file));
      this.dragDropAdapter.configureAsDropZone(dropZone);
    }
  }

  destroy() {
    this.fileInputElement?.removeEventListener('click', this.handleFileInputClick, false);
    this.fileInputElement?.removeEventListener('change', this.handleFileInputChange, false);
    this.dragDropAdapter?.destroy?.();
  }
}

function createFileImportBindingsAdapter(options) {
  const adapter = new FileImportBindingsAdapter(options);
  adapter.bind();
  return adapter;
}

export { createFileImportBindingsAdapter };
