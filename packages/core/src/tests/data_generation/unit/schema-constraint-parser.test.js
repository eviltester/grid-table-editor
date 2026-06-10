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

  test('parses AND chains left-associatively and evaluates all terms', () => {
    const parsed = parseConstraintText('IF [A] = "x" AND [B] <> "y" AND [C] < 3 THEN [Result] = "allow";');

    expect(parsed.ok).toBe(true);
    expect(parsed.errors).toEqual([]);
    expect(evaluatePredicate(parsed.ast.condition, { A: 'x', B: 'z', C: 2 })).toBe(true);
    expect(evaluatePredicate(parsed.ast.condition, { A: 'x', B: 'y', C: 2 })).toBe(false);
    expect(parsed.ast.condition).toMatchObject({
      kind: 'logical',
      operator: 'AND',
      right: {
        kind: 'comparison',
        relation: '<',
      },
    });
  });

  test('parses OR chains and grouped expressions', () => {
    const parsed = parseConstraintText(
      'IF ([A] = "x" OR [B] = "y" OR [C] = "z") AND [Count] >= 2 THEN [Result] = "allow";'
    );

    expect(parsed.ok).toBe(true);
    expect(parsed.errors).toEqual([]);
    expect(evaluatePredicate(parsed.ast.condition, { A: 'no', B: 'y', C: 'no', Count: 2 })).toBe(true);
    expect(evaluatePredicate(parsed.ast.condition, { A: 'x', B: 'no', C: 'no', Count: 1 })).toBe(false);
    expect(parsed.ast.condition).toMatchObject({
      kind: 'logical',
      operator: 'AND',
      left: {
        kind: 'logical',
        operator: 'OR',
      },
      right: {
        kind: 'comparison',
        relation: '>=',
      },
    });
  });
});
