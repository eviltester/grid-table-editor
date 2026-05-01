function convertStringToKotlinValidName(aString) {
  let result = String(aString).replace(/[^A-Za-z0-9_]/g, '_');
  if (/^[0-9]/.test(result)) {
    result = '_' + result;
  }
  return result;
}

function convertToPascalCase(value) {
  const parts = String(value)
    .replace(/[^A-Za-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter((part) => part.length > 0);
  if (parts.length === 0) {
    return 'Row';
  }
  const pascal = parts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('');
  if (/^[0-9]/.test(pascal)) {
    return `Row${pascal}`;
  }
  return pascal;
}

const KOTLIN_RESERVED_WORDS = new Set([
  'as',
  'break',
  'class',
  'continue',
  'do',
  'else',
  'false',
  'for',
  'fun',
  'if',
  'in',
  'interface',
  'is',
  'null',
  'object',
  'package',
  'return',
  'super',
  'this',
  'throw',
  'true',
  'try',
  'typealias',
  'val',
  'var',
  'when',
  'while',
]);

function escapeKotlinIdentifier(identifier) {
  return KOTLIN_RESERVED_WORDS.has(identifier) ? `\`${identifier}\`` : identifier;
}

function isNumericValue(value) {
  if (value === '' || value === null || value === undefined) {
    return false;
  }
  return !isNaN(value) && !isNaN(parseFloat(value));
}

class KotlinConvertorOptions {
  constructor() {
    this.delimiterMappings = {
      tab: '\t',
      space: ' ',
    };

    this.options = {
      collectionType: 'list',
      assignToVariable: true,
      mutableAssignment: false,
      variableName: 'data',
      quoteNumbers: false,
      useAnonymousObjects: true,
      objectClassName: 'Row',
      useMutableCollections: false,
      prettyPrint: true,
      prettyPrintDelimiter: '    ',
      trailingComma: true,
    };
  }

  mergeOptions(newoptions) {
    const src = newoptions.options !== undefined ? newoptions.options : newoptions;
    this.options = { ...this.options, ...src };
  }
}

class KotlinConvertor {
  constructor(options) {
    this.config = new KotlinConvertorOptions();
    if (options) {
      this.setOptions(options);
    }
  }

  setOptions(newOptions) {
    this.config.mergeOptions(newOptions);
  }

  _quote(textValue) {
    let escaped = String(textValue).replace(/\\/g, '\\\\');
    escaped = escaped.replace(/"/g, '\\"');
    escaped = escaped.replace(/\n/g, '\\n');
    escaped = escaped.replace(/\r/g, '\\r');
    escaped = escaped.replace(/\t/g, '\\t');
    return `"${escaped}"`;
  }

  _formatValue(value) {
    if (value === '' || value === null || value === undefined) {
      return this._quote('');
    }
    if (!this.config.options.quoteNumbers && isNumericValue(value)) {
      return String(value);
    }
    return this._quote(value);
  }

  _indent(level) {
    if (!this.config.options.prettyPrint) {
      return '';
    }
    const unit = this.config.options.prettyPrintDelimiter ?? '    ';
    return String(unit).repeat(level);
  }

  _buildMapPairs(headers, row) {
    return headers.map((header, index) => `${this._quote(header)} to ${this._formatValue(row[index])}`);
  }

  _buildAnonymousRow(headers, row) {
    const pairs = this._buildMapPairs(headers, row);
    const mapFunction = this.config.options.useMutableCollections ? 'mutableMapOf' : 'mapOf';
    if (!this.config.options.prettyPrint) {
      return `${mapFunction}(${pairs.join(', ')})`;
    }
    return `${this._indent(1)}${mapFunction}(${pairs.join(', ')})`;
  }

  _buildObjectRow(headers, row, className) {
    const args = headers.map((header, index) => `${escapeKotlinIdentifier(header)} = ${this._formatValue(row[index])}`);
    if (!this.config.options.prettyPrint) {
      return `${className}(${args.join(', ')})`;
    }
    return `${this._indent(1)}${className}(${args.join(', ')})`;
  }

  _buildClassDefinition(headers, className) {
    return [`data class ${className}(${headers.map((h) => `val ${escapeKotlinIdentifier(h)}: Any`).join(', ')})`, ''];
  }

  fromDataTable(dataTable) {
    const opts = this.config.options;
    const rawHeaders = dataTable.getHeaders();
    const sanitizedHeaders = rawHeaders.map((h) => convertStringToKotlinValidName(h));
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

    const variableName = convertStringToKotlinValidName(opts.variableName || 'data');
    const objectClassName = convertToPascalCase(opts.objectClassName || 'Row');

    const rows = [];
    for (let rowIndex = 0; rowIndex < dataTable.getRowCount(); rowIndex++) {
      const row = dataTable.getRow(rowIndex);
      if (opts.useAnonymousObjects) {
        rows.push(this._buildAnonymousRow(headers, row));
      } else {
        rows.push(this._buildObjectRow(headers, row, objectClassName));
      }
    }

    const openCollection =
      opts.collectionType === 'array' ? 'arrayOf(' : opts.useMutableCollections ? 'mutableListOf(' : 'listOf(';
    const closeCollection = ')';
    const declarationKeyword = opts.mutableAssignment ? 'var' : 'val';
    const prefix = opts.assignToVariable ? `${declarationKeyword} ${escapeKotlinIdentifier(variableName)} = ` : '';
    const lines = [];

    if (!opts.useAnonymousObjects) {
      lines.push(...this._buildClassDefinition(headers, objectClassName));
    }

    if (opts.prettyPrint) {
      lines.push(`${prefix}${openCollection}`);
      if (rows.length > 0) {
        const trailing = opts.trailingComma ? ',' : '';
        lines.push(`${rows.join(',\n')}${trailing}`);
      }
      lines.push(closeCollection);
      return lines.join('\n');
    }

    lines.push(`${prefix}${openCollection}${rows.join(', ')}${closeCollection}`);
    return lines.join('\n');
  }
}

export { KotlinConvertor, KotlinConvertorOptions };
