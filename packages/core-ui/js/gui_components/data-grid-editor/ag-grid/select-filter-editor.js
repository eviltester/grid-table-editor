// create a simple editor that shows the list of values but with a search component
// https://www.ag-grid.com/javascript-data-grid/component-cell-editor/
/* <input list="values">
<datalist id="values">
  <option value="Value 1">
  <option value="Value 2">
  <option value="Value 3">
</datalist>   */

import { openMethodPickerModal } from '../../shared/test-data/ui/index.js';

class SelectFilterEditor {
  init(params) {
    this.value = params.value;
    this.params = params;
    this.completed = false;

    this.gui = document.createElement('div');
    this.input = document.createElement('button');
    this.input.type = 'button';
    this.input.className = 'test-data-grid-command-picker-trigger';
    this.input.textContent = String(this.value || 'Pick method');
    this.gui.appendChild(this.input);
    this.validValues = params.values;

    this.input.addEventListener('click', async () => {
      try {
        const options =
          typeof this.params?.getMethodPickerOptions === 'function'
            ? this.params.getMethodPickerOptions(this.value)
            : (this.validValues || []).map((command) => ({
                sourceType: String(command || '').startsWith('helpers.') ? 'faker' : 'domain',
                command,
                helpModel: { summary: '', params: [], example: '' },
              }));
        const selected = await openMethodPickerModal({
          documentObj: document,
          windowObj: globalThis.window,
          options,
          currentCommand: this.value,
          title: 'Select schema method',
        });
        if (!selected?.command) {
          this.completed = true;
          this.params?.stopEditing?.(true);
          return;
        }
        this.value = selected.command;
        this.completed = true;
        this.params?.stopEditing?.();
      } catch {
        if (!this.completed) {
          this.completed = true;
          this.params?.stopEditing?.(true);
        }
      }
    });
  }

  /* Component Editor Lifecycle methods */
  // gets called once when grid ready to insert the element
  getGui() {
    return this.gui;
  }

  // the final value to send to the grid, on completion of editing
  getValue() {
    return this.value;
  }

  // Gets called once before editing starts, to give editor a chance to
  // cancel the editing before it even starts.
  isCancelBeforeStart() {
    return false;
  }

  // Gets called once when editing is finished (eg if Enter is pressed).
  // If you return true, then the result of the edit will be ignored.
  isCancelAfterEnd() {
    if (this.completed && !this.value) {
      return true;
    }
    // value must be from the list
    return !this.validValues.includes(this.value);
  }

  // after this component has been created and inserted into the grid
  afterGuiAttached() {
    this.input.focus();
  }
}

export { SelectFilterEditor };
