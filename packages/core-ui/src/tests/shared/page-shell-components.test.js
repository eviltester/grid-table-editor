import { JSDOM } from 'jsdom';
import * as appPageRuntimeExports from '../../../js/gui_components/app/page/app-page-runtime.js';
import { createAppPageComponent } from '../../../js/gui_components/app/page/app-page-shell.js';
import * as generatorPageExports from '../../../js/gui_components/generator/page/index.js';
import { createGeneratorPageShellComponent } from '../../../js/gui_components/generator/page/create-generator-page-shell-component.js';

describe('page shell components', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
    global.window = dom.window;
    global.document = dom.window.document;
  });

  afterEach(() => {
    dom.window.close();
    delete global.window;
    delete global.document;
  });

  test('page runtime entries stay narrow', () => {
    expect(typeof appPageRuntimeExports.bootstrapApp).toBe('function');
    expect(appPageRuntimeExports.createAppPageComponent).toBeUndefined();
    expect(appPageRuntimeExports.AppPageShellController).toBeUndefined();
    expect(appPageRuntimeExports.AppPageShellView).toBeUndefined();
    expect(typeof generatorPageExports.createGeneratorPageComponent).toBe('function');
    expect(generatorPageExports.createGeneratorPageShellComponent).toBeUndefined();
    expect(generatorPageExports.GeneratorPageShellController).toBeUndefined();
    expect(generatorPageExports.GeneratorPageShellView).toBeUndefined();
  });

  test('app page component renders shared app shell structure', () => {
    const root = document.getElementById('root');
    const component = createAppPageComponent({
      root,
      props: {
        showTestDataOpen: true,
      },
    });

    expect(root.querySelector('#page-instructions')).not.toBeNull();
    expect(root.querySelector('#main-grid-view')).not.toBeNull();
    expect(root.querySelector('#import-export-controls')).not.toBeNull();
    expect(root.querySelector('#testDataGeneratorContainer')).not.toBeNull();
    expect(root.querySelector('[data-role="test-data-details-content"]')?.hasAttribute('inert')).toBe(false);
    expect(root.querySelector('[data-role="test-data-details-content"]')?.getAttribute('aria-hidden')).toBeNull();
    expect(root.querySelector('.header')).toBeNull();
    expect(root.querySelector('#initial-load')).toBeNull();
    expect(root.querySelector('.testDataSchemaGui details')?.hasAttribute('open')).toBe(true);
    expect(root.querySelector('.importexport details')).toBeNull();
    expect(
      Array.from(root.querySelector('.main-app')?.children || []).map((element) => {
        if (element.id) {
          return element.id;
        }

        if (element.classList.contains('testDataSchemaGui')) {
          return 'testDataSchemaGui';
        }

        return element.tagName.toLowerCase();
      })
    ).toEqual(['main-grid-view', 'testDataSchemaGui', 'import-export-controls']);

    component.destroy();
    expect(root.children.length).toBe(0);
  });

  test('app page shell excludes collapsed test data content from focus order', () => {
    const root = document.getElementById('root');
    const component = createAppPageComponent({
      root,
    });
    const detailsElement = root.querySelector('[data-role="test-data-details"]');
    const contentElement = root.querySelector('[data-role="test-data-details-content"]');

    expect(detailsElement.open).toBe(false);
    expect(contentElement.hasAttribute('inert')).toBe(true);
    expect(contentElement.inert).toBe(true);
    expect(contentElement.getAttribute('aria-hidden')).toBe('true');

    detailsElement.open = true;
    detailsElement.dispatchEvent(new dom.window.Event('toggle'));

    expect(contentElement.hasAttribute('inert')).toBe(false);
    expect(contentElement.inert).toBe(false);
    expect(contentElement.getAttribute('aria-hidden')).toBeNull();

    component.destroy();
    expect(root.children.length).toBe(0);
  });

  test('generator page shell component renders shared generator shell structure', () => {
    const root = document.getElementById('root');
    const component = createGeneratorPageShellComponent({
      root,
    });

    expect(root.querySelector('.skip-link[href="#generator-main-content"]')).not.toBeNull();
    expect(root.querySelector('main#generator-main-content')).not.toBeNull();
    expect(root.querySelector('h1#generator-page-title')).not.toBeNull();
    expect(root.querySelector('#generator-instructions')).not.toBeNull();
    expect(root.querySelector('#generator-app')).not.toBeNull();
    expect(root.querySelector('.header')).toBeNull();
    expect(root.querySelector('#generator-initial-load')).toBeNull();

    component.destroy();
    expect(root.children.length).toBe(0);
  });
});
