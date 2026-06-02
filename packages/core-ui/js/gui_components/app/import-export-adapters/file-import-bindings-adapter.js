import { DragDropControl } from '../drag-drop-control.js';

class FileImportBindingsAdapter {
  constructor({ root, onFileSelected, createDragDropControl } = {}) {
    this.root = root;
    this.onFileSelected = onFileSelected;
    this.createDragDropControl = createDragDropControl || ((readFileFunction) => new DragDropControl(readFileFunction));
    this.fileInputElement = null;
    this.dragDropControl = null;
    this.handleFileInputClick = (event) => {
      event.currentTarget.value = '';
    };
    this.handleFileInputChange = (event) => {
      this.onFileSelected?.(event?.currentTarget?.files?.[0] || null);
    };
  }

  bind() {
    this.fileInputElement = this.root?.querySelector?.('#csvinput') || null;
    if (this.fileInputElement) {
      this.fileInputElement.addEventListener('click', this.handleFileInputClick, false);
      this.fileInputElement.addEventListener('change', this.handleFileInputChange, false);
    }

    const dropZone = this.root?.querySelector?.('#dropzone') || null;
    if (dropZone) {
      this.dragDropControl = this.createDragDropControl((file) => this.onFileSelected?.(file));
      this.dragDropControl.configureAsDropZone(dropZone);
    }
  }

  destroy() {
    this.fileInputElement?.removeEventListener('click', this.handleFileInputClick, false);
    this.fileInputElement?.removeEventListener('change', this.handleFileInputChange, false);
    this.dragDropControl?.destroy?.();
  }
}

function createFileImportBindingsAdapter(options) {
  const adapter = new FileImportBindingsAdapter(options);
  adapter.bind();
  return adapter;
}

export { createFileImportBindingsAdapter, FileImportBindingsAdapter };
