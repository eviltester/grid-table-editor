import { DelimiterOptions } from '@anywaydata/core/data_formats/delimiter-options.js';
import { GherkinConvertor } from '@anywaydata/core/data_formats/gherkin-convertor.js';
import { MarkdownConvertor, MarkdownOptions } from '@anywaydata/core/data_formats/markdown-convertor.js';
import { HtmlConvertor, HtmlConvertorOptions } from '@anywaydata/core/data_formats/html-convertor.js';
import { DelimiterConvertor } from '@anywaydata/core/data_formats/delimiter-convertor.js';
import { CsvConvertor } from '@anywaydata/core/data_formats/csv-convertor.js';
import { JsonConvertor, JsonConvertorOptions } from '@anywaydata/core/data_formats/json-convertor.js';
import { JavascriptConvertor, JavascriptConvertorOptions } from '@anywaydata/core/data_formats/javascript-convertor.js';
import { fileTypes } from '@anywaydata/core/data_formats/file-types.js';
import { PapaWrappa } from '../utils/papawrappa.js';

class Importer {
  constructor(gridExtension) {
    this.gridExtensions = gridExtension;

    this.options = {};
    this.options['csv'] = new DelimiterOptions('"');
    this.options['dsv'] = new DelimiterOptions('\t');
    // this.options["asciitable"] = new AsciiTableOptions();
    this.options['markdown'] = new MarkdownOptions();
    this.options['json'] = new JsonConvertorOptions();
    this.options['javascript'] = new JavascriptConvertorOptions();
    this.options['html'] = new HtmlConvertorOptions();

    this.convertors = {};
    this.convertors['markdown'] = new MarkdownConvertor();
    this.convertors['gherkin'] = new GherkinConvertor();
    this.convertors['html'] = new HtmlConvertor();
    this.convertors['dsv'] = new DelimiterConvertor();
    this.convertors['dsv'].setPapaParse(new PapaWrappa());
    this.convertors['csv'] = new CsvConvertor();
    this.convertors['csv'].setPapaParse(new PapaWrappa());
    this.convertors['json'] = new JsonConvertor();
    this.convertors['javascript'] = new JavascriptConvertor();
  }

  canImport(type) {
    return Object.prototype.hasOwnProperty.call(this.convertors, type);
  }

  getFileExtensionFor(type) {
    return fileTypes[type]?.fileExtension;
  }

  setOptionsForType(type, options) {
    if (this.options[type]) {
      let optionsToUse = this.options[type];
      optionsToUse.mergeOptions(options);
    }
  }

  // text area import
  importText(typeToImport, textToImport) {
    const dataTable = this.toGenericDataTable(typeToImport, textToImport);
    if (!dataTable) {
      return;
    }
    return this.setGridFromGenericDataTable(dataTable);
  }

  toGenericDataTable(typeToImport, textToImport) {
    if (!this.canImport(typeToImport)) {
      console.log(`Data Type ${typeToImport} not supported for importing`);
      return undefined;
    }

    let optionsToUse = {};
    if (this.options[typeToImport]) {
      optionsToUse = this.options[typeToImport];
    }

    let convertorToUse = this.convertors[typeToImport];
    if (convertorToUse !== undefined) {
      convertorToUse?.setOptions?.(optionsToUse);
      return convertorToUse.toDataTable(textToImport);
    }
    return undefined;
  }

  setGridFromGenericDataTable(dataTable) {
    return this.gridExtensions.setGridFromGenericDataTable(dataTable);
  }
}

export { Importer };
