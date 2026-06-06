const sharedInlineHelpEntries = {
  'import-export-controls': `
      <p>Using the import and export controls you can:</p>
      <ul>
        <li>"Set Text From Grid"<br> to refresh the text box for the chosen output format.</li>
        <li>"Set Grid From Text"<br> to <a class="helplink" href="/docs/editing-data/text-editing" target="anywaydatadocs">import the text box content</a> into the grid.</li>
        <li>"Choose File"<br> to <a class="helplink" href="docs/editing-data/import-from-file" target="anywaydatadocs">import a text file</a> of the chosen format.</li>
        <li>"Download File"<br> to <a class="helplink" href="docs/editing-data/exporting-data" target="anywaydatadocs">export the Data Grid</a> items in the chosen format.</li>
        <li>"Drag and Drop File"<br> to <a class="helplink" href="docs/editing-data/import-from-file" target="anywaydatadocs">import the file</a> contents using the currently chosen format.</li>
      </ul>
      <p>The options shown depend on the output type, some types are not supported for input and so only the output options will be shown.</p>
    `,
  'markdown-table-options': `
      <p>Export the table data as <a class="helplink" href="docs/data-formats/markdown/markdown" target="anywaydatadocs">Markdown</a>, a human readable format which can be easily converted to HTML or PDF.</p>
      <p>Choose from the list of <a class="helplink" href="docs/data-formats/markdown/options" target="anywaydatadocs">formatting options</a> and press the [Apply] button to render the data in the chosen style.</p>
      <p><a class="helplink" href="docs/data-formats/markdown/options" target="anywaydatadocs">Learn more</a></p>
    `,
  'ascii-table-options': `
      <p>Export the table data as Ascii Table suitable for adding to an email or text file.</p>
      <p>Choose from a list of predefined formats and press the [Apply] button to render the table in the chosen style.</p>
      <p><a class="helplink" href="docs/data-formats/ascii-tables/options" target="anywaydatadocs">Learn more</a></p>
    `,
  'csv-options': `
      <p>Export the table data as <a class="helplink" href="docs/data-formats/csv/csv" target="anywaydatadocs">CSV (Comma Separated Values)</a> suitable for importing into a spreadsheet.</p>
      <p>Choose from the formatting options and press the [Apply] button to render the data in the chosen style.</p>
      <p><a class="helplink" href="docs/data-formats/csv/options" target="anywaydatadocs">Learn more</a></p>
    `,
  'delimiter-options': `
      <p>Export the table data as a <a class="helplink" href="docs/data-formats/delimited/delimited" target="anywaydatadocs">Delimited</a> output suitable for importing or copy and pasting into a spreadsheet.</p>
      <p>Choose from the formatting options and press the [Apply] button to render the data in the chosen style.</p>
      <p><em>Hint: Use Tab delimiter if copying into another table editing application like a spreadsheet.</em></p>
      <p><a class="helplink" href="docs/data-formats/delimited/options" target="anywaydatadocs">Learn more</a></p>
    `,
  'json-options': `
      <p>Export the table data as a <a class="helplink" href="docs/data-formats/json/json" target="anywaydatadocs">JSON</a> output suitable for JSON interchange messages e.g. APIs.</p>
      <p>Choose from the formatting options and press the [Apply] button to render the JSON in the chosen style.</p>
      <p><a class="helplink" href="docs/data-formats/json/options" target="anywaydatadocs">Learn more</a></p>
    `,
  'jsonl-options': `
      <p>Export the table data as JSON Lines (JSONL), with one JSON object per line and no surrounding array.</p>
      <p>JSONL output is always compact single-line records. Number Convert can optionally convert numeric-looking values to numbers.</p>
      <p><a class="helplink" href="docs/data-formats/jsonl/jsonl" target="anywaydatadocs">Learn more</a> and see <a class="helplink" href="docs/data-formats/jsonl/options" target="anywaydatadocs">JSONL options</a>.</p>
    `,
  'javascript-options': `
      <p>Export the table data as a <a class="helplink" href="docs/data-formats/javascript/javascript" target="anywaydatadocs">Javascript</a> output suitable for using in a Javascript application or unit testing code.</p>
      <p>Choose from the formatting options and press the [Apply] button to render the Javascript in the chosen style.</p>
      <p><a class="helplink" href="docs/data-formats/javascript/options" target="anywaydatadocs">Learn more</a></p>
    `,
  'java-options': `
      <p>Export the table data as Java code using either anonymous \`Map\` rows or named class instances.</p>
      <p>Configure collection type, variable/class naming, number quoting, blank value handling, imports, and pretty printing before pressing [Apply].</p>
      <p><a class="helplink" href="docs/data-formats/java/options" target="anywaydatadocs">Learn more</a></p>
    `,
  'python-options': `
      <p>Export the table data as Python code using dictionaries or named class instances.</p>
      <p>Configure collection type, variable/class naming, decimal handling, quote style, import statements, and pretty printing before pressing [Apply].</p>
      <p><a class="helplink" href="docs/data-formats/python/options" target="anywaydatadocs">Learn more</a></p>
    `,
  'php-options': `
      <p>Export the table data as PHP code using associative arrays or named class instances.</p>
      <p>Configure collection type, PHP tag, variable/class naming, stdClass or class instances, number and scalar coercion, compatibility mode, constructor style, and pretty printing before pressing [Apply].</p>
      <p><em>Named constructor arguments require PHP 8+.</em></p>
      <p><a class="helplink" href="docs/data-formats/php/options" target="anywaydatadocs">Learn more</a></p>
    `,
  'ruby-options': `
      <p>Export the table data as Ruby code using hashes or named class instances.</p>
      <p>Configure collection type, variable/class naming, number quoting, object style, and pretty printing before pressing [Apply].</p>
      <p><a class="helplink" href="docs/data-formats/ruby/options" target="anywaydatadocs">Learn more</a></p>
    `,
  'perl-options': `
      <p>Export the table data as Perl code using hash references or blessed object instances.</p>
      <p>Configure collection type, variable/class naming, number quoting, hash key style, object style (bless or constructor), and pretty printing before pressing [Apply].</p>
      <p><a class="helplink" href="docs/data-formats/perl/options" target="anywaydatadocs">Learn more</a></p>
    `,
  'kotlin-options': `
      <p>Export the table data as Kotlin code using maps or named data class instances.</p>
      <p>Configure collection type, val/var assignment, mutable collections, Kotlin-safe naming, number quoting, object style, and pretty printing (including trailing comma) before pressing [Apply].</p>
      <p><a class="helplink" href="docs/data-formats/kotlin/options" target="anywaydatadocs">Learn more</a></p>
    `,
  'csharp-options': `
      <p>Export the table data as C# code using dictionaries or named class instances.</p>
      <p>Configure collection target type, variable/class naming, number quoting, dictionary value typing, keyword-safe identifiers, object style, and pretty printing before pressing [Apply].</p>
      <p><a class="helplink" href="docs/data-formats/csharp/options" target="anywaydatadocs">Learn more</a></p>
    `,
  'typescript-options': `
      <p>Export the table data as TypeScript code using anonymous objects or named class instances.</p>
      <p>Configure collection type, variable/class naming, blank value handling, number quoting, and pretty printing before pressing [Apply].</p>
      <p><a class="helplink" href="docs/data-formats/typescript/options" target="anywaydatadocs">Learn more</a></p>
    `,
  'xml-options': `
      <p>Export the table data as <a class="helplink" href="docs/data-formats/xml/xml" target="anywaydatadocs">XML</a>, suitable for system integration and data interchange.</p>
      <p>Configure root and item element names, optional attributes, XML header, and XML namespace, then press [Apply] to render using those settings.</p>
      <p><a class="helplink" href="docs/data-formats/xml/options" target="anywaydatadocs">Learn more</a></p>
    `,
  'sql-options': `
      <p>Export the table data as SQL INSERT statements for loading data into a table.</p>
      <p>Configure table name, max values per INSERT statement, and whether numeric-looking values are quoted.</p>
      <p><a class="helplink" href="docs/data-formats/sql/sql" target="anywaydatadocs">Learn more</a> and see <a class="helplink" href="docs/data-formats/sql/options" target="anywaydatadocs">SQL options</a>.</p>
    `,
  'gherkin-options': `
      <p>Export the table data as <a class="helplink" href="docs/data-formats/gherkin/gherkin" target="anywaydatadocs">Gherkin</a>, a human readable format used in BDD automation.</p>
      <p>The <a class="helplink" href="docs/data-formats/gherkin/options" target="anywaydatadocs">formatting options</a> help pretty print the output to fit in the specification.</p>
      <p><a class="helplink" href="docs/data-formats/gherkin/options" target="anywaydatadocs">Learn more</a></p>
    `,
  'html-table-options': `
      <p>Export the table data as a <a class="helplink" href="docs/data-formats/html/html-tables" target="anywaydatadocs">HTML Table</a> suitable for adding to a web page.</p>
      <p>Choose from the formatting options and press the [Apply] button to render the data as HTML code.</p>
      <p>Import any HTML code by pasting the \`table\` contents into the text area and pressing \`Set Grid From Text\`</p>
      <p><a class="helplink" href="docs/data-formats/html/options" target="anywaydatadocs">Learn more</a></p>
    `,
  'test-framework-options': `
      <p>Export the table data as unit test code for a selected framework.</p>
      <p>Configure suite name, test name prefix, data source strategy, setup inclusion, and formatting options before pressing [Apply].</p>
      <p><a class="helplink" href="docs/data-formats/unit-test-code/options" target="anywaydatadocs">See full unit-test option mapping</a></p>
    `,
  'shared-generator-screen-overview': `
      <p><strong>Generator Screen Overview</strong></p>
      <p><strong>Schema:</strong> Define fields and rules using row-based schema editing or text schema mode.</p>
      <p><strong>Generate Data and Options:</strong> Choose output format, configure options, then generate files.</p>
      <p><strong>Preview:</strong> Generate a small sample to validate output before downloading larger files.</p>
      <p><a class="helplink" href="https://anywaydata.com/docs/test-data/generate-to-file" target="_blank" rel="noopener noreferrer">Generate To File docs</a></p>
    `,
  'generator-screen-overview': `
      <p><strong>Generator Screen Overview</strong></p>
      <p><strong>Schema:</strong> Define fields and rules using row-based schema editing or text schema mode.</p>
      <p><strong>Generate Data and Options:</strong> Choose output format, configure options, then generate files.</p>
      <p><strong>Preview:</strong> Generate a small sample to validate output before downloading larger files.</p>
      <p><a class="helplink" href="https://anywaydata.com/docs/test-data/generate-to-file" target="_blank" rel="noopener noreferrer">Generate To File docs</a></p>
    `,
  'generator-schema-mode-help': `
      <p><strong>Schema Edit Mode</strong></p>
      <p>Switch between row-based schema editing and text schema editing.</p>
      <p>Row mode is useful for guided field editing, while text mode is useful for quick bulk updates.</p>
    `,
  'shared-schema-mode-help': `
      <p><strong>Schema Edit Mode</strong></p>
      <p>Switch between row-based schema editing and text schema editing.</p>
      <p>Row mode is useful for guided field editing, while text mode is useful for quick bulk updates.</p>
    `,
  'shared-schema-help': `
      <p><strong>Schema Field Help</strong></p>
      <p>Open help for the current schema command or field type.</p>
    `,
  'shared-generator-preview-help': `
      <p>Show a preview of the defined items count in the Output Preview area.</p>
    `,
  'shared-generator-generate-data-help': `
      <p>Generate Data for currently defined rows and output format to file.</p>
      <p><a class="helplink" href="https://anywaydata.com/docs/test-data/generate-to-file" target="_blank" rel="noopener noreferrer">Generate To File docs</a></p>
    `,
  'shared-generator-pairwise-help': `
      <p>Generate Pairwise Data from schema to a file.</p>
      <p><a class="helplink" href="https://anywaydata.com/docs/test-data/pairwise-testing" target="_blank" rel="noopener noreferrer">Pairwise testing docs</a></p>
    `,
  'generator-preview-help': `
      <p>Show a preview of the defined items count in the Output Preview area.</p>
    `,
  'generator-generate-data-help': `
      <p>Generate Data for currently defined rows and output format to file.</p>
      <p><a class="helplink" href="https://anywaydata.com/docs/test-data/generate-to-file" target="_blank" rel="noopener noreferrer">Generate To File docs</a></p>
    `,
  'generator-pairwise-help': `
      <p>Generate Pairwise Data from schema to a file.</p>
      <p><a class="helplink" href="https://anywaydata.com/docs/test-data/pairwise-testing" target="_blank" rel="noopener noreferrer">Pairwise testing docs</a></p>
    `,
};

const appOnlyInlineHelpEntries = {
  'test-data-text-schema-help': `
      <p>Define schema as repeating line pairs:</p>
      <ul>
        <li>Line 1: column header name</li>
        <li>Line 2: data definition</li>
      </ul>
      <p>Definition types:</p>
      <ul>
        <li><strong>Literal</strong>: fixed text value for every generated row.</li>
        <li><strong>Enum</strong>: choose from listed values, e.g. <code>enum("Open","In Progress","Closed")</code>.</li>
        <li><strong>RegEx</strong>: generate values from a regex pattern, e.g. <code>[A-Z]{3}-\\d{4}</code>.</li>
        <li><strong>Faker</strong>: realistic random values, e.g. <code>person.fullName</code>.</li>
      </ul>
      <button type="button" class="testdata-schema-sample-button">Load Sample Schema</button>
    `,
  'instructions-summary-title': `
      <p>This app converts table data between formats, and lets you edit directly in the grid.</p>
      <ul>
        <li>Use import/export controls to switch between text formats and grid data.</li>
        <li>Use column and row controls directly in the grid to shape your table.</li>
      </ul>
      <button type="button" class="instructions-sample-data-button" data-role="instructions-action-button" data-action-id="load-sample-data">Load Sample Data</button>
    `,
  'test-data-summary-title': `
      <p>The Test Data section allows you to randomly generate data to populate the grid. You can then export to the various supported formats.</p>
      <p><a class="helplink" href="/docs/test-data/test-data-generation" target="anywaydatadocs">Learn more</a></p>
    `,
};

export { sharedInlineHelpEntries, appOnlyInlineHelpEntries };
