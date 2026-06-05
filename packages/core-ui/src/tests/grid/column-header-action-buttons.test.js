import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import {
  bindColumnHeaderActionButtons,
  renderColumnHeaderActionButtonsHtml,
} from '../../../js/gui_components/data-grid-editor/shared/column-header-action-buttons.js';

describe('column header action buttons helpers', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body><div id="host"></div></body></html>');
  });

  afterEach(() => {
    dom.window.close();
  });

  test('render helper emits the shared action buttons with data-action hooks', () => {
    const host = dom.window.document.getElementById('host');
    host.innerHTML = renderColumnHeaderActionButtonsHtml();

    const addLeftButton = host.querySelector('[data-action="add-left"]');
    const renameButton = host.querySelector('[data-action="rename"]');
    const deleteButton = host.querySelector('[data-action="delete"]');
    const duplicateButton = host.querySelector('[data-action="duplicate"]');
    const addRightButton = host.querySelector('[data-action="add-right"]');

    expect(addLeftButton?.getAttribute('title')).toBe('Add column left');
    expect(renameButton?.getAttribute('aria-label')).toBe('Rename column');
    expect(deleteButton?.classList.contains('customHeaderDeleteButton')).toBe(true);
    expect(duplicateButton?.querySelector('svg.header-action-icon')).not.toBeNull();
    expect(addRightButton?.getAttribute('type')).toBe('button');
  });

  test('bind helper wires only the provided action handlers and cleans them up', () => {
    const host = dom.window.document.getElementById('host');
    host.innerHTML = renderColumnHeaderActionButtonsHtml();
    const onAddLeft = jest.fn();
    const onRename = jest.fn();

    const binding = bindColumnHeaderActionButtons({
      rootElement: host,
      handlers: {
        'add-left': onAddLeft,
        rename: onRename,
      },
    });

    host.querySelector('[data-action="add-left"]').click();
    host.querySelector('[data-action="rename"]').click();
    host.querySelector('[data-action="delete"]').click();

    expect(onAddLeft).toHaveBeenCalledTimes(1);
    expect(onRename).toHaveBeenCalledTimes(1);

    binding.destroy();
    host.querySelector('[data-action="add-left"]').click();
    expect(onAddLeft).toHaveBeenCalledTimes(1);
  });
});
