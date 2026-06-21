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
