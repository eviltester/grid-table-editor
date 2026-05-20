import { DOMAIN_KEYWORD_DEFINITIONS } from './domain-keyword-definitions.js';
import { executeCustomCounterString } from './counterstring.js';

const DOMAIN_ROOT_PREFIX = 'awd.domain.';
const DOMAIN_PREFIX = 'domain.';
const DELEGATE_TYPE_FAKER = 'faker';
const DELEGATE_TYPE_CUSTOM = 'custom';

function normaliseAlias(value) {
  return String(value || '').trim();
}

function buildCanonicalKeyword(fakerCommand) {
  const command = String(fakerCommand || '').trim();
  return `${DOMAIN_ROOT_PREFIX}${command}`;
}

function getCommandFromCanonical(canonicalKeyword) {
  const keyword = String(canonicalKeyword || '').trim();
  if (!keyword.startsWith(DOMAIN_ROOT_PREFIX)) {
    return '';
  }
  return keyword.slice(DOMAIN_ROOT_PREFIX.length);
}

function buildAliasCandidates(canonicalKeyword) {
  const command = getCommandFromCanonical(canonicalKeyword);
  if (!command) {
    return [canonicalKeyword];
  }

  const segments = command.split('.').filter((segment) => segment.length > 0);
  const candidates = [canonicalKeyword, `${DOMAIN_PREFIX}${command}`];

  // Add suffix aliases with at least 2 segments to avoid over-generic single-word keywords.
  for (let start = 0; start <= segments.length - 2; start += 1) {
    candidates.push(segments.slice(start).join('.'));
  }

  return [...new Set(candidates)];
}

function buildDomainKeywordCatalog(definitions = DOMAIN_KEYWORD_DEFINITIONS) {
  return definitions.map((definition) => {
    const keyword = String(definition?.keyword || '').trim();
    const canonical = buildCanonicalKeyword(keyword);
    return {
      canonical,
      keyword,
      delegate: {
        type: String(definition?.delegate?.type || '').trim(),
        target: String(definition?.delegate?.target || '').trim(),
        resultPath: String(definition?.delegate?.resultPath || '').trim(),
        argTransform: String(definition?.delegate?.argTransform || '').trim(),
      },
      help: {
        summary: String(definition?.help?.summary || '').trim(),
        docsUrl: String(definition?.help?.docsUrl || '').trim(),
        example: String(definition?.help?.example || '').trim(),
        examples: Array.isArray(definition?.help?.examples)
          ? definition.help.examples.map((example) => String(example || '').trim()).filter(Boolean)
          : [],
        exampleReturnValues: Array.isArray(definition?.help?.exampleReturnValues)
          ? definition.help.exampleReturnValues.map((value) => String(value || '').trim()).filter(Boolean)
          : [],
        returnType: String(definition?.help?.returnType || '').trim(),
        args: Array.isArray(definition?.help?.args)
          ? definition.help.args.map((arg) => ({
              name: String(arg?.name || '').trim(),
              type: String(arg?.type || '').trim(),
              required: arg?.required === true,
              description: String(arg?.description || '').trim(),
            }))
          : [],
      },
    };
  });
}

function buildDomainKeywordAliasIndex(keywords = DOMAIN_KEYWORDS) {
  const sortedKeywords = [...keywords].sort((a, b) => a.canonical.localeCompare(b.canonical));
  const nonCanonicalUsageCounts = new Map();
  const candidateAliasesByCanonical = new Map();

  for (const keyword of sortedKeywords) {
    const canonical = normaliseAlias(keyword?.canonical);
    const candidates = buildAliasCandidates(canonical);
    candidateAliasesByCanonical.set(canonical, candidates);
    for (const candidate of candidates) {
      if (candidate === canonical) {
        continue;
      }
      nonCanonicalUsageCounts.set(candidate, (nonCanonicalUsageCounts.get(candidate) || 0) + 1);
    }
  }

  const byAlias = {};
  const byCanonical = {};

  for (const keyword of sortedKeywords) {
    const canonical = normaliseAlias(keyword?.canonical);
    const aliases = candidateAliasesByCanonical.get(canonical) || [canonical];
    const uniqueAliases = [];

    for (const alias of aliases) {
      if (alias === canonical) {
        uniqueAliases.push(alias);
        continue;
      }
      if ((nonCanonicalUsageCounts.get(alias) || 0) === 1) {
        uniqueAliases.push(alias);
      }
    }

    byCanonical[canonical] = {
      ...keyword,
      aliases: uniqueAliases,
      shortestUniqueAlias: uniqueAliases
        .filter((alias) => alias !== canonical)
        .sort((a, b) => a.split('.').length - b.split('.').length || a.localeCompare(b))[0],
    };

    for (const alias of uniqueAliases) {
      byAlias[alias] = byCanonical[canonical];
    }
  }

  return { byAlias, byCanonical };
}

function getDomainKeywordByAlias(alias, index = DOMAIN_KEYWORD_ALIAS_INDEX) {
  const key = normaliseAlias(alias);
  if (!key) {
    return undefined;
  }
  return index.byAlias[key];
}

function runFakerDelegate(target, fakerInstance, args = [], resultPath = '') {
  const parts = String(target || '')
    .split('.')
    .filter((part) => part.length > 0);
  let node = fakerInstance;
  let parent = fakerInstance;
  for (const part of parts) {
    parent = node;
    node = node?.[part];
  }
  if (typeof node !== 'function') {
    throw new Error(`Unknown faker delegate target: ${target}`);
  }
  const result = node.apply(parent, args);
  if (!resultPath) {
    return result;
  }
  const resultParts = String(resultPath)
    .split('.')
    .filter((part) => part.length > 0);
  let resolved = result;
  for (const part of resultParts) {
    resolved = resolved?.[part];
  }
  return resolved;
}

function isTypeMatch(value, typeName) {
  const raw = String(typeName || '').trim();
  if (!raw) {
    return false;
  }
  const allowed = raw.split('|').map((entry) => entry.trim());
  for (const item of allowed) {
    if (item === 'string' && typeof value === 'string') return true;
    if (item === 'number' && typeof value === 'number' && Number.isFinite(value)) return true;
    if (item === 'boolean' && typeof value === 'boolean') return true;
    if (item === 'array' && Array.isArray(value)) return true;
    if (item === 'object' && value !== null && typeof value === 'object' && !Array.isArray(value)) return true;
  }
  return false;
}

function applyFakerArgTransform(keyword, args = []) {
  const transformName = String(keyword?.delegate?.argTransform || '').trim();
  if (!transformName) {
    return args;
  }
  if (transformName === 'optionsFromHelpArgs') {
    if (!Array.isArray(args)) {
      return args;
    }
    const argSchema = Array.isArray(keyword?.help?.args) ? keyword.help.args : [];
    const options = {};
    for (let index = 0; index < argSchema.length; index += 1) {
      const argValue = args[index];
      if (typeof argValue === 'undefined') {
        continue;
      }
      const key = String(argSchema[index]?.name || '').trim();
      if (!key) {
        continue;
      }
      options[key] = argValue;
    }
    return Object.keys(options).length > 0 ? [options] : [];
  }
  return args;
}

const BUILT_IN_CUSTOM_DELEGATES = {
  'literal.value': (executionContext = {}) => {
    const args = Array.isArray(executionContext.args) ? executionContext.args : [];
    return typeof args[0] === 'undefined' ? '' : args[0];
  },
  'string.counterString': executeCustomCounterString,
};

function validateDomainKeywordArgs(keyword, args = []) {
  const argumentList = Array.isArray(args) ? args : [];
  const schema = Array.isArray(keyword?.help?.args) ? keyword.help.args : [];

  for (let index = 0; index < schema.length; index += 1) {
    const spec = schema[index];
    const value = argumentList[index];
    if (spec.required && typeof value === 'undefined') {
      return { ok: false, error: `Missing required argument at position ${index}: ${spec.name}` };
    }
    if (typeof value !== 'undefined' && !isTypeMatch(value, spec.type)) {
      return {
        ok: false,
        error: `Invalid argument type at position ${index}: ${spec.name} expected ${spec.type}`,
      };
    }
  }

  if (argumentList.length > schema.length) {
    return {
      ok: false,
      error: `Too many arguments supplied. Expected ${schema.length}, received ${argumentList.length}.`,
    };
  }

  return { ok: true };
}

function executeDomainKeyword(aliasOrCanonical, executionContext = {}, index = DOMAIN_KEYWORD_ALIAS_INDEX) {
  const keyword = getDomainKeywordByAlias(aliasOrCanonical, index);
  if (!keyword) {
    throw new Error(`Unknown domain keyword: ${aliasOrCanonical}`);
  }

  const args = Array.isArray(executionContext.args) ? executionContext.args : [];
  const validation = validateDomainKeywordArgs(keyword, args);
  if (!validation.ok) {
    throw new Error(validation.error);
  }

  if (keyword.delegate.type === DELEGATE_TYPE_FAKER) {
    if (!executionContext.faker) {
      throw new Error('Faker execution requested but no faker instance was provided.');
    }
    const transformedArgs = applyFakerArgTransform(keyword, args);
    return runFakerDelegate(
      keyword.delegate.target,
      executionContext.faker,
      transformedArgs,
      keyword.delegate.resultPath
    );
  }

  if (keyword.delegate.type === DELEGATE_TYPE_CUSTOM) {
    const customDelegates = {
      ...BUILT_IN_CUSTOM_DELEGATES,
      ...(executionContext.customDelegates || {}),
    };
    const customFn = customDelegates[keyword.delegate.target];
    if (typeof customFn !== 'function') {
      throw new Error(`Unknown custom delegate target: ${keyword.delegate.target}`);
    }
    return customFn(executionContext);
  }

  throw new Error(`Unsupported delegate type: ${keyword.delegate.type}`);
}

const DOMAIN_KEYWORDS = buildDomainKeywordCatalog();
const DOMAIN_KEYWORD_ALIAS_INDEX = buildDomainKeywordAliasIndex(DOMAIN_KEYWORDS);

export {
  DOMAIN_KEYWORDS,
  DOMAIN_KEYWORD_DEFINITIONS,
  DOMAIN_KEYWORD_ALIAS_INDEX,
  DOMAIN_PREFIX,
  DOMAIN_ROOT_PREFIX,
  DELEGATE_TYPE_CUSTOM,
  DELEGATE_TYPE_FAKER,
  buildCanonicalKeyword,
  buildDomainKeywordAliasIndex,
  buildDomainKeywordCatalog,
  executeDomainKeyword,
  validateDomainKeywordArgs,
  buildAliasCandidates,
  getCommandFromCanonical,
  getDomainKeywordByAlias,
};
