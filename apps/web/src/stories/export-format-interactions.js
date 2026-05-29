import { expect, userEvent, waitFor, within } from 'storybook/test';

async function clickByText(canvas, text) {
  const button = canvas.getByText(text);
  await userEvent.click(button);
  return button;
}

async function setTextareaValue(canvasElement, value) {
  const textArea = canvasElement.querySelector('#markdownarea');
  textArea.focus();
  textArea.value = value;
  textArea.dispatchEvent(new Event('input', { bubbles: true }));
  textArea.dispatchEvent(new Event('change', { bubbles: true }));
  return textArea;
}

async function applyJsonObjectWrapper(canvasElement) {
  const checkbox = canvasElement.querySelector('.json-options .asobject label input');
  if (checkbox && checkbox.checked !== true) {
    await userEvent.click(checkbox);
  }

  const propertyInput = canvasElement.querySelector('.json-options .propertynamed label input');
  if (propertyInput) {
    propertyInput.focus();
    propertyInput.value = '';
    propertyInput.dispatchEvent(new Event('input', { bubbles: true }));
    await userEvent.type(propertyInput, 'records');
  }

  await userEvent.click(canvasElement.querySelector('.json-options .apply-options'));
}

async function applyDelimitedSemicolon(canvasElement) {
  const delimiterSelect = canvasElement.querySelector(".delimited-options select[name='delimiter']");
  await userEvent.selectOptions(delimiterSelect, 'semicolon');
  await userEvent.click(canvasElement.querySelector('.delimited-options .apply-options'));
}

async function playSetTextFromGrid({ canvasElement }) {
  const canvas = within(canvasElement);
  await clickByText(canvas, 'v Set Text From Grid v');
  await waitFor(() => {
    expect(canvasElement.querySelector('#markdownarea')?.value?.length || 0).toBeGreaterThan(0);
  });
}

async function playCsvRoundTrip({ canvasElement }) {
  const canvas = within(canvasElement);
  await clickByText(canvas, 'Preview (10)');
  await waitFor(() => expect(canvas.getByText('Edit')).toBeTruthy());

  const textArea = await setTextareaValue(canvasElement, 'Name,Role\nAda,Engineer\nBob,Tester');
  await clickByText(canvas, '^ Set Grid From Text ^');

  await waitFor(() => {
    expect(textArea.value).toContain('Ada');
    expect(canvasElement.querySelector('#setgridfromtextbutton')?.disabled).toBe(false);
  });
}

async function playJsonOptionsPreview({ canvasElement }) {
  await applyJsonObjectWrapper(canvasElement);
  await playSetTextFromGrid({ canvasElement });
  await waitFor(() => {
    expect(canvasElement.querySelector('#markdownarea')?.value || '').toContain('"records"');
  });
}

async function playPreviewEditMode({ canvasElement }) {
  const canvas = within(canvasElement);
  const modeButton = canvas.getByText('Preview (10)');
  await userEvent.click(modeButton);
  await waitFor(() => expect(canvas.getByText('Edit')).toBeTruthy());

  await userEvent.click(canvas.getByText('Edit'));
  await waitFor(() => expect(canvas.getByText('Preview (10)')).toBeTruthy());
}

async function playDelimitedOptionsPreview({ canvasElement }) {
  await applyDelimitedSemicolon(canvasElement);
  await playSetTextFromGrid({ canvasElement });
  await waitFor(() => {
    expect(canvasElement.querySelector('#markdownarea')?.value || '').toContain(';');
  });
}

async function playCodePreview({ canvasElement }) {
  await playSetTextFromGrid({ canvasElement });
  await waitFor(() => {
    const previewText = canvasElement.querySelector('#markdownarea')?.value || '';
    expect(previewText.length).toBeGreaterThan(0);
    expect(previewText).toContain('Ava');
  });
}

export {
  playCodePreview,
  playCsvRoundTrip,
  playDelimitedOptionsPreview,
  playJsonOptionsPreview,
  playPreviewEditMode,
  playSetTextFromGrid,
};
