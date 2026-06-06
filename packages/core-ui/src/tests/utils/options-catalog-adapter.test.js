import { OPTION_KEYS_BY_FORMAT } from '@anywaydata/core';
import {
  TEST_FRAMEWORK_GROUPS,
  getCodeLanguageSubtasks,
  getTestFrameworkFormats,
  getTestFrameworkLabel,
  getUnitTestLanguageSubtasks,
} from '../../../js/gui_components/generator/options/options-catalog-adapter.js';
import {
  applySanitizedUiOptionsToTargets,
  sanitizeUiOptionsForFormat,
} from '../../../js/gui_components/generator/options/options-catalog-adapter.js';

describe('options catalog adapter', () => {
  test('generator options barrel keeps catalog helpers direct-import-only', () => {
    return import('../../../js/gui_components/generator/options/apply-generator-format-options.js').then(
      (generatorOptions) => {
        expect(typeof generatorOptions.applyGeneratorFormatOptions).toBe('function');
        expect(generatorOptions.getCodeLanguageSubtasks).toBeUndefined();
        expect(generatorOptions.getUnitTestLanguageSubtasks).toBeUndefined();
        expect(generatorOptions.getOutputFormatGroups).toBeUndefined();
        expect(generatorOptions.sanitizeUiOptionsForFormat).toBeUndefined();
        expect(generatorOptions.applySanitizedUiOptionsToTargets).toBeUndefined();
        expect(generatorOptions.OPTION_UI_SCHEMA_BY_FORMAT).toBeUndefined();
        expect(generatorOptions.TEST_FRAMEWORK_GROUPS).toBeUndefined();
        expect(generatorOptions.getTestFrameworkFormats).toBeUndefined();
        expect(generatorOptions.getTestFrameworkLabel).toBeUndefined();
      }
    );
  });

  test('discovers test framework formats from core option catalog', () => {
    const discovered = getTestFrameworkFormats();
    expect(discovered).toContain('junit5');
    expect(discovered).toContain('jest');
    expect(discovered).toContain('test2-suite');
    expect(discovered.every((format) => Array.isArray(OPTION_KEYS_BY_FORMAT[format]))).toBe(true);
  });

  test('returns known framework labels with fallback', () => {
    expect(getTestFrameworkLabel('junit5')).toBe('JUnit5');
    expect(getTestFrameworkLabel('unknown-framework')).toBe('unknown-framework');
  });

  test('sanitizes UI options using the core catalog', () => {
    expect(sanitizeUiOptionsForFormat('csv', { header: false, unknown: true })).toEqual({
      outputFormat: 'csv',
      options: { header: false },
    });
  });

  test('applies sanitized UI options to every target using the resolved format', () => {
    const importerCalls = [];
    const exporterCalls = [];
    const resolvedCalls = [];
    const importer = { setOptionsForType: (...args) => importerCalls.push(args) };
    const exporter = { setOptionsForType: (...args) => exporterCalls.push(args) };
    const onResolvedFormat = (...args) => resolvedCalls.push(args);

    const sanitized = applySanitizedUiOptionsToTargets({
      requestedFormat: 'csv',
      rawOptions: { header: false, unknown: true },
      targets: [importer, exporter],
      onResolvedFormat,
    });

    expect(sanitized).toEqual({
      outputFormat: 'csv',
      options: { header: false },
    });
    expect(importerCalls).toEqual([['csv', sanitized]]);
    expect(exporterCalls).toEqual([['csv', sanitized]]);
    expect(resolvedCalls).toEqual([['csv', sanitized]]);
  });

  test('framework groups only reference discovered test framework formats', () => {
    const discovered = new Set(getTestFrameworkFormats());
    const grouped = Object.values(TEST_FRAMEWORK_GROUPS).flat();
    expect(grouped.every((format) => discovered.has(format))).toBe(true);
  });

  test('unit-test subtasks are derived from framework groups', () => {
    const subtasks = getUnitTestLanguageSubtasks();
    const typeScriptSubtask = subtasks.find((item) => item.id === 'typescript-ut');
    expect(typeScriptSubtask.types).toEqual(TEST_FRAMEWORK_GROUPS.javascript);
    expect(typeScriptSubtask.type).toBe('jest');
  });

  test('code subtasks preserve expected surface ordering', () => {
    const subtasks = getCodeLanguageSubtasks();
    expect(subtasks.map((item) => item.id)).toEqual([
      'csharp',
      'java',
      'javascript',
      'kotlin',
      'perl',
      'php',
      'python',
      'ruby',
      'typescript',
    ]);
  });
});
