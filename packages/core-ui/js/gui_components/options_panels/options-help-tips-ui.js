const UI_PANEL_ONLY_OPTION_TIPS_BY_ID = {
  'dsv-option-custom-delimiter': 'When Delimiter is set to Custom Value, enter the delimiter character here.',
  'json-option-custom-delimiter': 'When Delimiter is Custom Value, enter the indentation character here.',
  'html-option-custom-delimiter': 'When Delimiter is Custom Value, enter the indentation character here.',
  'java-option-custom-delimiter': 'When Delimiter is Custom Value, this value is used as indentation.',
  'python-option-custom-delimiter': 'When Delimiter is Custom Value, this value is used as indentation.',
  'typescript-option-custom-delimiter': 'When Delimiter is Custom Value, this value is used as indentation.',
  'test-framework-option-framework':
    'Choose the unit test framework for the current language tab. Output syntax and available strategies depend on this choice.',
};

function applyUiPanelOnlyTips(rootElement, ids = Object.keys(UI_PANEL_ONLY_OPTION_TIPS_BY_ID)) {
  if (!rootElement || !Array.isArray(ids)) {
    return;
  }
  for (const id of ids) {
    const elem = rootElement.querySelector(`[data-help='${id}']`);
    if (!elem) {
      continue;
    }
    const tip = UI_PANEL_ONLY_OPTION_TIPS_BY_ID[id];
    if (tip) {
      elem.setAttribute('data-help-text', tip);
      elem.setAttribute('data-ui-tip-key', id);
    }
  }
}

export { UI_PANEL_ONLY_OPTION_TIPS_BY_ID, applyUiPanelOnlyTips };
