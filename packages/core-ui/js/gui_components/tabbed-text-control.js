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
      { id: 'jsonl', label: 'JSONL', type: 'jsonl' },
      { id: 'xml', label: 'XML', type: 'xml' },
      { id: 'sql', label: 'SQL', type: 'sql' },
      {
        id: 'code',
        label: 'Code',
        subtasks: [
          { id: 'csharp', label: 'C#', type: 'csharp' },
          { id: 'java', label: 'Java', type: 'java' },
          { id: 'javascript', label: 'JavaScript', type: 'javascript' },
          { id: 'kotlin', label: 'Kotlin', type: 'kotlin' },
          { id: 'perl', label: 'Perl', type: 'perl' },
          { id: 'php', label: 'PHP', type: 'php' },
          { id: 'python', label: 'Python', type: 'python' },
          { id: 'ruby', label: 'Ruby', type: 'ruby' },
          { id: 'typescript', label: 'TypeScript', type: 'typescript' },
        ],
      },
      {
        id: 'code-unit-test',
        label: 'Code (Unit Test)',
        subtasks: [
          { id: 'csharp-ut', label: 'C#', type: 'xunit', types: ['xunit', 'nunit', 'mstest'] },
          { id: 'java-ut', label: 'Java', type: 'junit5', types: ['junit4', 'junit5', 'junit6', 'testng'] },
          { id: 'javascript-ut', label: 'JavaScript', type: 'jest', types: ['jest', 'vitest', 'mocha'] },
          { id: 'kotlin-ut', label: 'Kotlin', type: 'kotest', types: ['kotest', 'junit5-kotlin', 'spek'] },
          { id: 'perl-ut', label: 'Perl', type: 'test-more', types: ['test-more', 'test2-suite'] },
          { id: 'php-ut', label: 'PHP', type: 'phpunit', types: ['phpunit', 'pest'] },
          { id: 'python-ut', label: 'Python', type: 'pytest', types: ['pytest', 'unittest', 'nose2'] },
          { id: 'ruby-ut', label: 'Ruby', type: 'rspec', types: ['rspec', 'minitest'] },
          { id: 'typescript-ut', label: 'TypeScript', type: 'jest', types: ['jest', 'vitest', 'mocha'] },
        ],
      },
      { id: 'gherkin', label: 'Gherkin', type: 'gherkin' },
      { id: 'html', label: 'HTML', type: 'html' },
      { id: 'asciitable', label: 'ASCII', type: 'asciitable' },
    ];
    this.editModeHelpText =
      'Edit mode shows the full grid text in the chosen format. You can edit this text and use Set Grid From Text to apply changes back into the grid.';
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
            <span
              title="Preview/Edit mode help"
              id="previewEditModeHelpIcon"
              data-help="preview-edit-mode-help"
              class="helpicon option-help-icon"
            ></span>
            <button title="Toggle Preview/Edit mode" id="previewEditModeButton">Preview</button>
            <button title="Copy text to clipboard" id="copyTextButton">Copy</button>
          </div>
        </div>
        <div id="conversionSubtasks" class="conversionSubtasks" style="display: none"></div>

        <div class="edit-area">
            <div class="options-parent" style="display: none"></div>
            <div
              class="options-preview-splitter"
              style="display: none"
              role="separator"
              tabindex="0"
              aria-orientation="vertical"
              aria-label="Resize options panel"
            ></div>
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
          <li class="subtask-select" data-subtask-id="${subtask.id}" data-types="${(subtask.types || [subtask.type]).join(',')}" data-type="${subtask.selectedType || subtask.type}">
            <a class="subtask-select-action" data-subtask-id="${subtask.id}" data-type="${subtask.selectedType || subtask.type}" href="#">${subtask.label}</a>
          </li>`
          )
          .join('')}
      </ul>`;
    subtaskHost.style.display = 'block';

    subtaskHost.querySelectorAll('.subtask-select-action').forEach((linkElem) =>
      linkElem.addEventListener('click', (e) => {
        e.preventDefault();
        this._activateGroupedType(definition.id, e.currentTarget.dataset.type, {
          notifyController: true,
          subtaskId: e.currentTarget.dataset.subtaskId,
        });
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

  _activateGroupedType(tabId, type, { notifyController = true, subtaskId = undefined } = {}) {
    this._rememberGroupedSelection(tabId, type, subtaskId);
    this._clearActiveSelections();
    this.parent.querySelector(`#type-${tabId}`)?.classList.add('active-main-type');

    const subtaskHost = this.parent.querySelector('#conversionSubtasks');
    const activeSubtask = subtaskId
      ? subtaskHost?.querySelector(`.subtask-select[data-subtask-id="${subtaskId}"]`)
      : this._findSubtaskForType(subtaskHost, type);
    if (activeSubtask) {
      activeSubtask.classList.add('active-type');
      activeSubtask.setAttribute('data-type', type);
      const activeAction = activeSubtask.querySelector('.subtask-select-action');
      if (activeAction) {
        activeAction.setAttribute('data-type', type);
      }
    }

    if (notifyController) {
      this._notifyTypeChanged();
    }
  }

  _findSubtaskForType(subtaskHost, type) {
    if (!subtaskHost) {
      return null;
    }
    const subtasks = Array.from(subtaskHost.querySelectorAll('.subtask-select'));
    return (
      subtasks.find((subtask) => {
        const supportedTypes = String(subtask.getAttribute('data-types') || '')
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean);
        return supportedTypes.includes(type);
      }) || null
    );
  }

  _rememberGroupedSelection(tabId, type, subtaskId) {
    const definition = this._getTabDefinition(tabId);
    if (!definition || !definition.subtasks) {
      return;
    }

    let subtask = undefined;
    if (subtaskId) {
      subtask = definition.subtasks.find((entry) => entry.id === subtaskId);
    }
    if (!subtask) {
      subtask = definition.subtasks.find((entry) => (entry.types || [entry.type]).includes(type));
    }
    if (!subtask) {
      return;
    }
    subtask.selectedType = type;
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
    const modeHelpIcon = this.parent.querySelector('#previewEditModeHelpIcon');
    if (!modeButton) {
      return;
    }

    if (this.importExportController?.isPreviewTextMode?.()) {
      const rowLimit = this.importExportController?.getPreviewRowLimit?.() ?? 10;
      modeButton.innerText = `Preview (${rowLimit})`;
      if (modeHelpIcon) {
        const previewHelpText = `Preview mode shows a sample of the first ${rowLimit} rows from the data grid in the chosen format. Click Preview to switch to Edit mode and show full grid data.`;
        modeHelpIcon.setAttribute('data-help-text', previewHelpText);
        modeHelpIcon._tippy?.setContent?.(previewHelpText);
      }
      return;
    }
    modeButton.innerText = 'Edit';
    if (modeHelpIcon) {
      modeHelpIcon.setAttribute('data-help-text', this.editModeHelpText);
      modeHelpIcon._tippy?.setContent?.(this.editModeHelpText);
    }
  }
}

export { TabbedTextControl };
