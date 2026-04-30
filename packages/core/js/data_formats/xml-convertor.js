class XmlConvertorOptions {
  constructor() {
    this.options = {
      rootElementName: 'root',
      itemElementName: 'item',
      attributeColumnsCsv: '',
      includeXmlHeader: true,
      xmlns: '',
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

class XmlConvertor {
  constructor(params) {
    this.config = new XmlConvertorOptions();
    this.warnings = [];

    if (params !== undefined) {
      this.setOptions(params);
    }
  }

  setOptions(newOptions) {
    this.config.mergeOptions(newOptions);
  }

  getWarnings() {
    return this.warnings.map((warning) => warning);
  }

  fromDataTable(dataTable) {
    this.warnings = [];

    const headers = dataTable.getHeaders();
    const attributeColumnNames = this._parseAttributeColumns(this.config.options.attributeColumnsCsv);
    const knownAttributeColumnNames = new Set();

    attributeColumnNames.forEach((attributeColumnName) => {
      if (headers.includes(attributeColumnName)) {
        knownAttributeColumnNames.add(attributeColumnName);
        return;
      }
      this.warnings.push(`Ignored unknown XML attribute column: ${attributeColumnName}`);
    });

    const rootElementName = this._normaliseXmlName(this.config.options.rootElementName, 'root', 'root element');
    const itemElementName = this._normaliseXmlName(this.config.options.itemElementName, 'item', 'item element');

    const usedColumnXmlNames = new Set();
    const headerXmlNames = headers.map((header) => {
      const context = knownAttributeColumnNames.has(header) ? 'attribute column' : 'child element column';
      return this._normaliseXmlName(header, 'column', context, usedColumnXmlNames);
    });

    const lines = [];
    if (this.config.options.includeXmlHeader) {
      lines.push('<?xml version="1.0" encoding="utf-8"?>');
    }

    const xmlnsValue = String(this.config.options.xmlns ?? '').trim();
    const xmlnsAttribute = xmlnsValue.length > 0 ? ` xmlns="${this._escapeXmlValue(xmlnsValue)}"` : '';
    lines.push(`<${rootElementName}${xmlnsAttribute}>`);

    for (let rowIndex = 0; rowIndex < dataTable.getRowCount(); rowIndex++) {
      const row = dataTable.getRow(rowIndex);
      const itemAttributes = [];
      const childElements = [];

      headers.forEach((header, columnIndex) => {
        const value = this._sanitizeXmlCharacters(row[columnIndex]);
        const xmlName = headerXmlNames[columnIndex];
        if (knownAttributeColumnNames.has(header)) {
          itemAttributes.push(`${xmlName}="${this._escapeXmlValue(value)}"`);
          return;
        }
        childElements.push(`    <${xmlName}>${this._escapeXmlValue(value)}</${xmlName}>`);
      });

      const attributesSuffix = itemAttributes.length > 0 ? ` ${itemAttributes.join(' ')}` : '';
      lines.push(`  <${itemElementName}${attributesSuffix}>`);
      childElements.forEach((line) => lines.push(line));
      lines.push(`  </${itemElementName}>`);
    }

    lines.push(`</${rootElementName}>`);
    return lines.join('\n');
  }

  _parseAttributeColumns(attributeColumnsCsv) {
    return String(attributeColumnsCsv ?? '')
      .split(',')
      .map((column) => column.trim())
      .filter((column) => column.length > 0);
  }

  _normaliseXmlName(originalName, fallbackName, contextLabel, usedNames) {
    const namesInUse = usedNames || new Set();
    const inputName = String(originalName ?? '').trim();
    let normalised = inputName.length > 0 ? inputName : fallbackName;

    normalised = normalised.replace(/\s+/g, '_');
    normalised = normalised.replace(/[^A-Za-z0-9_.-]/g, '_');

    if (!/^[A-Za-z_]/.test(normalised)) {
      normalised = `_${normalised}`;
    }

    if (/^xml/i.test(normalised)) {
      normalised = `_${normalised}`;
    }

    if (normalised.length === 0) {
      normalised = fallbackName;
    }

    let deduplicated = normalised;
    let suffix = 2;
    while (namesInUse.has(deduplicated)) {
      deduplicated = `${normalised}_${suffix}`;
      suffix++;
    }
    namesInUse.add(deduplicated);

    if (inputName !== deduplicated) {
      this.warnings.push(`Auto-fixed XML ${contextLabel} name "${inputName}" -> "${deduplicated}"`);
    }

    return deduplicated;
  }

  _sanitizeXmlCharacters(value) {
    const text = String(value ?? '');
    let sanitized = '';

    for (const char of text) {
      const codePoint = char.codePointAt(0);
      const isValidXmlChar =
        codePoint === 0x9 ||
        codePoint === 0xa ||
        codePoint === 0xd ||
        (codePoint >= 0x20 && codePoint <= 0xd7ff) ||
        (codePoint >= 0xe000 && codePoint <= 0xfffd) ||
        (codePoint >= 0x10000 && codePoint <= 0x10ffff);

      if (isValidXmlChar) {
        sanitized += char;
      }
    }

    return sanitized;
  }

  _escapeXmlValue(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&apos;');
  }
}

export { XmlConvertor, XmlConvertorOptions };
