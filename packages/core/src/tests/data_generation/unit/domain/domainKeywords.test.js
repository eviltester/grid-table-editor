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
import { parseKeywordInvocation } from '../../../../../js/domain/domain-keyword-parser.js';
import { FAKER_COMMAND_HELP_METADATA } from '../../../../../js/faker/faker-command-help-metadata.js';

describe('domain keyword catalog', () => {
  test('registers canonical awd.domain keywords for faker commands', () => {
    expect(DOMAIN_KEYWORDS.length).toBeGreaterThan(0);
    expect(DOMAIN_KEYWORDS[0].canonical.startsWith('awd.domain.')).toBe(true);

    const airplane = DOMAIN_KEYWORDS.find(
      (entry) => entry.keyword === 'airline.airplane.name' && entry.delegate?.resultPath === 'name'
    );
    expect(airplane).toEqual(
      expect.objectContaining({
        keyword: 'airline.airplane.name',
        canonical: 'awd.domain.airline.airplane.name',
      })
    );
    expect(airplane?.canonical).toBe('awd.domain.airline.airplane.name');
  });

  test('contains help metadata fields for each keyword', () => {
    DOMAIN_KEYWORDS.forEach((entry) => {
      expect(entry.help && typeof entry.help).toBe('object');
      expect(typeof entry.help.summary).toBe('string');
      expect(typeof entry.help.docsUrl).toBe('string');
      expect(typeof entry.help.example).toBe('string');
      expect(typeof entry.help.returnType).toBe('string');
      expect(entry.help.returnType.length).toBeGreaterThan(0);
      expect(Array.isArray(entry.help.args)).toBe(true);
      entry.help.args.forEach((arg) => {
        expect(typeof arg.name).toBe('string');
        expect(typeof arg.type).toBe('string');
        expect(typeof arg.required).toBe('boolean');
        expect(typeof arg.description).toBe('string');
      });
    });
  });

  test('includes all faker metadata params except object-wrapper options', () => {
    const byKeyword = new Map(DOMAIN_KEYWORDS.map((entry) => [entry.keyword, entry]));
    const mismatches = [];

    for (const [keyword, fakerHelp] of Object.entries(FAKER_COMMAND_HELP_METADATA)) {
      const domainKeyword = byKeyword.get(keyword);
      if (!domainKeyword) {
        continue;
      }

      const fakerParams = (fakerHelp?.params || []).map((param) => param.name).filter((name) => name !== 'options');
      const domainParams = new Set((domainKeyword.help?.args || []).map((arg) => arg.name));
      const missing = fakerParams.filter((name) => !domainParams.has(name));

      if (missing.length > 0) {
        mismatches.push({ keyword, missing });
      }
    }

    expect(mismatches).toEqual([]);
  });

  test('uses optionsFromHelpArgs for options-based faker commands with flattened args', () => {
    const byKeyword = new Map(DOMAIN_KEYWORDS.map((entry) => [entry.keyword, entry]));
    const missingTransforms = [];

    for (const [keyword, fakerHelp] of Object.entries(FAKER_COMMAND_HELP_METADATA)) {
      const domainKeyword = byKeyword.get(keyword);
      if (!domainKeyword || domainKeyword.delegate?.type !== 'faker') {
        continue;
      }

      const fakerParams = Array.isArray(fakerHelp?.params) ? fakerHelp.params : [];
      const hasOptionsParam = fakerParams.some((param) => param.name === 'options');
      const hasFlattenedArgs = Array.isArray(domainKeyword.help?.args) && domainKeyword.help.args.length > 0;
      const hasTransform = domainKeyword.delegate?.argTransform === 'optionsFromHelpArgs';

      if (hasOptionsParam && hasFlattenedArgs && !hasTransform) {
        missingTransforms.push(keyword);
      }
    }

    expect(missingTransforms).toEqual([]);
  });

  test('is defined from standalone domain definitions with explicit delegates', () => {
    expect(DOMAIN_KEYWORD_DEFINITIONS.length).toBeGreaterThan(0);
    DOMAIN_KEYWORD_DEFINITIONS.forEach((definition) => {
      expect(typeof definition.keyword).toBe('string');
      expect([DELEGATE_TYPE_FAKER, DELEGATE_TYPE_CUSTOM]).toContain(definition.delegate?.type);
      expect(typeof definition.delegate?.target).toBe('string');
    });
  });

  test('standalone domain definitions include at least one help example', () => {
    const missingExamples = DOMAIN_KEYWORD_DEFINITIONS.filter(
      (definition) => typeof definition?.help?.example !== 'string' || definition.help.example.trim().length === 0
    ).map((definition) => definition.keyword);

    expect(missingExamples).toEqual([]);
  });

  test('standalone domain definitions do not contain legacy placeholder argument docs', () => {
    const legacyPlaceholderArgs = [];
    DOMAIN_KEYWORD_DEFINITIONS.forEach((definition) => {
      const args = Array.isArray(definition?.help?.args) ? definition.help.args : [];
      args.forEach((arg) => {
        const description = String(arg?.description || '');
        if (description.includes('Legacy placeholder argument from Faker signatures')) {
          legacyPlaceholderArgs.push(`${definition.keyword}.${arg.name}`);
        }
      });
    });

    expect(legacyPlaceholderArgs).toEqual([]);
  });

  test('supports creating catalogs from injected definitions', () => {
    const catalog = buildDomainKeywordCatalog([
      {
        keyword: 'demo.echo',
        delegate: { type: 'custom', target: 'demo.echo' },
        help: { summary: 'Echo', docsUrl: 'https://example.test', example: 'x', returnType: 'string', args: [] },
      },
    ]);
    expect(catalog).toHaveLength(1);
    expect(catalog[0].canonical).toBe('awd.domain.demo.echo');
  });

  test('does not expose helpers.* in domain keyword catalog', () => {
    expect(DOMAIN_KEYWORDS.some((entry) => entry.keyword.startsWith('helpers.'))).toBe(false);
    expect(DOMAIN_KEYWORD_DEFINITIONS.some((entry) => String(entry.keyword || '').startsWith('helpers.'))).toBe(false);
  });

  test('keeps critical keyword metadata contracts for documented return types and transforms', () => {
    const byKeyword = new Map(DOMAIN_KEYWORDS.map((entry) => [entry.keyword, entry]));

    expect(byKeyword.get('literal.value')?.help?.returnType).toBe('string|number|boolean');
    expect(byKeyword.get('datatype.boolean')?.help?.args.map((arg) => arg.name)).toEqual(['probability']);
    expect(byKeyword.get('finance.accountName')?.help?.returnType).toBe('string');
    expect(byKeyword.get('finance.accountNumber')?.help?.returnType).toBe('string');
    expect(byKeyword.get('date.month')?.help?.returnType).toBe('string');
    expect(byKeyword.get('date.weekday')?.help?.returnType).toBe('string');
    expect(byKeyword.get('autoIncrement.timestamp')?.delegate?.type).toBe('custom');
    expect(byKeyword.get('autoIncrement.timestamp')?.help?.returnType).toBe('string');
    expect(byKeyword.get('internet.email')?.delegate?.argTransform).toBe('optionsFromHelpArgs');
    expect(byKeyword.get('internet.httpStatusCode')?.help?.returnType).toBe('number');
    expect(byKeyword.get('internet.port')?.help?.returnType).toBe('number');
    expect(byKeyword.get('location.country')?.help?.returnType).toBe('string');
    expect(byKeyword.get('location.countryCode')?.help?.returnType).toBe('string');
    expect(byKeyword.get('location.county')?.help?.returnType).toBe('string');
    expect(byKeyword.get('location.direction')?.help?.returnType).toBe('string');
    expect(byKeyword.get('location.secondaryAddress')?.help?.returnType).toBe('string');
    expect(byKeyword.get('location.language')?.help?.returnType).toBe('object');
  });

  test('example literals are consistent with declared returnType metadata', () => {
    const failures = [];

    for (const entry of DOMAIN_KEYWORDS) {
      const declaredType = String(entry?.help?.returnType || '');
      const example = String(entry?.help?.example || '');
      const inferred = inferTypeFromExampleLiteral(example);
      const inferredType = inferred.type;
      const confidence = inferred.confidence;

      const allowedTypes = declaredType
        .split('|')
        .map((part) => part.trim())
        .filter((part) => part.length > 0);

      if (allowedTypes.includes('object') && !exampleLooksLikeObjectLiteral(example)) {
        failures.push({
          keyword: entry.keyword,
          returnType: declaredType,
          example,
          reason: 'declared object returnType requires object-like example literal',
        });
        continue;
      }

      if (confidence === 'high' && !allowedTypes.includes(inferredType)) {
        failures.push({
          keyword: entry.keyword,
          returnType: declaredType,
          example,
          inferredType,
        });
      }
    }

    expect(failures).toEqual([]);
  });
});

describe('domain keyword alias mapping', () => {
  test('creates alias chain including awd.domain, domain, module path, and minimal path when unique', () => {
    const command = getDomainKeywordByAlias('awd.domain.airline.airplane.name');
    expect(command?.canonical).toBe('awd.domain.airline.airplane.name');

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
    expect(DOMAIN_KEYWORD_ALIAS_INDEX.byAlias['awd.domain.person.firstName']?.canonical).toBe(
      'awd.domain.person.firstName'
    );
  });

  test('does not map helpers aliases in prebuilt index', () => {
    expect(DOMAIN_KEYWORD_ALIAS_INDEX.byAlias['helpers.fake']).toBeUndefined();
    expect(DOMAIN_KEYWORD_ALIAS_INDEX.byAlias['domain.helpers.fake']).toBeUndefined();
    expect(DOMAIN_KEYWORD_ALIAS_INDEX.byAlias['awd.domain.helpers.fake']).toBeUndefined();
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

  test('allows custom literal delegate to override built-in behavior', () => {
    const result = executeDomainKeyword('literal.value', {
      customDelegates: {
        'literal.value': () => 'should-run',
      },
      args: [undefined],
    });
    expect(result).toBe('should-run');
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

function setDeepMethod(root, target, fn) {
  const parts = String(target || '')
    .split('.')
    .filter((part) => part.length > 0);

  let node = root;
  for (let index = 0; index < parts.length - 1; index += 1) {
    const part = parts[index];
    node[part] = node[part] || {};
    node = node[part];
  }

  node[parts[parts.length - 1]] = fn;
}

function sampleValueForType(type) {
  const allowed = String(type || '')
    .split('|')
    .map((entry) => entry.trim());

  if (allowed.includes('integer')) return 7;
  if (allowed.includes('number')) return 7;
  if (allowed.includes('regexp')) return '[A-Z]';
  if (allowed.includes('boolean')) return true;
  if (allowed.includes('array')) return ['x', 'y'];
  if (allowed.includes('object')) return { key: 'value' };
  return 'sample';
}

function valueToInvocationLiteral(value) {
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (value && typeof value === 'object') {
    return JSON.stringify(value);
  }
  throw new Error(`Unsupported invocation literal value: ${String(value)}`);
}

function inferTypeFromExampleLiteral(example) {
  const value = String(example || '').trim();
  if (value.length === 0) return { type: 'unknown', confidence: 'low' };

  if (value === 'true' || value === 'false') return { type: 'boolean', confidence: 'high' };
  if (value.startsWith('[') && value.endsWith(']')) return { type: 'array', confidence: 'high' };
  if (value.startsWith('{') && value.endsWith('}')) return { type: 'object', confidence: 'high' };
  if (/^"?\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z"?$/.test(value)) {
    return { type: 'date', confidence: 'high' };
  }
  if (/[^0-9.+-]/.test(value)) return { type: 'string', confidence: 'high' };
  if (/^[+-]?\d+(\.\d+)?$/.test(value)) return { type: 'number', confidence: 'low' };

  return { type: 'string', confidence: 'low' };
}

function exampleLooksLikeObjectLiteral(example) {
  const value = String(example || '').trim();
  return value.startsWith('{') && value.endsWith('}');
}

describe('faker keyword invocation styles', () => {
  const fakerKeywordsWithArgs = DOMAIN_KEYWORDS.filter(
    (keyword) => keyword.delegate?.type === 'faker' && Array.isArray(keyword.help?.args) && keyword.help.args.length > 0
  );

  for (const keyword of fakerKeywordsWithArgs) {
    test(`${keyword.keyword} supports equivalent positional and named argument invocation`, () => {
      const sampleArgs = keyword.help.args.map((arg) => sampleValueForType(arg.type));

      const positionalInvocation = `${keyword.keyword}(${sampleArgs.map(valueToInvocationLiteral).join(', ')})`;
      const namedInvocation = `${keyword.keyword}(${keyword.help.args
        .map((arg, index) => `${arg.name}=${valueToInvocationLiteral(sampleArgs[index])}`)
        .join(', ')})`;

      const parsedPositional = parseKeywordInvocation(positionalInvocation);
      const parsedNamed = parseKeywordInvocation(namedInvocation);

      expect(parsedPositional.errors).toEqual([]);
      expect(parsedNamed.errors).toEqual([]);
      expect(parsedNamed.args).toEqual(parsedPositional.args);

      const callArgs = [];
      const fakeFaker = {};
      setDeepMethod(fakeFaker, keyword.delegate.target, (...receivedArgs) => {
        callArgs.push(receivedArgs);
        return 'ok';
      });

      executeDomainKeyword(parsedPositional.keyword, { faker: fakeFaker, args: parsedPositional.args });
      executeDomainKeyword(parsedNamed.keyword, { faker: fakeFaker, args: parsedNamed.args });

      expect(callArgs).toHaveLength(2);
      expect(callArgs[1]).toEqual(callArgs[0]);
    });
  }
});
