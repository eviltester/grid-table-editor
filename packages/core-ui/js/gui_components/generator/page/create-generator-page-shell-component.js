import { GeneratorPageShellController } from './generator-page-shell-controller.js';
import { GeneratorPageShellView } from './generator-page-shell-view.js';

function createGeneratorPageShellComponent({ root, props = {} } = {}) {
  const controller = new GeneratorPageShellController({ props });
  const view = new GeneratorPageShellView({
    root,
    controller,
  });

  view.mount();

  return {
    update(nextProps) {
      controller.updateProps(nextProps);
      view.render();
    },
    destroy() {
      view.destroy();
    },
    getState() {
      return controller.getState();
    },
  };
}

export { createGeneratorPageShellComponent };
