import {
  buildMethodPickerTabSpecs,
  filterMethodPickerOptions,
  getNextRecentEntries,
  normalizeActiveTab,
  normalizeRecentEntries,
  prepareMethodPickerOptions,
  resolveSelectedCommandForFiltered,
  selectInitialCommand,
} from './method-picker-dialog-utils.js';

function normalizeProps(props = {}) {
  const options = prepareMethodPickerOptions(props.options);
  const tabSpecs = buildMethodPickerTabSpecs(options);
  const activeTab = normalizeActiveTab(tabSpecs, props.initialTab);
  const recentEntries = normalizeRecentEntries(props.recentEntries);

  return {
    title: props.title || 'Choose Method',
    options,
    tabSpecs,
    activeTab,
    searchTerm: String(props.searchTerm || ''),
    selectedCommand: selectInitialCommand(options, props.currentCommand),
    recentEntries,
  };
}

class MethodPickerDialogController {
  constructor({ props = {}, services = {} } = {}) {
    this.recentStore = services.recentStore || null;
    this.state = normalizeProps({
      ...props,
      recentEntries: props.recentEntries || this.recentStore?.read?.() || [],
    });
    this.syncSelectionWithFiltered();
  }

  getFilteredOptions() {
    return filterMethodPickerOptions({
      options: this.state.options,
      activeTab: this.state.activeTab,
      searchTerm: this.state.searchTerm,
      recentEntries: this.state.recentEntries,
    });
  }

  syncSelectionWithFiltered() {
    const filteredOptions = this.getFilteredOptions();
    this.state.selectedCommand = resolveSelectedCommandForFiltered(this.state.selectedCommand, filteredOptions);
  }

  updateProps(nextProps = {}) {
    const currentState = this.getState();
    this.state = normalizeProps({
      title: currentState.title,
      options: currentState.options,
      initialTab: currentState.activeTab,
      currentCommand: currentState.selectedCommand,
      searchTerm: currentState.searchTerm,
      recentEntries: currentState.recentEntries,
      ...nextProps,
    });
    this.syncSelectionWithFiltered();
  }

  setSearchTerm(searchTerm) {
    this.state.searchTerm = String(searchTerm || '');
    this.syncSelectionWithFiltered();
  }

  setActiveTab(activeTab) {
    this.state.activeTab = normalizeActiveTab(this.state.tabSpecs, activeTab);
    this.syncSelectionWithFiltered();
  }

  selectCommand(command) {
    const selected = String(command || '').trim();
    if (this.state.options.some((option) => option.command === selected)) {
      this.state.selectedCommand = selected;
    }
  }

  selectFirstFilteredOption() {
    const first = this.getFilteredOptions()[0];
    if (first) {
      this.state.selectedCommand = first.command;
    }
  }

  activateCommandWithEnter(command) {
    const selected = String(command || '').trim();
    if (!this.state.options.some((option) => option.command === selected)) {
      return { action: 'none', selection: null };
    }
    if (this.state.selectedCommand !== selected) {
      this.state.selectedCommand = selected;
      return { action: 'preview', selection: null };
    }
    return { action: 'apply', selection: this.applySelection() };
  }

  getSelectedOption() {
    return this.state.options.find((option) => option.command === this.state.selectedCommand) || null;
  }

  applySelection() {
    const selected = this.getSelectedOption();
    if (!selected) {
      return null;
    }
    const recentEntries = getNextRecentEntries(selected.command, this.state.recentEntries);
    this.state.recentEntries = recentEntries;
    this.recentStore?.write?.(recentEntries);
    return { sourceType: selected.sourceType, command: selected.command };
  }

  getState() {
    const filteredOptions = this.getFilteredOptions();
    const selectedOption = this.getSelectedOption();
    return {
      ...this.state,
      options: this.state.options.slice(),
      tabSpecs: this.state.tabSpecs.slice(),
      recentEntries: this.state.recentEntries.slice(),
      filteredOptions,
      selectedOption,
      applyDisabled: !selectedOption,
    };
  }
}

export { MethodPickerDialogController };
