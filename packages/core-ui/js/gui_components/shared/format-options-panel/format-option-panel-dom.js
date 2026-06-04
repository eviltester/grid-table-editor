function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function optionHtml(options = []) {
  return options
    .map((option) => `<option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`)
    .join('');
}

function selectorForName(name) {
  return `[name='${name}']`;
}

function setSelectValue(select, value, fallback) {
  if (!select) {
    return;
  }
  const resolved = value ?? fallback;
  const hasValue = Array.from(select.options).some((option) => option.value === resolved);
  select.value = hasValue ? resolved : (fallback ?? select.options[0]?.value ?? '');
}

export { escapeHtml, optionHtml, selectorForName, setSelectValue };
