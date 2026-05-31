import {
  BASIC_OPTIONS,
  createStory,
  playAsciiApply,
  playCsvApply,
  playDsvApply,
  playHtmlApply,
  playJsonApply,
  playJsonlApply,
  playMarkdownApply,
  renderFormatOptionPanelStory,
  playSqlApply,
  playXmlApply,
} from './format-option-panel.story-helpers.js';

const meta = {
  title: 'Shared/Format Option Panel/Basic',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Shared \`FormatOptionsPanel\` is the component boundary around the existing export/import option-panel classes.

This Basic section maps to the non-code tabs in the current product:
- \`CSV\` and \`DSV\` for delimiter, header, and quoting controls
- \`JSON\` and \`JSONL\` for structured data output
- \`SQL\` and \`XML\` for richer schema-oriented output
- \`Markdown\`, \`HTML\`, and \`ASCII\` for markup and table-oriented output

Each story mounts the same shared component with a different selected format. Hover the \`Options\` title help icon to review the panel-level explanation for the selected format, then hover the smaller field help icons to inspect option-specific guidance.
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

export const Csv = createStory(
  'csv',
  BASIC_OPTIONS.csv,
  'Shows the CSV panel with real quote/header controls. Hover the `Options` title help icon for the panel-level CSV explanation, then hover the smaller field help icons for option-specific guidance. Try toggling Header or Use Quotes and then Apply to see the shared dirty/apply lifecycle.',
  playCsvApply
);

export const Dsv = createStory(
  'dsv',
  BASIC_OPTIONS.dsv,
  'Shows the delimited-value panel with the shared delimiter selector. Hover the `Options` title help icon for the DSV overview, then inspect the field help icons for delimiter and quoting guidance. Switching the delimiter should make Apply active, then clicking Apply should reset the dirty state.',
  playDsvApply
);

export const Json = createStory(
  'json',
  BASIC_OPTIONS.json,
  'Shows the JSON panel with pretty-print and wrapper-object controls. Hover the `Options` title help icon for the JSON overview, then inspect the field help icons for pretty-print and wrapper-object behavior.',
  playJsonApply
);

export const Jsonl = createStory(
  'jsonl',
  BASIC_OPTIONS.jsonl,
  'Shows the JSONL panel, which intentionally strips the richer JSON pretty-print controls down to line-oriented output settings. Hover the `Options` title help icon for the JSONL overview, then toggle `Number Convert` and apply to review the compact shared dirty/apply lifecycle.',
  playJsonlApply
);

export const Sql = createStory(
  'sql',
  BASIC_OPTIONS.sql,
  'Shows the SQL panel with table, dialect, null-handling, and transaction controls. Hover the `Options` title help icon for the SQL overview, then inspect the field help icons for individual settings. Changing `Table Name` is the quickest way to exercise the shared dirty/apply lifecycle.',
  playSqlApply
);

export const Xml = createStory(
  'xml',
  BASIC_OPTIONS.xml,
  'Shows the XML panel with root/item naming, attribute extraction, header, and namespace controls. Hover the `Options` title help icon for the XML overview, then edit `Root Element` to review how a simple structured-output change flows through the shared component contract.',
  playXmlApply
);

export const Markdown = createStory(
  'markdown',
  BASIC_OPTIONS.markdown,
  'Shows the Markdown panel with table-alignment and text-formatting controls. Hover the `Options` title help icon for the Markdown overview, then inspect the field help icons for padding, borders, and alignment.',
  playMarkdownApply
);

export const Html = createStory(
  'html',
  BASIC_OPTIONS.html,
  'Shows the HTML panel with compact/pretty-print behavior and optional `<thead>` / `<tbody>` generation. Hover the `Options` title help icon for the HTML overview, then toggle `Add <thead>` to review the shared dirty/apply lifecycle and inspect the per-field help icons for formatting guidance.',
  playHtmlApply
);

export const Ascii = createStory(
  'asciitable',
  BASIC_OPTIONS.asciitable,
  'Shows the ASCII table panel, which is the smallest shared options surface in this family. Hover the `Options` title help icon for the ASCII overview, then hover the `Style` help icon and switch the table style to review the same dirty/apply lifecycle on a deliberately minimal panel.',
  playAsciiApply
);
