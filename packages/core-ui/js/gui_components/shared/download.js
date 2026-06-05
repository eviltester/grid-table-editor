import { getDefaultDocumentObj, getDefaultWindowObj, resolveWindowObj } from './dom/default-objects.js';

class Download {
  constructor(
    filename,
    { documentObj = getDefaultDocumentObj(), windowObj = getDefaultWindowObj(), URLObj, BlobCtor } = {}
  ) {
    this.filename = filename;
    this.documentObj = documentObj;
    const resolvedWindowObj = resolveWindowObj(windowObj, documentObj);
    this.URLObj = URLObj || resolvedWindowObj?.URL || globalThis.URL;
    this.BlobCtor = BlobCtor || resolvedWindowObj?.Blob || globalThis.Blob;
  }

  downloadFile(text) {
    if (
      !this.documentObj?.body?.appendChild ||
      typeof this.documentObj.createElement !== 'function' ||
      typeof this.BlobCtor !== 'function' ||
      typeof this.URLObj?.createObjectURL !== 'function' ||
      typeof this.URLObj?.revokeObjectURL !== 'function'
    ) {
      return false;
    }

    const blob = new this.BlobCtor([text], { type: 'text/plain;charset=utf-8' });
    const url = this.URLObj.createObjectURL(blob);
    const element = this.documentObj.createElement('a');
    element.setAttribute('href', url);
    element.setAttribute('download', this.filename);

    element.style.display = 'none';
    this.documentObj.body.appendChild(element);

    element.click();

    this.documentObj.body.removeChild(element);
    this.URLObj.revokeObjectURL(url);
    return true;
  }
}

export { Download };
