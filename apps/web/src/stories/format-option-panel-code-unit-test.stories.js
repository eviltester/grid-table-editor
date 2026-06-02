import {
  getTestFrameworkLabel,
  getUnitTestLanguageSubtasks,
} from '../../../../packages/core-ui/js/gui_components/generator/options/index.js';
import {
  createUnitTestStory,
  playGenericApply,
  playJestApply,
  renderFormatOptionPanelStory,
} from './format-option-panel.story-helpers.js';

const unitTestSubtasks = getUnitTestLanguageSubtasks();

function getFrameworkType(type) {
  return unitTestSubtasks.find((subtask) => subtask.type === type)?.type || type;
}

function getFrameworkStory(type, description, play) {
  const resolvedType = getFrameworkType(type);
  return createUnitTestStory(resolvedType, getTestFrameworkLabel(resolvedType), description, play);
}

const meta = {
  title: 'Export Formats/Format Option Panel/Code Unit Test',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
These stories map to the current Code Unit Test tab and show every test-framework option panel through the shared \`FormatOptionsPanel\` component.

Use them to review suite naming, setup generation, data-source strategy, pretty-printing, and framework-specific guidance without leaving the shared component boundary.
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

export const Jest = getFrameworkStory(
  'jest',
  'Shows the Jest unit-test framework panel through the shared component. Hover the `Options` title help icon for the framework-level overview, then inspect the field help icons for suite naming, setup, and data-source strategy. Editing `Suite Name` is the clearest way to review the shared dirty/apply lifecycle on a framework-backed panel.',
  playJestApply
);

export const Vitest = getFrameworkStory('vitest', undefined, playGenericApply);
export const Mocha = getFrameworkStory('mocha', undefined, playGenericApply);
export const JUnit4 = getFrameworkStory('junit4', undefined, playGenericApply);
export const JUnit5 = getFrameworkStory('junit5', undefined, playGenericApply);
export const JUnit6 = getFrameworkStory('junit6', undefined, playGenericApply);
export const TestNg = getFrameworkStory('testng', undefined, playGenericApply);
export const PyTest = getFrameworkStory('pytest', undefined, playGenericApply);
export const Unittest = getFrameworkStory('unittest', undefined, playGenericApply);
export const Nose2 = getFrameworkStory('nose2', undefined, playGenericApply);
export const XUnit = getFrameworkStory('xunit', undefined, playGenericApply);
export const NUnit = getFrameworkStory('nunit', undefined, playGenericApply);
export const MSTest = getFrameworkStory('mstest', undefined, playGenericApply);
export const RSpec = getFrameworkStory('rspec', undefined, playGenericApply);
export const Minitest = getFrameworkStory('minitest', undefined, playGenericApply);
export const PHPUnit = getFrameworkStory('phpunit', undefined, playGenericApply);
export const Pest = getFrameworkStory('pest', undefined, playGenericApply);
export const Kotest = getFrameworkStory('kotest', undefined, playGenericApply);
export const JUnit5Kotlin = getFrameworkStory('junit5-kotlin', undefined, playGenericApply);
export const Spek = getFrameworkStory('spek', undefined, playGenericApply);
export const TestMore = getFrameworkStory('test-more', undefined, playGenericApply);
export const Test2Suite = getFrameworkStory('test2-suite', undefined, playGenericApply);
