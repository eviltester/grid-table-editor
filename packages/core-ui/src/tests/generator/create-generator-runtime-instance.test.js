import { describe, expect, test } from '@jest/globals';
import { TestDataGenerator } from '../../../../core/js/data_generation/testDataGenerator.js';
import { createUninitializedGeneratorRuntime } from '../../../js/gui_components/generator/runtime/create-generator-runtime-instance.js';

class FakeTabulator {}

class FakeGridExtension {}

class FakeExporter {}

class FakeDownload {}

describe('createUninitializedGeneratorRuntime', () => {
  test('builds the uninitialized runtime from base state plus generator dependencies', () => {
    const parentElement = { id: 'root' };
    const documentObj = { nodeType: 9 };
    const faker = { word: { noun: () => 'x' } };
    const RandExp = function RandExp() {};

    const runtime = createUninitializedGeneratorRuntime({
      options: {
        parentElement,
        documentObj,
        faker,
        RandExp,
        TabulatorCtor: FakeTabulator,
        GridExtensionClass: FakeGridExtension,
        ExporterClass: FakeExporter,
        DownloadClass: FakeDownload,
        TestDataGeneratorClass: TestDataGenerator,
      },
      schemaTextToDataRules: () => ({ dataRules: [], errors: [], schemaTokens: [] }),
      schemaRowsToSpec: () => '',
      schemaRowsToSpecWithTokens: () => '',
      validateSchemaRows: (rows) => ({ rows, errors: [] }),
      dataRulesToSchemaText: () => '',
      sampleSchemaText: 'Name\nenum(a,b)',
    });

    expect(runtime.parentElement).toBe(parentElement);
    expect(runtime.documentObj).toBe(documentObj);
    expect(runtime.faker).toBe(faker);
    expect(runtime.RandExp).toBe(RandExp);
    expect(runtime.TabulatorCtor).toBe(FakeTabulator);
    expect(runtime.GridExtensionClass).toBe(FakeGridExtension);
    expect(runtime.ExporterClass).toBe(FakeExporter);
    expect(runtime.DownloadClass).toBe(FakeDownload);
    expect(runtime.TestDataGeneratorClass).toBe(TestDataGenerator);
    expect(runtime.schemaTextToDataRules).toBeDefined();
    expect(runtime.generatorSchemaState).toBeDefined();
    expect(runtime.generatorRuntimeActions).toBeDefined();
  });

  test('keeps the uninitialized runtime focused on shell assembly beyond base-state defaults', () => {
    const runtime = createUninitializedGeneratorRuntime({
      options: {
        parentElement: { id: 'root' },
        faker: { word: { noun: () => 'x' } },
        RandExp: function RandExp() {},
        TabulatorCtor: FakeTabulator,
        GridExtensionClass: FakeGridExtension,
        ExporterClass: FakeExporter,
        DownloadClass: FakeDownload,
        TestDataGeneratorClass: TestDataGenerator,
      },
      schemaTextToDataRules: () => ({ dataRules: [], errors: [], schemaTokens: [] }),
      schemaRowsToSpec: () => '',
      schemaRowsToSpecWithTokens: () => '',
      validateSchemaRows: (rows) => ({ rows, errors: [] }),
      dataRulesToSchemaText: () => '',
      sampleSchemaText: 'Name\nenum(a,b)',
    });

    expect(typeof runtime.init).toBe('function');
    expect(typeof runtime.destroy).toBe('function');
    expect(runtime.generatorViewState).toBeDefined();
    expect(runtime.generatorRuntimeActions).toBeDefined();
  });
});
