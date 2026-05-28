import { faker } from '@faker-js/faker';
import RandExp from 'randexp';
import { schemaTextToDataRules } from '../../../../core/js/data_generation/schema-rules-adapter.js';
import {
  getSchemaRowSemanticValidationIssues,
  getSchemaRowValidationIssues,
} from '../../../js/gui_components/shared/test-data/schema/index.js';

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
});
