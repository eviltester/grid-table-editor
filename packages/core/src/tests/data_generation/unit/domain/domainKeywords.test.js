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
  getDomainKeywordHelpByAlias,
  validateDomainKeywordArgs,
} from '../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../js/domain/domain-keyword-parser.js';
import {
  buildFakerHelperHelpMetadata,
  getFakerCommandHelp,
} from '../../../../../js/faker/faker-helper-keyword-definitions.js';
import { FAKER_HELPER_KEYWORD_DEFINITIONS } from '../../../../../js/faker/faker-helper-keyword-definitions.js';
import { sampleValueForKeywordArg, valueToInvocationLiteral } from './domain-keyword-sample-values.test-helper.js';

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
      expect(typeof entry.help.fakerDocsUrl).toBe('string');
      expect(Array.isArray(entry.help.usageExamples)).toBe(true);
      expect(entry.help.usageExamples.length).toBeGreaterThan(0);
      expect(entry.help.usageExamples[0]).toEqual(
        expect.objectContaining({
          functionCall: expect.any(String),
          description: expect.any(String),
        })
      );
      expect(entry.help.validator).toBeDefined();
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

  test('keeps faker helper metadata file scoped to faker-only helper commands', () => {
    const helperMetadata = buildFakerHelperHelpMetadata();
    expect(Object.keys(helperMetadata).length).toBeGreaterThan(0);
    expect(Object.keys(helperMetadata).every((keyword) => keyword.startsWith('helpers.'))).toBe(true);
    expect(Object.keys(helperMetadata)).toEqual(Object.keys(FAKER_HELPER_KEYWORD_DEFINITIONS));
  });

  test('exposes domain-backed faker command help from the domain keyword source of truth', () => {
    const mismatches = [];

    DOMAIN_KEYWORDS.filter((entry) => entry.delegate?.type === DELEGATE_TYPE_FAKER).forEach((entry) => {
      const domainHelp = getDomainKeywordHelpByAlias(entry.keyword);
      const fakerHelp = getFakerCommandHelp(entry.keyword);

      if (!domainHelp || !fakerHelp) {
        mismatches.push({ keyword: entry.keyword, reason: 'missing help entry' });
        return;
      }

      const domainArgNames = (domainHelp.args || []).map((arg) => arg.name);
      const fakerParamNames = (fakerHelp.params || []).map((param) => param.name);

      if (
        fakerHelp.summary !== domainHelp.summary ||
        fakerHelp.docsUrl !== domainHelp.docsUrl ||
        fakerHelp.fakerDocsUrl !== domainHelp.fakerDocsUrl ||
        fakerHelp.returnType !== domainHelp.returnType ||
        JSON.stringify(fakerParamNames) !== JSON.stringify(domainArgNames) ||
        serializeExampleValue(fakerHelp.usageExamples || []) !== serializeExampleValue(domainHelp.usageExamples || [])
      ) {
        mismatches.push({
          keyword: entry.keyword,
          domainArgNames,
          fakerParamNames,
          domainUsageExamples: domainHelp.usageExamples,
          fakerUsageExamples: fakerHelp.usageExamples,
        });
      }
    });

    expect(mismatches).toEqual([]);
  });

  test('is defined from standalone domain definitions with explicit delegates', () => {
    expect(DOMAIN_KEYWORD_DEFINITIONS.length).toBeGreaterThan(0);
    DOMAIN_KEYWORD_DEFINITIONS.forEach((definition) => {
      expect(typeof definition.keyword).toBe('string');
      expect([DELEGATE_TYPE_FAKER, DELEGATE_TYPE_CUSTOM]).toContain(definition.delegate?.type);
      expect(typeof definition.delegate?.target).toBe('string');
    });
  });

  test('standalone domain definitions normalize to at least one structured usage example', () => {
    const missingExamples = DOMAIN_KEYWORDS.filter(
      (definition) => !Array.isArray(definition?.help?.usageExamples) || definition.help.usageExamples.length === 0
    ).map((definition) => definition.keyword);

    expect(missingExamples).toEqual([]);
  });

  test('standalone domain definitions expose explicit sample return values for every usage example', () => {
    const missingSampleReturnValues = DOMAIN_KEYWORD_DEFINITIONS.flatMap((definition) => {
      const usageExamples = Array.isArray(definition?.help?.usageExamples) ? definition.help.usageExamples : [];
      return usageExamples
        .map((usageExample, index) =>
          typeof usageExample?.sampleReturnValue === 'undefined' ? `${definition.keyword} example ${index + 1}` : null
        )
        .filter(Boolean);
    });

    expect(missingSampleReturnValues).toEqual([]);
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
        help: {
          summary: 'Echo',
          docsUrl: 'https://example.test',
          usageExamples: [
            {
              functionCall: 'demo.echo()',
              sampleReturnValue: 'x',
              description: 'Shows demo.echo in use.',
            },
          ],
          validator: (value) => typeof value === 'string',
          returnType: 'string',
          args: [],
        },
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
    expect(byKeyword.get('autoIncrement.sequence')?.help?.returnType).toBe('string|number');
    expect(byKeyword.get('autoIncrement.sequence')?.help?.docsUrl).toBe(
      'https://anywaydata.com/docs/test-data/auto-increment-sequences'
    );
    expect(byKeyword.get('person.firstName')?.help?.docsUrl).toBe(
      'https://anywaydata.com/docs/test-data/domain/person'
    );
    expect(byKeyword.get('person.firstName')?.help?.fakerDocsUrl).toBe('https://fakerjs.dev/api/person');
    expect(byKeyword.get('datatype.boolean')?.help?.args.map((arg) => arg.name)).toEqual(['probability']);
    expect(byKeyword.get('finance.accountName')?.help?.returnType).toBe('string');
    expect(byKeyword.get('finance.accountNumber')?.help?.returnType).toBe('string');
    expect(byKeyword.get('date.month')?.help?.returnType).toBe('string');
    expect(byKeyword.get('date.weekday')?.help?.returnType).toBe('string');
    expect(byKeyword.get('autoIncrement.timestamp')?.delegate?.type).toBe('custom');
    expect(byKeyword.get('autoIncrement.timestamp')?.help?.returnType).toBe('string');
    expect(byKeyword.get('internet.email')?.delegate?.argTransform).toBe('optionsFromHelpArgs');
    expect(byKeyword.get('internet.httpMethod')?.delegate?.type).toBe('custom');
    expect(byKeyword.get('internet.httpMethod')?.help?.returnType).toBe(
      'GET|HEAD|POST|PUT|DELETE|PATCH|OPTIONS|TRACE|CONNECT'
    );
    expect(byKeyword.get('internet.httpMethod')?.help?.fakerDocsUrl).toBe('');
    expect(byKeyword.get('internet.httpStatusCode')?.help?.returnType).toBe('number');
    expect(byKeyword.get('internet.port')?.help?.returnType).toBe('number');
    expect(byKeyword.get('location.country')?.help?.returnType).toBe('string');
    expect(byKeyword.get('location.countryCode')?.help?.returnType).toBe('string');
    expect(byKeyword.get('location.county')?.help?.returnType).toBe('string');
    expect(byKeyword.get('location.direction')?.help?.returnType).toBe('string');
    expect(byKeyword.get('location.secondaryAddress')?.help?.returnType).toBe('string');
    expect(byKeyword.get('location.language')?.help?.returnType).toBe('object');
    expect(byKeyword.get('location.language.name')?.help?.returnType).toBe('string');
    expect(byKeyword.get('location.language.alpha2')?.help?.returnType).toBe('string');
    expect(byKeyword.get('location.language.alpha3')?.help?.returnType).toBe('string');
    expect(byKeyword.get('science.unit')?.help?.returnType).toBe('object');
    expect(byKeyword.get('science.unit.name')?.help?.returnType).toBe('string');
    expect(byKeyword.get('science.unit.symbol')?.help?.returnType).toBe('string');
  });

  test('example literals are consistent with declared returnType metadata', () => {
    const failures = [];

    for (const entry of DOMAIN_KEYWORDS) {
      const declaredType = String(entry?.help?.returnType || '');
      const exampleValue = entry?.help?.usageExamples?.[0]?.sampleReturnValue;
      const example = typeof exampleValue === 'undefined' ? '' : exampleValue;
      const inferred = inferTypeFromExampleLiteral(example);
      const inferredType = inferred.type;
      const confidence = inferred.confidence;

      const allowedTypes = declaredType
        .split('|')
        .map((part) => part.trim())
        .filter((part) => part.length > 0);

      if (allowedTypes.includes('string') && inferredType === 'date') {
        continue;
      }
      if (allowedTypes.includes('integer') && inferredType === 'number') {
        continue;
      }
      if (inferredType === 'string' && allowedTypes.includes(String(example))) {
        continue;
      }
      if (
        inferredType === 'string' &&
        allowedTypes.includes(JSON.stringify(String(example))) &&
        !allowedTypes.includes('string')
      ) {
        continue;
      }

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

  test('faker-backed domain commands keep anywaydata docsUrl and upstream fakerDocsUrl', () => {
    const failures = DOMAIN_KEYWORDS.filter((entry) => entry.delegate?.type === DELEGATE_TYPE_FAKER).flatMap(
      (entry) => {
        const docsUrl = String(entry.help?.docsUrl || '').trim();
        const fakerDocsUrl = String(entry.help?.fakerDocsUrl || '').trim();
        const failuresForEntry = [];

        if (!docsUrl.startsWith('https://anywaydata.com/docs/')) {
          failuresForEntry.push(`${entry.keyword}:docsUrl`);
        }
        if (docsUrl.includes('fakerjs.dev')) {
          failuresForEntry.push(`${entry.keyword}:docsUrl-faker`);
        }
        if (!fakerDocsUrl.startsWith('https://fakerjs.dev/api/')) {
          failuresForEntry.push(`${entry.keyword}:fakerDocsUrl`);
        }

        return failuresForEntry;
      }
    );

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

  test('resolves minimal aliases for flattened location.language and science.unit keywords', () => {
    expect(getDomainKeywordByAlias('language.name')?.canonical).toBe('awd.domain.location.language.name');
    expect(getDomainKeywordByAlias('language.alpha2')?.canonical).toBe('awd.domain.location.language.alpha2');
    expect(getDomainKeywordByAlias('language.alpha3')?.canonical).toBe('awd.domain.location.language.alpha3');
    expect(getDomainKeywordByAlias('unit.name')?.canonical).toBe('awd.domain.science.unit.name');
    expect(getDomainKeywordByAlias('unit.symbol')?.canonical).toBe('awd.domain.science.unit.symbol');
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

  test('uses built-in auto increment delegate when no custom override is supplied', () => {
    const state = {};
    expect(executeDomainKeyword('autoIncrement.sequence', { args: [], autoIncrementState: state })).toBe(1);
    expect(executeDomainKeyword('autoIncrement.sequence', { args: [], autoIncrementState: state })).toBe(2);
  });

  test('executes datatype.enum from CSV strings and string arrays', () => {
    const originalRandom = Math.random;
    Math.random = () => 0;

    try {
      expect(executeDomainKeyword('datatype.enum', { args: ['active,inactive'] })).toBe('active');
      expect(executeDomainKeyword('datatype.enum', { args: [['active', 'inactive']] })).toBe('active');
    } finally {
      Math.random = originalRandom;
    }
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
    expect(result.error).toBe(
      'Invalid keyword arguments: argument "value" must be string, number or boolean, not object'
    );
  });

  test('returns metadata-driven boolean type errors for named-param-backed domain args', () => {
    const keyword = getDomainKeywordByAlias('internet.httpMethod');
    const result = validateDomainKeywordArgs(keyword, ['true']);
    expect(result).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "commonOnly" must be boolean, not string',
    });
  });

  test('rejects unsupported internet.httpStatusCode types before generation', () => {
    const keyword = getDomainKeywordByAlias('internet.httpStatusCode');
    const result = validateDomainKeywordArgs(keyword, [['success', 'redirect']]);

    expect(result).toEqual({
      ok: false,
      error:
        'Invalid keyword arguments: argument "types" contains unsupported value "redirect". Allowed values are informational, success, redirection, clientError, serverError',
    });
  });

  test('treats comma-separated list metadata as string-compatible for datatype.enum', () => {
    const keyword = getDomainKeywordByAlias('datatype.enum');
    const result = validateDomainKeywordArgs(keyword, ['active,inactive,pending']);
    expect(result).toEqual({ ok: true });
  });

  test('treats CSV strings and string arrays as enum value lists for datatype.enum', () => {
    const keyword = getDomainKeywordByAlias('datatype.enum');

    expect(validateDomainKeywordArgs(keyword, ['active,inactive'])).toEqual({ ok: true });
    expect(validateDomainKeywordArgs(keyword, [['active', 'inactive']])).toEqual({ ok: true });
  });

  test('rejects reversed number bounds before generation', () => {
    const keyword = getDomainKeywordByAlias('number.int');
    const result = validateDomainKeywordArgs(keyword, [47, 32]);

    expect(result).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "min" must be less than or equal to argument "max"',
    });
  });

  test('rejects number.int multipleOf zero before generation', () => {
    const keyword = getDomainKeywordByAlias('number.int');
    const result = validateDomainKeywordArgs(keyword, [1, 10, 0]);

    expect(result).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "multipleOf" must be greater than 0',
    });
  });

  test('rejects invalid autoIncrement.sequence parameters before generation', () => {
    const keyword = getDomainKeywordByAlias('autoIncrement.sequence');

    expect(validateDomainKeywordArgs(keyword, [1, 0])).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "step" must be a non-zero integer',
    });
    expect(validateDomainKeywordArgs(keyword, [1, -0])).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "step" must be a non-zero integer',
    });
    expect(validateDomainKeywordArgs(keyword, [1, 1, '', '', -1])).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "zeropadding" must be greater than or equal to 0',
    });
  });

  test('rejects datatype.boolean probability outside documented range', () => {
    const keyword = getDomainKeywordByAlias('datatype.boolean');

    expect(validateDomainKeywordArgs(keyword, [2])).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "probability" must be between 0 and 1',
    });
    expect(validateDomainKeywordArgs(keyword, [-0.1])).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "probability" must be between 0 and 1',
    });
  });

  test('rejects negative date.recent days before generation', () => {
    const keyword = getDomainKeywordByAlias('date.recent');
    const result = validateDomainKeywordArgs(keyword, [-7]);

    expect(result).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "days" must be greater than or equal to 0',
    });
  });

  test('rejects reversed date bounds before generation', () => {
    const keyword = getDomainKeywordByAlias('date.between');
    const result = validateDomainKeywordArgs(keyword, [1659312000000, 1577836800000]);

    expect(result).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "from" must be less than or equal to argument "to"',
    });
  });

  test('keeps tolerant counterstring min/max behavior unchanged', () => {
    const keyword = getDomainKeywordByAlias('string.counterString');
    const result = validateDomainKeywordArgs(keyword, [47, 32]);

    expect(result).toEqual({ ok: true });
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

function normalizeExampleValue(value) {
  if (typeof value === 'bigint') {
    return {
      __type: 'bigint',
      value: value.toString(),
    };
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.map((entry) => normalizeExampleValue(entry));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, normalizeExampleValue(entry)]));
  }

  return value;
}

function serializeExampleValue(value) {
  return JSON.stringify(normalizeExampleValue(value));
}

function inferTypeFromExampleLiteral(example) {
  if (example === null || typeof example === 'undefined') {
    return { type: 'unknown', confidence: 'low' };
  }
  if (Array.isArray(example)) {
    return { type: 'array', confidence: 'high' };
  }
  if (typeof example === 'object') {
    return { type: 'object', confidence: 'high' };
  }
  if (typeof example === 'bigint') {
    return { type: 'integer', confidence: 'high' };
  }
  if (typeof example === 'boolean') {
    return { type: 'boolean', confidence: 'high' };
  }
  if (typeof example === 'number') {
    return { type: 'number', confidence: Number.isFinite(example) ? 'high' : 'low' };
  }
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
  if (example && typeof example === 'object' && !Array.isArray(example)) {
    return true;
  }
  const value = String(example || '').trim();
  return value.startsWith('{') && value.endsWith('}');
}

describe('faker keyword invocation styles', () => {
  const fakerKeywordsWithArgs = DOMAIN_KEYWORDS.filter(
    (keyword) => keyword.delegate?.type === 'faker' && Array.isArray(keyword.help?.args) && keyword.help.args.length > 0
  );

  for (const keyword of fakerKeywordsWithArgs) {
    test(`${keyword.keyword} supports equivalent positional and named argument invocation`, () => {
      const sampleArgs = keyword.help.args.map((arg) => sampleValueForKeywordArg(keyword.keyword, arg.name, arg.type));
      if (keyword.keyword === 'datatype.boolean') {
        sampleArgs[0] = 0.5;
      }
      if (keyword.keyword === 'string.uuid' && sampleArgs.length >= 2) {
        sampleArgs[0] = 7;
      }

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
