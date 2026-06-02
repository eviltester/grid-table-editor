import { JSDOM } from 'jsdom';
import { fireEvent } from '@testing-library/dom';
import { jest } from '@jest/globals';
import { createRowCountControl } from '../../../js/gui_components/shared/row-count-control/index.js';

describe('row-count-control view', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
    global.window = dom.window;
    global.document = dom.window.document;
    global.Event = dom.window.Event;
  });

  afterEach(() => {
    dom.window.close();
    delete global.window;
    delete global.document;
    delete global.Event;
  });

  test('renders label and normalizes invalid input through the mounted component', () => {
    const root = document.getElementById('root');
    const onChange = jest.fn();
    const component = createRowCountControl({
      root,
      props: {
        inputId: 'generateCount',
        label: 'How Many?',
        min: 1,
        step: 1,
        value: 1,
        normalizeOnInput: true,
      },
      callbacks: { onChange },
    });

    const input = root.querySelector('#generateCount');
    expect(root.textContent).toContain('How Many?');
    expect(input.value).toBe('1');

    input.value = '-4';
    fireEvent.input(input, { target: { value: '-4' } });

    expect(input.value).toBe('1');
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        rawValue: '-4',
      })
    );

    component.destroy();
    expect(root.children.length).toBe(0);
  });

  test('normalizes browser-sanitized invalid text input through the mounted component when configured to normalize on input', () => {
    const root = document.getElementById('root');
    const onChange = jest.fn();
    createRowCountControl({
      root,
      props: {
        inputId: 'generateCount',
        label: 'How Many?',
        min: 1,
        step: 1,
        value: 1,
        normalizeOnInput: true,
      },
      callbacks: { onChange },
    });

    const input = root.querySelector('#generateCount');
    input.value = '';
    fireEvent.input(input, { target: { value: '' } });

    expect(input.value).toBe('1');
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        rawValue: '',
        parsed: {
          value: 1,
          valid: true,
          errors: [],
        },
      })
    );
  });

  test('preserves max-exceeding numeric values through the mounted component when not normalizing on input', () => {
    const root = document.getElementById('root');
    const onChange = jest.fn();
    createRowCountControl({
      root,
      props: {
        inputId: 'previewRowsCount',
        label: 'Preview Items Count',
        min: 0,
        max: 50,
        step: 1,
        value: 10,
        normalizeOnInput: false,
      },
      callbacks: { onChange },
    });

    const input = root.querySelector('#previewRowsCount');
    input.value = '999';
    fireEvent.input(input, { target: { value: '999' } });

    expect(input.value).toBe('999');
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        rawValue: '999',
        parsed: {
          value: 50,
          valid: false,
          errors: ['previewRowsCount must be less than or equal to 50.'],
        },
      })
    );
  });

  test('destroy removes listeners so detached inputs no longer emit changes', () => {
    const root = document.getElementById('root');
    const onChange = jest.fn();
    const component = createRowCountControl({
      root,
      props: {
        inputId: 'generateCount',
        label: 'How Many?',
        min: 1,
        step: 1,
        value: 1,
        normalizeOnInput: true,
      },
      callbacks: { onChange },
    });

    const input = root.querySelector('#generateCount');
    component.destroy();

    input.value = '7';
    fireEvent.input(input, { target: { value: '7' } });

    expect(onChange).not.toHaveBeenCalled();
    expect(root.children.length).toBe(0);
  });

  test('can be created without a global document when a root element is provided', () => {
    const root = document.getElementById('root');
    const originalDocument = global.document;
    const originalWindow = global.window;
    const originalEvent = global.Event;

    try {
      delete global.document;
      delete global.window;
      delete global.Event;

      const component = createRowCountControl({
        root,
        props: {
          inputId: 'generateCount',
          label: 'How Many?',
          min: 1,
          step: 1,
          value: 3,
        },
      });

      const input = root.querySelector('#generateCount');
      expect(input?.value).toBe('3');
      expect(root.textContent).toContain('How Many?');

      component.destroy();
    } finally {
      global.document = originalDocument;
      global.window = originalWindow;
      global.Event = originalEvent;
    }
  });
});
