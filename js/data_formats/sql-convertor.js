class SqlConvertorOptions {
  constructor() {
    this.options = {
      tableName: 'myTable',
      maxValuesPerInsert: 100,
      quoteNumeric: true,
      sqlDialect: 'ansi',
      quoteIdentifiers: true,
      wrapTransaction: false,
      nullHandling: 'empty-string',
    };
  }

  mergeOptions(newOptions) {
    if (newOptions?.options) {
      this.options = { ...this.options, ...newOptions.options };
      return;
    }
    this.options = { ...this.options, ...newOptions };
  }
}

class SqlConvertor {
  constructor(params) {
    this.config = new SqlConvertorOptions();
    if (params !== undefined) {
      this.setOptions(params);
    }
  }

  setOptions(newOptions) {
    this.config.mergeOptions(newOptions);
  }

  fromDataTable(dataTable) {
    const dialect = this._normalizeDialect(this.config.options.sqlDialect);
    const tableName = this._renderIdentifier(this._normalizeTableName(this.config.options.tableName), dialect);
    const headers = dataTable.getHeaders().map((header, index) => {
      const normalizedHeader = this._normalizeHeaderName(header, index);
      return this._renderIdentifier(normalizedHeader, dialect);
    });
    const rowCount = dataTable.getRowCount();
    const maxValuesPerInsert = this._normalizeMaxValuesPerInsert(this.config.options.maxValuesPerInsert);

    if (headers.length === 0 || rowCount === 0) {
      return '';
    }

    const statements = [];
    for (let rowStart = 0; rowStart < rowCount; rowStart += maxValuesPerInsert) {
      const valuesLines = [];
      const rowEndExclusive = Math.min(rowStart + maxValuesPerInsert, rowCount);
      for (let rowIndex = rowStart; rowIndex < rowEndExclusive; rowIndex++) {
        const row = dataTable.getRow(rowIndex);
        const values = headers.map((_, columnIndex) => this._renderValue(row[columnIndex])).join(',');
        valuesLines.push(`\t(${values})`);
      }

      statements.push(`INSERT INTO ${tableName} (${headers.join(',')}) values \n${valuesLines.join(',\n')};`);
    }

    const sqlText = statements.join('\n\n');
    if (this.config.options.wrapTransaction !== true) {
      return sqlText;
    }

    const transaction = this._getTransactionStatementsForDialect(dialect);
    return `${transaction.begin}\n\n${sqlText}\n\n${transaction.commit}`;
  }

  _normalizeTableName(tableName) {
    const candidate = String(tableName ?? '').trim();
    if (candidate.length === 0) {
      return 'myTable';
    }
    return candidate;
  }

  _normalizeMaxValuesPerInsert(maxValuesPerInsert) {
    const parsed = Number.parseInt(maxValuesPerInsert, 10);
    if (Number.isNaN(parsed) || parsed < 1) {
      return 100;
    }
    return parsed;
  }

  _normalizeDialect(sqlDialect) {
    const dialect = String(sqlDialect ?? '')
      .trim()
      .toLowerCase();
    if (['ansi', 'postgresql', 'mysql', 'sqlserver'].includes(dialect)) {
      return dialect;
    }
    return 'ansi';
  }

  _normalizeHeaderName(header, index) {
    const headerName = String(header ?? '').trim();
    if (headerName.length > 0) {
      return headerName;
    }
    return `column${index + 1}`;
  }

  _renderIdentifier(identifier, dialect) {
    const candidate = String(identifier ?? '').trim();
    if (this.config.options.quoteIdentifiers !== true) {
      return candidate;
    }

    if (dialect === 'mysql') {
      return `\`${candidate.replaceAll('`', '``')}\``;
    }

    if (dialect === 'sqlserver') {
      return `[${candidate.replaceAll(']', ']]')}]`;
    }

    return `"${candidate.replaceAll('"', '""')}"`;
  }

  _getTransactionStatementsForDialect(dialect) {
    if (dialect === 'mysql') {
      return {
        begin: 'START TRANSACTION;',
        commit: 'COMMIT;',
      };
    }

    if (dialect === 'sqlserver') {
      return {
        begin: 'BEGIN TRANSACTION;',
        commit: 'COMMIT TRANSACTION;',
      };
    }

    return {
      begin: 'BEGIN;',
      commit: 'COMMIT;',
    };
  }

  _renderValue(value) {
    const rawValue = value;
    const valueString = String(value ?? '');
    const trimmed = valueString.trim();
    const nullHandling = this.config.options.nullHandling;

    if (rawValue === null || rawValue === undefined) {
      if (nullHandling === 'empty-as-null' || nullHandling === 'empty-or-literal-null') {
        return 'NULL';
      }
    }

    if ((nullHandling === 'empty-as-null' || nullHandling === 'empty-or-literal-null') && trimmed.length === 0) {
      return 'NULL';
    }

    if (nullHandling === 'empty-or-literal-null' && trimmed.toUpperCase() === 'NULL') {
      return 'NULL';
    }

    if (this.config.options.quoteNumeric === false && this._isNumericLiteral(trimmed)) {
      return trimmed;
    }

    return `'${this._escapeSqlString(valueString)}'`;
  }

  _isNumericLiteral(value) {
    const trimmed = String(value ?? '').trim();
    if (trimmed.length === 0) {
      return false;
    }
    return /^-?\d+(\.\d+)?$/.test(trimmed);
  }

  _escapeSqlString(value) {
    return String(value ?? '').replaceAll("'", "''");
  }
}

export { SqlConvertor, SqlConvertorOptions };
