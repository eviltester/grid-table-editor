import { getDomainKeywordHelpByAlias } from '../domain/domain-keywords.js';
import { normalizeUsageExamples } from '../command-help/command-help-contract.js';
import { HELPERS_FAKE_KEYWORD_DEFINITION } from '../keywords/faker/helpers/fake-keyword-definition.js';
import { HELPERS_MUSTACHE_KEYWORD_DEFINITION } from '../keywords/faker/helpers/mustache-keyword-definition.js';
import { HELPERS_FROM_REG_EXP_KEYWORD_DEFINITION } from '../keywords/faker/helpers/from-reg-exp-keyword-definition.js';
import { HELPERS_MAYBE_KEYWORD_DEFINITION } from '../keywords/faker/helpers/maybe-keyword-definition.js';
import { HELPERS_ARRAY_ELEMENT_KEYWORD_DEFINITION } from '../keywords/faker/helpers/array-element-keyword-definition.js';
import { HELPERS_OBJECT_KEY_KEYWORD_DEFINITION } from '../keywords/faker/helpers/object-key-keyword-definition.js';
import { HELPERS_OBJECT_VALUE_KEYWORD_DEFINITION } from '../keywords/faker/helpers/object-value-keyword-definition.js';
import { HELPERS_OBJECT_ENTRY_KEYWORD_DEFINITION } from '../keywords/faker/helpers/object-entry-keyword-definition.js';
import { HELPERS_ENUM_VALUE_KEYWORD_DEFINITION } from '../keywords/faker/helpers/enum-value-keyword-definition.js';
import { HELPERS_SLUGIFY_KEYWORD_DEFINITION } from '../keywords/faker/helpers/slugify-keyword-definition.js';
import { HELPERS_REPLACE_SYMBOLS_KEYWORD_DEFINITION } from '../keywords/faker/helpers/replace-symbols-keyword-definition.js';
import { HELPERS_REPLACE_CREDIT_CARD_SYMBOLS_KEYWORD_DEFINITION } from '../keywords/faker/helpers/replace-credit-card-symbols-keyword-definition.js';
import { HELPERS_SHUFFLE_KEYWORD_DEFINITION } from '../keywords/faker/helpers/shuffle-keyword-definition.js';
import { HELPERS_UNIQUE_ARRAY_KEYWORD_DEFINITION } from '../keywords/faker/helpers/unique-array-keyword-definition.js';
import { HELPERS_WEIGHTED_ARRAY_ELEMENT_KEYWORD_DEFINITION } from '../keywords/faker/helpers/weighted-array-element-keyword-definition.js';
import { HELPERS_ARRAY_ELEMENTS_KEYWORD_DEFINITION } from '../keywords/faker/helpers/array-elements-keyword-definition.js';
import { HELPERS_RANGE_TO_NUMBER_KEYWORD_DEFINITION } from '../keywords/faker/helpers/range-to-number-keyword-definition.js';
import { HELPERS_MULTIPLE_KEYWORD_DEFINITION } from '../keywords/faker/helpers/multiple-keyword-definition.js';

const FAKER_HELPERS_DOCS_URL = 'https://fakerjs.dev/api/helpers';

// Faker helper definitions live here because helpers.* remains outside the domain keyword abstraction.
// These definitions are the source of truth for helper command registration, params, examples, and help metadata.

const FAKER_HELPER_KEYWORD_DEFINITIONS = {
  'helpers.fake': HELPERS_FAKE_KEYWORD_DEFINITION,
  'helpers.mustache': HELPERS_MUSTACHE_KEYWORD_DEFINITION,
  'helpers.fromRegExp': HELPERS_FROM_REG_EXP_KEYWORD_DEFINITION,
  'helpers.maybe': HELPERS_MAYBE_KEYWORD_DEFINITION,
  'helpers.arrayElement': HELPERS_ARRAY_ELEMENT_KEYWORD_DEFINITION,
  'helpers.objectKey': HELPERS_OBJECT_KEY_KEYWORD_DEFINITION,
  'helpers.objectValue': HELPERS_OBJECT_VALUE_KEYWORD_DEFINITION,
  'helpers.objectEntry': HELPERS_OBJECT_ENTRY_KEYWORD_DEFINITION,
  'helpers.enumValue': HELPERS_ENUM_VALUE_KEYWORD_DEFINITION,
  'helpers.slugify': HELPERS_SLUGIFY_KEYWORD_DEFINITION,
  'helpers.replaceSymbols': HELPERS_REPLACE_SYMBOLS_KEYWORD_DEFINITION,
  'helpers.replaceCreditCardSymbols': HELPERS_REPLACE_CREDIT_CARD_SYMBOLS_KEYWORD_DEFINITION,
  'helpers.shuffle': HELPERS_SHUFFLE_KEYWORD_DEFINITION,
  'helpers.uniqueArray': HELPERS_UNIQUE_ARRAY_KEYWORD_DEFINITION,
  'helpers.weightedArrayElement': HELPERS_WEIGHTED_ARRAY_ELEMENT_KEYWORD_DEFINITION,
  'helpers.arrayElements': HELPERS_ARRAY_ELEMENTS_KEYWORD_DEFINITION,
  'helpers.rangeToNumber': HELPERS_RANGE_TO_NUMBER_KEYWORD_DEFINITION,
  'helpers.multiple': HELPERS_MULTIPLE_KEYWORD_DEFINITION,
};

function normalizeFakerHelperKeywordHelp(definition) {
  if (!definition) {
    return undefined;
  }

  const normalizedParams = Array.isArray(definition.params)
    ? definition.params.map((param) => ({
        name: String(param.name || '').trim(),
        optional: param.optional !== false,
        positionalOnly: param.positionalOnly === true,
        type: String(param.type || '').trim(),
        description: String(param.description || '').trim(),
        examples: Array.isArray(param.examples) ? param.examples : [],
      }))
    : [];
  const returnType = String(definition.returnType || '').trim();
  const usageExamples = normalizeUsageExamples({
    command: definition.command || '',
    returnType,
    usageExamples: definition.usageExamples,
  });

  return {
    summary: String(definition.summary || '').trim(),
    params: normalizedParams,
    docsUrl: String(definition.docsUrl || '').trim(),
    fakerDocsUrl: String(definition.fakerDocsUrl || '').trim(),
    usageExamples,
    validator: definition.validator,
    returnType,
  };
}

function buildFakerHelperHelpMetadata(definitions = FAKER_HELPER_KEYWORD_DEFINITIONS) {
  return Object.fromEntries(
    Object.entries(definitions).map(([command, definition]) => [
      command,
      normalizeFakerHelperKeywordHelp({ ...definition, command }),
    ])
  );
}

function getFakerHelperKeywordHelp(commandValue, definitions = FAKER_HELPER_KEYWORD_DEFINITIONS) {
  const command = String(commandValue || '').trim();
  if (!Object.prototype.hasOwnProperty.call(definitions, command)) {
    return undefined;
  }
  return normalizeFakerHelperKeywordHelp({ ...definitions[command], command });
}

function mapDomainKeywordHelpToFakerCommandHelp(commandHelp) {
  if (!commandHelp) {
    return undefined;
  }

  const params = Array.isArray(commandHelp.args)
    ? commandHelp.args.map((arg) => ({
        name: arg.name,
        optional: arg.required !== true,
        type: arg.type,
        description: arg.description || '',
        examples: Array.isArray(arg.examples) ? arg.examples : [],
      }))
    : [];
  const returnType = commandHelp.returnType || '';
  const usageExamples = normalizeUsageExamples({
    command: commandHelp.keyword,
    returnType,
    usageExamples: commandHelp.usageExamples,
  });

  return {
    summary: commandHelp.summary || '',
    params,
    docsUrl: commandHelp.docsUrl || '',
    fakerDocsUrl: commandHelp.fakerDocsUrl || '',
    usageExamples,
    validator: commandHelp.validator,
    returnType,
  };
}

function getFakerCommandHelp(commandValue, definitions = FAKER_HELPER_KEYWORD_DEFINITIONS) {
  const command = String(commandValue || '').trim();
  const helperHelp = getFakerHelperKeywordHelp(command, definitions);
  if (helperHelp) {
    return helperHelp;
  }
  return mapDomainKeywordHelpToFakerCommandHelp(getDomainKeywordHelpByAlias(command));
}

export {
  FAKER_HELPERS_DOCS_URL,
  FAKER_HELPER_KEYWORD_DEFINITIONS,
  buildFakerHelperHelpMetadata,
  getFakerCommandHelp,
  getFakerHelperKeywordHelp,
  mapDomainKeywordHelpToFakerCommandHelp,
  normalizeFakerHelperKeywordHelp,
};
