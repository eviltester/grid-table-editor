/*
 * Responsibilities:
 * - Public DataGeneratorPage entrypoint for the standalone generator page.
 * - Delegates runtime behavior to the generator-page runtime implementation while keeping the public API stable.
 */

import {
  DataGeneratorPageRuntime,
  buildRuleSpecFromSchemaRow,
  extractLiteralValueFromRuleSpec,
  extractRegexValueFromRuleSpec,
  schemaRowsToSpec,
  schemaRowsToSpecWithTokens,
  validateSchemaRows,
  normaliseFakerCommand,
} from '../runtime/data-generator-page-runtime.js';

class DataGeneratorPage extends DataGeneratorPageRuntime {}

export {
  DataGeneratorPage,
  buildRuleSpecFromSchemaRow,
  extractLiteralValueFromRuleSpec,
  extractRegexValueFromRuleSpec,
  schemaRowsToSpec,
  schemaRowsToSpecWithTokens,
  validateSchemaRows,
  normaliseFakerCommand,
};
