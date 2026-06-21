/*
 * Responsibilities:
 * - Shared session-backed UI generation engine for app and generator shells.
 * - Centralizes schema-to-session compilation, enum eligibility checks, and result normalization.
 * - Owns row generation, pairwise generation, n-wise generation, amend execution, and direct amend adapters.
 */

import { createGenerationSession } from '@anywaydata/core';
import {
  CombinationAlgorithm,
  DEFAULT_AETG_RUNS,
} from '@anywaydata/core/data_generation/n-wise/combinationsTestDataGenerator.js';
import { EnumParser } from '@anywaydata/core/data_generation/utils/enumParser.js';
import { buildRuleSpecFromSchemaRow } from '../../schema-row-rule-mapper.js';
import { createCombinationsDataTable } from './generation-controller.js';
import { isEnumLikeSchemaRow, isNWiseEligibleForSchemaRows } from './ui-derived-state.js';

function createMutableDataTable(GenericDataTableClass) {
  const dataTable = new GenericDataTableClass();
  if (typeof dataTable.setHeaders !== 'function') {
    dataTable.headers = [];
    dataTable.rows = [];
    dataTable.setHeaders = (headers) => {
      dataTable.headers = Array.isArray(headers) ? [...headers] : [];
    };
    dataTable.appendDataRow = (row) => {
      dataTable.rows.push(Array.isArray(row) ? [...row] : []);
    };
    dataTable.getHeaders = () => dataTable.headers;
    dataTable.getRowCount = () => dataTable.rows.length;
    dataTable.getRow = (index) => dataTable.rows[index];
  }
  return dataTable;
}

function createDataTableFromRows({ headers = [], rows = [], GenericDataTableClass }) {
  const dataTable = createMutableDataTable(GenericDataTableClass);
  dataTable.setHeaders(Array.isArray(headers) ? headers : []);
  (Array.isArray(rows) ? rows : []).forEach((row) => {
    dataTable.appendDataRow(Array.isArray(row) ? [...row] : []);
  });
  return dataTable;
}

function cloneRowsFromDataTable(dataTable) {
  if (Array.isArray(dataTable?.rows)) {
    return dataTable.rows.map((row) => (Array.isArray(row) ? [...row] : []));
  }

  const rows = [];
  const rowCount = typeof dataTable?.getRowCount === 'function' ? Number.parseInt(dataTable.getRowCount(), 10) || 0 : 0;
  for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
    rows.push(Array.isArray(dataTable.getRow(rowIndex)) ? [...dataTable.getRow(rowIndex)] : []);
  }
  return rows;
}

function getDataTableHeaders(dataTable) {
  if (typeof dataTable?.getHeaders === 'function') {
    return Array.isArray(dataTable.getHeaders()) ? [...dataTable.getHeaders()] : [];
  }
  return Array.isArray(dataTable?.headers) ? [...dataTable.headers] : [];
}

function buildConstraintImpactMessage({ generatedRows = 0, failedRows = 0 } = {}) {
  return `Schema Constraints are impacting row generation - generated ${generatedRows} rows, failed to generate ${failedRows} rows. Consider changing constraints to improve row generation.`;
}

function hasConstraintText(schemaText = '') {
  return /^\s*IF\b/m.test(String(schemaText || ''));
}

function buildValidationError(code, message, diagnostics = {}) {
  return {
    ok: false,
    errors: [{ code, message }],
    diagnostics,
    dataTable: null,
    aborted: false,
    partial: false,
    statusContext: {
      operationKind: 'validation',
      generatedRows: 0,
      failedRows: 0,
      retryLimitReached: false,
    },
  };
}

function normalizeSessionResult({
  result = {},
  operationKind,
  GenericDataTableClass,
  fallbackDiagnostics = {},
  fallbackDataTable = null,
}) {
  const diagnostics = {
    ...fallbackDiagnostics,
    ...(result?.diagnostics || {}),
  };
  const headers = Array.isArray(result?.headers) ? result.headers : [];
  const rows = Array.isArray(result?.rows) ? result.rows : [];
  const dataTable =
    headers.length > 0 || rows.length > 0
      ? createDataTableFromRows({ headers, rows, GenericDataTableClass })
      : fallbackDataTable;
  const generatedRows =
    rows.length || diagnostics.generatedCount || diagnostics.rowCount || dataTable?.getRowCount?.() || 0;
  const failedRows = diagnostics.failedRows || diagnostics.failedCount || 0;

  return {
    ok: result?.ok === true,
    errors: Array.isArray(result?.errors) ? result.errors : [],
    diagnostics,
    dataTable: dataTable || null,
    aborted: result?.aborted === true,
    partial: result?.partial === true,
    statusContext: {
      operationKind,
      generatedRows,
      failedRows,
      retryLimitReached: false,
    },
  };
}

function createUiGenerationSessionService({
  getValidatedSchemaState = () => ({ errors: [], rows: [] }),
  getSchemaText = () => '',
  schemaRowsToSpec = () => '',
  schemaRowsToGenerationSpec = null,
  schemaSource = 'ui-generation',
  GenericDataTableClass,
  CombinationsTestDataGeneratorClass,
  createConfiguredGenerator = null,
  createGenerationSessionFn = createGenerationSession,
  faker,
  RandExp,
}) {
  function getSchemaState(validationOptions) {
    const nextState = getValidatedSchemaState?.(validationOptions) || { errors: [], rows: [] };
    return {
      errors: Array.isArray(nextState.errors) ? nextState.errors : [],
      rows: Array.isArray(nextState.rows) ? nextState.rows : [],
    };
  }

  function buildGenerationSchemaText(schemaState) {
    const explicitSchemaText = String(getSchemaText?.() || '');
    const trimmedExplicitSchemaText = explicitSchemaText.trim();
    const rowBasedSchemaText =
      typeof schemaRowsToGenerationSpec === 'function'
        ? schemaRowsToGenerationSpec(schemaState?.rows || [])
        : schemaRowsToSpec(schemaState?.rows || []);
    if (trimmedExplicitSchemaText.length === 0) {
      return rowBasedSchemaText;
    }
    if (hasConstraintText(explicitSchemaText)) {
      return explicitSchemaText;
    }
    return rowBasedSchemaText || explicitSchemaText;
  }

  function createSessionContext(validationOptions) {
    const schemaState = getSchemaState(validationOptions);
    if (schemaState.errors.length > 0) {
      return {
        ok: false,
        errors: schemaState.errors,
        diagnostics: {},
        rows: schemaState.rows,
        textSpec: '',
        session: null,
      };
    }

    const textSpec = buildGenerationSchemaText(schemaState);
    const session = createGenerationSessionFn({
      textSpec,
      schemaSource,
      fakerInstance: faker,
      RandExpClass: RandExp,
    });

    if (!session.isValid()) {
      return {
        ok: false,
        errors: session.getErrors(),
        diagnostics: session.diagnostics || {},
        rows: schemaState.rows,
        textSpec,
        session: null,
      };
    }

    return {
      ok: true,
      errors: [],
      diagnostics: session.diagnostics || {},
      rows: schemaState.rows,
      textSpec,
      session,
    };
  }

  function countEnumColumns(validationOptions) {
    const schemaState = getSchemaState(validationOptions);
    if (schemaState.errors.length > 0) {
      return 0;
    }
    return schemaState.rows.filter((row) => isEnumLikeSchemaRow(row)).length;
  }

  function getEnumValueCounts(validationOptions) {
    const schemaState = getSchemaState(validationOptions);
    if (schemaState.errors.length > 0) {
      return [];
    }

    return schemaState.rows
      .filter((row) => isEnumLikeSchemaRow(row))
      .map((row) => {
        try {
          return EnumParser.extractEnumValues(buildRuleSpecFromSchemaRow(row)).length;
        } catch (error) {
          console.error('Failed to extract enum values for schema row rule spec.', {
            row,
            ruleSpec: row?.params,
            error,
          });
          return 0;
        }
      })
      .filter((count) => count > 0);
  }

  function getPairwiseVisibility(validationOptions) {
    const schemaState = getSchemaState(validationOptions);
    if (schemaState.errors.length > 0) {
      return false;
    }
    return isNWiseEligibleForSchemaRows(schemaState.rows || []);
  }

  function validateCombinationStrength({ strength, validationOptions }) {
    const enumColumnCount = countEnumColumns(validationOptions);
    if (!Number.isInteger(strength) || strength < 2 || strength > enumColumnCount) {
      return buildValidationError(
        'invalid_nwise_strength',
        `n-wise strength must be between 2 and ${enumColumnCount} for this schema.`,
        { enumColumnCount }
      );
    }
    return {
      ok: true,
      enumColumnCount,
    };
  }

  function createGeneratorContext(validationOptions) {
    if (typeof createConfiguredGenerator !== 'function') {
      return buildValidationError(
        'generator_adapter_unavailable',
        'Generator adapter is unavailable for this operation.'
      );
    }

    const configured = createConfiguredGenerator(validationOptions) || {};
    if (Array.isArray(configured.errors) && configured.errors.length > 0) {
      return {
        ok: false,
        errors: configured.errors,
        diagnostics: {},
        dataTable: null,
        aborted: false,
        partial: false,
        statusContext: {
          operationKind: 'validation',
          generatedRows: 0,
          failedRows: 0,
          retryLimitReached: false,
        },
      };
    }

    return {
      ok: true,
      generator: configured.generator || null,
      rows: configured.rows || [],
    };
  }

  function generateRows({ rowCount, validationOptions, onConstraintImpact } = {}) {
    const sessionContext = createSessionContext(validationOptions);
    if (!sessionContext.ok) {
      return normalizeSessionResult({
        result: { ok: false, errors: sessionContext.errors, diagnostics: sessionContext.diagnostics },
        operationKind: 'generateRows',
        GenericDataTableClass,
      });
    }

    if (typeof onConstraintImpact === 'function') {
      return Promise.resolve(
        sessionContext.session.generateRows({
          rowCount,
          hooks: {
            onConstraintImpact,
          },
        })
      ).then((result) =>
        normalizeSessionResult({
          result,
          operationKind: 'generateRows',
          GenericDataTableClass,
          fallbackDiagnostics: sessionContext.diagnostics,
        })
      );
    }

    const result = sessionContext.session.generateRows({
      rowCount,
    });
    return normalizeSessionResult({
      result,
      operationKind: 'generateRows',
      GenericDataTableClass,
      fallbackDiagnostics: sessionContext.diagnostics,
    });
  }

  function generatePairwise({ validationOptions } = {}) {
    const sessionContext = createSessionContext(validationOptions);
    if (!sessionContext.ok) {
      return normalizeSessionResult({
        result: { ok: false, errors: sessionContext.errors, diagnostics: sessionContext.diagnostics },
        operationKind: 'generatePairwise',
        GenericDataTableClass,
      });
    }

    if (!isNWiseEligibleForSchemaRows(sessionContext.rows || [])) {
      return buildValidationError(
        'insufficient_enum_columns',
        'Pairwise generation requires at least 2 enum columns.',
        { enumColumnCount: countEnumColumns(validationOptions) }
      );
    }

    const result = sessionContext.session.generatePairwise({
      outputFormat: 'json',
    });
    return normalizeSessionResult({
      result,
      operationKind: 'generatePairwise',
      GenericDataTableClass,
      fallbackDiagnostics: sessionContext.diagnostics,
    });
  }

  function generateCombinations({ strength, algorithm, validationOptions } = {}) {
    const strengthValidation = validateCombinationStrength({ strength, validationOptions });
    if (!strengthValidation.ok) {
      return strengthValidation;
    }

    const generatorContext = createGeneratorContext(validationOptions);
    if (!generatorContext.ok) {
      return generatorContext;
    }

    const dataTable = createCombinationsDataTable({
      generator: generatorContext.generator,
      CombinationsTestDataGeneratorClass,
      GenericDataTableClass,
      faker,
      RandExp,
      options: {
        strength,
        algorithm,
        seed: 1,
        candidateCount: 20,
        runs: algorithm === CombinationAlgorithm.AETG ? DEFAULT_AETG_RUNS : 1,
      },
    });

    if (!dataTable) {
      return buildValidationError('combinations_generation_failed', 'Failed to generate combinations data.');
    }

    return {
      ok: true,
      errors: [],
      diagnostics: {
        rowCount: dataTable.getRowCount?.() || 0,
        combinationStats: dataTable.__combinationStats || null,
      },
      dataTable,
      aborted: false,
      partial: false,
      statusContext: {
        operationKind: 'generateCombinations',
        generatedRows: dataTable.getRowCount?.() || 0,
        failedRows: 0,
        retryLimitReached: false,
      },
    };
  }

  function amendRows({ dataTable, rowCount, mode, selectedRowIndexes = [], validationOptions } = {}) {
    const sessionContext = createSessionContext(validationOptions);
    if (!sessionContext.ok) {
      return normalizeSessionResult({
        result: { ok: false, errors: sessionContext.errors, diagnostics: sessionContext.diagnostics },
        operationKind: 'amendRows',
        GenericDataTableClass,
      });
    }

    const result = sessionContext.session.amendRows({
      headers: getDataTableHeaders(dataTable),
      rows: cloneRowsFromDataTable(dataTable),
      rowCount,
      mode,
      selectedRowIndexes,
    });

    return normalizeSessionResult({
      result,
      operationKind: 'amendRows',
      GenericDataTableClass,
      fallbackDiagnostics: sessionContext.diagnostics,
    });
  }

  function createDirectAmendAdapter(validationOptions) {
    const generatorContext = createGeneratorContext(validationOptions);
    if (!generatorContext.ok || !generatorContext.generator) {
      return generatorContext;
    }

    return {
      ok: true,
      generator: generatorContext.generator,
      schemaHeaders: generatorContext.generator.generateHeadersArray(),
      generateRow: () => generatorContext.generator.generateRow(),
      diagnostics: {},
      errors: [],
    };
  }

  return {
    createSessionContext,
    countEnumColumns,
    getEnumValueCounts,
    getPairwiseVisibility,
    validateCombinationStrength,
    getCombinationInput(validationOptions) {
      return {
        enumColumnCount: countEnumColumns(validationOptions),
        enumValueCounts: getEnumValueCounts(validationOptions),
      };
    },
    buildConstraintImpactMessage,
    generateRows,
    generatePairwise,
    generateCombinations,
    amendRows,
    createDirectAmendAdapter,
  };
}

export { createUiGenerationSessionService, buildConstraintImpactMessage };
