import { getDefaultDocumentObj } from './dom/default-objects.js';

class Download {
  constructor(
    filename,
    { documentObj = getDefaultDocumentObj(), URLObj = globalThis.URL, BlobCtor = globalThis.Blob } = {}
  ) {
    this.filename = filename;
    this.documentObj = documentObj;
    this.URLObj = URLObj;
    this.BlobCtor = BlobCtor;
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
