function convertStringToCSharpValidName(aString) {
  let result = String(aString).replace(/[^A-Za-z0-9_]/g, '_');
  if (/^[0-9]/.test(result)) {
    result = '_' + result;
  }
  return result;
}

const CSHARP_RESERVED_WORDS = new Set([
  'abstract',
  'as',
  'base',
  'bool',
  'break',
  'byte',
  'case',
  'catch',
  'char',
  'checked',
  'class',
  'const',
  'continue',
  'decimal',
  'default',
  'delegate',
  'do',
  'double',
  'else',
  'enum',
  'event',
  'explicit',
  'extern',
  'false',
  'finally',
  'fixed',
  'float',
  'for',
  'foreach',
  'goto',
  'if',
  'implicit',
  'in',
  'int',
  'interface',
  'internal',
  'is',
  'lock',
  'long',
  'namespace',
  'new',
  'null',
  'object',
  'operator',
  'out',
  'override',
  'params',
  'private',
  'protected',
  'public',
  'readonly',
  'ref',
  'return',
  'sbyte',
  'sealed',
  'short',
  'sizeof',
  'stackalloc',
  'static',
  'string',
  'struct',
  'switch',
  'this',
  'throw',
  'true',
  'try',
  'typeof',
  'uint',
  'ulong',
  'unchecked',
  'unsafe',
  'ushort',
  'using',
  'virtual',
  'void',
  'volatile',
  'while',
]);

function escapeCSharpIdentifier(identifier) {
  return CSHARP_RESERVED_WORDS.has(identifier) ? `@${identifier}` : identifier;
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

function isNumericValue(value) {
  if (value === '' || value === null || value === undefined) {
    return false;
  }
  return !isNaN(value) && !isNaN(parseFloat(value));
}

class CSharpConvertorOptions {
  constructor() {
    this.delimiterMappings = {
      tab: '\t',
      space: ' ',
    };

    this.options = {
      collectionType: 'list',
      collectionTargetType: '',
      assignToVariable: true,
      variableName: 'data',
      quoteNumbers: false,
      dictionaryValueType: 'auto',
      useAnonymousObjects: true,
      objectClassName: 'Row',
      prettyPrint: true,
      prettyPrintDelimiter: '    ',
    };
  }

  mergeOptions(newoptions) {
    const src = newoptions.options !== undefined ? newoptions.options : newoptions;
    this.options = { ...this.options, ...src };
  }
}

class CSharpConvertor {
  constructor(options) {
    this.config = new CSharpConvertorOptions();
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

  _buildAnonymousRow(headers, row) {
    const pairs = headers.map((header, index) => `{ ${this._quote(header)}, ${this._formatValue(row[index])} }`);
    const configuredType = this.config.options.dictionaryValueType || 'auto';
    const valueType =
      configuredType === 'string'
        ? 'string'
        : configuredType === 'object'
          ? 'object'
          : this.config.options.quoteNumbers
            ? 'string'
            : 'object';
    if (!this.config.options.prettyPrint) {
      return `new Dictionary<string, ${valueType}> { ${pairs.join(', ')} }`;
    }
    return `${this._indent(1)}new Dictionary<string, ${valueType}> { ${pairs.join(', ')} }`;
  }

  _buildObjectRow(headers, row, className) {
    const props = headers.map(
      (header, index) => `${escapeCSharpIdentifier(convertToPascalCase(header))} = ${this._formatValue(row[index])}`
    );
    if (!this.config.options.prettyPrint) {
      return `new ${className} { ${props.join(', ')} }`;
    }
    return `${this._indent(1)}new ${className} { ${props.join(', ')} }`;
  }

  _buildClassDefinition(headers, className) {
    const lines = [`public class ${className}`, '{'];
    headers.forEach((header) => {
      lines.push(
        `${this._indent(1)}public object ${escapeCSharpIdentifier(convertToPascalCase(header))} { get; set; }`
      );
    });
    lines.push('}');
    lines.push('');
    return lines;
  }

  fromDataTable(dataTable) {
    const opts = this.config.options;
    const rawHeaders = dataTable.getHeaders();
    const sanitizedHeaders = rawHeaders.map((h) => convertStringToCSharpValidName(h));
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

    const variableName = escapeCSharpIdentifier(convertStringToCSharpValidName(opts.variableName || 'data'));
    const objectClassName = escapeCSharpIdentifier(convertToPascalCase(opts.objectClassName || 'Row'));

    const rows = [];
    for (let rowIndex = 0; rowIndex < dataTable.getRowCount(); rowIndex++) {
      const row = dataTable.getRow(rowIndex);
      if (opts.useAnonymousObjects) {
        rows.push(this._buildAnonymousRow(headers, row));
      } else {
        rows.push(this._buildObjectRow(headers, row, objectClassName));
      }
    }

    const collectionTarget = opts.collectionTargetType || (opts.collectionType === 'array' ? 'array' : 'list');
    const openCollection = collectionTarget === 'array' ? 'new[] {' : 'new List<object> {';
    const closeCollection = '}';
    let prefix = '';
    if (opts.assignToVariable) {
      if (collectionTarget === 'ireadonlylist') {
        prefix = `IReadOnlyList<object> ${variableName} = `;
      } else if (collectionTarget === 'ienumerable') {
        prefix = `IEnumerable<object> ${variableName} = `;
      } else {
        prefix = `var ${variableName} = `;
      }
    }
    const lines = [];

    if (!opts.useAnonymousObjects) {
      lines.push(...this._buildClassDefinition(headers, objectClassName));
    }

    if (opts.prettyPrint) {
      lines.push(`${prefix}${openCollection}`);
      if (rows.length > 0) {
        lines.push(`${rows.join(',\n')},`);
      }
      lines.push(closeCollection + ';');
      return lines.join('\n');
    }

    lines.push(`${prefix}${openCollection} ${rows.join(', ')} ${closeCollection};`);
    return lines.join('\n');
  }
}

export { CSharpConvertor, CSharpConvertorOptions };
