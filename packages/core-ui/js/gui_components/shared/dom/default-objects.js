function getDefaultDocumentObj() {
  return typeof document !== 'undefined' ? document : null;
}

function resolveDocumentObj(documentObj, rootElement = null) {
  return documentObj || rootElement?.ownerDocument || getDefaultDocumentObj();
}

function getDefaultWindowObj() {
  return typeof window !== 'undefined' ? window : null;
}

function resolveWindowObj(windowObj, documentObj = null) {
  return windowObj || documentObj?.defaultView || getDefaultWindowObj();
}

export { getDefaultDocumentObj, resolveDocumentObj, getDefaultWindowObj, resolveWindowObj };
