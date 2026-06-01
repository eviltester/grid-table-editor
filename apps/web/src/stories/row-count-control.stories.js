import { expect, userEvent, within } from 'storybook/test';
import { createRowCountControl } from '../../../../packages/core-ui/js/gui_components/shared/row-count-control/index.js';

function renderRowCountControlStory(args) {
  const root = document.createElement('section');
  const component = createRowCountControl({
    root,
    props: {
      inputId: args.inputId,
      label: args.label,
      min: args.min,
      max: args.max,
      step: args.step,
      value: args.value,
      normalizeOnInput: args.normalizeOnInput,
      clampToMaxOnInput: args.clampToMaxOnInput,
    },
    callbacks: {
      onChange: args.onChange,
    },
  });
  root.__storybookCleanup = () => component.destroy();
  return root;
}

const meta = {
  title: 'Shared/Row Count',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          `
` +
          '```text' +
          `
RowCountControl is the first shared proving-slice component for the frontend migration.
` +
          '```' +
          `

It wraps a number input behind the standard \`Controller + View + createComponent\` structure and is intended to be reusable across:

- app test-data generation row counts
- generator export row counts
- generator preview row counts

## Behavior Modes

- **Normalize on input**: invalid or below-min values are snapped to the configured minimum during typing.
- **Validation without normalization**: the raw value is preserved in the field and validation is reported by the controller.
- **Optional max clamping**: values above the configured max can either remain visible for validation or be clamped during input.

## How To Explore These Stories

- In **Normalize on input**, try entering a value below the minimum. The field will immediately snap back to the configured minimum.
- In **Validation without normalization**, try entering a value above the maximum. The field keeps the visible value so you can inspect the invalid UI state.
- In **Max clamping on input**, try entering a value above the maximum. The field will immediately snap back to the configured maximum.

For the non-normalizing story, the **Actions** panel helps explain what the component is doing:

- \`rawValue\` is the literal text/value the user entered
- \`state.inputValue\` is the current visible field value
- \`parsed.value\` is the controller's bounded parsed value

That means the visible field can temporarily show an out-of-range value, while the parsed/controller value remains inside the configured limits.

## Why This Story Exists

This story set is both documentation and a migration quality check:

- the harness is intentionally small
- the component can mount with explicit props only
- the key behavior modes are visible without bootstrapping a page
        `,
      },
    },
  },
  argTypes: {
    inputId: {
      control: 'text',
      description: 'DOM id and name used for the rendered number input.',
    },
    label: {
      control: 'text',
      description: 'Visible label text associated with the number input.',
    },
    min: {
      control: 'number',
      description: 'Minimum parsed value for the control.',
    },
    max: {
      control: 'number',
      description: 'Optional maximum parsed value for the control.',
    },
    step: {
      control: 'number',
      description: 'Step attribute passed through to the number input.',
    },
    value: {
      control: 'number',
      description: 'Initial displayed value.',
    },
    normalizeOnInput: {
      control: 'boolean',
      description: 'When true, invalid or below-min values are normalized during input.',
    },
    clampToMaxOnInput: {
      control: 'boolean',
      description: 'When true, values above max are clamped during input instead of only being reported as invalid.',
    },
    onChange: {
      action: 'onChange',
      description: 'Emitted whenever input changes, including raw value, parsed result, and current controller state.',
      table: { disable: true },
    },
  },
  args: {
    inputId: 'generateCount',
    label: 'How Many?',
    min: 1,
    max: undefined,
    step: 1,
    value: 1,
    normalizeOnInput: true,
    clampToMaxOnInput: false,
  },
};

export default meta;

export const NormalizeOnInput = {
  args: {
    inputId: 'generateCount',
    label: 'How Many?',
    min: 10,
    value: 10,
    normalizeOnInput: true,
    clampToMaxOnInput: false,
  },
  render: renderRowCountControlStory,
  parameters: {
    docs: {
      description: {
        story:
          'Minimum-normalizing mode. This story starts at `10` with `min: 10`, so entering anything below `10` causes the field to snap back to `10` immediately.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('spinbutton', { name: /how many/i });
    await userEvent.clear(input);
    expect(input.value).toBe('10');
  },
};

export const ValidationWithoutNormalization = {
  args: {
    inputId: 'previewRowsCount',
    label: 'Preview Items Count',
    min: 0,
    max: 999,
    value: 100,
    normalizeOnInput: false,
  },
  render: renderRowCountControlStory,
  parameters: {
    docs: {
      description: {
        story:
          'Validation-without-normalization mode. This story uses `min: 0` and `max: 999`. Entering a value above `999` keeps the visible value in the field, while the Actions payload shows that the parsed/controller value remains bounded. The HTML input control shows the bounded values when you use the increment controls up and down.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('spinbutton', { name: /preview items count/i });
    await userEvent.clear(input);
    await userEvent.type(input, '1234');
    expect(input.value).toBe('1234');
  },
};

export const MaxClampingOnInput = {
  args: {
    inputId: 'previewRowsCount',
    label: 'Preview Items Count',
    min: 0,
    max: 999,
    value: 100,
    normalizeOnInput: true,
    clampToMaxOnInput: true,
  },
  render: renderRowCountControlStory,
  parameters: {
    docs: {
      description: {
        story:
          'Max-clamping mode. This story uses `max: 999`, so entering a value above `999` causes the field to snap back to `999` immediately.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('spinbutton', { name: /preview items count/i });
    await userEvent.clear(input);
    await userEvent.type(input, '1234');
    expect(input.value).toBe('999');
  },
};
