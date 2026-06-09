const SVG_NS = 'http://www.w3.org/2000/svg';

const ICONS = {
  'add-column-left': [
    ['path', { d: 'M13 5h8v14h-8z' }],
    ['path', { d: 'M3 12h7' }],
    ['path', { d: 'm6 9-3 3 3 3' }],
    ['path', { d: 'M17 9v6' }],
    ['path', { d: 'M14 12h6' }],
  ],
  'add-column-right': [
    ['path', { d: 'M3 5h8v14H3z' }],
    ['path', { d: 'M14 12h7' }],
    ['path', { d: 'm18 9 3 3-3 3' }],
    ['path', { d: 'M7 9v6' }],
    ['path', { d: 'M4 12h6' }],
  ],
  'arrow-down': [
    ['path', { d: 'M12 5v14' }],
    ['path', { d: 'm19 12-7 7-7-7' }],
  ],
  'arrow-up': [
    ['path', { d: 'm5 12 7-7 7 7' }],
    ['path', { d: 'M12 19V5' }],
  ],
  'circle-help': [
    ['circle', { cx: '12', cy: '12', r: '10' }],
    ['path', { d: 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3' }],
    ['path', { d: 'M12 17h.01' }],
  ],
  copy: [
    ['rect', { x: '9', y: '9', width: '13', height: '13', rx: '2', ry: '2' }],
    ['path', { d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' }],
  ],
  'clipboard-paste': [
    ['path', { d: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2' }],
    ['rect', { x: '8', y: '2', width: '8', height: '4', rx: '1', ry: '1' }],
    ['path', { d: 'M12 10v8' }],
    ['path', { d: 'm8.5 14 3.5 4 3.5-4' }],
  ],
  file: [
    ['path', { d: 'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z' }],
    ['path', { d: 'M14 2v6h6' }],
  ],
  'file-plus': [
    ['path', { d: 'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z' }],
    ['path', { d: 'M14 2v6h6' }],
    ['path', { d: 'M12 11v6' }],
    ['path', { d: 'M9 14h6' }],
  ],
  filter: [['path', { d: 'M22 3H2l8 9.46V19l4 2v-8.54z' }]],
  grid: [
    ['rect', { x: '3', y: '4', width: '18', height: '16', rx: '1', ry: '1' }],
    ['path', { d: 'M3 10h18' }],
    ['path', { d: 'M3 15h18' }],
    ['path', { d: 'M9 4v16' }],
    ['path', { d: 'M15 4v16' }],
  ],
  'grip-vertical': [
    ['circle', { cx: '9', cy: '6', r: '1' }],
    ['circle', { cx: '9', cy: '12', r: '1' }],
    ['circle', { cx: '9', cy: '18', r: '1' }],
    ['circle', { cx: '15', cy: '6', r: '1' }],
    ['circle', { cx: '15', cy: '12', r: '1' }],
    ['circle', { cx: '15', cy: '18', r: '1' }],
  ],
  minus: [['path', { d: 'M5 12h14' }]],
  pencil: [
    ['path', { d: 'M21.174 6.812a1 1 0 0 0-1.414-1.414L5 20.158 2 22l1.842-3 14.76-14.76a1 1 0 0 1 1.414 0z' }],
    ['path', { d: 'm15 5 4 4' }],
  ],
  plus: [
    ['path', { d: 'M5 12h14' }],
    ['path', { d: 'M12 5v14' }],
  ],
  settings: [
    ['circle', { cx: '12', cy: '12', r: '3' }],
    [
      'path',
      {
        d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82L4.21 7.2a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
      },
    ],
  ],
  trash: [
    ['path', { d: 'M3 6h18' }],
    ['path', { d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6' }],
    ['path', { d: 'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' }],
    ['path', { d: 'M10 11v6' }],
    ['path', { d: 'M14 11v6' }],
  ],
  x: [
    ['path', { d: 'M18 6 6 18' }],
    ['path', { d: 'm6 6 12 12' }],
  ],
};

function escapeAttribute(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function getIconDefinition(name) {
  const icon = ICONS[name];
  if (!icon) {
    throw new Error(`Unknown icon "${name}"`);
  }
  return icon;
}

function createIconElement(documentObj, name, options = {}) {
  if (!documentObj?.createElementNS) {
    throw new Error('createIconElement requires a document with createElementNS');
  }

  const svg = documentObj.createElementNS(SVG_NS, 'svg');
  const className = options.className || 'app-icon';
  svg.setAttribute('xmlns', SVG_NS);
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', String(options.size || 16));
  svg.setAttribute('height', String(options.size || 16));
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', String(options.strokeWidth || 2));
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('class', className);
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');

  getIconDefinition(name).forEach(([tagName, attributes]) => {
    const child = documentObj.createElementNS(SVG_NS, tagName);
    Object.entries(attributes).forEach(([key, value]) => {
      child.setAttribute(key, value);
    });
    svg.appendChild(child);
  });

  return svg;
}

function renderIconHtml(name, options = {}) {
  const className = escapeAttribute(options.className || 'app-icon');
  const size = escapeAttribute(options.size || 16);
  const strokeWidth = escapeAttribute(options.strokeWidth || 2);
  const children = getIconDefinition(name)
    .map(([tagName, attributes]) => {
      const attributeText = Object.entries(attributes)
        .map(([key, value]) => `${key}="${escapeAttribute(value)}"`)
        .join(' ');
      return `<${tagName} ${attributeText}></${tagName}>`;
    })
    .join('');

  return `<svg xmlns="${SVG_NS}" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" class="${className}" aria-hidden="true" focusable="false">${children}</svg>`;
}

function decorateIconContainer(element, iconName, options = {}) {
  if (!element?.ownerDocument) {
    return null;
  }
  element.querySelector?.('svg.app-icon')?.remove();
  const icon = createIconElement(element.ownerDocument, iconName, options);
  element.prepend(icon);
  return icon;
}

export { createIconElement, decorateIconContainer, renderIconHtml };
