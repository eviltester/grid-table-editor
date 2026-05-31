import tippy from 'tippy.js';
import '@popperjs/core';
import 'tippy.js/dist/tippy.css';
import '../apps/web/styles.css';

globalThis.tippy = tippy;

const preview = {
  parameters: {
    layout: 'fullscreen',
    controls: {
      expanded: true,
    },
    options: {
      storySort: {
        order: ['Test Data', 'Export Formats'],
      },
    },
  },
};

export default preview;
