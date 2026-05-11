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
