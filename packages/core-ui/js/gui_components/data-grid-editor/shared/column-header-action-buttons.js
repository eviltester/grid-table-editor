import { renderIconHtml } from '../../shared/primitives/icon/index.js';

const COLUMN_HEADER_ACTIONS = [
  {
    action: 'add-left',
    legacyClassName: 'customHeaderAddLeftButton',
    title: 'Add column left',
    icon: 'add-column-left',
  },
  {
    action: 'rename',
    legacyClassName: 'customHeaderRenameButton',
    title: 'Rename column',
    icon: 'pencil',
  },
  {
    action: 'delete',
    legacyClassName: 'customHeaderDeleteButton',
    title: 'Delete column',
    icon: 'trash',
  },
  {
    action: 'duplicate',
    legacyClassName: 'customHeaderDuplicateButton',
    title: 'Duplicate column',
    icon: 'copy',
  },
  {
    action: 'add-right',
    legacyClassName: 'customHeaderAddRightButton',
    title: 'Add column right',
    icon: 'add-column-right',
  },
];

function renderColumnHeaderActionButtonsHtml() {
  return COLUMN_HEADER_ACTIONS.map(
    ({ action, legacyClassName, title, icon }) =>
      `<button type="button" class="${legacyClassName} header-icon-button" data-action="${action}" title="${title}" aria-label="${title}">${renderIconHtml(icon, { className: 'app-icon header-action-icon' })}</button>`
  ).join('');
}

function bindColumnHeaderActionButtons({ rootElement, handlers = {} } = {}) {
  const disposers = [];

  COLUMN_HEADER_ACTIONS.forEach(({ action }) => {
    const handler = handlers[action];
    const button = rootElement?.querySelector?.(`[data-action="${action}"]`);
    if (!button || typeof handler !== 'function') {
      return;
    }
    button.addEventListener('click', handler);
    disposers.push(() => button.removeEventListener('click', handler));
  });

  return {
    destroy() {
      disposers.forEach((dispose) => dispose());
    },
  };
}

export { COLUMN_HEADER_ACTIONS, renderColumnHeaderActionButtonsHtml, bindColumnHeaderActionButtons };
