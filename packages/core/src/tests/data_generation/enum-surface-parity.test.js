import { jest } from '@jest/globals';
import { faker } from '@faker-js/faker';
import RandExp from 'randexp';
import { generateFromTextSpec } from '../../index.js';
import { TestDataRulesCompiler } from '../../../js/data_generation/testDataRulesCompiler.js';
import { TestDataRule } from '../../../js/data_generation/testDataRule.js';
import { EnumTestDataGenerator } from '../../../js/data_generation/enum/enumTestDataGenerator.js';

const PUBLIC_ENUM_SURFACE_CASES = [
  {
    label: 'simple comma-separated list',
    ruleSpec: 'active,inactive,pending',
  },
  {
    label: 'quoted comma-separated list',
    ruleSpec: '"active","inactive","pending"',
  },
  {
    label: 'explicit enum(...) call',
    ruleSpec: 'enum("active","inactive","pending")',
  },
  {
    label: 'enum shorthand call',
    ruleSpec: 'enum active,inactive,pending',
  },
  {
    label: 'datatype.enum(...) alias',
    ruleSpec: 'datatype.enum("active","inactive","pending")',
  },
  {
    label: 'datatype.enum named values alias',
    ruleSpec: 'datatype.enum(values="active,inactive,pending")',
  },
  {
    label: 'datatype.enum unquoted named values alias',
    ruleSpec: 'datatype.enum(values=active,inactive,pending)',
  },
  {
    label: 'awd.datatype.enum(...) alias',
    ruleSpec: 'awd.datatype.enum("active","inactive","pending")',
  },
  {
    label: 'awd.datatype.enum named values alias',
    ruleSpec: 'awd.datatype.enum(values="active,inactive,pending")',
  },
  {
    label: 'enum(...) named values alias',
    ruleSpec: 'enum(values="active,inactive,pending")',
  },
];

const ENUM_GENERATOR_SURFACE_CASES = [
  ...PUBLIC_ENUM_SURFACE_CASES,
  {
    label: 'parenthesized comma-separated list',
    ruleSpec: '(active,inactive,pending)',
  },
];

describe('enum surface parity', () => {
  test.each(PUBLIC_ENUM_SURFACE_CASES)(
    'compiler normalizes public $label to the canonical domain enum model',
    ({ ruleSpec }) => {
      const compiler = new TestDataRulesCompiler(faker, RandExp);
      const rules = [new TestDataRule('Status', ruleSpec)];

      compiler.compile(rules);
      compiler.validate();

      expect(rules[0].type).toBe('domain');
      expect(rules[0].ruleSpec).toBe('datatype.enum("active", "inactive", "pending")');
      expect(compiler.isValid()).toBe(true);
    }
  );

  test.each(PUBLIC_ENUM_SURFACE_CASES)(
    'compiler normalizes predeclared enum $label to the canonical domain enum model',
    ({ ruleSpec }) => {
      const compiler = new TestDataRulesCompiler(faker, RandExp);
      const rules = [new TestDataRule('Status', ruleSpec)];
      rules[0].type = 'enum';

      compiler.compile(rules);
      compiler.validate();

      expect(rules[0].type).toBe('domain');
      expect(rules[0].ruleSpec).toBe('datatype.enum("active", "inactive", "pending")');
      expect(compiler.isValid()).toBe(true);
    }
  );

  test.each(PUBLIC_ENUM_SURFACE_CASES)(
    'generateFromTextSpec evaluates public $label using the same enum value selection',
    ({ ruleSpec }) => {
      const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.5);

      try {
        const result = generateFromTextSpec({
          textSpec: `Status\n${ruleSpec}`,
          rowCount: 3,
          outputFormat: 'json',
        });

        expect(result.ok).toBe(true);
        expect(result.headers).toEqual(['Status']);
        expect(result.rows).toEqual([['inactive'], ['inactive'], ['inactive']]);
      } finally {
        randomSpy.mockRestore();
      }
    }
  );

  test.each(ENUM_GENERATOR_SURFACE_CASES)(
    'EnumTestDataGenerator evaluates parser-level $label using the same enum value selection',
    ({ ruleSpec }) => {
      const generator = new EnumTestDataGenerator();
      const rule = new TestDataRule('Status', ruleSpec);
      rule.type = 'enum';
      const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.5);

      try {
        const results = Array.from({ length: 3 }, () => generator.generateFrom(rule));
        results.forEach((result) => {
          expect(result.isError).toBe(false);
          expect(result.data).toBe('inactive');
        });
      } finally {
        randomSpy.mockRestore();
      }
    }
  );
});
