import { faker } from '@faker-js/faker';
import RandExp from 'randexp';
import { TestDataGenerator } from '../../../js/data_generation/testDataGenerator.js';
import { dataResponse } from '../../../js/data_generation/ruleResponse.js';

describe('domain generation integration', () => {
  test('generates values for domain rules via TestDataGenerator', () => {
    const generator = new TestDataGenerator(faker, RandExp);
    generator.rulesParser.testDataRules.rules = [
      {
        name: 'rating',
        ruleSpec: 'number.int(1,10)',
        comments: '',
        type: 'domain',
      },
    ];

    generator.compile();
    const row = generator.generateRow();

    expect(generator.isValid()).toBe(true);
    expect(row).toHaveLength(1);
    expect(typeof row[0]).toBe('number');
    expect(row[0]).toBeGreaterThanOrEqual(1);
    expect(row[0]).toBeLessThanOrEqual(10);
  });

  test('autoIncrement.sequence advances only for accepted rows when constraints retry generation', () => {
    const generator = new TestDataGenerator(faker, RandExp);
    generator.rulesParser.testDataRules.rules = [
      {
        name: 'Ticket',
        ruleSpec: 'autoIncrement.sequence(prefix="T-", zeropadding=2)',
        comments: '',
        type: 'domain',
      },
      {
        name: 'Keep',
        ruleSpec: 'enum(yes,no)',
        comments: '',
        type: 'enum',
      },
    ];
    generator.rulesParser.testDataRules.constraints = [
      {
        ast: {
          kind: 'if-then-constraint',
          condition: {
            kind: 'comparison',
            relation: '=',
            left: { kind: 'parameter', name: 'Keep' },
            right: { kind: 'value', valueType: 'string', value: 'no' },
          },
          consequence: {
            kind: 'comparison',
            relation: '=',
            left: { kind: 'parameter', name: 'Keep' },
            right: { kind: 'value', valueType: 'string', value: 'yes' },
          },
        },
        referencedParameters: ['Keep', 'Keep'],
      },
    ];

    generator.compile();
    let keepAttemptCount = 0;
    const baseDomainGenerateFrom = generator.generator.domainGenerator.generateFrom.bind(
      generator.generator.domainGenerator
    );
    generator.generator.domainGenerator.generateFrom = (rule, executionContext) => {
      if (rule?.name === 'Keep') {
        keepAttemptCount += 1;
        return dataResponse(keepAttemptCount === 1 ? 'no' : 'yes');
      }
      return baseDomainGenerateFrom(rule, executionContext);
    };

    const firstRow = generator.generateRow();
    const secondRow = generator.generateRow();

    expect(generator.isValid()).toBe(true);
    expect(firstRow).toEqual(['T-01', 'yes']);
    expect(secondRow).toEqual(['T-02', 'yes']);
  });
});
