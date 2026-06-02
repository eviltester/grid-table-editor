import tippy from 'tippy.js';
import '@popperjs/core';
import 'tippy.js/dist/tippy.css';
import 'tabulator-tables/dist/css/tabulator.min.css';
import '../apps/web/styles.css';
import { renderStoryWithCleanup } from '../apps/web/src/stories/story-cleanup.js';

globalThis.tippy = tippy;

const preview = {
  decorators: [
    (Story) => renderStoryWithCleanup(Story, globalThis.document),
  ],
  parameters: {
    layout: 'fullscreen',
    controls: {
      expanded: true,
    },
    options: {
      storySort: {
        order: [
          'Pages',
          [
            'App',
            ['Page', 'TestDataGenerationPanel', 'Import Export Workspace', 'Import Export Toolbar', 'Text Preview Editor'],
            'Generator',
            ['Page', 'Controls', 'Preview'],
          ],
          'Data Grid Editor',
          'Test Data Generation',
          'Export Formats',
          ['Previews', 'Format Selector', 'Format Option Panel'],
          'Shared',
          'Primitives',
        ],
      },
    },
  },
};

export default preview;
