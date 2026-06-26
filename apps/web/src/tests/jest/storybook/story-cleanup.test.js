import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import {
  cleanupStoryEnvironment,
  destroyTippyInstances,
  registerStoryCleanup,
  renderStoryWithCleanup,
  removeStoryArtifacts,
} from '../../../stories/story-cleanup.js';
import { openMethodPickerModal } from '../../../../../../packages/core-ui/js/gui_components/shared/test-data/ui/method-picker-modal.js';

describe('story cleanup helpers', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body></body></html>');
    global.document = dom.window.document;
  });

  afterEach(() => {
    dom.window.close();
    delete global.document;
  });

  test('cleanupStoryEnvironment runs the previous registered cleanup before a new story renders', () => {
    const firstRoot = document.createElement('section');
    firstRoot.__storybookCleanup = jest.fn();
    document.body.appendChild(firstRoot);

    registerStoryCleanup(firstRoot, document);
    cleanupStoryEnvironment(document);

    expect(firstRoot.__storybookCleanup).toHaveBeenCalledTimes(1);
    expect(document.body.contains(firstRoot)).toBe(false);
  });

  test('removeStoryArtifacts clears known modal, tooltip, and help-container leftovers', () => {
    document.body.innerHTML = `
      <div id="confirm-modal-backdrop"></div>
      <div id="text-input-modal-backdrop"></div>
      <div data-role="method-picker-overlay"></div>
      <div class="tippy-box"></div>
      <div class="tippy-popper"></div>
      <div id="inline-help-items"></div>
    `;

    removeStoryArtifacts(document);

    expect(document.body.children).toHaveLength(0);
  });

  test('removeStoryArtifacts restores method picker scroll lock when clearing a stale overlay', () => {
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'scroll';

    openMethodPickerModal({
      documentObj: document,
      windowObj: dom.window,
      options: [{ sourceType: 'domain', command: 'number.int', helpModel: { summary: '', params: [], example: '' } }],
      currentCommand: 'number.int',
    });

    expect(document.querySelector('[data-role="method-picker-overlay"]')).not.toBeNull();
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.documentElement.style.overflow).toBe('hidden');

    removeStoryArtifacts(document);

    expect(document.querySelector('[data-role="method-picker-overlay"]')).toBeNull();
    expect(document.body.style.overflow).toBe('auto');
    expect(document.documentElement.style.overflow).toBe('scroll');
  });

  test('registerStoryCleanup supports async story results', async () => {
    const root = document.createElement('section');
    root.__storybookCleanup = jest.fn();
    document.body.appendChild(root);

    const result = await registerStoryCleanup(Promise.resolve(root), document);
    expect(result).toBe(root);

    cleanupStoryEnvironment(document);
    expect(root.__storybookCleanup).toHaveBeenCalledTimes(1);
  });

  test('registerStoryCleanup supports multiple concurrent roots before cleanup runs', () => {
    const firstRoot = document.createElement('section');
    firstRoot.dataset.story = 'first';
    firstRoot.__storybookCleanup = jest.fn();
    document.body.appendChild(firstRoot);

    const secondRoot = document.createElement('section');
    secondRoot.dataset.story = 'second';
    secondRoot.__storybookCleanup = jest.fn();
    document.body.appendChild(secondRoot);

    registerStoryCleanup(firstRoot, document);
    registerStoryCleanup(secondRoot, document);

    cleanupStoryEnvironment(document);

    expect(firstRoot.__storybookCleanup).toHaveBeenCalledTimes(1);
    expect(secondRoot.__storybookCleanup).toHaveBeenCalledTimes(1);
    expect(document.body.contains(firstRoot)).toBe(false);
    expect(document.body.contains(secondRoot)).toBe(false);
  });

  test('cleanupStoryEnvironment clears the previous story before registering the next one', () => {
    const firstRoot = document.createElement('section');
    firstRoot.dataset.story = 'first';
    firstRoot.__storybookCleanup = jest.fn(() => {
      firstRoot.remove();
      const leftoverTooltip = document.querySelector('.tippy-box');
      leftoverTooltip?.remove();
    });
    document.body.appendChild(firstRoot);
    const firstTooltip = document.createElement('div');
    firstTooltip.className = 'tippy-box';
    document.body.appendChild(firstTooltip);
    registerStoryCleanup(firstRoot, document);

    cleanupStoryEnvironment(document);

    const secondRoot = document.createElement('section');
    secondRoot.dataset.story = 'second';
    secondRoot.__storybookCleanup = jest.fn();
    document.body.appendChild(secondRoot);
    registerStoryCleanup(secondRoot, document);

    expect(firstRoot.__storybookCleanup).toHaveBeenCalledTimes(1);
    expect(document.body.contains(firstRoot)).toBe(false);
    expect(document.querySelector('.tippy-box')).toBeNull();
    expect(document.body.contains(secondRoot)).toBe(true);
  });

  test('renderStoryWithCleanup simulates sequential Storybook story mounts and clears prior roots plus artifacts', async () => {
    const firstRoot = await renderStoryWithCleanup(() => {
      const root = document.createElement('section');
      root.dataset.story = 'first';
      root.__storybookCleanup = jest.fn(() => {
        root.remove();
      });
      document.body.appendChild(root);

      const modal = document.createElement('div');
      modal.id = 'confirm-modal-backdrop';
      document.body.appendChild(modal);

      const tooltipTrigger = document.createElement('button');
      tooltipTrigger._tippy = { destroy: jest.fn() };
      document.body.appendChild(tooltipTrigger);

      const tooltipBox = document.createElement('div');
      tooltipBox.className = 'tippy-box';
      document.body.appendChild(tooltipBox);

      return root;
    }, document);

    expect(document.body.contains(firstRoot)).toBe(true);
    expect(document.getElementById('confirm-modal-backdrop')).not.toBeNull();
    expect(document.querySelector('.tippy-box')).not.toBeNull();

    const secondRoot = await renderStoryWithCleanup(() => {
      const root = document.createElement('section');
      root.dataset.story = 'second';
      root.__storybookCleanup = jest.fn();
      document.body.appendChild(root);
      return root;
    }, document);

    expect(firstRoot.__storybookCleanup).toHaveBeenCalledTimes(1);
    expect(document.body.contains(firstRoot)).toBe(false);
    expect(document.getElementById('confirm-modal-backdrop')).toBeNull();
    expect(document.querySelector('.tippy-box')).toBeNull();
    expect(document.body.contains(secondRoot)).toBe(true);
  });

  test('renderStoryWithCleanup can preserve existing roots for docs-style multi-canvas rendering', async () => {
    const firstRoot = await renderStoryWithCleanup(
      () => {
        const root = document.createElement('section');
        root.dataset.story = 'first';
        root.__storybookCleanup = jest.fn();
        document.body.appendChild(root);
        return root;
      },
      document,
      { cleanupExisting: false }
    );

    const secondRoot = await renderStoryWithCleanup(
      () => {
        const root = document.createElement('section');
        root.dataset.story = 'second';
        root.__storybookCleanup = jest.fn();
        document.body.appendChild(root);
        return root;
      },
      document,
      { cleanupExisting: false }
    );

    expect(document.body.contains(firstRoot)).toBe(true);
    expect(document.body.contains(secondRoot)).toBe(true);

    cleanupStoryEnvironment(document);

    expect(firstRoot.__storybookCleanup).toHaveBeenCalledTimes(1);
    expect(secondRoot.__storybookCleanup).toHaveBeenCalledTimes(1);
    expect(document.body.contains(firstRoot)).toBe(false);
    expect(document.body.contains(secondRoot)).toBe(false);
  });

  test('destroyTippyInstances tears down registered tooltip instances before artifact removal', () => {
    const trigger = document.createElement('button');
    trigger._tippy = { destroy: jest.fn() };
    document.body.appendChild(trigger);

    destroyTippyInstances(document);

    expect(trigger._tippy.destroy).toHaveBeenCalledTimes(1);
  });
});
