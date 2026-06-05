import { expect, userEvent, waitFor, within } from 'storybook/test';

async function clickByText(canvas, text) {
  const button = canvas.getByRole('button', { name: text });
  await userEvent.click(button);
  return button;
}

function getPreviewTextEditor(canvas) {
  return canvas.getByRole('textbox', { name: 'Preview text editor' });
}

async function setTextareaValue(canvas, value) {
  const textArea = getPreviewTextEditor(canvas);
  await userEvent.click(textArea);
  await userEvent.clear(textArea);
  await userEvent.type(textArea, value);
  await userEvent.tab();
  return textArea;
}

async function applyJsonObjectWrapper(canvas) {
  const checkbox = canvas.getByRole('checkbox', { name: /as object/i });
  if (checkbox && checkbox.checked !== true) {
    await userEvent.click(checkbox);
  }

  const propertyInput = canvas.getByRole('textbox', { name: /property name/i });
  if (propertyInput) {
    await userEvent.click(propertyInput);
    await userEvent.clear(propertyInput);
    await userEvent.type(propertyInput, 'records');
    await userEvent.tab();
  }

  await userEvent.click(canvas.getByRole('button', { name: 'Apply' }));
}

async function applyDelimitedSemicolon(canvas) {
  const delimiterSelect = canvas.getByRole('combobox', { name: 'Delimiter' });
  await userEvent.selectOptions(delimiterSelect, 'semicolon');
  await userEvent.click(canvas.getByRole('button', { name: 'Apply' }));
}

async function playSetTextFromGrid({ canvasElement }) {
  const canvas = within(canvasElement);
  await clickByText(canvas, 'v Set Text From Grid v');
  const textArea = getPreviewTextEditor(canvas);
  await waitFor(() => {
    expect(textArea.value?.length || 0).toBeGreaterThan(0);
  });
}

async function playCsvRoundTrip({ canvasElement }) {
  const canvas = within(canvasElement);
  await clickByText(canvas, 'Preview');
  await waitFor(() => expect(canvas.getByText('Edit')).toBeTruthy());

  const textArea = await setTextareaValue(canvas, 'Name,Role\nAda,Engineer\nBob,Tester');
  await clickByText(canvas, '^ Set Grid From Text ^');
  const setGridFromTextButton = canvas.getByRole('button', { name: '^ Set Grid From Text ^' });

  await waitFor(() => {
    expect(textArea.value).toContain('Ada');
    expect(setGridFromTextButton).toBeEnabled();
  });
}

async function playJsonOptionsPreview({ canvasElement }) {
  const canvas = within(canvasElement);
  const textArea = getPreviewTextEditor(canvas);
  await applyJsonObjectWrapper(canvas);
  await playSetTextFromGrid({ canvasElement });
  await waitFor(() => {
    expect(textArea.value || '').toContain('"records"');
  });
}

async function playPreviewEditMode({ canvasElement }) {
  const canvas = within(canvasElement);
  const modeButton = canvas.getByRole('button', { name: 'Preview' });
  await userEvent.click(modeButton);
  await waitFor(() => expect(canvas.getByRole('button', { name: 'Edit' })).toBeTruthy());

  await userEvent.click(canvas.getByRole('button', { name: 'Edit' }));
  await waitFor(() => expect(canvas.getByRole('button', { name: 'Preview' })).toBeTruthy());
}

async function playDelimitedOptionsPreview({ canvasElement }) {
  const canvas = within(canvasElement);
  const textArea = getPreviewTextEditor(canvas);
  await applyDelimitedSemicolon(canvas);
  await playSetTextFromGrid({ canvasElement });
  await waitFor(() => {
    expect(textArea.value || '').toContain(';');
  });
}

async function playCodePreview({ canvasElement }) {
  const canvas = within(canvasElement);
  const textArea = getPreviewTextEditor(canvas);
  await playSetTextFromGrid({ canvasElement });
  await waitFor(() => {
    const previewText = textArea.value || '';
    expect(previewText.length).toBeGreaterThan(0);
    expect(previewText).toContain('Ava');
  });
}

async function playPreviewAlreadyRendered({ canvasElement }) {
  const canvas = within(canvasElement);
  const textArea = getPreviewTextEditor(canvas);

  await waitFor(() => {
    expect(textArea?.value?.length || 0).toBeGreaterThan(0);
  });

  await expect(canvas.getByRole('button', { name: 'Preview' })).toBeTruthy();
  await expect(canvas.getByRole('spinbutton', { name: 'Preview row count' })).toHaveValue(10);
  await userEvent.click(canvas.getByRole('button', { name: 'Copy' }));
  await waitFor(() => {
    expect(textArea?.value?.length || 0).toBeGreaterThan(0);
  });
}

export {
  playCodePreview,
  playCsvRoundTrip,
  playDelimitedOptionsPreview,
  playJsonOptionsPreview,
  playPreviewAlreadyRendered,
  playPreviewEditMode,
  playSetTextFromGrid,
};
