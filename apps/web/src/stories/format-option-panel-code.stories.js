import { getCodeLanguageSubtasks } from '../../../../packages/core-ui/js/gui_components/generator/options/index.js';
import {
  CODE_OPTIONS,
  createStory,
  playJavascriptApply,
  playPythonApply,
  renderFormatOptionPanelStory,
} from './format-option-panel.story-helpers.js';

const codeSubtasks = getCodeLanguageSubtasks();

function getCodeLabel(type, fallback) {
  return codeSubtasks.find((subtask) => subtask.type === type)?.label || fallback;
}

const meta = {
  title: 'Shared/Format Option Panel/Code',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
These stories map to the current Code tab and show every code-language option panel through the shared \`FormatOptionsPanel\` component.

Use them to review language-specific generation settings such as collection shape, variable naming, imports, namespaces/packages, quoting, pretty-printing, and object/class generation.
        `,
      },
    },
  },
  argTypes: {
    selectedFormat: {
      control: false,
    },
    currentOptions: {
      control: false,
    },
    onApplyOptions: {
      action: 'onApplyOptions',
    },
    onDirtyStateChanged: {
      action: 'onDirtyStateChanged',
    },
  },
  render: renderFormatOptionPanelStory,
};

export default meta;

export const Python = createStory(
  'python',
  CODE_OPTIONS.python,
  'Shows the Python code-generation panel. Hover the `Options` title help icon for the Python overview, then inspect the field help icons for collection shape, imports, quoting, and class/object behavior. Toggling `Include Imports` is a quick way to exercise the shared dirty/apply lifecycle on a richer code-generation panel.',
  playPythonApply
);

export const Javascript = createStory(
  'javascript',
  CODE_OPTIONS.javascript,
  'Shows the JavaScript code-generation panel through the shared component. This is useful because JavaScript reuses a JSON-style option surface underneath while still participating in the shared format-option contract.',
  playJavascriptApply
);

export const CSharp = createStory(
  'csharp',
  CODE_OPTIONS.csharp,
  `Shows the ${getCodeLabel('csharp', 'C#')} code-generation panel through the shared component. Review namespace, class, collection, and record-style options in the same shared dirty/apply lifecycle.`
);

export const Java = createStory(
  'java',
  CODE_OPTIONS.java,
  `Shows the ${getCodeLabel('java', 'Java')} code-generation panel through the shared component. Review package, import, class, and collection options for this language family.`
);

export const Kotlin = createStory(
  'kotlin',
  CODE_OPTIONS.kotlin,
  `Shows the ${getCodeLabel('kotlin', 'Kotlin')} code-generation panel through the shared component. Review package, import, class, collection, and data-class options for this language family.`
);

export const Perl = createStory(
  'perl',
  CODE_OPTIONS.perl,
  `Shows the ${getCodeLabel('perl', 'Perl')} code-generation panel through the shared component. Review package, array, and object-shape settings in the same shared option contract.`
);

export const Php = createStory(
  'php',
  CODE_OPTIONS.php,
  `Shows the ${getCodeLabel('php', 'PHP')} code-generation panel through the shared component. Review namespace, class, PHP-tag, and array/object-shape options.`
);

export const Ruby = createStory(
  'ruby',
  CODE_OPTIONS.ruby,
  `Shows the ${getCodeLabel('ruby', 'Ruby')} code-generation panel through the shared component. Review symbol, class, pretty-print, and collection-shape options.`
);

export const TypeScript = createStory(
  'typescript',
  CODE_OPTIONS.typescript,
  `Shows the ${getCodeLabel('typescript', 'TypeScript')} code-generation panel through the shared component. Review interface, object-shape, and pretty-print options in the same shared option contract.`
);
