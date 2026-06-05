const TABULATOR_SCRIPT_ID = 'tabulator-script';
const TABULATOR_CSS_ID = 'tabulator-css';
const TABULATOR_SCRIPT_SRC = 'https://unpkg.com/tabulator-tables@6.3.1/dist/js/tabulator.min.js';
const TABULATOR_CSS_HREF = 'https://unpkg.com/tabulator-tables@6.3.1/dist/css/tabulator.min.css';

let tabulatorLoadPromise;

function getDocument(docOverride) {
  return docOverride || globalThis?.document;
}

function loadScript({ id, src, globalName, doc }) {
  return new Promise((resolve, reject) => {
    if (globalName && globalThis?.[globalName]) {
      resolve();
      return;
    }

    const existingScript = doc.getElementById(id);
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener('error', () => reject(new Error(`Failed loading script ${src}`)), { once: true });
      return;
    }

    const script = doc.createElement('script');
    script.id = id;
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed loading script ${src}`));
    doc.head.appendChild(script);
  });
}

function ensureStylesheet({ id, href, doc }) {
  const existing = doc.getElementById(id);
  if (existing) {
    return;
  }
  const link = doc.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = href;
  doc.head.appendChild(link);
}

function loadTabulator(doc) {
  ensureStylesheet({
    id: TABULATOR_CSS_ID,
    href: TABULATOR_CSS_HREF,
    doc,
  });

  return loadScript({
    id: TABULATOR_SCRIPT_ID,
    src: TABULATOR_SCRIPT_SRC,
    globalName: 'Tabulator',
    doc,
  });
}

function resetEnginePromise() {
  tabulatorLoadPromise = undefined;
}

function ensureGridLibraryLoaded(context = {}) {
  const doc = getDocument(context.document);
  if (!doc) {
    return Promise.reject(new Error('No document available to load grid libraries'));
  }

  if (tabulatorLoadPromise) {
    return tabulatorLoadPromise;
  }

  tabulatorLoadPromise = loadTabulator(doc).catch((error) => {
    resetEnginePromise();
    throw error;
  });

  return tabulatorLoadPromise;
}

export { ensureGridLibraryLoaded, resetEnginePromise };
