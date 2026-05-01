function convertStringToRubyValidName(aString) {
  let result = String(aString).replace(/[^A-Za-z0-9_]/g, '_');
  if (/^[0-9]/.test(result)) {
    result = '_' + result;
  }
  return result;
}

function toSnakeCase(value) {
  return String(value)
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[^A-Za-z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
}

function isNumericValue(value) {
  if (value === '' || value === null || value === undefined) {
    return false;
  }
  return !isNaN(value) && !isNaN(parseFloat(value));
}

class RubyConvertorOptions {
  constructor() {
    this.delimiterMappings = {
      tab: '\t',
      space: ' ',
    };

    this.options = {
      collectionType: 'array',
      assignToVariable: true,
      variableName: 'data',
      outputWrapper: 'plain',
      quoteNumbers: false,
      hashKeyStyle: 'string',
      useAnonymousObjects: true,
      objectClassName: 'Row',
      objectRepresentation: 'class',
      fieldNameStyle: 'preserve',
      prettyPrint: true,
      prettyPrintDelimiter: '  ',
      hashPrettyStyle: 'compact',
    };
  }

  mergeOptions(newoptions) {
    const src = newoptions.options !== undefined ? newoptions.options : newoptions;
    this.options = { ...this.options, ...src };
  }
}

class RubyConvertor {
  constructor(options) {
    this.config = new RubyConvertorOptions();
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

  _buildHashPairs(headers, row) {
    return headers.map((header, index) => {
      if (this.config.options.hashKeyStyle === 'symbol') {
        return `${header}: ${this._formatValue(row[index])}`;
      }
      return `${this._quote(header)} => ${this._formatValue(row[index])}`;
    });
  }

  _buildAnonymousRow(headers, row) {
    const pairs = this._buildHashPairs(headers, row);
    const aligned = this.config.options.hashPrettyStyle === 'aligned' && this.config.options.prettyPrint;
    const hash = aligned
      ? `{\n${this._indent(2)}${pairs.join(`,\n${this._indent(2)}`)},\n${this._indent(1)}}`
      : `{ ${pairs.join(', ')} }`;
    if (!this.config.options.prettyPrint) {
      return hash;
    }
    return `${this._indent(1)}${hash}`;
  }

  _buildObjectRow(headers, row, className) {
    const args = headers.map((header, index) => `${header}: ${this._formatValue(row[index])}`);
    if (!this.config.options.prettyPrint) {
      return `${className}.new(${args.join(', ')})`;
    }
    return `${this._indent(1)}${className}.new(${args.join(', ')})`;
  }

  _buildStructRow(headers, row, className) {
    const args = headers.map((header, index) => `${header}: ${this._formatValue(row[index])}`);
    if (!this.config.options.prettyPrint) {
      return `${className}.new(${args.join(', ')})`;
    }
    return `${this._indent(1)}${className}.new(${args.join(', ')})`;
  }

  _buildClassDefinition(headers, className) {
    const lines = [];
    lines.push(`class ${className}`);
    lines.push(`${this._indent(1)}attr_accessor ${headers.map((h) => `:${h}`).join(', ')}`);
    lines.push('');
    lines.push(`${this._indent(1)}def initialize(${headers.map((h) => `${h}:`).join(', ')})`);
    headers.forEach((header) => {
      lines.push(`${this._indent(2)}@${header} = ${header}`);
    });
    lines.push(`${this._indent(1)}end`);
    lines.push('end');
    lines.push('');
    return lines;
  }

  _buildStructDefinition(headers, className) {
    const definitionMethod = this.config.options.objectRepresentation === 'data' ? 'define' : 'new';
    const kind = this.config.options.objectRepresentation === 'data' ? 'Data' : 'Struct';
    return [`${className} = ${kind}.${definitionMethod}(${headers.map((h) => `:${h}`).join(', ')})`, ''];
  }

  _dedupeHeaders(headers) {
    const usedNames = new Set();
    return headers.map((h) => {
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
  }

  fromDataTable(dataTable) {
    const opts = this.config.options;
    const rawHeaders = dataTable.getHeaders();
    const sanitizedHeaders = rawHeaders.map((h) => {
      const base = opts.fieldNameStyle === 'snake_case' ? toSnakeCase(h) : String(h);
      return convertStringToRubyValidName(base);
    });
    const headers = this._dedupeHeaders(sanitizedHeaders);
    const objectHeaders = this._dedupeHeaders(rawHeaders.map((h) => convertStringToRubyValidName(toSnakeCase(h))));

    const variableName = convertStringToRubyValidName(opts.variableName || 'data');
    const objectClassName = convertStringToRubyValidName(opts.objectClassName || 'Row');

    const rows = [];
    for (let rowIndex = 0; rowIndex < dataTable.getRowCount(); rowIndex++) {
      const row = dataTable.getRow(rowIndex);
      if (opts.useAnonymousObjects) {
        rows.push(this._buildAnonymousRow(headers, row));
      } else if (opts.objectRepresentation === 'struct' || opts.objectRepresentation === 'data') {
        rows.push(this._buildStructRow(objectHeaders, row, objectClassName));
      } else {
        rows.push(this._buildObjectRow(objectHeaders, row, objectClassName));
      }
    }

    const openCollection = opts.collectionType === 'list' ? 'Array[' : '[';
    const closeCollection = ']';
    const collectionText = this.config.options.prettyPrint ? rows.join(',\n') : rows.join(', ');

    const lines = [];
    if (!opts.useAnonymousObjects && opts.objectRepresentation === 'class') {
      lines.push(...this._buildClassDefinition(objectHeaders, objectClassName));
    } else if (
      !opts.useAnonymousObjects &&
      (opts.objectRepresentation === 'struct' || opts.objectRepresentation === 'data')
    ) {
      lines.push(...this._buildStructDefinition(objectHeaders, objectClassName));
    }

    const prefix =
      opts.outputWrapper === 'rspec-let'
        ? `let(:${variableName}) do`
        : opts.assignToVariable
          ? `${variableName} = `
          : '';

    if (opts.prettyPrint) {
      if (opts.outputWrapper === 'rspec-let') {
        lines.push(prefix);
        lines.push(`${this._indent(1)}${openCollection}`);
      } else {
        lines.push(`${prefix}${openCollection}`);
      }
      if (rows.length > 0) {
        lines.push(`${opts.outputWrapper === 'rspec-let' ? this._indent(1) : ''}${collectionText},`);
      }
      lines.push(`${opts.outputWrapper === 'rspec-let' ? this._indent(1) : ''}${closeCollection}`);
      if (opts.outputWrapper === 'rspec-let') {
        lines.push('end');
      }
      return lines.join('\n');
    }

    if (opts.outputWrapper === 'rspec-let') {
      lines.push(`let(:${variableName}) do ${openCollection}${collectionText}${closeCollection} end`);
    } else {
      lines.push(`${prefix}${openCollection}${collectionText}${closeCollection}`);
    }
    return lines.join('\n');
  }
}

export { RubyConvertor, RubyConvertorOptions };
