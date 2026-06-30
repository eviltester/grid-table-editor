/*
 * Responsibilities:
 * - Normalizes schema/parser error collections into user-readable text.
 */

const UNSAFE_FAKER_UI_HINT = "Configure in Test Data Settings 'allow unsafe faker'.";

function appendUnsafeFakerUiHint(message, reasonCode) {
  const text = String(message ?? '');
  if (reasonCode !== 'unsafe_faker_rule' || text.includes(UNSAFE_FAKER_UI_HINT)) {
    return text;
  }
  return `${text}. ${UNSAFE_FAKER_UI_HINT}`;
}

function schemaErrorsToText(errors = []) {
  return (Array.isArray(errors) ? errors : [])
    .map((error) => {
      if (error && typeof error === 'object' && typeof error.message === 'string') {
        return appendUnsafeFakerUiHint(error.message, error.reasonCode);
      }
      return String(error ?? '');
    })
    .join('\n');
}

export { UNSAFE_FAKER_UI_HINT, appendUnsafeFakerUiHint, schemaErrorsToText };
