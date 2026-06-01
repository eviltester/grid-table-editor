import { bootstrapApp } from './gui_components/app/page/index.js';

// setup the grid after the page has finished loading
if (typeof document !== 'undefined') {
  const runBootstrap = async function () {
    await bootstrapApp();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runBootstrap, { once: true });
  } else {
    runBootstrap();
  }
}

export { bootstrapApp };
