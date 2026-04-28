class TabbedTextControl {
  constructor(parentElement, theImportExportControls) {
    this.parent = parentElement;
    this.importExportController = theImportExportControls;
    this.defaultTabId = 'csv';
    this.tabDefinitions = [
      { id: 'markdown', label: 'Markdown', type: 'markdown' },
      { id: 'csv', label: 'CSV', type: 'csv' },
      { id: 'dsv', label: 'Delimited', type: 'dsv' },
      { id: 'json', label: 'JSON', type: 'json' },
      {
        id: 'code',
        label: 'Code',
        subtasks: [
          { id: 'java', label: 'Java', type: 'java' },
          { id: 'javascript', label: 'JavaScript', type: 'javascript' },
          { id: 'python', label: 'Python', type: 'python' },
        ],
      },
      { id: 'gherkin', label: 'Gherkin', type: 'gherkin' },
      { id: 'html', label: 'HTML', type: 'html' },
      { id: 'asciitable', label: 'ASCII', type: 'asciitable' },
    ];
  }

  // TODO : populate this from the registered importers and exporters rather than hard coding
  addToGui() {
    this.parent.innerHTML = `
        <div class="conversionTabs">
          <div id="conversionTypes" class="conversionTypes">
            <ul class="conversionTypesList">
              ${this._renderMainTabMarkup()}
            </ul>
          </div>
          <div class="rightbuttons">
            <button title="Toggle Preview/Edit mode" id="previewEditModeButton">Preview</button>
            <button title="Copy text to clipboard" id="copyTextButton">Copy</button>
          </div>
        </div>
        <div id="conversionSubtasks" class="conversionSubtasks" style="display: none"></div>

        <div class="edit-area">
            <div class="options-parent" style="display: none"></div>
            <div id="markdown" style="height: 30%; width:100%;">
              <textarea class="textrepresentation" name="Markdown" id="markdownarea"></textarea>
            </div>
        </div>
        `;

    this.parent.querySelectorAll('.type-select-action').forEach((linkElem) =>
      linkElem.addEventListener('click', (e) => {
        e.preventDefault();
        this._handleMainTabSelection(e.currentTarget.dataset.tabId);
        return false;
      })
    );

    this.parent.querySelectorAll('li.type-select').forEach((lielem) =>
      lielem.addEventListener('click', (e) => {
        e.target.querySelector('a.type-select-action')?.click();
      })
    );

    const modeButton = this.parent.querySelector('#previewEditModeButton');
    if (modeButton) {
      modeButton.addEventListener('click', () => {
        this.importExportController.toggleTextEditMode();
        this._syncPreviewEditButtonLabel();
      });
    }

    this._handleMainTabSelection(this.defaultTabId, { notifyController: false });
    this._syncPreviewEditButtonLabel();
  }

  _renderMainTabMarkup() {
    return this.tabDefinitions
      .map((definition) => {
        const typeAttributes = definition.type ? `data-type="${definition.type}"` : `data-group="${definition.id}"`;

        return `
              <li id="type-${definition.id}" class="type-select" data-tab-id="${definition.id}">
                <a class="type-select-action" data-tab-id="${definition.id}" ${typeAttributes} href="#">${definition.label}</a>
              </li>`;
      })
      .join('');
  }

  _handleMainTabSelection(tabId, { notifyController = true } = {}) {
    const definition = this._getTabDefinition(tabId);
    if (!definition) {
      return false;
    }

    if (!definition.subtasks) {
      this._activateDirectType(tabId, definition.type, { notifyController });
      return false;
    }

    this._renderSubtasks(definition);
    this._activateGroupedType(tabId, definition.subtasks[0].type, { notifyController });
    return false;
  }

  _renderSubtasks(definition) {
    const subtaskHost = this.parent.querySelector('#conversionSubtasks');
    if (!subtaskHost) {
      return;
    }

    subtaskHost.innerHTML = `
      <ul class="conversionSubtasksList">
        ${definition.subtasks
          .map(
            (subtask) => `
          <li class="subtask-select" data-type="${subtask.type}">
            <a class="subtask-select-action" data-type="${subtask.type}" href="#">${subtask.label}</a>
          </li>`
          )
          .join('')}
      </ul>`;
    subtaskHost.style.display = 'block';

    subtaskHost.querySelectorAll('.subtask-select-action').forEach((linkElem) =>
      linkElem.addEventListener('click', (e) => {
        e.preventDefault();
        this._activateGroupedType(definition.id, e.currentTarget.dataset.type, { notifyController: true });
        return false;
      })
    );

    subtaskHost.querySelectorAll('li.subtask-select').forEach((listElem) =>
      listElem.addEventListener('click', (e) => {
        e.target.querySelector('a.subtask-select-action')?.click();
      })
    );
  }

  _activateDirectType(tabId, type, { notifyController = true } = {}) {
    this._clearActiveSelections();
    this.parent.querySelector(`#type-${tabId}`)?.classList.add('active-type');
    this._hideSubtasks();
    if (notifyController) {
      this._notifyTypeChanged();
    }
  }

  _activateGroupedType(tabId, type, { notifyController = true } = {}) {
    this._clearActiveSelections();
    this.parent.querySelector(`#type-${tabId}`)?.classList.add('active-main-type');

    const subtaskHost = this.parent.querySelector('#conversionSubtasks');
    const activeSubtask = subtaskHost?.querySelector(`.subtask-select[data-type="${type}"]`);
    if (activeSubtask) {
      activeSubtask.classList.add('active-type');
    }

    if (notifyController) {
      this._notifyTypeChanged();
    }
  }

  _clearActiveSelections() {
    this.parent.querySelectorAll('.type-select').forEach((elem) => {
      elem.classList.remove('active-type');
      elem.classList.remove('active-main-type');
    });

    this.parent.querySelectorAll('.subtask-select').forEach((elem) => elem.classList.remove('active-type'));
  }

  _hideSubtasks() {
    const subtaskHost = this.parent.querySelector('#conversionSubtasks');
    if (!subtaskHost) {
      return;
    }
    subtaskHost.innerHTML = '';
    subtaskHost.style.display = 'none';
  }

  _notifyTypeChanged() {
    this.importExportController.renderTextFromGrid();
    this.importExportController.setFileFormatType();
    this.importExportController.setOptionsViewForFormatType();
  }

  _getTabDefinition(tabId) {
    return this.tabDefinitions.find((definition) => definition.id === tabId);
  }

  _syncPreviewEditButtonLabel() {
    const modeButton = this.parent.querySelector('#previewEditModeButton');
    if (!modeButton) {
      return;
    }

    if (this.importExportController?.isPreviewTextMode?.()) {
      const rowLimit = this.importExportController?.getPreviewRowLimit?.() ?? 10;
      modeButton.innerText = `Preview (${rowLimit})`;
      return;
    }
    modeButton.innerText = 'Edit';
  }
}

export { TabbedTextControl };
