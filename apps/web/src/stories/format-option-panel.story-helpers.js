import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createFormatOptionsPanel } from '../../../../packages/core-ui/js/gui_components/shared/format-options-panel/index.js';

export function renderFormatOptionPanelStory(args) {
  const root = document.createElement('section');
  root.style.maxWidth = '320px';

  const component = createFormatOptionsPanel({
    root,
    documentObj: document,
    props: {
      selectedFormat: args.selectedFormat,
      currentOptions: args.currentOptions,
    },
    callbacks: {
      onApplyOptions: args.onApplyOptions,
      onDirtyStateChanged: args.onDirtyStateChanged,
    },
  });

  root.__storybookCleanup = () => component.destroy();
  return root;
}

export const BASIC_OPTIONS = {
  csv: {
    outputFormat: 'csv',
    options: {
      quotes: false,
      header: true,
      quoteChar: '"',
      escapeChar: '"',
    },
  },
  dsv: {
    outputFormat: 'dsv',
    options: {
      delimiter: '\t',
      quotes: false,
      header: true,
      quoteChar: '"',
      escapeChar: '"',
    },
  },
  json: {
    outputFormat: 'json',
    options: {
      makeNumbersNumeric: false,
      prettyPrint: true,
      prettyPrintDelimiter: '\t',
      asObject: false,
      asPropertyNamed: 'records',
    },
  },
  jsonl: {
    outputFormat: 'jsonl',
    options: {
      makeNumbersNumeric: true,
      prettyPrint: false,
      asObject: false,
      asPropertyNamed: '',
      outputAsJsonLines: true,
    },
  },
  sql: {
    outputFormat: 'sql',
    options: {
      tableName: 'users',
      maxValuesPerInsert: 100,
      quoteNumeric: false,
      sqlDialect: 'postgresql',
      quoteIdentifiers: true,
      nullHandling: 'empty-as-null',
      wrapTransaction: true,
    },
  },
  xml: {
    outputFormat: 'xml',
    options: {
      rootElementName: 'items',
      itemElementName: 'item',
      attributeColumnsCsv: 'id,type',
      includeXmlHeader: true,
      xmlns: 'https://example.test/data',
    },
  },
  markdown: {
    outputFormat: 'markdown',
    options: {
      spacePadding: 'both',
      tabPadding: 'none',
      borderBars: true,
      emboldenHeaders: false,
      emphasisHeaders: false,
      emboldenColumns: [],
      emphasisColumns: [],
      prettyPrint: false,
      globalColumnAlign: 'default',
    },
  },
  html: {
    outputFormat: 'html',
    options: {
      compact: false,
      prettyPrint: true,
      prettyPrintDelimiter: '\t',
      addTheadToTable: false,
      addTbodyToTable: true,
    },
  },
  asciitable: {
    outputFormat: 'asciitable',
    options: {
      style: 'default',
    },
  },
};

export const CODE_OPTIONS = {
  csharp: {
    outputFormat: 'csharp',
    options: {
      collectionType: 'list',
      assignToVariable: true,
      variableName: 'rows',
      quoteNumbers: false,
      quoteStyle: 'double',
      prettyPrint: true,
      prettyPrintDelimiter: '    ',
      includeUsings: true,
      namespace: 'GeneratedData',
      className: 'Row',
      useRecordType: false,
    },
  },
  java: {
    outputFormat: 'java',
    options: {
      collectionType: 'list',
      assignToVariable: true,
      variableName: 'rows',
      quoteNumbers: false,
      quoteStyle: 'double',
      prettyPrint: true,
      prettyPrintDelimiter: '    ',
      includeImports: true,
      packageName: 'com.example.generated',
      className: 'Row',
      useRecordType: false,
    },
  },
  javascript: {
    outputFormat: 'javascript',
    options: {
      makeNumbersNumeric: false,
      prettyPrint: true,
      prettyPrintDelimiter: '\t',
      asObject: false,
      asPropertyNamed: 'records',
    },
  },
  kotlin: {
    outputFormat: 'kotlin',
    options: {
      collectionType: 'list',
      assignToVariable: true,
      variableName: 'rows',
      quoteNumbers: false,
      quoteStyle: 'double',
      prettyPrint: true,
      prettyPrintDelimiter: '    ',
      includeImports: true,
      packageName: 'com.example.generated',
      className: 'Row',
      useDataClass: true,
    },
  },
  perl: {
    outputFormat: 'perl',
    options: {
      collectionType: 'array',
      assignToVariable: true,
      variableName: '@rows',
      quoteNumbers: false,
      prettyPrint: true,
      prettyPrintDelimiter: '  ',
      includeUseStatements: false,
      useBlessedObjects: false,
      packageName: 'Generated::Row',
    },
  },
  php: {
    outputFormat: 'php',
    options: {
      collectionType: 'array',
      assignToVariable: true,
      variableName: '$rows',
      quoteNumbers: false,
      prettyPrint: true,
      prettyPrintDelimiter: '    ',
      includePhpTag: true,
      includeNamespace: false,
      namespace: 'Generated',
      className: 'Row',
      useAssociativeArrays: true,
    },
  },
  python: {
    outputFormat: 'python',
    options: {
      collectionType: 'list',
      assignToVariable: true,
      variableName: 'rows',
      quoteNumbers: false,
      useDecimalType: false,
      decimalColumnsCsv: '',
      decimalTreatIntegersAsDecimal: false,
      blankValueBehavior: 'empty-string',
      quoteStyle: 'double',
      prettyPrint: true,
      prettyPrintDelimiter: '\t',
      includeImports: false,
      importStatements: '',
      useAnonymousDicts: true,
      objectClassName: 'Row',
    },
  },
  ruby: {
    outputFormat: 'ruby',
    options: {
      collectionType: 'array',
      assignToVariable: true,
      variableName: 'rows',
      quoteNumbers: false,
      prettyPrint: true,
      prettyPrintDelimiter: '  ',
      includeRequires: false,
      useSymbols: true,
      className: 'Row',
    },
  },
  typescript: {
    outputFormat: 'typescript',
    options: {
      makeNumbersNumeric: false,
      prettyPrint: true,
      prettyPrintDelimiter: '\t',
      asObject: false,
      asPropertyNamed: 'records',
      includeInterface: true,
      interfaceName: 'GeneratedRow',
    },
  },
};

export const DEFAULT_UNIT_TEST_OPTIONS = {
  suiteName: 'GeneratedDataTests',
  testNamePrefix: 'row',
  dataSourceStrategy: 'provider',
  includeSetup: true,
  prettyPrint: true,
};

export function createMeta(title, componentDescription) {
  return {
    title,
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component: componentDescription,
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
}

export function createStory(selectedFormat, currentOptions, description, play) {
  return {
    args: {
      selectedFormat,
      currentOptions,
    },
    parameters: {
      docs: {
        description: {
          story: description,
        },
      },
    },
    ...(play ? { play } : {}),
  };
}

export function createUnitTestStory(formatId, label, description, play) {
  return createStory(
    formatId,
    {
      outputFormat: formatId,
      options: {
        ...DEFAULT_UNIT_TEST_OPTIONS,
      },
    },
    description ||
      `Shows the ${label} unit-test framework options path through the shared component. Hover the \`Options\` title help icon for the framework-level overview, then inspect the field help icons for suite naming, setup, and data-source strategy.`,
    play
  );
}

export async function playCsvApply({ canvasElement }) {
  const canvas = within(canvasElement);
  const applyButton = canvas.getByRole('button', { name: 'Apply' });
  const headerCheckbox = canvas.getByRole('checkbox', { name: /use header/i });

  await expect(applyButton).toBeDisabled();
  await userEvent.click(headerCheckbox);
  await expect(applyButton).toBeEnabled();
  await userEvent.click(applyButton);
  await waitFor(() => expect(applyButton).toBeDisabled());
}

export async function playDsvApply({ canvasElement }) {
  const canvas = within(canvasElement);
  const applyButton = canvas.getByRole('button', { name: 'Apply' });
  const delimiterSelect = canvas.getByRole('combobox', { name: /delimiter/i });

  await expect(applyButton).toBeDisabled();
  await userEvent.selectOptions(delimiterSelect, 'pipe');
  await expect(applyButton).toBeEnabled();
  await userEvent.click(applyButton);
  await waitFor(() => expect(applyButton).toBeDisabled());
}

export async function playJsonApply({ canvasElement }) {
  const canvas = within(canvasElement);
  const applyButton = canvas.getByRole('button', { name: 'Apply' });
  const asObjectCheckbox = canvas.getByRole('checkbox', { name: /as object/i });

  await expect(applyButton).toBeDisabled();
  await userEvent.click(asObjectCheckbox);
  await expect(applyButton).toBeEnabled();
  await userEvent.click(applyButton);
  await waitFor(() => expect(applyButton).toBeDisabled());
}

export async function playJsonlApply({ canvasElement }) {
  const canvas = within(canvasElement);
  const applyButton = canvas.getByRole('button', { name: 'Apply' });
  const numberConvertCheckbox = canvas.getByRole('checkbox', { name: /number convert/i });

  await expect(applyButton).toBeDisabled();
  await userEvent.click(numberConvertCheckbox);
  await expect(applyButton).toBeEnabled();
  await userEvent.click(applyButton);
  await waitFor(() => expect(applyButton).toBeDisabled());
}

export async function playSqlApply({ canvasElement }) {
  const canvas = within(canvasElement);
  const applyButton = canvas.getByRole('button', { name: 'Apply' });
  const tableNameInput = canvas.getByRole('textbox', { name: /table name/i });

  await expect(applyButton).toBeDisabled();
  await userEvent.clear(tableNameInput);
  await userEvent.type(tableNameInput, 'audit_log');
  await expect(applyButton).toBeEnabled();
  await userEvent.click(applyButton);
  await waitFor(() => expect(applyButton).toBeDisabled());
}

export async function playXmlApply({ canvasElement }) {
  const canvas = within(canvasElement);
  const applyButton = canvas.getByRole('button', { name: 'Apply' });
  const rootElementInput = canvas.getByRole('textbox', { name: /root element/i });

  await expect(applyButton).toBeDisabled();
  await userEvent.clear(rootElementInput);
  await userEvent.type(rootElementInput, 'records');
  await expect(applyButton).toBeEnabled();
  await userEvent.click(applyButton);
  await waitFor(() => expect(applyButton).toBeDisabled());
}

export async function playMarkdownApply({ canvasElement }) {
  const canvas = within(canvasElement);
  const applyButton = canvas.getByRole('button', { name: 'Apply' });
  const prettyPrintCheckbox = canvas.getByRole('checkbox', { name: /pretty print/i });

  await expect(applyButton).toBeDisabled();
  await userEvent.click(prettyPrintCheckbox);
  await expect(applyButton).toBeEnabled();
  await userEvent.click(applyButton);
  await waitFor(() => expect(applyButton).toBeDisabled());
}

export async function playHtmlApply({ canvasElement }) {
  const canvas = within(canvasElement);
  const applyButton = canvas.getByRole('button', { name: 'Apply' });
  const addTheadCheckbox = canvas.getByRole('checkbox', { name: /add <thead>/i });

  await expect(applyButton).toBeDisabled();
  await userEvent.click(addTheadCheckbox);
  await expect(applyButton).toBeEnabled();
  await userEvent.click(applyButton);
  await waitFor(() => expect(applyButton).toBeDisabled());
}

export async function playAsciiApply({ canvasElement }) {
  const canvas = within(canvasElement);
  const applyButton = canvas.getByRole('button', { name: 'Apply' });
  const styleSelect = canvas.getByRole('combobox', { name: /style/i });
  const styleOptions = styleSelect.querySelectorAll('option');

  await expect(applyButton).toBeDisabled();
  await userEvent.selectOptions(styleSelect, styleOptions[1].value);
  await expect(applyButton).toBeEnabled();
  await userEvent.click(applyButton);
  await waitFor(() => expect(applyButton).toBeDisabled());
}

export async function playPythonApply({ canvasElement }) {
  const canvas = within(canvasElement);
  const applyButton = canvas.getByRole('button', { name: 'Apply' });
  const includeImportsCheckbox = canvas.getByRole('checkbox', { name: /include imports/i });

  await expect(applyButton).toBeDisabled();
  await userEvent.click(includeImportsCheckbox);
  await expect(applyButton).toBeEnabled();
  await userEvent.click(applyButton);
  await waitFor(() => expect(applyButton).toBeDisabled());
}

export async function playJavascriptApply({ canvasElement }) {
  const canvas = within(canvasElement);
  const applyButton = canvas.getByRole('button', { name: 'Apply' });
  const asObjectCheckbox = canvas.getByRole('checkbox', { name: /as object/i });

  await expect(applyButton).toBeDisabled();
  await userEvent.click(asObjectCheckbox);
  await expect(applyButton).toBeEnabled();
  await userEvent.click(applyButton);
  await waitFor(() => expect(applyButton).toBeDisabled());
}

export async function playJestApply({ canvasElement }) {
  const canvas = within(canvasElement);
  const applyButton = canvas.getByRole('button', { name: 'Apply' });
  const suiteNameInput = canvas.getByRole('textbox', { name: /suite name/i });

  await expect(applyButton).toBeDisabled();
  await userEvent.clear(suiteNameInput);
  await userEvent.type(suiteNameInput, 'CustomerTableTests');
  await expect(applyButton).toBeEnabled();
  await userEvent.click(applyButton);
  await waitFor(() => expect(applyButton).toBeDisabled());
}
