import { parseSchemaText, countEnumRules } from '../../../js/gui_components/shared/test-data/schema/schema-runtime.js';
import { jest } from '@jest/globals';

describe('schema-runtime', () => {
  test('parseSchemaText delegates to schema adapter', () => {
    const fakeParser = jest.fn().mockReturnValue({ dataRules: [], errors: [] });
    const result = parseSchemaText({
      schemaTextToDataRules: fakeParser,
      schemaText: 'name\nliteral("x")',
      faker: {},
      RandExp: function RandExp() {},
    });

    expect(fakeParser).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ dataRules: [], errors: [] });
  });

  test('countEnumRules counts enum type rows', () => {
    expect(countEnumRules([{ type: 'enum' }, { type: 'regex' }, { type: 'enum' }])).toBe(2);
  });
});
