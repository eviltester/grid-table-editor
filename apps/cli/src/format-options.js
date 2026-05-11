import { normalizeFormat, sanitizeOptionsForFormat, SUPPORTED_FORMATS } from '@anywaydata/core';

export function normalizeAndValidateFormat(format) {
  const normalizedFormat = normalizeFormat(format);
  return {
    format: normalizedFormat,
    isSupported: SUPPORTED_FORMATS.includes(normalizedFormat),
  };
}

export function sanitizeCliOptionsForFormat(format, options) {
  return sanitizeOptionsForFormat(format, options || {});
}
