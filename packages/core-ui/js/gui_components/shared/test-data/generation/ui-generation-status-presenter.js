import { schemaErrorsToText } from '../schema/schema-error-text.js';
import { buildConstraintImpactMessage } from './ui-generation-session-service.js';

function hasErrorCode(result, code) {
  return (Array.isArray(result?.errors) ? result.errors : []).some((error) => error?.code === code);
}

function getRowCount(result) {
  return (
    result?.dataTable?.getRowCount?.() ||
    result?.statusContext?.generatedRows ||
    result?.diagnostics?.rowCount ||
    result?.diagnostics?.generatedCount ||
    0
  );
}

function createAppSuccessMessage({ operationKind, result, previewUpdated = false, strength }) {
  const suffix = previewUpdated ? 'Grid and preview updated.' : 'Grid updated.';
  const rowCount = getRowCount(result);

  if (operationKind === 'generatePairwise') {
    return `Generated ${rowCount} pairwise combinations. ${suffix}`;
  }

  if (operationKind === 'generateCombinations') {
    return `Generated ${rowCount} ${strength}-wise combinations. ${suffix}`;
  }

  if (operationKind === 'amendRows') {
    return `Amend complete. ${suffix}`;
  }

  return `Generate complete. ${suffix}`;
}

function createGeneratorSuccessMessage({ operationKind, filename, result }) {
  const rowCount = getRowCount(result);

  if (operationKind === 'generatePairwise') {
    return `Download ready: ${filename} (${rowCount} combinations)`;
  }

  if (operationKind === 'generateCombinations') {
    return `Download ready: ${filename} (${rowCount} combinations)`;
  }

  if (operationKind === 'generateRows') {
    return `Download ready: ${filename}`;
  }

  return '';
}

function presentUiGenerationNotice({ noticeKind, surface, previewUpdated = false } = {}) {
  if (noticeKind === 'cartesianSkipped') {
    return {
      outcome: 'warning',
      schemaMessage: null,
      statusMessage: 'Cartesian product generation skipped.',
      statusOptions: { severity: 'warning', dismissable: true },
    };
  }

  if (noticeKind === 'amendSuccess' && surface === 'app') {
    return {
      outcome: 'success',
      schemaMessage: null,
      statusMessage: `Amend complete. ${previewUpdated ? 'Grid and preview updated.' : 'Grid updated.'}`,
      statusOptions: { dismissable: true },
    };
  }

  return {
    outcome: 'none',
    schemaMessage: null,
    statusMessage: '',
    statusOptions: null,
  };
}

function presentUiGenerationResult({
  surface,
  operationKind,
  result,
  previewUpdated = false,
  retryLimitReached = false,
  strength,
  filename = '',
} = {}) {
  const schemaMessage = schemaErrorsToText(result?.errors || []);

  if (result?.aborted && operationKind === 'generateRows' && surface === 'app') {
    const message = buildConstraintImpactMessage({
      generatedRows: result?.statusContext?.generatedRows || 0,
      failedRows: result?.statusContext?.failedRows || 0,
    });

    return {
      outcome: 'warning',
      schemaMessage: retryLimitReached ? `${message} Retry limit reached.` : message,
      statusMessage: `${retryLimitReached ? `${message} Retry limit reached.` : message} ${
        previewUpdated ? 'Grid and preview updated.' : 'Grid updated.'
      }`,
      statusOptions: { severity: 'warning', dismissable: true },
    };
  }

  if (result?.ok) {
    if (surface === 'app') {
      return {
        outcome: 'success',
        schemaMessage: null,
        statusMessage: createAppSuccessMessage({ operationKind, result, previewUpdated, strength }),
        statusOptions: { dismissable: true },
      };
    }

    return {
      outcome: 'success',
      schemaMessage: null,
      statusMessage: createGeneratorSuccessMessage({ operationKind, filename, result }),
      statusOptions: null,
    };
  }

  if (hasErrorCode(result, 'insufficient_enum_columns')) {
    return {
      outcome: 'warning',
      schemaMessage,
      statusMessage: 'Insufficient enum columns.',
      statusOptions: { severity: 'warning', dismissable: true },
    };
  }

  if (hasErrorCode(result, 'invalid_nwise_strength')) {
    return {
      outcome: 'warning',
      schemaMessage,
      statusMessage: 'Invalid n-wise strength.',
      statusOptions: { severity: 'warning', dismissable: true },
    };
  }

  if (hasErrorCode(result, 'constraint_generation_failed') && operationKind === 'amendRows' && surface === 'app') {
    return {
      outcome: 'warning',
      schemaMessage,
      statusMessage: 'Amend stopped by schema constraints.',
      statusOptions: { severity: 'warning', dismissable: true },
    };
  }

  if (surface === 'generator') {
    return {
      outcome: 'error',
      schemaMessage,
      statusMessage: '',
      statusOptions: null,
    };
  }

  if (operationKind === 'generatePairwise') {
    return {
      outcome: 'error',
      schemaMessage,
      statusMessage: 'Pairwise generation failed.',
      statusOptions: { severity: 'error', dismissable: true },
    };
  }

  if (operationKind === 'generateCombinations') {
    return {
      outcome: 'error',
      schemaMessage,
      statusMessage: 'Combination generation failed.',
      statusOptions: { severity: 'error', dismissable: true },
    };
  }

  if (operationKind === 'amendRows') {
    return {
      outcome: 'error',
      schemaMessage,
      statusMessage: 'Amend failed.',
      statusOptions: { severity: 'error', dismissable: true },
    };
  }

  return {
    outcome: 'error',
    schemaMessage,
    statusMessage: 'Schema validation failed.',
    statusOptions: { severity: 'error', dismissable: true },
  };
}

export { presentUiGenerationResult, presentUiGenerationNotice };
