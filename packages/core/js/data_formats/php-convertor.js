function convertStringToPhpValidName(aString) {
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

class PhpConvertorOptions {
  constructor() {
    this.delimiterMappings = {
      tab: '\t',
      space: ' ',
    };

    this.options = {
      includePhpTag: false,
      collectionType: 'array',
      preferShortArraySyntax: false,
      assignToVariable: true,
      variableName: 'data',
      quoteNumbers: false,
      objectRepresentation: 'array',
      objectClassName: 'Row',
      arrayKeyQuoteStyle: 'quoted',
      blankValueBehavior: 'empty-string',
      coerceBooleanLiterals: false,
      coerceNullLiteral: false,
      phpCompatibility: '8+',
      classPropertyTyping: 'none',
      useConstructorPromotion: false,
      constructorArgStyle: 'positional',
      prettyPrint: true,
      prettyPrintDelimiter: '    ',
    };
  }

  mergeOptions(newoptions) {
    const src = newoptions.options !== undefined ? newoptions.options : newoptions;
    this.options = { ...this.options, ...src };
  }
}

class PhpConvertor {
  constructor(options) {
    this.config = new PhpConvertorOptions();
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
      return this.config.options.blankValueBehavior === 'null' ? 'null' : this._quote('');
    }

    const text = String(value).trim();
    if (this.config.options.coerceNullLiteral && text.toLowerCase() === 'null') {
      return 'null';
    }
    if (this.config.options.coerceBooleanLiterals) {
      if (text.toLowerCase() === 'true') {
        return 'true';
      }
      if (text.toLowerCase() === 'false') {
        return 'false';
      }
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

  _buildAssocArrayPairs(headers, row) {
    return headers.map((header, index) => {
      const key = this.config.options.arrayKeyQuoteStyle === 'unquoted' ? header : this._quote(header);
      return `${key} => ${this._formatValue(row[index])}`;
    });
  }

  _buildAnonymousRow(headers, row) {
    const pairs = this._buildAssocArrayPairs(headers, row);
    const useShort = this.config.options.preferShortArraySyntax || this.config.options.collectionType === 'list';
    if (!this.config.options.prettyPrint) {
      if (useShort) {
        return `[${pairs.join(', ')}]`;
      }
      return `array(${pairs.join(', ')})`;
    }

    if (useShort) {
      return `${this._indent(1)}[${pairs.join(', ')}]`;
    }
    return `${this._indent(1)}array(${pairs.join(', ')})`;
  }

  _buildStdClassRow(headers, row) {
    const pairs = this._buildAssocArrayPairs(headers, row);
    const useShort = this.config.options.preferShortArraySyntax || this.config.options.collectionType === 'list';
    const inner = useShort ? `[${pairs.join(', ')}]` : `array(${pairs.join(', ')})`;
    if (!this.config.options.prettyPrint) {
      return `(object)${inner}`;
    }
    return `${this._indent(1)}(object)${inner}`;
  }

  _buildObjectRow(args, className) {
    if (!this.config.options.prettyPrint) {
      return `new ${className}(${args.join(', ')})`;
    }
    return `${this._indent(1)}new ${className}(${args.join(', ')})`;
  }

  _buildClassDefinition(headers, className) {
    const lines = [];
    lines.push(`class ${className} {`);
    const typedProps = this.config.options.classPropertyTyping === 'typed';
    const canType = typedProps && this.config.options.phpCompatibility === '8+';
    const usePromotion = this.config.options.useConstructorPromotion && this.config.options.phpCompatibility === '8+';
    const constructorParams = headers
      .map((h) => {
        if (!usePromotion) {
          return `$${h}`;
        }
        if (!canType) {
          return `public $${h}`;
        }
        return `public mixed $${h}`;
      })
      .join(', ');

    if (!usePromotion) {
      headers.forEach((header) => {
        const propDecl = canType ? 'public mixed' : 'public';
        lines.push(`${this._indent(1)}${propDecl} $${header};`);
      });
      lines.push('');
    }
    lines.push(`${this._indent(1)}public function __construct(${constructorParams}) {`);
    if (!usePromotion) {
      headers.forEach((header) => {
        lines.push(`${this._indent(2)}$this->${header} = $${header};`);
      });
    }
    lines.push(`${this._indent(1)}}`);
    lines.push('}');
    lines.push('');
    return lines;
  }

  fromDataTable(dataTable) {
    const opts = this.config.options;
    const rawHeaders = dataTable.getHeaders();
    const sanitizedHeaders = rawHeaders.map((h) => convertStringToPhpValidName(h));
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

    const variableName = convertStringToPhpValidName(opts.variableName || 'data');
    const objectClassName = convertStringToPhpValidName(opts.objectClassName || 'Row');
    const prefix = opts.assignToVariable ? `$${variableName} = ` : '';
    const useShortOuter = opts.preferShortArraySyntax || opts.collectionType === 'list';

    const rows = [];
    for (let rowIndex = 0; rowIndex < dataTable.getRowCount(); rowIndex++) {
      const row = dataTable.getRow(rowIndex);
      if (
        opts.objectRepresentation === 'array' ||
        (opts.objectRepresentation === undefined && opts.useAnonymousObjects)
      ) {
        rows.push(this._buildAnonymousRow(headers, row));
      } else if (opts.objectRepresentation === 'stdclass') {
        rows.push(this._buildStdClassRow(headers, row));
      } else {
        const args =
          opts.constructorArgStyle === 'named' && opts.phpCompatibility === '8+'
            ? headers.map((h, i) => `${h}: ${this._formatValue(row[i])}`)
            : headers.map((h, i) => `${this._formatValue(row[i])}`);
        rows.push(this._buildObjectRow(args, objectClassName));
      }
    }

    const openBracket = useShortOuter ? '[' : 'array(';
    const closeBracket = useShortOuter ? ']' : ')';

    const lines = [];
    if (opts.includePhpTag) {
      lines.push('<?php', '');
    }
    if (opts.objectRepresentation === 'class' || (!opts.objectRepresentation && opts.useAnonymousObjects === false)) {
      lines.push(...this._buildClassDefinition(headers, objectClassName));
    }

    if (opts.prettyPrint) {
      lines.push(`${prefix}${openBracket}`);
      if (rows.length > 0) {
        lines.push(`${rows.join(',\n')},`);
      }
      lines.push(`${closeBracket};`);
      return lines.join('\n');
    }

    const compactRows = rows.join(', ');
    lines.push(`${prefix}${openBracket}${compactRows}${closeBracket};`);
    return lines.join('\n');
  }
}

export { PhpConvertor, PhpConvertorOptions };
