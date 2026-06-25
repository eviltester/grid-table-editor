import { validateEnumMemberValue } from '../../../command-help/command-help-validators.js';
import { normalizeDatatypeEnumArgs } from './datatype-enum.js';

function validateDatatypeEnumArgs(args = []) {
  const values = normalizeDatatypeEnumArgs(args).map((value) => String(value));

  if (values.length === 0) {
    return {
      ok: false,
      error: 'Invalid keyword arguments: argument "values" is required',
    };
  }

  if (values.some((value) => value.length === 0)) {
    return {
      ok: false,
      error: 'Invalid keyword arguments: enum values cannot be empty',
    };
  }

  return { ok: true };
}

const DATATYPE_ENUM_KEYWORD_DEFINITION = {
  keyword: 'datatype.enum',
  delegate: {
    type: 'custom',
    target: 'datatype.enum',
  },
  help: {
    summary:
      'Enum helper accepts CSV values or a string array and returns one value at random. Bare CSV is supported as schema shorthand; function calls use quoted strings, arrays, or named arguments.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/datatype',
    validator: validateEnumMemberValue,
    argsValidator: validateDatatypeEnumArgs,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'datatype.enum(csv="active,inactive,pending")',
        sampleReturnValue: 'inactive',
        description:
          'Shows the canonical datatype enum helper using a named CSV argument. The same public enum can also be authored as enum("active","inactive","pending") or the schema shorthand active,inactive,pending.',
      },
      {
        functionCall: 'datatype.enum(values=["GET","POST","PUT","PATCH"])',
        sampleReturnValue: 'PUT',
        description:
          'Shows the string-array form for values that should be parsed directly instead of as CSV text. The fully-qualified compatibility alias awd.datatype.enum(...) also normalizes to this same datatype.enum command internally.',
      },
    ],
    args: [
      {
        name: 'values',
        type: 'comma-separated list|array',
        aliases: ['csv'],
        required: true,
        optional: false,
        variadic: true,
        description:
          'List of allowed enum values chosen at random during generation. Named csv="..." is also accepted as a CSV-string alias for this argument.',
        example: 'active,inactive,pending',
      },
    ],
  },
};

export { DATATYPE_ENUM_KEYWORD_DEFINITION, validateDatatypeEnumArgs };
