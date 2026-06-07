import { resolveDocumentObj } from '../../shared/dom/default-objects.js';

class FormatSelectorView {
  constructor({ root, subtasksRoot, controller, documentObj, services = {} } = {}) {
    this.root = root;
    this.subtasksRoot = subtasksRoot;
    this.controller = controller;
    this.documentObj = resolveDocumentObj(documentObj, root || subtasksRoot);
    this.services = services;
    this.handleRootClick = (event) => this.handleClick(event);
    this.handleSubtasksClick = (event) => this.handleClick(event);
  }

  mount() {
    if (!this.root || !this.subtasksRoot) {
      throw new Error('FormatSelectorView requires root and subtasksRoot');
    }

    this.root.innerHTML = `
      <div class="conversionTypesHeader" data-role="format-tabs-header">
        <span
          class="helpicon"
          data-role="format-tabs-help"
          data-help-role="help-icon"
          data-help="export-format-tabs-help"
        ></span>
        <ul class="conversionTypesList" data-role="format-tabs-list"></ul>
      </div>
    `;
    this.bindEvents();
    this.render();
    this.services.updateHelpHints?.();
  }

  bindEvents() {
    this.root.addEventListener('click', this.handleRootClick);
    this.subtasksRoot.addEventListener('click', this.handleSubtasksClick);
  }

  handleClick(event) {
    const action = event.target.closest('[data-role="format-main-tab-action"], [data-role="format-subtask-action"]');
    if (!action) {
      return;
    }
    event.preventDefault();

    const tabId = action.getAttribute('data-tab-id');
    if (tabId) {
      this.controller.selectMainTab(tabId);
      this.render();
      return;
    }

    const type = action.getAttribute('data-type');
    if (type) {
      this.controller.setSelectedFormat(type);
      this.render();
    }
  }

  render() {
    const listRoot = this.getTabsListRoot();
    if (!listRoot) {
      return;
    }

    const state = this.controller.getState();
    listRoot.innerHTML = state.tabDefinitions
      .map((definition) => {
        const typeAttributes = definition.type ? `data-type="${definition.type}"` : `data-group="${definition.id}"`;
        const activeClass = definition.id === state.activeMainTabId ? ' active-main-type' : '';
        const directActiveClass =
          definition.type && definition.type === state.activeType ? ' active-type active-main-type' : activeClass;
        const activeMainTab = definition.id === state.activeMainTabId;
        const activeFormat = definition.type ? definition.type === state.activeType : false;

        return `<li class="type-select${directActiveClass}" data-role="format-main-tab-item" data-tab-id="${definition.id}" data-active-main-tab="${activeMainTab}" data-active-format="${activeFormat}">
                <a class="type-select-action" data-role="format-main-tab-action" data-tab-id="${definition.id}" ${typeAttributes} href="#">${definition.label}</a>
              </li>`;
      })
      .join('');

    const activeDefinition = this.controller.getActiveTabDefinition();
    if (!activeDefinition?.subtasks) {
      this.subtasksRoot.innerHTML = '';
      this.subtasksRoot.style.display = 'none';
      return;
    }

    this.subtasksRoot.innerHTML = `<ul class="conversionSubtasksList" data-role="format-subtasks-list">
      ${activeDefinition.subtasks
        .map((subtask) => {
          const supportedTypes = subtask.types || [subtask.type];
          const selectedType = subtask.selectedType || subtask.type;
          const isActive = supportedTypes.includes(state.activeType);
          const activeClass = isActive ? ' active-type' : '';
          return `<li class="subtask-select${activeClass}" data-role="format-subtask-item" data-type="${selectedType}" data-active-format="${isActive}">
            <a class="subtask-select-action" data-role="format-subtask-action" data-type="${selectedType}" href="#">${subtask.label}</a>
          </li>`;
        })
        .join('')}
      </ul>`;
    this.subtasksRoot.style.display = 'block';
    this.services.updateHelpHints?.();
  }

  destroy() {
    this.root.removeEventListener('click', this.handleRootClick);
    this.subtasksRoot.removeEventListener('click', this.handleSubtasksClick);
    this.root.replaceChildren();
    this.subtasksRoot.replaceChildren();
  }

  getTabsListRoot() {
    return this.root.querySelector('[data-role="format-tabs-list"]');
  }
}

export { FormatSelectorView };
