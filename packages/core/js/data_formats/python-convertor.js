function convertStringToPythonValidName(aString) {
  let result = String(aString).replace(/[^A-Za-z0-9_]/g, '_');
  if (/^[0-9]/.test(result)) {
    result = '_' + result;
  }
  return result;
}

function isNumericValue(value) {
  if (value === '' || value === null || value === undefined) {
    return false;
  }
  return !isNaN(value) && !isNaN(parseFloat(value));
}

function looksLikeDecimal(value) {
  if (value === '' || value === null || value === undefined) {
    return false;
  }
  return /^-?\d+\.\d+$/.test(String(value).trim());
}

function looksLikeInteger(value) {
  if (value === '' || value === null || value === undefined) {
    return false;
  }
  return /^-?\d+$/.test(String(value).trim());
}

class PythonConvertorOptions {
  constructor() {
    this.delimiterMappings = {
      tab: '\t',
      space: ' ',
    };

    this.options = {
      // 'list' | 'tuple'
      collectionType: 'list',
      // wrap output in a variable assignment
      assignToVariable: true,
      variableName: 'data',
      // false = numbers emitted as numeric literals; true = always quoted strings
      quoteNumbers: false,
      // true = list of plain dicts; false = list of class instances
      useAnonymousDicts: true,
      // class name used when useAnonymousDicts is false
      objectClassName: 'Row',
      // when true, decimal-looking values become Decimal("12.34")
      useDecimalType: false,
      // comma-separated list of column names that should be Decimal candidates
      decimalColumnsCsv: '',
      // when true, integer-like values in decimal-scoped columns also become Decimal("5")
      decimalTreatIntegersAsDecimal: false,
      // 'none' or 'empty-string' for blank values
      blankValueBehavior: 'empty-string',
      // 'single' or 'double' quote style for strings and keys
      quoteStyle: 'double',
      // include import statements at top of output
      includeImports: false,
      // newline separated import statements
      importStatements: '',
      // pretty print with line breaks and indentation
      prettyPrint: true,
      // indent character(s) used when prettyPrint is enabled
      prettyPrintDelimiter: '    ',
    };
  }

  mergeOptions(newoptions) {
    const src = newoptions.options !== undefined ? newoptions.options : newoptions;
    this.options = { ...this.options, ...src };
  }
}

class PythonConvertor {
  constructor(options) {
    this.config = new PythonConvertorOptions();
    this.usedDecimal = false;
    if (options) {
      this.setOptions(options);
    }
  }

  setOptions(newOptions) {
    this.config.mergeOptions(newOptions);
  }

  _quoteChar() {
    return this.config.options.quoteStyle === 'single' ? "'" : '"';
  }

  _escapeForQuoteStyle(textValue) {
    const quote = this._quoteChar();
    let escaped = String(textValue).replace(/\\/g, '\\\\');
    escaped = escaped.replace(/\n/g, '\\n');
    escaped = escaped.replace(/\r/g, '\\r');
    escaped = escaped.replace(/\t/g, '\\t');
    if (quote === "'") {
      escaped = escaped.replace(/'/g, "\\'");
    } else {
      escaped = escaped.replace(/"/g, '\\"');
    }
    return escaped;
  }

  _quote(textValue) {
    const quote = this._quoteChar();
    return `${quote}${this._escapeForQuoteStyle(textValue)}${quote}`;
  }

  _getDecimalColumnNamesSet(rawHeaders) {
    const configuredColumns = String(this.config.options.decimalColumnsCsv || '')
      .split(',')
      .map((value) => value.trim().toLowerCase())
      .filter((value) => value.length > 0);

    if (configuredColumns.length === 0) {
      return null;
    }

    const names = new Set(configuredColumns);
    // Allow matching by original header names and Python-safe converted header names.
    (rawHeaders || []).forEach((header) => {
      const raw = String(header || '')
        .trim()
        .toLowerCase();
      const converted = convertStringToPythonValidName(header).toLowerCase();
      if (raw.length > 0 && names.has(raw)) {
        names.add(converted);
      }
      if (converted.length > 0 && names.has(converted)) {
        names.add(raw);
      }
    });

    return names;
  }

  _shouldTreatAsDecimal(rawHeaderName, convertedHeaderName) {
    if (!this.config.options.useDecimalType || this.config.options.quoteNumbers) {
      return false;
    }

    const configuredSet = this.decimalColumnNamesSet;
    if (configuredSet === null) {
      return true;
    }

    const raw = String(rawHeaderName || '')
      .trim()
      .toLowerCase();
    const converted = String(convertedHeaderName || '')
      .trim()
      .toLowerCase();
    return configuredSet.has(raw) || configuredSet.has(converted);
  }

  _formatValue(value, rawHeaderName, convertedHeaderName) {
    const options = this.config.options;
    if (value === '' || value === null || value === undefined) {
      if (options.blankValueBehavior === 'none') {
        return 'None';
      }
      return this._quote('');
    }

    if (this._shouldTreatAsDecimal(rawHeaderName, convertedHeaderName)) {
      const shouldUseDecimal =
        looksLikeDecimal(value) || (options.decimalTreatIntegersAsDecimal && looksLikeInteger(value));
      if (shouldUseDecimal) {
        this.usedDecimal = true;
        return `Decimal(${this._quote(String(value).trim())})`;
      }
    }

    if (!options.quoteNumbers && isNumericValue(value)) {
      return String(value);
    }

    return this._quote(value);
  }

  _buildImportLines() {
    const importLines = [];
    const configuredImports = String(this.config.options.importStatements || '')
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (this.config.options.includeImports) {
      configuredImports.forEach((line) => {
        importLines.push(line);
      });
    }

    if (this.usedDecimal && !importLines.includes('from decimal import Decimal')) {
      importLines.unshift('from decimal import Decimal');
    }

    return importLines;
  }

  _joinRows(rows) {
    if (this.config.options.prettyPrint) {
      return rows.join(',\n');
    }
    return rows.join(', ');
  }

  _indent(level) {
    if (!this.config.options.prettyPrint) {
      return '';
    }
    let unit = this.config.options.prettyPrintDelimiter ?? '    ';
    // Python indentation must be whitespace; fall back to spaces for invalid custom values.
    if (!/^\s+$/.test(String(unit))) {
      unit = '    ';
    }
    return String(unit).repeat(level);
  }

  fromDataTable(dataTable) {
    const opts = this.config.options;
    const rawHeaders = dataTable.getHeaders();
    const sanitizedHeaders = rawHeaders.map((h) => convertStringToPythonValidName(h));
    // De-duplicate sanitized header names by suffixing with _2, _3, ...
    const usedNames = new Set();
    const headers = sanitizedHeaders.map((h) => {
      if (!usedNames.has(h)) {
        usedNames.add(h);
        return h;
      }
      let counter = 2;
      let candidate = `${h}_${counter}`;
      while (usedNames.has(candidate)) {
        counter++;
        candidate = `${h}_${counter}`;
      }
      usedNames.add(candidate);
      return candidate;
    });
    // Sanitize user-provided identifier names to ensure valid Python identifiers.
    const variableName = convertStringToPythonValidName(opts.variableName || 'data');
    const objectClassName = convertStringToPythonValidName(opts.objectClassName || 'Row');
    this.usedDecimal = false;
    this.decimalColumnNamesSet = this._getDecimalColumnNamesSet(rawHeaders);

    const quote = this._quoteChar();
    const lines = [];
    const collectionRows = [];
    const classIndent = '    ';
    const classNestedIndent = '        ';

    if (!opts.useAnonymousDicts) {
      lines.push(`class ${objectClassName}:`);
      lines.push(`${classIndent}def __init__(self, ${headers.join(', ')}):`);
      headers.forEach((h) => {
        lines.push(`${classNestedIndent}self.${h} = ${h}`);
      });
      lines.push('');
    }

    const openBracket = opts.collectionType === 'tuple' ? '(' : '[';
    const closeBracket = opts.collectionType === 'tuple' ? ')' : ']';
    const prefix = opts.assignToVariable ? `${variableName} = ` : '';

    for (let rowIndex = 0; rowIndex < dataTable.getRowCount(); rowIndex++) {
      const row = dataTable.getRow(rowIndex);
      if (opts.useAnonymousDicts) {
        const pairs = headers.map(
          (h, i) => `${quote}${this._escapeForQuoteStyle(h)}${quote}: ${this._formatValue(row[i], rawHeaders[i], h)}`
        );
        if (opts.prettyPrint) {
          collectionRows.push(`${this._indent(1)}{${pairs.join(', ')}}`);
        } else {
          collectionRows.push(`{${pairs.join(', ')}}`);
        }
      } else {
        const pairs = headers.map((h, i) => `${h}=${this._formatValue(row[i], rawHeaders[i], h)}`);
        if (opts.prettyPrint) {
          collectionRows.push(`${this._indent(1)}${objectClassName}(${pairs.join(', ')})`);
        } else {
          collectionRows.push(`${objectClassName}(${pairs.join(', ')})`);
        }
      }
    }

    const importLines = this._buildImportLines();
    if (importLines.length > 0) {
      lines.unshift(...importLines, '');
    }

    if (opts.prettyPrint) {
      lines.push(`${prefix}${openBracket}`);
      if (collectionRows.length > 0) {
        lines.push(`${this._joinRows(collectionRows)},`);
      }
      lines.push(`${closeBracket}`);
      return lines.join('\n');
    }

    const compactRows = this._joinRows(collectionRows);
    const compactCollection =
      opts.collectionType === 'tuple' && collectionRows.length === 1
        ? `${openBracket}${compactRows},${closeBracket}`
        : `${openBracket}${compactRows}${closeBracket}`;
    lines.push(`${prefix}${compactCollection}`);
    return lines.join('\n');
  }
}

export { PythonConvertor, PythonConvertorOptions };
