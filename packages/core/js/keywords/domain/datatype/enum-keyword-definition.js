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
      'Enum helper accepts a list of values and returns one value at random. Supports enum(value1,value2), enum value1,value2, or datatype.enum(value1,value2).',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/datatype',
    validator: validateEnumMemberValue,
    argsValidator: validateDatatypeEnumArgs,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'datatype.enum(values="active,inactive,pending")',
        sampleReturnValue: 'inactive',
        description:
          'Shows the canonical datatype enum helper using a named values argument. The same public enum can also be authored as enum("active","inactive","pending"), enum active,inactive,pending, active,inactive,pending, or "active","inactive","pending".',
      },
      {
        functionCall: 'datatype.enum(values="GET,POST,PUT,PATCH")',
        sampleReturnValue: 'PUT',
        description:
          'Shows a second named-parameter example with a different enum set. The fully-qualified compatibility alias awd.datatype.enum(...) also normalizes to this same datatype.enum command internally.',
      },
    ],
    args: [
      {
        name: 'values',
        type: 'comma-separated list',
        required: true,
        optional: false,
        variadic: true,
        description: 'List of allowed enum values chosen at random during generation.',
        example: 'active,inactive,pending',
      },
    ],
  },
};

export { DATATYPE_ENUM_KEYWORD_DEFINITION, validateDatatypeEnumArgs };
