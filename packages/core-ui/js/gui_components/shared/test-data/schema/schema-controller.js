/*
 * Responsibilities:
 * - Shared schema state helpers for parsing text into rows and applying row-list mutations.
 * - Provides a shared schema editing session controller so both UIs can share state transitions without sharing DOM code.
 */

import { mapParsedRulesToRows } from './schema-editor-core.js';
import { parseSchemaText } from './schema-runtime.js';
import { preservePreviousMethodLikeSourceType } from './schema-row-mapper.js';

function isRecoverableSchemaParseError(error) {
  return error?.code === 'compiler_validation_error';
}

function parseSchemaTextToRows({ schemaTextToDataRules, schemaText, faker, RandExp, mapRuleToRow, previousRows = [] }) {
  const parseResult = parseSchemaText({
    schemaTextToDataRules,
    schemaText,
    faker,
    RandExp,
  });

  const tokens = Array.isArray(parseResult.schemaTokens) ? parseResult.schemaTokens : [];
  const parseErrors = Array.isArray(parseResult.errors) ? parseResult.errors : [];
  const parsedConstraints = Array.isArray(parseResult.constraints) ? parseResult.constraints : [];
  const blockingErrors = parseErrors.filter((error) => !isRecoverableSchemaParseError(error));
  if (blockingErrors.length > 0) {
    return { rows: [], errors: parseErrors, tokens, constraints: parsedConstraints };
  }

  const parsedRows = mapParsedRulesToRows({
    dataRules: parseResult.dataRules,
    schemaTokens: tokens,
    mapRuleToRow,
  });
  const ruleTokens = tokens.filter((token) => token?.kind === 'rule');

  return {
    rows: parsedRows.map((row, index) =>
      preservePreviousMethodLikeSourceType({
        row,
        previousRow: previousRows[index],
        rawRuleSpec: ruleTokens[index]?.rule ?? parseResult.dataRules?.[index]?.ruleSpec ?? '',
      })
    ),
    errors: parseErrors,
    tokens,
    constraints: parsedConstraints,
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

function moveSchemaRowToIndex(rows = [], fromIndex, toIndex) {
  const nextRows = Array.isArray(rows) ? rows.slice() : [];
  if (
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= nextRows.length ||
    toIndex >= nextRows.length ||
    fromIndex === toIndex
  ) {
    return nextRows;
  }
  const [row] = nextRows.splice(fromIndex, 1);
  nextRows.splice(toIndex, 0, row);
  return nextRows;
}

function buildConstraintTextFromTokens(tokens = [], constraints = []) {
  const safeTokens = Array.isArray(tokens) ? tokens : [];
  const lastRuleIndex = safeTokens.reduce(
    (latestIndex, token, index) => (token?.kind === 'rule' ? index : latestIndex),
    -1
  );
  const constraintSectionTokens = safeTokens.slice(lastRuleIndex + 1);
  const hasConstraintSectionTokens = constraintSectionTokens.some(
    (token) => token?.kind === 'constraint' || token?.kind === 'comment' || token?.kind === 'blank'
  );

  if (hasConstraintSectionTokens) {
    let constraintIndex = 0;
    const lines = constraintSectionTokens.flatMap((token) => {
      if (token?.kind === 'comment' || token?.kind === 'blank') {
        return [String(token.text ?? '')];
      }
      if (token?.kind === 'constraint') {
        const sourceText = String(constraints[constraintIndex]?.sourceText ?? token.text ?? '');
        constraintIndex += 1;
        return sourceText.split('\n');
      }
      return [];
    });

    while (lines.length > 0 && String(lines[0] ?? '').trim().length === 0) {
      lines.shift();
    }

    return lines.join('\n');
  }

  return (Array.isArray(constraints) ? constraints : [])
    .map((constraint) => String(constraint?.sourceText ?? ''))
    .join('\n\n');
}

function createSchemaEditingSession({
  createBlankSchemaRow,
  schemaTextToDataRules,
  faker,
  RandExp,
  mapRuleToRow,
  schemaRowsToSpecWithTokens,
  initialRows,
  initialTokens = [],
  initialConstraints = [],
  initialConstraintText = '',
  initialTextMode = false,
} = {}) {
  const state = {
    rows: Array.isArray(initialRows) && initialRows.length > 0 ? initialRows.slice() : [createBlankSchemaRow()],
    tokens: Array.isArray(initialTokens) ? initialTokens.slice() : [],
    constraints: Array.isArray(initialConstraints) ? initialConstraints.slice() : [],
    constraintText: String(initialConstraintText ?? ''),
    isTextMode: initialTextMode === true,
  };

  function getRows() {
    return state.rows;
  }

  function setRows(rows, { allowEmpty = false } = {}) {
    if (Array.isArray(rows) && rows.length > 0) {
      state.rows = rows;
      return state.rows;
    }
    state.rows = allowEmpty ? [] : [createBlankSchemaRow()];
    return state.rows;
  }

  function getTokens() {
    return state.tokens;
  }

  function setTokens(tokens) {
    state.tokens = Array.isArray(tokens) ? tokens : [];
    return state.tokens;
  }

  function getConstraints() {
    return state.constraints;
  }

  function setConstraints(constraints) {
    state.constraints = Array.isArray(constraints) ? constraints : [];
    return state.constraints;
  }

  function getConstraintText() {
    return state.constraintText;
  }

  function setConstraintText(constraintText) {
    state.constraintText = String(constraintText ?? '');
    return state.constraintText;
  }

  function getTextMode() {
    return state.isTextMode;
  }

  function setTextMode(isTextMode) {
    state.isTextMode = isTextMode === true;
    return state.isTextMode;
  }

  function getTrailingTextLinesFromTokens() {
    if (!Array.isArray(state.tokens) || state.tokens.length === 0) {
      return [];
    }

    const lastRuleIndex = state.tokens.reduce(
      (latestIndex, token, index) => (token?.kind === 'rule' ? index : latestIndex),
      -1
    );
    const hasConstraintSection = state.tokens.slice(lastRuleIndex + 1).some((token) => token?.kind === 'constraint');
    if (hasConstraintSection) {
      return [];
    }

    const trailing = [];
    for (let index = state.tokens.length - 1; index >= 0; index -= 1) {
      const token = state.tokens[index];
      if (token?.kind === 'rule') {
        break;
      }
      if (token?.kind === 'blank' || token?.kind === 'comment') {
        trailing.unshift(String(token.text ?? ''));
      }
    }
    return trailing;
  }

  function invalidateTokensFromRows() {
    const trailingLines = getTrailingTextLinesFromTokens();
    if (trailingLines.length > 0 && state.rows.length > 0) {
      const lastRow = state.rows[state.rows.length - 1];
      const existingComments = String(lastRow?.comments ?? '');
      const trailingText = trailingLines.join('\n');
      lastRow.comments = existingComments.length > 0 ? `${existingComments}\n${trailingText}` : trailingText;
    }
    state.tokens = [];
    return state.tokens;
  }

  function parseTextToRows(schemaText) {
    const text = String(schemaText ?? '');
    if (text.trim().length === 0) {
      return { rows: [], errors: [], tokens: [], constraints: [] };
    }

    return parseSchemaTextToRows({
      schemaTextToDataRules,
      schemaText: text,
      faker,
      RandExp,
      mapRuleToRow,
      previousRows: state.rows,
    });
  }

  function syncRowsFromText({ schemaText, preserveEmptyRows = false } = {}) {
    if (!state.isTextMode) {
      return { rows: state.rows, errors: [], tokens: state.tokens };
    }

    const parsed = parseTextToRows(schemaText);
    if (parsed.errors.length > 0) {
      return parsed;
    }

    if (parsed.rows.length === 0 && preserveEmptyRows) {
      state.rows = [createBlankSchemaRow()];
    } else {
      state.rows = parsed.rows;
    }
    state.tokens = parsed.tokens || [];
    state.constraints = parsed.constraints || [];
    state.constraintText = buildConstraintTextFromTokens(state.tokens, state.constraints);
    return { rows: state.rows, errors: [], tokens: state.tokens, constraints: state.constraints };
  }

  function toggleMode({ schemaText, preserveEmptyRows = true } = {}) {
    if (state.isTextMode) {
      const parsed = parseTextToRows(schemaText);
      if (parsed.errors.length > 0) {
        return { ok: false, errors: parsed.errors, rows: parsed.rows, tokens: parsed.tokens || [] };
      }
      state.rows = parsed.rows.length > 0 || !preserveEmptyRows ? parsed.rows : [createBlankSchemaRow()];
      state.tokens = parsed.tokens || [];
      state.constraints = parsed.constraints || [];
      state.constraintText = buildConstraintTextFromTokens(state.tokens, state.constraints);
      state.isTextMode = false;
      return {
        ok: true,
        rows: state.rows,
        tokens: state.tokens,
        constraints: state.constraints,
        isTextMode: state.isTextMode,
      };
    }

    const text = schemaRowsToSpecWithTokens(state.rows, state.tokens);
    state.isTextMode = true;
    return {
      ok: true,
      schemaText: text,
      rows: state.rows,
      tokens: state.tokens,
      constraints: state.constraints,
      isTextMode: state.isTextMode,
    };
  }

  function addRowAfterIndex(index) {
    state.rows = addSchemaRowAfter(state.rows, index, createBlankSchemaRow);
    invalidateTokensFromRows();
    return state.rows;
  }

  function removeRowAtIndex(index) {
    state.rows = removeSchemaRowAt(state.rows, index, createBlankSchemaRow);
    invalidateTokensFromRows();
    return state.rows;
  }

  function moveRowAtIndex(index, direction) {
    state.rows = moveSchemaRow(state.rows, index, direction);
    invalidateTokensFromRows();
    return state.rows;
  }

  function moveRowToIndex(fromIndex, toIndex) {
    state.rows = moveSchemaRowToIndex(state.rows, fromIndex, toIndex);
    invalidateTokensFromRows();
    return state.rows;
  }

  function updateRowAtIndex(index, updater) {
    if (index < 0 || index >= state.rows.length) {
      return undefined;
    }
    invalidateTokensFromRows();
    const currentRow = state.rows[index];
    state.rows[index] = typeof updater === 'function' ? updater(currentRow) : { ...currentRow, ...(updater || {}) };
    return state.rows[index];
  }

  return {
    getRows,
    setRows,
    getTokens,
    setTokens,
    getConstraints,
    setConstraints,
    getConstraintText,
    setConstraintText,
    getTextMode,
    setTextMode,
    getState: () => ({
      rows: state.rows,
      tokens: state.tokens,
      constraints: state.constraints,
      constraintText: state.constraintText,
      isTextMode: state.isTextMode,
    }),
    parseTextToRows,
    syncRowsFromText,
    toggleMode,
    invalidateTokensFromRows,
    addRowAfterIndex,
    removeRowAtIndex,
    moveRowAtIndex,
    moveRowToIndex,
    updateRowAtIndex,
  };
}

export {
  parseSchemaTextToRows,
  addSchemaRowAfter,
  removeSchemaRowAt,
  moveSchemaRow,
  moveSchemaRowToIndex,
  buildConstraintTextFromTokens,
  createSchemaEditingSession,
};
