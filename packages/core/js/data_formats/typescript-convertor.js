function convertStringToTypeScriptValidName(aString) {
  let result = String(aString).replace(/[^A-Za-z0-9_$]/g, '_');
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

class TypeScriptConvertorOptions {
  constructor() {
    this.delimiterMappings = {
      tab: '\t',
      space: ' ',
    };

    this.options = {
      // 'list' | 'array'
      collectionType: 'list',
      // wrap output in a variable assignment
      assignToVariable: true,
      variableName: 'data',
      // false = numbers emitted as numeric literals; true = always quoted strings (Number Convert)
      quoteNumbers: false,
      // true = list/array of anonymous object literals; false = list/array of class instances
      useAnonymousObjects: true,
      // class name used when useAnonymousObjects is false
      objectClassName: 'Row',
      // 'null' or 'empty-string' for blank values
      blankValueBehavior: 'null',
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

class TypeScriptConvertor {
  constructor(options) {
    this.config = new TypeScriptConvertorOptions();
    if (options) {
      this.setOptions(options);
    }
  }

  setOptions(newOptions) {
    this.config.mergeOptions(newOptions);
  }

  _escape(textValue) {
    let escaped = String(textValue).replace(/\\/g, '\\\\');
    escaped = escaped.replace(/\n/g, '\\n');
    escaped = escaped.replace(/\r/g, '\\r');
    escaped = escaped.replace(/\t/g, '\\t');
    escaped = escaped.replace(/"/g, '\\"');
    return escaped;
  }

  _quote(textValue) {
    return `"${this._escape(textValue)}"`;
  }

  _formatValue(value) {
    const opts = this.config.options;
    if (value === '' || value === null || value === undefined) {
      if (opts.blankValueBehavior === 'null') {
        return 'null';
      }
      return this._quote('');
    }

    if (!opts.quoteNumbers && isNumericValue(value)) {
      return String(Number(value));
    }

    return this._quote(value);
  }

  _indent(level) {
    if (!this.config.options.prettyPrint) {
      return '';
    }
    let unit = this.config.options.prettyPrintDelimiter ?? '    ';
    // TypeScript indentation should be whitespace; fallback to spaces for invalid custom values.
    if (!/^\s+$/.test(String(unit))) {
      unit = '    ';
    }
    return String(unit).repeat(level);
  }

  _inferColumnType(colIndex, dataTable) {
    const options = this.config.options;
    let allNumeric = true;
    let hasAnyValue = false;
    let hasBlanks = false;
    for (let i = 0; i < dataTable.getRowCount(); i++) {
      const row = dataTable.getRow(i);
      const value = row[colIndex];
      if (value === '' || value === null || value === undefined) {
        hasBlanks = true;
        continue;
      }
      hasAnyValue = true;
      if (!isNumericValue(value)) {
        allNumeric = false;
        break;
      }
    }

    const isNullable = options.blankValueBehavior === 'null' && hasBlanks;

    if (options.quoteNumbers) {
      return isNullable ? 'string | null' : 'string';
    }

    if (!hasAnyValue) {
      return isNullable ? 'string | null' : 'string';
    }

    if (allNumeric) {
      return isNullable ? 'number | null' : 'number';
    }

    return isNullable ? 'string | null' : 'string';
  }

  _buildAnonymousObjectRow(rawHeaders, row, prettyIndent) {
    const options = this.config.options;
    const pairs = rawHeaders.map((header, index) => `${this._quote(header)}: ${this._formatValue(row[index])}`);

    if (options.prettyPrint) {
      return `${prettyIndent}{${pairs.join(', ')}}`;
    }

    return `{${pairs.join(', ')}}`;
  }

  _buildNamedObjectRow(objectClassName, headers, columnTypes, row, prettyIndent) {
    const args = headers.map((h, i) => {
      const value = row[i];
      if (value === '' || value === null || value === undefined) {
        return this.config.options.blankValueBehavior === 'null' ? 'null' : this._quote('');
      }
      if (columnTypes[i].includes('number') && isNumericValue(value)) {
        return String(Number(value));
      }
      return this._quote(value);
    });

    if (this.config.options.prettyPrint) {
      return `${prettyIndent}new ${objectClassName}(${args.join(', ')})`;
    }

    return `new ${objectClassName}(${args.join(', ')})`;
  }

  _buildClassDefinition(objectClassName, headers, columnTypes) {
    const lines = [];
    lines.push(`class ${objectClassName} {`);

    headers.forEach((header, index) => {
      lines.push(`    ${header}: ${columnTypes[index]};`);
    });

    lines.push('');

    const constructorParams = headers.map((h, i) => `${h}: ${columnTypes[i]}`).join(', ');
    lines.push(`    constructor(${constructorParams}) {`);
    headers.forEach((header) => {
      lines.push(`        this.${header} = ${header};`);
    });
    lines.push('    }');
    lines.push('}');

    return lines;
  }

  fromDataTable(dataTable) {
    const options = this.config.options;
    const rawHeaders = dataTable.getHeaders();
    const sanitisedHeaders = rawHeaders.map((h) => convertStringToTypeScriptValidName(h));

    const usedNames = new Set();
    const headers = sanitisedHeaders.map((header) => {
      if (!usedNames.has(header)) {
        usedNames.add(header);
        return header;
      }
      let counter = 2;
      let candidate = `${header}_${counter}`;
      while (usedNames.has(candidate)) {
        counter++;
        candidate = `${header}_${counter}`;
      }
      usedNames.add(candidate);
      return candidate;
    });

    const variableName = convertStringToTypeScriptValidName(options.variableName || 'data');
    const objectClassName = convertStringToTypeScriptValidName(options.objectClassName || 'Row');

    const useAnonymousObjects = options.useAnonymousObjects;
    const useList = options.collectionType === 'list';

    const outputLines = [];
    const rowItems = [];
    const indent1 = this._indent(1);
    const columnTypes = headers.map((h, i) => this._inferColumnType(i, dataTable));

    for (let rowIndex = 0; rowIndex < dataTable.getRowCount(); rowIndex++) {
      const row = dataTable.getRow(rowIndex);
      if (useAnonymousObjects) {
        rowItems.push(this._buildAnonymousObjectRow(rawHeaders, row, indent1));
      } else {
        rowItems.push(this._buildNamedObjectRow(objectClassName, headers, columnTypes, row, indent1));
      }
    }

    if (!useAnonymousObjects) {
      outputLines.push(...this._buildClassDefinition(objectClassName, headers, columnTypes), '');
    }

    const listType = useAnonymousObjects ? 'Record<string, unknown>' : objectClassName;
    const collectionType = useList ? `Array<${listType}>` : `${listType}[]`;
    const varDeclaration = options.assignToVariable ? `const ${variableName}: ${collectionType} = ` : '';

    if (options.prettyPrint) {
      outputLines.push(`${varDeclaration}[`);
      if (rowItems.length > 0) {
        outputLines.push(rowItems.join(',\n'));
      }
      outputLines.push('];');
      return outputLines.join('\n');
    }

    outputLines.push(`${varDeclaration}[${rowItems.join(', ')}];`);
    return outputLines.join('\n');
  }
}

export { TypeScriptConvertor, TypeScriptConvertorOptions };
