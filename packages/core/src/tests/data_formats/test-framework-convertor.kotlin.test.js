import {
  createConvertor,
  makeTable,
  makeStressTable,
  makeKotlinIdentifierTable,
  makeKotlinCollisionHeaderTable,
} from './test-framework-convertor.shared.js';

describe('test framework convertor - Kotlin', () => {
  test.each([
    ['kotest', /rowProvider\(\)\.forEach \{ row ->/],
    ['junit5-kotlin', /import org\.junit\.jupiter\.params\.ParameterizedTest/],
    ['spek', /import org\.spekframework\.spek2\.Spek/],
  ])('renders %s output', (frameworkId, pattern) => {
    const rendered = createConvertor(frameworkId).fromDataTable(makeTable());
    expect(rendered).toMatch(pattern);
  });

  test('junit5-kotlin sanitizes digit-led identifiers', () => {
    const rendered = createConvertor('junit5-kotlin').fromDataTable(makeKotlinIdentifierTable());
    expect(rendered).toMatch(/_123code/);
  });

  test('junit5-kotlin deduplicates colliding sanitized parameter names', () => {
    const rendered = createConvertor('junit5-kotlin').fromDataTable(makeKotlinCollisionHeaderTable());
    expect(rendered).toMatch(/user_id/);
    expect(rendered).toMatch(/user_id_2/);
  });

  test.each(['kotest', 'junit5-kotlin', 'spek'])('%s renders stress-table content', (frameworkId) => {
    const rendered = createConvertor(frameworkId, { dataSourceStrategy: 'provider', prettyPrint: true }).fromDataTable(
      makeStressTable()
    );
    expect(rendered).toContain('Connie');
  });

  test('kotest includes setup and provider structure', () => {
    const rendered = createConvertor('kotest', { includeSetup: true, dataSourceStrategy: 'provider' }).fromDataTable(
      makeTable()
    );
    expect(rendered).toContain('class GeneratedDataTests : StringSpec({');
    expect(rendered).toContain('fun rowProvider()');
    expect(rendered).toContain('"row parameterized" {');
    expect(rendered).toContain('rowProvider().forEach { row ->');
    expect(rendered).toContain('Connie');
    expect(rendered).toContain('Miles');
  });
});
