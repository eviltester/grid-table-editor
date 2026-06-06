import { schemaErrorsToText } from '../../shared/test-data/schema/schema-error-text.js';
import { syncGeneratorSchemaRowsFromTextMode } from './generator-schema-sync.js';

function createGeneratorSchemaRuntimeBridge({
  getSchemaDefinition,
  getSchemaRows,
  getSchemaTextTokens,
  validateSchemaRows,
  showSchemaErrorStatus,
  clearSchemaErrorStatus,
  setGenerationStatus,
  scheduleClearGenerationStatus,
} = {}) {
  return {
    showSchemaErrorStatus(message) {
      showSchemaErrorStatus?.(message);
    },

    clearSchemaErrorStatus() {
      clearSchemaErrorStatus?.();
    },

    surfacePageError(message, { useSchemaStatus = false } = {}) {
      const text = String(message || '').trim();
      if (!text) {
        return;
      }
      if (useSchemaStatus) {
        showSchemaErrorStatus?.(text);
        return;
      }
      setGenerationStatus?.(text, { severity: 'error', dismissable: true });
      scheduleClearGenerationStatus?.(5000);
    },

    revalidateSchemaRows() {
      const schemaDefinition = getSchemaDefinition?.();
      if (schemaDefinition?.validateRows) {
        return schemaDefinition.validateRows() || { rows: getSchemaRows?.() || [], errors: [] };
      }
      const rows = getSchemaRows?.() || [];
      if (rows.length === 0) {
        return { rows: [], errors: [] };
      }
      return validateSchemaRows?.(rows) || { rows, errors: [] };
    },

    syncSchemaRowsFromTextMode({ showErrors = false, applySemanticValidation = true } = {}) {
      return syncGeneratorSchemaRowsFromTextMode({
        schemaDefinition: getSchemaDefinition?.(),
        getSchemaRows,
        getSchemaTextTokens,
        revalidateSchemaRows: () => this.revalidateSchemaRows(),
        surfaceSchemaError: (message) => this.surfacePageError(message, { useSchemaStatus: true }),
        formatSchemaErrors: (errors) => schemaErrorsToText(errors),
        showErrors,
        applySemanticValidation,
      });
    },

    toggleSchemaEditMode() {
      const toggleResult = getSchemaDefinition?.()?.toggleMode?.();
      if (toggleResult?.errors?.length > 0) {
        showSchemaErrorStatus?.(schemaErrorsToText(toggleResult.errors));
      }
      return toggleResult;
    },
  };
}

export { createGeneratorSchemaRuntimeBridge };
