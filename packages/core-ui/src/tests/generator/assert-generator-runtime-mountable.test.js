import { describe, expect, test } from '@jest/globals';
import { assertGeneratorRuntimeMountable } from '../../../js/gui_components/generator/runtime/assert-generator-runtime-mountable.js';

describe('assertGeneratorRuntimeMountable', () => {
  test('accepts runtimes with a mount root and Tabulator constructor', () => {
    expect(() =>
      assertGeneratorRuntimeMountable({
        parentElement: { id: 'root' },
        TabulatorCtor: function FakeTabulator() {},
      })
    ).not.toThrow();
  });

  test('guards the required runtime mount prerequisites', () => {
    expect(() =>
      assertGeneratorRuntimeMountable({
        parentElement: null,
        TabulatorCtor: function FakeTabulator() {},
      })
    ).toThrow('Generator page runtime requires a parentElement');

    expect(() =>
      assertGeneratorRuntimeMountable({
        parentElement: { id: 'root' },
        TabulatorCtor: null,
      })
    ).toThrow('Tabulator library is not available');
  });
});
