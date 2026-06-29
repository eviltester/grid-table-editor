import { faker } from '@faker-js/faker';
import RandExp from 'randexp';
import { schemaTextToDataRules } from '../../../../core/js/data_generation/schema-rules-adapter.js';
import {
  getSchemaRowSemanticValidationIssues,
  getSchemaRowValidationIssues,
} from '../../../js/gui_components/shared/test-data/schema/schema-row-validation.js';

describe('schema-row-validation', () => {
  test('reports semantic validation issues for invalid domain params', () => {
    const issues = getSchemaRowSemanticValidationIssues(
      {
        name: 'Name',
        sourceType: 'domain',
        command: 'person.fullName',
        params: '(10)',
      },
      0,
      {
        schemaTextToDataRules,
        faker,
        RandExp,
      }
    );

    expect(issues).toEqual([
      expect.objectContaining({
        code: 'compiler_validation_error',
        field: 'params',
        severity: 'error',
        message: expect.stringContaining('Row 1: invalid domain params -'),
      }),
    ]);
  });

  test('reports typed domain param validation errors through the shared row validation path', () => {
    const issues = getSchemaRowSemanticValidationIssues(
      {
        name: 'Method',
        sourceType: 'domain',
        command: 'internet.httpMethod',
        params: '(commonOnly="true")',
      },
      0,
      {
        schemaTextToDataRules,
        faker,
        RandExp,
      }
    );

    expect(issues).toEqual([
      expect.objectContaining({
        code: 'compiler_validation_error',
        field: 'params',
        message:
          'Row 1: invalid domain params - Invalid keyword arguments: argument "commonOnly" must be boolean, not string',
      }),
    ]);
  });

  test('reports reversed domain bounds through the shared row validation path', () => {
    const issues = getSchemaRowSemanticValidationIssues(
      {
        name: 'Age',
        sourceType: 'domain',
        command: 'number.int',
        params: '(min=47, max=32)',
      },
      0,
      {
        schemaTextToDataRules,
        faker,
        RandExp,
      }
    );

    expect(issues).toEqual([
      expect.objectContaining({
        code: 'compiler_validation_error',
        field: 'params',
        message:
          'Row 1: invalid domain params - Invalid keyword arguments: argument "min" must be less than or equal to argument "max"',
      }),
    ]);
  });

  test('reports missing helpers.rangeToNumber max through the shared row validation path', () => {
    const issues = getSchemaRowSemanticValidationIssues(
      {
        name: 'Number',
        sourceType: 'faker',
        command: 'helpers.rangeToNumber',
        params: '({ min: 5 })',
      },
      0,
      {
        schemaTextToDataRules,
        faker,
        RandExp,
      }
    );

    expect(issues).toEqual([
      expect.objectContaining({
        code: 'compiler_validation_error',
        field: 'params',
        message: 'Row 1: invalid faker params - Invalid Faker API Call helpers.rangeToNumber range object requires max',
      }),
    ]);
  });

  test('marks unsafe faker semantic validation as warning metadata', () => {
    const issues = getSchemaRowSemanticValidationIssues(
      {
        name: 'Choice',
        sourceType: 'faker',
        command: 'helpers.fake',
        params: '(faker.person.firstName())',
      },
      0,
      {
        schemaTextToDataRules,
        faker,
        RandExp,
      }
    );

    expect(issues).toEqual([
      expect.objectContaining({
        code: 'compiler_validation_error',
        reasonCode: 'unsafe_faker_rule',
        field: 'params',
        severity: 'warning',
        message: expect.stringContaining('Unsafe faker rule syntax detected'),
      }),
    ]);
  });

  test('reports malformed helpers.arrayElement params with array guidance', () => {
    const issues = getSchemaRowSemanticValidationIssues(
      {
        name: 'Choice',
        sourceType: 'faker',
        command: 'helpers.arrayElement',
        params: '(["A", "B")',
      },
      0,
      {
        schemaTextToDataRules,
        faker,
        RandExp,
      }
    );

    expect(issues).toEqual([
      expect.objectContaining({
        code: 'compiler_validation_error',
        field: 'params',
        message:
          'Row 1: invalid faker params - Invalid Faker API Call helpers.arrayElement requires an array argument, e.g. helpers.arrayElement(["A", "B", "C"]).',
      }),
    ]);
  });

  test('merges precomputed semantic issues into row validation state', () => {
    const issues = getSchemaRowValidationIssues(
      {
        name: 'Name',
        sourceType: 'domain',
        command: 'person.fullName',
        params: '(10)',
        semanticValidationIssues: [
          {
            code: 'compiler_validation_error',
            field: 'params',
            line: 1,
            message: 'Row 1: invalid domain params - test message.',
          },
        ],
      },
      0
    );

    expect(issues).toEqual([
      expect.objectContaining({
        code: 'compiler_validation_error',
        field: 'params',
        message: 'Row 1: invalid domain params - test message.',
      }),
    ]);
  });

  test('reports forbidden faker commands as known but not allowed', () => {
    const issues = getSchemaRowValidationIssues(
      {
        name: 'Value',
        sourceType: 'faker',
        command: 'helpers.objectKey',
        params: '({"red":"#f00"})',
      },
      0
    );

    expect(issues).toEqual([
      expect.objectContaining({
        code: 'forbidden_faker_command',
        field: 'command',
        message: expect.stringContaining('helpers.objectKey'),
      }),
    ]);
  });

  test('reports missing regex value for blank regex rows', () => {
    const issues = getSchemaRowValidationIssues(
      {
        name: 'Code',
        sourceType: 'regex',
        value: '   ',
      },
      0
    );

    expect(issues).toEqual([
      expect.objectContaining({
        code: 'missing_regex_value',
        field: 'value',
        message: 'Row 1: regex value is required.',
      }),
    ]);
  });

  test('reports missing enum value for blank enum rows', () => {
    const issues = getSchemaRowValidationIssues(
      {
        name: 'Status',
        sourceType: 'enum',
        value: '   ',
      },
      0
    );

    expect(issues).toEqual([
      expect.objectContaining({
        code: 'missing_enum_value',
        field: 'value',
        message: 'Row 1: enum value is required.',
      }),
    ]);
  });

  test('reports missing datatype.enum values through the shared row validation path', () => {
    const issues = getSchemaRowSemanticValidationIssues(
      {
        name: 'Status',
        sourceType: 'domain',
        command: 'datatype.enum',
        params: '',
      },
      0,
      {
        schemaTextToDataRules,
        faker,
        RandExp,
      }
    );

    expect(issues).toEqual([
      expect.objectContaining({
        code: 'compiler_validation_error',
        field: 'params',
        message: 'Row 1: invalid domain params - Invalid keyword arguments: argument "values" is required',
      }),
    ]);
  });

  test('reports invalid regex value through the shared row validation path', () => {
    const issues = getSchemaRowSemanticValidationIssues(
      {
        name: 'Code',
        sourceType: 'regex',
        value: '[',
      },
      0,
      {
        schemaTextToDataRules,
        faker,
        RandExp,
      }
    );

    expect(issues).toEqual([
      expect.objectContaining({
        code: 'compiler_validation_error',
        field: 'value',
        message: expect.stringContaining('Row 1: invalid regex value -'),
      }),
    ]);
  });

  test('bracket guidance suggests a corrected example instead of echoing broken syntax', () => {
    const issues = getSchemaRowValidationIssues(
      {
        name: 'Code',
        sourceType: 'domain',
        command: 'string.alpha',
        params: '(length=4',
      },
      0
    );

    expect(issues[0]?.message).toBe('Row 1: params should be wrapped in parentheses, e.g. (length=4).');
  });
});
