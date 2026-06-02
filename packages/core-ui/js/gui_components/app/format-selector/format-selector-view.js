import { resolveDocumentObj } from '../../shared/dom/default-objects.js';

class FormatSelectorView {
  constructor({ root, subtasksRoot, controller, documentObj } = {}) {
    this.root = root;
    this.subtasksRoot = subtasksRoot;
    this.controller = controller;
    this.documentObj = resolveDocumentObj(documentObj, root || subtasksRoot);
    this.handleRootClick = (event) => this.handleClick(event);
    this.handleSubtasksClick = (event) => this.handleClick(event);
  }

  mount() {
    if (!this.root || !this.subtasksRoot) {
      throw new Error('FormatSelectorView requires root and subtasksRoot');
    }

    this.root.innerHTML = '<ul class="conversionTypesList"></ul>';
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    this.root.addEventListener('click', this.handleRootClick);
    this.subtasksRoot.addEventListener('click', this.handleSubtasksClick);
  }

  handleClick(event) {
    const action = event.target.closest('.type-select-action, .subtask-select-action');
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
    const listRoot = this.root.querySelector('.conversionTypesList');
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

        return `<li id="type-${definition.id}" class="type-select${directActiveClass}" data-tab-id="${definition.id}">
                <a class="type-select-action" data-tab-id="${definition.id}" ${typeAttributes} href="#">${definition.label}</a>
              </li>`;
      })
      .join('');

    const activeDefinition = this.controller.getActiveTabDefinition();
    if (!activeDefinition?.subtasks) {
      this.subtasksRoot.innerHTML = '';
      this.subtasksRoot.style.display = 'none';
      return;
    }

    this.subtasksRoot.innerHTML = `<ul class="conversionSubtasksList">
      ${activeDefinition.subtasks
        .map((subtask) => {
          const supportedTypes = subtask.types || [subtask.type];
          const selectedType = subtask.selectedType || subtask.type;
          const activeClass = supportedTypes.includes(state.activeType) ? ' active-type' : '';
          return `<li class="subtask-select${activeClass}" data-subtask-id="${subtask.id}" data-types="${supportedTypes.join(',')}" data-type="${selectedType}">
            <a class="subtask-select-action" data-subtask-id="${subtask.id}" data-type="${selectedType}" href="#">${subtask.label}</a>
          </li>`;
        })
        .join('')}
      </ul>`;
    this.subtasksRoot.style.display = 'block';
  }

  destroy() {
    this.root.removeEventListener('click', this.handleRootClick);
    this.subtasksRoot.removeEventListener('click', this.handleSubtasksClick);
    this.root.replaceChildren();
    this.subtasksRoot.replaceChildren();
  }
}

export { FormatSelectorView };
