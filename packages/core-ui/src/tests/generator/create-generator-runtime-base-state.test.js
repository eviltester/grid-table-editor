import { describe, expect, test } from '@jest/globals';
import { TestDataGenerator } from '../../../../core/js/data_generation/testDataGenerator.js';
import { createGeneratorPageBaseState } from '../../../js/gui_components/generator/runtime/create-generator-page-base-state.js';

class FakeTabulator {}

class FakeGridExtension {}

class FakeExporter {}

class FakeDownload {}

describe('createGeneratorPageBaseState', () => {
  test('builds base runtime state from injected options and defaults', () => {
    const parentElement = { id: 'root' };
    const documentObj = { nodeType: 9 };
    const windowObj = { navigator: { platform: 'Win32' } };
    const faker = { word: { noun: () => 'x' } };
    const RandExp = function RandExp() {};

    const baseState = createGeneratorPageBaseState({
      options: {
        parentElement,
        documentObj,
        windowObj,
        faker,
        RandExp,
        TabulatorCtor: FakeTabulator,
        GridExtensionClass: FakeGridExtension,
        ExporterClass: FakeExporter,
        DownloadClass: FakeDownload,
        TestDataGeneratorClass: TestDataGenerator,
      },
    });

    expect(baseState).toEqual({
      parentElement,
      documentObj,
      faker,
      RandExp,
      windowObj,
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
      ExporterClass: FakeExporter,
      DownloadClass: FakeDownload,
      TestDataGeneratorClass: TestDataGenerator,
      defaultExportEncodingSettings: {
        lineEnding: 'crlf',
        includeBom: false,
      },
    });
  });

  test('defaults documentObj to null when there is no global document available', () => {
    const originalDocument = global.document;
    delete global.document;

    try {
      const baseState = createGeneratorPageBaseState({
        options: {
          parentElement: null,
          faker: { word: { noun: () => 'x' } },
          RandExp: function RandExp() {},
          TabulatorCtor: FakeTabulator,
          GridExtensionClass: FakeGridExtension,
          ExporterClass: FakeExporter,
          DownloadClass: FakeDownload,
          TestDataGeneratorClass: TestDataGenerator,
        },
      });

      expect(baseState.documentObj).toBeNull();
    } finally {
      global.document = originalDocument;
    }
  });
});
