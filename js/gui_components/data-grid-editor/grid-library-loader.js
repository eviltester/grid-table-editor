import { GRID_ENGINE_AG_GRID, GRID_ENGINE_TABULATOR, resolveGridEngine } from "./grid-engine.js";

const AG_GRID_SCRIPT_ID = "ag-grid-script";
const AG_GRID_SRC = "https://unpkg.com/ag-grid-community@33.3.0/dist/ag-grid-community.min.js";

const TABULATOR_SCRIPT_ID = "tabulator-script";
const TABULATOR_CSS_ID = "tabulator-css";
const TABULATOR_SCRIPT_SRC = "https://unpkg.com/tabulator-tables@6.3.1/dist/js/tabulator.min.js";
const TABULATOR_CSS_HREF = "https://unpkg.com/tabulator-tables@6.3.1/dist/css/tabulator.min.css";

const loadPromisesByEngine = {};

function getDocument(docOverride){
    return docOverride || globalThis?.document;
}

function loadScript({ id, src, globalName, doc }) {
    return new Promise((resolve, reject) => {
        if(globalName && globalThis?.[globalName]){
            resolve();
            return;
        }

        const existingScript = doc.getElementById(id);
        if(existingScript){
            existingScript.addEventListener("load", () => resolve(), { once: true });
            existingScript.addEventListener("error", () => reject(new Error(`Failed loading script ${src}`)), { once: true });
            return;
        }

        const script = doc.createElement("script");
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
    if(existing){
        return;
    }
    const link = doc.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = href;
    doc.head.appendChild(link);
}

function loadAgGrid(doc){
    return loadScript({
        id: AG_GRID_SCRIPT_ID,
        src: AG_GRID_SRC,
        globalName: "agGrid",
        doc
    });
}

function loadTabulator(doc){
    ensureStylesheet({
        id: TABULATOR_CSS_ID,
        href: TABULATOR_CSS_HREF,
        doc
    });

    return loadScript({
        id: TABULATOR_SCRIPT_ID,
        src: TABULATOR_SCRIPT_SRC,
        globalName: "Tabulator",
        doc
    });
}

function resetEnginePromise(engine){
    if(engine){
        delete loadPromisesByEngine[engine];
        return;
    }
    delete loadPromisesByEngine[GRID_ENGINE_AG_GRID];
    delete loadPromisesByEngine[GRID_ENGINE_TABULATOR];
}

function ensureGridLibraryLoaded(context = {}) {
    const doc = getDocument(context.document);
    if(!doc){
        return Promise.reject(new Error("No document available to load grid libraries"));
    }

    const explicitEngine = context.engine;
    const engine = explicitEngine || resolveGridEngine({
        explicitEngine,
        locationSearch: context.locationSearch,
        globalObject: context.globalObject
    });

    if(loadPromisesByEngine[engine]){
        return loadPromisesByEngine[engine];
    }

    let loaderPromise;
    if(engine === GRID_ENGINE_AG_GRID){
        loaderPromise = loadAgGrid(doc);
    }else{
        loaderPromise = loadTabulator(doc);
    }

    loadPromisesByEngine[engine] = loaderPromise.catch((error) => {
        resetEnginePromise(engine);
        throw error;
    });

    return loadPromisesByEngine[engine];
}

export {
    ensureGridLibraryLoaded,
    resetEnginePromise
}
