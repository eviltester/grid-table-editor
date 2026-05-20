/*
 * Responsibilities:
 * - Shared schema state helpers for parsing text into rows and applying row-list mutations.
 * - Provides pure operations so both UIs can share behavior without sharing DOM code.
 */

import { mapParsedRulesToRows } from './schema-editor-core.js';
import { parseSchemaText } from './schema-runtime.js';

function parseSchemaTextToRows({ schemaTextToDataRules, schemaText, faker, RandExp, mapRuleToRow }) {
  const parseResult = parseSchemaText({
    schemaTextToDataRules,
    schemaText,
    faker,
    RandExp,
  });

  const tokens = Array.isArray(parseResult.schemaTokens) ? parseResult.schemaTokens : [];
  if (parseResult.errors.length > 0) {
    return { rows: [], errors: parseResult.errors, tokens };
  }

  return {
    rows: mapParsedRulesToRows({
      dataRules: parseResult.dataRules,
      schemaTokens: tokens,
      mapRuleToRow,
    }),
    errors: [],
    tokens,
  };
}

function addSchemaRowAfter(rows = [], index, createBlankSchemaRow) {
  const nextRows = Array.isArray(rows) ? rows.slice() : [];
  const insertAt = Math.min(Math.max(index + 1, 0), nextRows.length);
  nextRows.splice(insertAt, 0, createBlankSchemaRow());
  return nextRows;
}

function removeSchemaRowAt(rows = [], index, createBlankSchemaRow) {
  const nextRows = Array.isArray(rows) ? rows.slice() : [];
  if (nextRows.length <= 1) {
    return [createBlankSchemaRow()];
  }
  nextRows.splice(index, 1);
  return nextRows;
}

function moveSchemaRow(rows = [], index, direction) {
  const nextRows = Array.isArray(rows) ? rows.slice() : [];
  const targetIndex = index + direction;
  if (targetIndex < 0 || targetIndex >= nextRows.length) {
    return nextRows;
  }
  const [row] = nextRows.splice(index, 1);
  nextRows.splice(targetIndex, 0, row);
  return nextRows;
}

export { parseSchemaTextToRows, addSchemaRowAfter, removeSchemaRowAt, moveSchemaRow };
