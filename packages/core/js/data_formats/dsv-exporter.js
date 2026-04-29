class DsvCellFormatter {
  constructor(options = {}) {
    this.setOptions(options);
  }

  setOptions(options = {}) {
    this.options = {
      delimiter: ',',
      quoteChar: '"',
      escapeChar: '"',
      quotes: true,
      ...options,
    };
  }

  formatCell(value, columnIndex = 0) {
    const asText = value === undefined || value === null ? '' : String(value);
    const escaped = this.escapeQuotes(asText);
    if (this.shouldQuote(escaped, columnIndex)) {
      return `${this.options.quoteChar}${escaped}${this.options.quoteChar}`;
    }
    return escaped;
  }

  escapeQuotes(text) {
    const quoteChar = this.options.quoteChar;
    if (!quoteChar || !text.includes(quoteChar)) {
      return text;
    }

    const escapeChar = this.options.escapeChar ?? quoteChar;
    const quoteEscape = escapeChar === quoteChar ? `${quoteChar}${quoteChar}` : `${escapeChar}${quoteChar}`;
    return text.split(quoteChar).join(quoteEscape);
  }

  shouldQuote(value, columnIndex) {
    const quoteConfig = this.options.quotes;
    const forceQuote = Array.isArray(quoteConfig) ? Boolean(quoteConfig[columnIndex]) : Boolean(quoteConfig);

    if (forceQuote) {
      return true;
    }

    const delimiter = this.options.delimiter;
    const quoteChar = this.options.quoteChar;
    return (
      value.includes(delimiter) ||
      value.includes('\n') ||
      value.includes('\r') ||
      (quoteChar ? value.includes(quoteChar) : false)
    );
  }
}

class DsvExporter {
  constructor(options = {}) {
    this.setOptions(options);
  }

  setOptions(options = {}) {
    this.options = {
      delimiter: ',',
      newline: '\n',
      header: true,
      ...options,
    };
    this.cellFormatter = new DsvCellFormatter(this.options);
  }

  fromDataTable(dataTable) {
    const lines = [];

    if (this.options.header) {
      lines.push(this.formatRow(dataTable.getHeaders()));
    }

    const rowCount = dataTable.getRowCount();
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      lines.push(this.formatRow(dataTable.getRow(rowIndex)));
    }

    return lines.join(this.options.newline);
  }

  async fromDataTableAsync(dataTable, progressCallback) {
    const lines = [];

    if (this.options.header) {
      lines.push(this.formatRow(dataTable.getHeaders()));
    }

    const rowCount = dataTable.getRowCount();
    const batchSize = 200;
    progressCallback?.(`Formatting rows... 0/${rowCount} (0%)`);

    for (let start = 0; start < rowCount; start += batchSize) {
      const end = Math.min(start + batchSize, rowCount);
      for (let rowIndex = start; rowIndex < end; rowIndex++) {
        lines.push(this.formatRow(dataTable.getRow(rowIndex)));
      }

      const percent = Math.round((end / Math.max(rowCount, 1)) * 100);
      progressCallback?.(`Formatting rows... ${end}/${rowCount} (${percent}%)`);

      if (end < rowCount) {
        await this._yieldToUi();
      }
    }

    return lines.join(this.options.newline);
  }

  _yieldToUi() {
    return new Promise((resolve) => {
      if (typeof requestAnimationFrame !== 'function') {
        setTimeout(resolve, 0);
        return;
      }
      requestAnimationFrame(() => {
        setTimeout(resolve, 0);
      });
    });
  }

  formatRow(rowValues = []) {
    const rendered = new Array(rowValues.length);
    for (let colIndex = 0; colIndex < rowValues.length; colIndex++) {
      rendered[colIndex] = this.cellFormatter.formatCell(rowValues[colIndex], colIndex);
    }
    return rendered.join(this.options.delimiter);
  }
}

class CsvExporter extends DsvExporter {
  constructor(options = {}) {
    super({ ...options, delimiter: ',' });
  }

  setOptions(options = {}) {
    super.setOptions({ ...options, delimiter: ',' });
  }
}

class TsvExporter extends DsvExporter {
  constructor(options = {}) {
    super({ ...options, delimiter: '\t' });
  }

  setOptions(options = {}) {
    super.setOptions({ ...options, delimiter: '\t' });
  }
}

export { CsvExporter, DsvCellFormatter, DsvExporter, TsvExporter };
