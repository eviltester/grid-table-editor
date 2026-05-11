const UI_PANEL_ONLY_OPTION_TIPS_BY_ID = {
  'dsv-option-custom-delimiter': 'When Delimiter is set to Custom Value, enter the delimiter character here.',
  'json-option-custom-delimiter': 'When Delimiter is Custom Value, enter the indentation character here.',
  'html-option-custom-delimiter': 'When Delimiter is Custom Value, enter the indentation character here.',
  'java-option-custom-delimiter': 'When Delimiter is Custom Value, this value is used as indentation.',
  'csharp-option-custom-delimiter': 'When Delimiter is Custom Value, this value is used as indentation.',
  'kotlin-option-custom-delimiter': 'When Delimiter is Custom Value, this value is used as indentation.',
  'perl-option-custom-delimiter': 'When Delimiter is Custom Value, this value is used as indentation.',
  'php-option-custom-delimiter': 'When Delimiter is Custom Value, this value is used as indentation.',
  'python-option-custom-delimiter': 'When Delimiter is Custom Value, this value is used as indentation.',
  'ruby-option-custom-delimiter': 'When Delimiter is Custom Value, this value is used as indentation.',
  'typescript-option-custom-delimiter': 'When Delimiter is Custom Value, this value is used as indentation.',
  'test-framework-option-framework':
    'Choose the unit test framework for the current language tab. Output syntax and available strategies depend on this choice.',
  'csharp-option-collection-type': 'Choose whether rows are emitted as an array or list-like collection type.',
  'csharp-option-assign-variable': 'Assign generated output to a named variable declaration.',
  'csharp-option-variable-name': 'Variable name to use when assignment is enabled.',
  'csharp-option-quote-numbers': 'Emit numeric values as quoted strings instead of numeric literals.',
  'csharp-option-dictionary-value-type': 'Select the value type used for dictionary/map representations.',
  'csharp-option-anonymous-objects': 'Use anonymous objects instead of dictionary/map objects when possible.',
  'csharp-option-class-name': 'Class/object name used for generated object instances.',
  'csharp-option-pretty-print': 'Format output with indentation and line breaks for readability.',
  'csharp-option-delimiter': 'Select indentation style used by pretty print.',
  'kotlin-option-collection-type': 'Choose whether rows are emitted as arrayOf(...) or listOf(...).',
  'kotlin-option-assign-variable': 'Assign generated output to a named variable declaration.',
  'kotlin-option-mutable-assignment': 'Use mutable variable assignment (var) instead of immutable (val).',
  'kotlin-option-variable-name': 'Variable name to use when assignment is enabled.',
  'kotlin-option-quote-numbers': 'Emit numeric values as quoted strings instead of numeric literals.',
  'kotlin-option-anonymous-objects': 'Use anonymous maps instead of named class instances when possible.',
  'kotlin-option-mutable-collections': 'Prefer mutable collection constructors in generated output.',
  'kotlin-option-class-name': 'Class/object name used for generated object instances.',
  'kotlin-option-pretty-print': 'Format output with indentation and line breaks for readability.',
  'kotlin-option-delimiter': 'Select indentation style used by pretty print.',
  'kotlin-option-trailing-comma': 'Include trailing commas in multi-line collections when supported.',
  'perl-option-collection-type': 'Choose whether rows are emitted as array ref or list syntax.',
  'perl-option-assign-variable': 'Assign generated output to a named variable declaration.',
  'perl-option-variable-name': 'Variable name to use when assignment is enabled.',
  'perl-option-quote-numbers': 'Emit numeric values as quoted strings instead of numeric literals.',
  'perl-option-hash-key-style': 'Choose quoted or bareword style for hash keys.',
  'perl-option-anonymous-objects': 'Use anonymous hash/map style for row objects.',
  'perl-option-class-name': 'Class/object name used for generated object instances.',
  'perl-option-object-instantiation-style': 'Choose bless(...) or constructor style object instantiation.',
  'perl-option-pretty-print': 'Format output with indentation and line breaks for readability.',
  'perl-option-delimiter': 'Select indentation style used by pretty print.',
  'php-option-collection-type': 'Choose whether rows are emitted with array() or short list syntax.',
  'php-option-include-php-tag': 'Include the opening <?php tag in generated output.',
  'php-option-short-array-syntax': 'Prefer short array syntax [ ... ] when possible.',
  'php-option-assign-variable': 'Assign generated output to a named variable declaration.',
  'php-option-variable-name': 'Variable name to use when assignment is enabled.',
  'php-option-quote-numbers': 'Emit numeric values as quoted strings instead of numeric literals.',
  'php-option-object-representation': 'Choose how objects are represented: arrays, stdClass, or named classes.',
  'php-option-class-name': 'Class/object name used for generated object instances.',
  'php-option-array-key-quote-style': 'Select whether array keys are quoted or unquoted.',
  'php-option-blank-value-behavior': 'Choose whether blank values become empty strings or null.',
  'php-option-coerce-boolean-literals': 'Convert string literals "true"/"false" into booleans.',
  'php-option-coerce-null-literal': 'Convert string literal "null" into null.',
  'php-option-php-compatibility': 'Target PHP language compatibility level for generated syntax.',
  'php-option-class-property-typing': 'Choose typed or untyped class properties for class output.',
  'php-option-use-constructor-promotion': 'Use constructor property promotion when targeting PHP 8+.',
  'php-option-constructor-arg-style': 'Choose positional or named constructor argument style.',
  'php-option-pretty-print': 'Format output with indentation and line breaks for readability.',
  'php-option-delimiter': 'Select indentation style used by pretty print.',
  'ruby-option-collection-type': 'Choose whether rows are emitted as array literals or Array[...] style.',
  'ruby-option-assign-variable': 'Assign generated output to a named variable declaration.',
  'ruby-option-variable-name': 'Variable name to use when assignment is enabled.',
  'ruby-option-output-wrapper': 'Wrap output as plain assignment or RSpec let helper.',
  'ruby-option-quote-numbers': 'Emit numeric values as quoted strings instead of numeric literals.',
  'ruby-option-hash-key-style': 'Choose string-key or symbol-key hash output style.',
  'ruby-option-anonymous-objects': 'Use anonymous hash/map style for row objects.',
  'ruby-option-class-name': 'Class/object name used for generated object instances.',
  'ruby-option-object-representation': 'Choose class, struct, or data object representation.',
  'ruby-option-field-name-style': 'Keep field names as-is or convert to snake_case.',
  'ruby-option-pretty-print': 'Format output with indentation and line breaks for readability.',
  'ruby-option-hash-pretty-style': 'Choose compact or aligned multi-line hash formatting style.',
  'ruby-option-delimiter': 'Select indentation style used by pretty print.',
};

function applyUiPanelOnlyTips(rootElement, ids = undefined) {
  if (!rootElement) {
    return;
  }
  const resolvedIds = Array.isArray(ids)
    ? ids
    : Array.from(rootElement.querySelectorAll('.option-help-icon[data-help]'))
        .map((elem) => elem.getAttribute('data-help'))
        .filter(Boolean);

  for (const id of resolvedIds) {
    const elem = rootElement.querySelector(`[data-help='${id}']`);
    if (!elem) {
      continue;
    }
    const tip = UI_PANEL_ONLY_OPTION_TIPS_BY_ID[id] || `Help for option '${id}'.`;
    elem.setAttribute('data-help-text', tip);
    elem.setAttribute('data-ui-tip-key', id);
  }
}

export { UI_PANEL_ONLY_OPTION_TIPS_BY_ID, applyUiPanelOnlyTips };
