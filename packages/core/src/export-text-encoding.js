const EXPORT_LINE_ENDINGS = Object.freeze({
  lf: 'lf',
  crlf: 'crlf',
});

function normalizePlatformToken(platform) {
  return String(platform || '')
    .trim()
    .toLowerCase();
}

function resolveDefaultLineEndingForPlatform(platform) {
  const normalizedPlatform = normalizePlatformToken(platform);
  const isWindowsPlatform = normalizedPlatform.startsWith('win') || normalizedPlatform.includes('windows');
  return isWindowsPlatform ? EXPORT_LINE_ENDINGS.crlf : EXPORT_LINE_ENDINGS.lf;
}

function resolveExportTextEncodingSettings(settings = {}, { platform } = {}) {
  const requestedLineEnding = normalizePlatformToken(settings.lineEnding);
  return {
    lineEnding:
      requestedLineEnding === EXPORT_LINE_ENDINGS.crlf || requestedLineEnding === EXPORT_LINE_ENDINGS.lf
        ? requestedLineEnding
        : resolveDefaultLineEndingForPlatform(platform),
    includeBom: settings.includeBom === true,
  };
}

function normalizeTextForLineEnding(text, lineEnding) {
  const normalizedText = String(text ?? '').replace(/\r\n?/g, '\n');
  if (lineEnding === EXPORT_LINE_ENDINGS.crlf) {
    return normalizedText.replace(/\n/g, '\r\n');
  }
  return normalizedText;
}

function applyExportTextEncoding(text, settings = {}, { platform } = {}) {
  const resolvedSettings = resolveExportTextEncodingSettings(settings, { platform });
  const normalizedText = normalizeTextForLineEnding(
    String(text ?? '').replace(/^\uFEFF/, ''),
    resolvedSettings.lineEnding
  );
  return resolvedSettings.includeBom ? `\uFEFF${normalizedText}` : normalizedText;
}

export {
  EXPORT_LINE_ENDINGS,
  applyExportTextEncoding,
  normalizeTextForLineEnding,
  resolveDefaultLineEndingForPlatform,
  resolveExportTextEncodingSettings,
};
