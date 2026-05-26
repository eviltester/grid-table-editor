/*
 * Responsibilities:
 * - Normalizes schema/parser error collections into user-readable text.
 */

function schemaErrorsToText(errors = []) {
  return (Array.isArray(errors) ? errors : [])
    .map((error) => {
      if (error && typeof error === 'object' && typeof error.message === 'string') {
        return error.message;
      }
      return String(error ?? '');
    })
    .join('\n');
}

export { schemaErrorsToText };
