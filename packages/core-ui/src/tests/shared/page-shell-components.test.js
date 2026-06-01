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

    expect(root.querySelector('.header')).not.toBeNull();
    expect(root.querySelector('#page-instructions')).not.toBeNull();
    expect(root.querySelector('#main-grid-view')).not.toBeNull();
    expect(root.querySelector('#import-export-controls')).not.toBeNull();
    expect(root.querySelector('#testDataGeneratorContainer')).not.toBeNull();
    expect(root.querySelector('#initial-load')).not.toBeNull();
    expect(root.querySelector('.testDataSchemaGui details')?.hasAttribute('open')).toBe(true);

    component.destroy();
    expect(root.children.length).toBe(0);
  });

  test('generator page shell component renders shared generator shell structure', () => {
    const root = document.getElementById('root');
    const component = createGeneratorPageShellComponent({
      root,
    });

    expect(root.querySelector('.header')).not.toBeNull();
    expect(root.querySelector('#generator-instructions')).not.toBeNull();
    expect(root.querySelector('#generator-initial-load')).not.toBeNull();
    expect(root.querySelector('#generator-app')).not.toBeNull();

    component.destroy();
    expect(root.children.length).toBe(0);
  });
});
