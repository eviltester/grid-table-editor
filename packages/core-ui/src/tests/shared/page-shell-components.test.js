import { JSDOM } from 'jsdom';
import { createAppPageComponent } from '../../../js/gui_components/app/page/index.js';
import { createGeneratorPageShellComponent } from '../../../js/gui_components/generator/page/index.js';

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
    expect(root.querySelector('.header')).toBeNull();
    expect(root.querySelector('#initial-load')).toBeNull();
    expect(root.querySelector('.testDataSchemaGui details')?.hasAttribute('open')).toBe(true);
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

  test('generator page shell component renders shared generator shell structure', () => {
    const root = document.getElementById('root');
    const component = createGeneratorPageShellComponent({
      root,
    });

    expect(root.querySelector('#generator-instructions')).not.toBeNull();
    expect(root.querySelector('#generator-app')).not.toBeNull();
    expect(root.querySelector('.header')).toBeNull();
    expect(root.querySelector('#generator-initial-load')).toBeNull();

    component.destroy();
    expect(root.children.length).toBe(0);
  });
});
