import {
  DELEGATE_TYPE_CUSTOM,
  DELEGATE_TYPE_FAKER,
  DOMAIN_KEYWORD_ALIAS_INDEX,
  DOMAIN_KEYWORD_DEFINITIONS,
  DOMAIN_KEYWORDS,
  buildDomainKeywordAliasIndex,
  buildDomainKeywordCatalog,
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../js/domain/domain-keywords.js';

describe('domain keyword catalog', () => {
  test('registers canonical awd.domain keywords for faker commands', () => {
    expect(DOMAIN_KEYWORDS.length).toBeGreaterThan(0);
    expect(DOMAIN_KEYWORDS[0].canonical.startsWith('awd.domain.')).toBe(true);

    const airplane = DOMAIN_KEYWORDS.find(
      (entry) => entry.keyword === 'airline.airplane.name' && entry.delegate?.resultPath === 'name'
    );
    expect(airplane).toBeDefined();
    expect(airplane?.canonical).toBe('awd.domain.airline.airplane.name');
  });

  test('contains help metadata fields for each keyword', () => {
    DOMAIN_KEYWORDS.forEach((entry) => {
      expect(entry.help).toBeDefined();
      expect(typeof entry.help.summary).toBe('string');
      expect(typeof entry.help.docsUrl).toBe('string');
      expect(typeof entry.help.example).toBe('string');
      expect(Array.isArray(entry.help.args)).toBe(true);
      entry.help.args.forEach((arg) => {
        expect(typeof arg.name).toBe('string');
        expect(typeof arg.type).toBe('string');
        expect(typeof arg.required).toBe('boolean');
        expect(typeof arg.description).toBe('string');
      });
    });
  });

  test('is defined from standalone domain definitions with explicit delegates', () => {
    expect(DOMAIN_KEYWORD_DEFINITIONS.length).toBeGreaterThan(0);
    DOMAIN_KEYWORD_DEFINITIONS.forEach((definition) => {
      expect(typeof definition.keyword).toBe('string');
      expect([DELEGATE_TYPE_FAKER, DELEGATE_TYPE_CUSTOM]).toContain(definition.delegate?.type);
      expect(typeof definition.delegate?.target).toBe('string');
    });
  });

  test('supports creating catalogs from injected definitions', () => {
    const catalog = buildDomainKeywordCatalog([
      {
        keyword: 'demo.echo',
        delegate: { type: 'custom', target: 'demo.echo' },
        help: { summary: 'Echo', docsUrl: 'https://example.test', example: 'x', args: [] },
      },
    ]);
    expect(catalog).toHaveLength(1);
    expect(catalog[0].canonical).toBe('awd.domain.demo.echo');
  });
});

describe('domain keyword alias mapping', () => {
  test('creates alias chain including awd.domain, domain, module path, and minimal path when unique', () => {
    const command = getDomainKeywordByAlias('awd.domain.airline.airplane.name');
    expect(command).toBeDefined();

    const byDomain = getDomainKeywordByAlias('domain.airline.airplane.name');
    const byModule = getDomainKeywordByAlias('airline.airplane.name');
    const byMinimal = getDomainKeywordByAlias('airplane.name');

    expect(byDomain?.canonical).toBe(command.canonical);
    expect(byModule?.canonical).toBe(command.canonical);
    expect(byMinimal?.canonical).toBe(command.canonical);
  });

  test('falls back to longer unique aliases when shorter aliases collide', () => {
    const customKeywords = [
      { canonical: 'awd.domain.alpha.beta.name', fakerCommand: 'alpha.beta.name', help: {} },
      { canonical: 'awd.domain.gamma.beta.name', fakerCommand: 'gamma.beta.name', help: {} },
    ];

    const aliasIndex = buildDomainKeywordAliasIndex(customKeywords);

    expect(aliasIndex.byAlias['beta.name']).toBeUndefined();
    expect(aliasIndex.byAlias['alpha.beta.name']?.canonical).toBe('awd.domain.alpha.beta.name');
    expect(aliasIndex.byAlias['gamma.beta.name']?.canonical).toBe('awd.domain.gamma.beta.name');
    expect(aliasIndex.byAlias['domain.alpha.beta.name']?.canonical).toBe('awd.domain.alpha.beta.name');
    expect(aliasIndex.byAlias['domain.gamma.beta.name']?.canonical).toBe('awd.domain.gamma.beta.name');
  });

  test('uses canonical full keyword when no shorter alias is unique', () => {
    const customKeywords = [
      { canonical: 'awd.domain.alpha.beta.name', fakerCommand: 'alpha.beta.name', help: {} },
      { canonical: 'awd.domain.alpha.beta.name', fakerCommand: 'alpha.beta.name', help: {} },
    ];
    const aliasIndex = buildDomainKeywordAliasIndex(customKeywords);

    expect(aliasIndex.byAlias['awd.domain.alpha.beta.name']?.canonical).toBe('awd.domain.alpha.beta.name');
  });

  test('builds deterministic alias mapping', () => {
    const indexA = buildDomainKeywordAliasIndex(DOMAIN_KEYWORDS);
    const indexB = buildDomainKeywordAliasIndex([...DOMAIN_KEYWORDS].reverse());

    expect(Object.keys(indexA.byAlias)).toEqual(Object.keys(indexB.byAlias));
    expect(Object.keys(indexA.byCanonical)).toEqual(Object.keys(indexB.byCanonical));
  });

  test('prebuilt index resolves canonical aliases', () => {
    expect(DOMAIN_KEYWORD_ALIAS_INDEX.byAlias['awd.domain.person.firstName']).toBeDefined();
  });
});

describe('domain keyword delegation', () => {
  test('delegates faker keyword execution via mapped delegate target', () => {
    const fakeFaker = {
      person: {
        firstName: () => 'Sam',
      },
    };

    const result = executeDomainKeyword('person.firstName', { faker: fakeFaker });
    expect(result).toBe('Sam');
  });

  test('delegates custom keyword execution via custom delegate map', () => {
    const result = executeDomainKeyword('literal.value', {
      customDelegates: {
        'literal.value': (context) => context.literal,
      },
      args: ['Pending'],
      literal: 'Pending',
    });

    expect(result).toBe('Pending');
  });

  test('blocks execution when args do not match help arg schema', () => {
    expect(() =>
      executeDomainKeyword('literal.value', {
        customDelegates: {
          'literal.value': () => 'should-not-run',
        },
        args: [undefined],
      })
    ).toThrow('Missing required argument');
  });
});

describe('domain keyword arg validation', () => {
  test('returns ok when args satisfy ordered schema', () => {
    const keyword = getDomainKeywordByAlias('literal.value');
    const result = validateDomainKeywordArgs(keyword, ['Pending']);
    expect(result).toEqual({ ok: true });
  });

  test('returns error for wrong arg type', () => {
    const keyword = getDomainKeywordByAlias('literal.value');
    const result = validateDomainKeywordArgs(keyword, [{ bad: true }]);
    expect(result.ok).toBe(false);
    expect(result.error).toContain('Invalid argument type');
  });
});
