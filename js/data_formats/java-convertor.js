function convertStringToJavaValidName(aString) {
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

function looksLikeInteger(value) {
  if (value === '' || value === null || value === undefined) {
    return false;
  }
  return /^-?\d+$/.test(String(value).trim());
}

class JavaConvertorOptions {
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
      // true = list of plain Maps; false = list of class instances
      useAnonymousMaps: true,
      // class name used when useAnonymousMaps is false
      objectClassName: 'Row',
      // 'null' or 'empty-string' for blank values
      blankValueBehavior: 'null',
      // include import statements at top of output
      includeImports: true,
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

class JavaConvertor {
  constructor(options) {
    this.config = new JavaConvertorOptions();
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
      return String(value);
    }

    return this._quote(value);
  }

  _indent(level) {
    if (!this.config.options.prettyPrint) {
      return '';
    }
    let unit = this.config.options.prettyPrintDelimiter ?? '    ';
    // Java indentation must be whitespace; fall back to 4 spaces for invalid custom values.
    if (!/^\s+$/.test(String(unit))) {
      unit = '    ';
    }
    return String(unit).repeat(level);
  }

  _inferColumnType(colIndex, dataTable) {
    if (this.config.options.quoteNumbers) {
      return 'String';
    }
    let allInteger = true;
    let allNumeric = true;
    let hasAnyValue = false;
    for (let i = 0; i < dataTable.getRowCount(); i++) {
      const row = dataTable.getRow(i);
      const value = row[colIndex];
      if (value === '' || value === null || value === undefined) {
        continue;
      }
      hasAnyValue = true;
      if (!isNumericValue(value)) {
        allNumeric = false;
        allInteger = false;
        break;
      }
      if (!looksLikeInteger(value)) {
        allInteger = false;
      }
    }
    if (!hasAnyValue || !allNumeric) {
      return 'String';
    }
    return allInteger ? 'int' : 'double';
  }

  _buildImportLines(useMap, useList) {
    if (!this.config.options.includeImports) {
      return [];
    }
    const imports = [];
    if (useMap) {
      imports.push('import java.util.Map;');
    }
    if (useList) {
      imports.push('import java.util.List;');
      imports.push('import java.util.ArrayList;');
    }
    return imports;
  }

  _buildAnonymousMapRow(rawHeaders, row, prettyIndent) {
    const opts = this.config.options;
    if (rawHeaders.length <= 10) {
      const pairs = [];
      rawHeaders.forEach((h, i) => {
        pairs.push(this._quote(h));
        pairs.push(this._formatValue(row[i]));
      });
      if (opts.prettyPrint) {
        return `${prettyIndent}Map.of(${pairs.join(', ')})`;
      }
      return `Map.of(${pairs.join(', ')})`;
    }
    // Map.ofEntries for > 10 columns (Map.of is limited to 10 key-value pairs)
    const entries = rawHeaders.map((h, i) => `Map.entry(${this._quote(h)}, ${this._formatValue(row[i])})`);
    if (opts.prettyPrint) {
      const entryIndent = prettyIndent + this._indent(1);
      return `${prettyIndent}Map.ofEntries(\n${entries.map((e) => `${entryIndent}${e}`).join(',\n')}\n${prettyIndent})`;
    }
    return `Map.ofEntries(${entries.join(', ')})`;
  }

  _buildNamedObjectRow(objectClassName, headers, columnTypes, row, prettyIndent) {
    const opts = this.config.options;
    const args = headers.map((h, i) => {
      const value = row[i];
      if (value === '' || value === null || value === undefined) {
        if (opts.blankValueBehavior === 'null') {
          return 'null';
        }
        return this._quote('');
      }
      if (columnTypes[i] !== 'String' && isNumericValue(value)) {
        return String(value);
      }
      return this._quote(value);
    });
    if (opts.prettyPrint) {
      return `${prettyIndent}new ${objectClassName}(${args.join(', ')})`;
    }
    return `new ${objectClassName}(${args.join(', ')})`;
  }

  _buildClassDefinition(objectClassName, headers, columnTypes) {
    const indent = '    ';
    const lines = [];
    lines.push(`class ${objectClassName} {`);
    headers.forEach((h, i) => {
      lines.push(`${indent}${columnTypes[i]} ${h};`);
    });
    lines.push('');
    const paramList = headers.map((h, i) => `${columnTypes[i]} ${h}`).join(', ');
    lines.push(`${indent}${objectClassName}(${paramList}) {`);
    headers.forEach((h) => {
      lines.push(`${indent}${indent}this.${h} = ${h};`);
    });
    lines.push(`${indent}}`);
    lines.push('}');
    return lines;
  }

  fromDataTable(dataTable) {
    const opts = this.config.options;
    const rawHeaders = dataTable.getHeaders();
    const sanitizedHeaders = rawHeaders.map((h) => convertStringToJavaValidName(h));
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

    const variableName = convertStringToJavaValidName(opts.variableName || 'data');
    const objectClassName = convertStringToJavaValidName(opts.objectClassName || 'Row');
    const useAnonymousMaps = opts.useAnonymousMaps;
    const useList = opts.collectionType === 'list';

    // Infer column types for named class mode
    const columnTypes = headers.map((h, i) => this._inferColumnType(i, dataTable));

    const outputLines = [];
    const rowItems = [];
    const prettyIndent1 = this._indent(1);

    for (let rowIndex = 0; rowIndex < dataTable.getRowCount(); rowIndex++) {
      const row = dataTable.getRow(rowIndex);
      if (useAnonymousMaps) {
        rowItems.push(this._buildAnonymousMapRow(rawHeaders, row, prettyIndent1));
      } else {
        rowItems.push(this._buildNamedObjectRow(objectClassName, headers, columnTypes, row, prettyIndent1));
      }
    }

    // Build imports
    const importLines = this._buildImportLines(useAnonymousMaps, useList);
    if (importLines.length > 0) {
      outputLines.push(...importLines, '');
    }

    // Build class definition for named objects
    if (!useAnonymousMaps) {
      outputLines.push(...this._buildClassDefinition(objectClassName, headers, columnTypes), '');
    }

    // Build collection declaration
    if (useList) {
      const collectionType = useAnonymousMaps ? 'List<Map<String, Object>>' : `List<${objectClassName}>`;
      const varDeclaration = opts.assignToVariable ? `${collectionType} ${variableName} = ` : '';
      if (opts.prettyPrint) {
        outputLines.push(`${varDeclaration}new ArrayList<>(List.of(`);
        if (rowItems.length > 0) {
          outputLines.push(rowItems.join(',\n'));
        }
        outputLines.push(`));`);
      } else {
        outputLines.push(`${varDeclaration}new ArrayList<>(List.of(${rowItems.join(', ')}));`);
      }
    } else {
      // Array
      const arrayTypeName = useAnonymousMaps ? 'Map<String, Object>[]' : `${objectClassName}[]`;
      const newArrayName = useAnonymousMaps ? 'Map' : objectClassName;
      const varDeclaration = opts.assignToVariable ? `${arrayTypeName} ${variableName} = ` : '';
      // @SuppressWarnings needed for raw generic array type when assigning to typed variable
      if (useAnonymousMaps && opts.assignToVariable) {
        outputLines.push('@SuppressWarnings("unchecked")');
      }
      if (opts.prettyPrint) {
        outputLines.push(`${varDeclaration}new ${newArrayName}[]{`);
        if (rowItems.length > 0) {
          outputLines.push(rowItems.join(',\n'));
        }
        outputLines.push(`};`);
      } else {
        outputLines.push(`${varDeclaration}new ${newArrayName}[]{${rowItems.join(', ')}};`);
      }
    }

    return outputLines.join('\n');
  }
}

export { JavaConvertor, JavaConvertorOptions };
