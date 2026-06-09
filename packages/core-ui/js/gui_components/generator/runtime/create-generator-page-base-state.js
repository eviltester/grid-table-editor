import { TestDataGenerator } from '@anywaydata/core/data_generation/testDataGenerator.js';
import { Exporter } from '@anywaydata/core/grid/exporter.js';
import { Download } from '../../shared/download.js';
import { GridExtension as TabulatorGridExtension } from '../../data-grid-editor/tabulator/gridExtension-tabulator.js';
import { getDefaultDocumentObj } from '../../shared/dom/default-objects.js';
import { resolveDefaultBrowserExportEncodingSettings } from '../../shared/export-encoding-settings.js';

function createGeneratorPageBaseState({ options = {} } = {}) {
  const {
    parentElement,
    documentObj = getDefaultDocumentObj(),
    windowObj = documentObj?.defaultView || globalThis.window,
    faker,
    RandExp,
    TabulatorCtor = globalThis?.Tabulator,
    GridExtensionClass = TabulatorGridExtension,
    ExporterClass = Exporter,
    DownloadClass = Download,
    TestDataGeneratorClass = TestDataGenerator,
  } = options;

  return {
    parentElement,
    documentObj,
    faker,
    RandExp,
    windowObj,
    TabulatorCtor,
    GridExtensionClass,
    ExporterClass,
    DownloadClass,
    TestDataGeneratorClass,
    defaultExportEncodingSettings:
      options.defaultExportEncodingSettings || resolveDefaultBrowserExportEncodingSettings({ documentObj, windowObj }),
  };
}

export { createGeneratorPageBaseState };
