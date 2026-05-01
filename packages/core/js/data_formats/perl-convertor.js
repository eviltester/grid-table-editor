function convertStringToPerlValidName(aString) {
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

class PerlConvertorOptions {
  constructor() {
    this.delimiterMappings = {
      tab: '\t',
      space: ' ',
    };

    this.options = {
      collectionType: 'array',
      assignToVariable: true,
      variableName: 'data',
      quoteNumbers: false,
      hashKeyStyle: 'quoted',
      useAnonymousObjects: true,
      objectClassName: 'Row',
      objectInstantiationStyle: 'bless',
      prettyPrint: true,
      prettyPrintDelimiter: '  ',
    };
  }

  mergeOptions(newoptions) {
    const src = newoptions.options !== undefined ? newoptions.options : newoptions;
    this.options = { ...this.options, ...src };
  }
}

class PerlConvertor {
  constructor(options) {
    this.config = new PerlConvertorOptions();
    if (options) {
      this.setOptions(options);
    }
  }

  setOptions(newOptions) {
    this.config.mergeOptions(newOptions);
  }

  _quote(textValue) {
    let escaped = String(textValue).replace(/\\/g, '\\\\');
    escaped = escaped.replace(/'/g, "\\'");
    escaped = escaped.replace(/\n/g, '\\n');
    escaped = escaped.replace(/\r/g, '\\r');
    escaped = escaped.replace(/\t/g, '\\t');
    return `'${escaped}'`;
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
    const unit = this.config.options.prettyPrintDelimiter ?? '  ';
    return String(unit).repeat(level);
  }

  _buildAnonymousRow(headers, row) {
    const pairs = headers.map((header, index) => `${this._formatHashKey(header)} => ${this._formatValue(row[index])}`);
    if (!this.config.options.prettyPrint) {
      return `{ ${pairs.join(', ')} }`;
    }
    return `${this._indent(1)}{ ${pairs.join(', ')} }`;
  }

  _buildObjectRow(headers, row, className) {
    const pairs = headers.map((header, index) => `${header} => ${this._formatValue(row[index])}`);
    if (this.config.options.objectInstantiationStyle === 'constructor') {
      if (!this.config.options.prettyPrint) {
        return `${className}->new({ ${pairs.join(', ')} })`;
      }
      return `${this._indent(1)}${className}->new({ ${pairs.join(', ')} })`;
    }
    if (!this.config.options.prettyPrint) {
      return `bless({ ${pairs.join(', ')} }, '${className}')`;
    }
    return `${this._indent(1)}bless({ ${pairs.join(', ')} }, '${className}')`;
  }

  _formatHashKey(header) {
    if (this.config.options.hashKeyStyle === 'bareword') {
      return header;
    }
    return this._quote(header);
  }

  fromDataTable(dataTable) {
    const opts = this.config.options;
    const rawHeaders = dataTable.getHeaders();
    const sanitizedHeaders = rawHeaders.map((h) => convertStringToPerlValidName(h));
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

    const variableName = convertStringToPerlValidName(opts.variableName || 'data');
    const objectClassName = convertStringToPerlValidName(opts.objectClassName || 'Row');
    const variablePrefix = opts.collectionType === 'list' ? '@' : '$';

    const rows = [];
    for (let rowIndex = 0; rowIndex < dataTable.getRowCount(); rowIndex++) {
      const row = dataTable.getRow(rowIndex);
      if (opts.useAnonymousObjects) {
        rows.push(this._buildAnonymousRow(rawHeaders, row));
      } else {
        rows.push(this._buildObjectRow(headers, row, objectClassName));
      }
    }

    const openCollection = opts.collectionType === 'array' ? '[' : '(';
    const closeCollection = opts.collectionType === 'array' ? ']' : ')';
    const prefix = opts.assignToVariable ? `my ${variablePrefix}${variableName} = ${openCollection}` : openCollection;
    const suffix = ';';
    const lines = [];

    if (opts.prettyPrint) {
      lines.push(prefix);
      if (rows.length > 0) {
        lines.push(`${rows.join(',\n')},`);
      }
      lines.push(`${closeCollection}${suffix}`);
      return lines.join('\n');
    }

    lines.push(`${prefix}${rows.join(', ')}${closeCollection}${suffix}`);
    return lines.join('\n');
  }
}

export { PerlConvertor, PerlConvertorOptions };
