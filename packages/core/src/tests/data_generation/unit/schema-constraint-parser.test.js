import { parseConstraintText } from '../../../../js/data_generation/schema-constraint-parser.js';
import { evaluatePredicate } from '../../../../js/data_generation/schema-constraint-evaluator.js';

describe('schema constraint parser', () => {
  test('treats AND as higher precedence than OR', () => {
    const parsed = parseConstraintText('IF [A] = "yes" OR [B] = "yes" AND [C] = "yes" THEN [Result] = "allow";');

    expect(parsed.ok).toBe(true);
    expect(parsed.errors).toEqual([]);
    expect(evaluatePredicate(parsed.ast.condition, { A: 'yes', B: 'no', C: 'no' })).toBe(true);
    expect(evaluatePredicate(parsed.ast.condition, { A: 'no', B: 'yes', C: 'yes' })).toBe(true);
    expect(evaluatePredicate(parsed.ast.condition, { A: 'no', B: 'yes', C: 'no' })).toBe(false);
    expect(parsed.ast.condition).toMatchObject({
      kind: 'logical',
      operator: 'OR',
      right: {
        kind: 'logical',
        operator: 'AND',
      },
    });
  });
});
