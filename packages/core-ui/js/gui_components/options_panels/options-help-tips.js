import { getTipsForFormat } from '@anywaydata/core';

function applySharedOptionTips(rootElement, format, bindings = []) {
  if (!rootElement || !format || !Array.isArray(bindings) || bindings.length === 0) {
    return;
  }

  const tips = getTipsForFormat(format);
  for (const binding of bindings) {
    const elem = rootElement.querySelector(binding.selector);
    if (!elem) {
      continue;
    }
    const tip = tips?.[binding.key] || binding.fallback;
    if (tip) {
      elem.setAttribute('data-help-text', tip);
    }
    elem.setAttribute('data-option-key', binding.key);
    elem.setAttribute('data-option-format', format);
  }
}

export { applySharedOptionTips };
