import { getCodeLanguageSubtasks, getUnitTestLanguageSubtasks } from '../../generator/options/index.js';

function createDefaultTabDefinitions() {
  return [
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
      subtasks: getCodeLanguageSubtasks(),
    },
    {
      id: 'code-unit-test',
      label: 'Code (Unit Test)',
      subtasks: getUnitTestLanguageSubtasks(),
    },
    { id: 'gherkin', label: 'Gherkin', type: 'gherkin' },
    { id: 'html', label: 'HTML', type: 'html' },
    { id: 'asciitable', label: 'ASCII', type: 'asciitable' },
  ];
}

function cloneTabDefinitions(definitions = []) {
  return definitions.map((definition) => ({
    ...definition,
    subtasks: Array.isArray(definition.subtasks)
      ? definition.subtasks.map((subtask) => ({
          ...subtask,
        }))
      : undefined,
  }));
}

class FormatSelectorController {
  constructor({ props = {}, callbacks = {} } = {}) {
    this.callbacks = callbacks;
    this.state = {
      defaultTabId: props.defaultTabId || 'csv',
      tabDefinitions: cloneTabDefinitions(props.tabDefinitions || createDefaultTabDefinitions()),
      activeMainTabId: props.defaultTabId || 'csv',
      activeType: props.selectedFormat || 'csv',
    };
    this.setSelectedFormat(this.state.activeType, { emit: false });
  }

  getState() {
    return {
      ...this.state,
      tabDefinitions: cloneTabDefinitions(this.state.tabDefinitions),
    };
  }

  updateProps(nextProps = {}) {
    if (Array.isArray(nextProps.tabDefinitions)) {
      this.state.tabDefinitions = cloneTabDefinitions(nextProps.tabDefinitions);
    }
    if (Object.prototype.hasOwnProperty.call(nextProps, 'defaultTabId')) {
      this.state.defaultTabId = nextProps.defaultTabId || 'csv';
    }
    if (Object.prototype.hasOwnProperty.call(nextProps, 'selectedFormat')) {
      this.setSelectedFormat(nextProps.selectedFormat || this.state.defaultTabId, { emit: false });
    }
  }

  setSelectedFormat(type, { emit = true } = {}) {
    const definitions = this.state.tabDefinitions;
    const directDefinition = definitions.find((definition) => definition.type === type);
    if (directDefinition) {
      this.state.activeMainTabId = directDefinition.id;
      this.state.activeType = type;
      if (emit) {
        this.callbacks.onFormatChange?.(type);
      }
      return;
    }

    const groupDefinition = definitions.find((definition) =>
      Array.isArray(definition.subtasks)
        ? definition.subtasks.some((subtask) => (subtask.types || [subtask.type]).includes(type))
        : false
    );

    if (groupDefinition) {
      this.state.activeMainTabId = groupDefinition.id;
      this.state.activeType = type;
      const activeSubtask = groupDefinition.subtasks.find((subtask) =>
        (subtask.types || [subtask.type]).includes(type)
      );
      if (activeSubtask) {
        activeSubtask.selectedType = type;
      }
      if (emit) {
        this.callbacks.onFormatChange?.(type);
      }
    }
  }

  selectMainTab(tabId) {
    const definition = this.state.tabDefinitions.find((entry) => entry.id === tabId);
    if (!definition) {
      return;
    }

    if (!definition.subtasks) {
      this.setSelectedFormat(definition.type);
      return;
    }

    const firstSubtask = definition.subtasks[0];
    const selectedType = firstSubtask?.selectedType || firstSubtask?.type;
    this.setSelectedFormat(selectedType);
  }

  getActiveTabDefinition() {
    return this.state.tabDefinitions.find((definition) => definition.id === this.state.activeMainTabId) || null;
  }
}

export { createDefaultTabDefinitions, FormatSelectorController };
