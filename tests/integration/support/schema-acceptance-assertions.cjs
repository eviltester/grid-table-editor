function toErrorParts(error) {
  if (error && typeof error === 'object') {
    return {
      code: typeof error.code === 'string' ? error.code : '',
      text: String(error.message || error.error || JSON.stringify(error)),
    };
  }
  return {
    code: '',
    text: String(error || ''),
  };
}

function toObjectRows(parsedRows, expectedHeaders) {
  return parsedRows.map((row) => expectedHeaders.map((header) => normalizeCellValue(row?.[header])));
}

function normalizeCellValue(value) {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
}

function inferObjectRowHeaders(parsedRows, fallbackHeaders = []) {
  const discoveredHeaders = [];
  for (const row of parsedRows) {
    if (!row || typeof row !== 'object' || Array.isArray(row)) {
      continue;
    }
    for (const key of Object.keys(row)) {
      if (!discoveredHeaders.includes(key)) {
        discoveredHeaders.push(String(key));
      }
    }
  }
  return discoveredHeaders.length > 0 ? discoveredHeaders : fallbackHeaders.map(String);
}

function normalizeApiBody(body) {
  if (body?.headers && body?.rows) {
    return {
      ok: true,
      headers: body.headers.map(String),
      rows: body.rows.map((row) => row.map(normalizeCellValue)),
      format: body.format || 'json',
      rendered: typeof body.rendered === 'string' ? body.rendered : '',
      diagnostics: body.diagnostics || {},
    };
  }

  const parts = Array.isArray(body?.errors) ? body.errors.map(toErrorParts) : [];
  return {
    ok: false,
    errorCodes: parts.map((part) => part.code).filter(Boolean),
    errorTexts: parts.map((part) => part.text),
    diagnostics: body?.diagnostics || {},
  };
}

function normalizeMcpPayload(payload) {
  if (payload?.ok === true && Array.isArray(payload.rows) && Array.isArray(payload.headers)) {
    return {
      ok: true,
      headers: payload.headers.map(String),
      rows: payload.rows.map((row) => row.map(normalizeCellValue)),
      format: payload.format || 'json',
      rendered: typeof payload.rendered === 'string' ? payload.rendered : '',
      diagnostics: payload.diagnostics || {},
    };
  }

  const detailErrors = Array.isArray(payload?.error?.details?.errors) ? payload.error.details.errors : [];
  const parts = detailErrors.length > 0 ? detailErrors.map(toErrorParts) : [toErrorParts(payload?.error)];
  return {
    ok: false,
    errorCodes: parts.map((part) => part.code).filter(Boolean),
    errorTexts: parts.map((part) => part.text),
    diagnostics: payload?.error?.details?.diagnostics || {},
  };
}

function normalizeCliSuccess(stdoutText, fallbackHeaders = []) {
  const parsed = JSON.parse(stdoutText.trim());
  const headers = inferObjectRowHeaders(parsed, fallbackHeaders);
  return {
    ok: true,
    headers,
    rows: toObjectRows(parsed, headers),
    format: 'json',
    rendered: stdoutText.trim(),
    diagnostics: {},
  };
}

function normalizeCliFailure(stderrText) {
  const parts = String(stderrText)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^\[([^\]]+)\]\s*(.*)$/);
      return {
        code: match ? match[1] : '',
        text: match ? match[2] : line,
      };
    });

  return {
    ok: false,
    errorCodes: parts.map((part) => part.code).filter(Boolean),
    errorTexts: parts.map((part) => part.text),
    diagnostics: {},
  };
}

function normalizeUiGridResult({ headers, rows }) {
  return {
    ok: true,
    headers: headers.map(String),
    rows: rows.map((row) => row.map(normalizeCellValue)),
    format: 'json',
    rendered: '',
    diagnostics: {},
  };
}

function normalizeUiDownloadedJson(text, fallbackHeaders = []) {
  const parsed = JSON.parse(text);
  const headers = inferObjectRowHeaders(parsed, fallbackHeaders);
  return {
    ok: true,
    headers,
    rows: toObjectRows(parsed, headers),
    format: 'json',
    rendered: text,
    diagnostics: {},
  };
}

function normalizeUiErrorText(errorText, errorCodes = []) {
  return {
    ok: false,
    errorCodes: errorCodes.filter(Boolean),
    errorTexts: [String(errorText || '').trim()].filter(Boolean),
    diagnostics: {},
  };
}

module.exports = {
  normalizeApiBody,
  normalizeMcpPayload,
  normalizeCliSuccess,
  normalizeCliFailure,
  normalizeUiGridResult,
  normalizeUiDownloadedJson,
  normalizeUiErrorText,
};
