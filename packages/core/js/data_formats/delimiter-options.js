class DelimiterOptions {
  constructor(delimiter) {
    this.options = {
      quotes: true, //or array of booleans
      quoteChar: '"',
      escapeChar: '"',
      delimiter: '"',
      header: true,
      newline: '\n',
      // Prevent parser artifacts: terminal newlines should not create synthetic rows.
      // Explicit empty records (e.g. ",," or "") are still preserved.
      skipEmptyLines: 'greedy', //other option is true.
      columns: null, //or array of strings
    };

    if (delimiter !== undefined) {
      this.options.delimiter = delimiter;
    }

    this.headers = [];
  }

  mergeOptions(delimiterOptions) {
    if (delimiterOptions.options) {
      this.options = { ...this.options, ...delimiterOptions.options };
    } else {
      this.options = { ...this.options, ...delimiterOptions };
    }

    if (Object.prototype.hasOwnProperty.call(delimiterOptions, 'headers')) {
      this.headers = delimiterOptions.headers.map((header) => header);
    } else {
      this.headers = [];
    }
  }
}

export { DelimiterOptions };
