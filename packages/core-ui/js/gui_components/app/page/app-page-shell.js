import { AppPageShellController } from './app-page-shell-controller.js';
import { AppPageShellView } from './app-page-shell-view.js';

function createAppPageComponent({ root, props = {} } = {}) {
  const controller = new AppPageShellController({ props });
  const view = new AppPageShellView({
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

export { createAppPageComponent };
