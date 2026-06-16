function buildPreviewText(schemaText, maxLength = 160) {
  const normalized = String(schemaText || '')
    .trim()
    .replace(/\s+/g, ' ');
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, maxLength - 3)}...`;
}

class StoredSchemasManagerController {
  constructor({ props = {}, callbacks = {} } = {}) {
    this.props = props;
    this.callbacks = callbacks;
    this.state = {
      currentSchemaText: String(props.currentSchemaText || ''),
      selectedLastUsedId: props.summary?.lastUsed?.[0]?.id || '',
      summary: props.summary || {
        draft: null,
        lastUsed: [],
        saved: [],
        counts: { lastUsed: 0, saved: 0 },
        hasDraft: false,
        errorMessage: '',
      },
    };
  }

  updateProps(nextProps = {}) {
    this.props = { ...this.props, ...nextProps };
    if (Object.prototype.hasOwnProperty.call(nextProps, 'currentSchemaText')) {
      this.state.currentSchemaText = String(nextProps.currentSchemaText || '');
    }
    if (nextProps.summary) {
      this.state.summary = nextProps.summary;
      const availableSelection = nextProps.summary.lastUsed.find((entry) => entry.id === this.state.selectedLastUsedId);
      this.state.selectedLastUsedId = availableSelection?.id || nextProps.summary.lastUsed[0]?.id || '';
    }
  }

  getState() {
    return {
      ...this.state,
      summary: {
        ...this.state.summary,
        lastUsed: (this.state.summary.lastUsed || []).slice(),
        saved: (this.state.summary.saved || []).slice(),
      },
    };
  }

  setCurrentSchemaText(schemaText) {
    this.state.currentSchemaText = String(schemaText || '');
  }

  setSummary(summary) {
    this.updateProps({ summary });
  }

  setSelectedLastUsedId(id) {
    this.state.selectedLastUsedId = String(id || '');
  }

  getSelectedLastUsedEntry() {
    return this.state.summary.lastUsed.find((entry) => entry.id === this.state.selectedLastUsedId) || null;
  }

  getViewModel() {
    const selectedLastUsed = this.getSelectedLastUsedEntry();
    const draftPreview = buildPreviewText(this.state.summary.draft?.schemaText || '');
    const lastUsedPreview = buildPreviewText(selectedLastUsed?.schemaText || '');
    return {
      summaryLabel: `Managed Stored Schemas (${this.state.summary.counts.saved})`,
      saveAsDisabled: this.state.currentSchemaText.trim().length === 0,
      recoverDraftDisabled: !this.state.summary.hasDraft,
      recoverDraftPreview: draftPreview,
      clearLastUsedDisabled: (this.state.summary.counts.lastUsed || 0) === 0,
      loadLastUsedDisabled: !selectedLastUsed,
      loadSavedDisabled: (this.state.summary.counts.saved || 0) === 0,
      lastUsedOptions: (this.state.summary.lastUsed || []).map((entry) => ({
        value: entry.id,
        label: entry.name,
      })),
      selectedLastUsedId: this.state.selectedLastUsedId,
      selectedLastUsedPreview: lastUsedPreview,
      errorMessage: this.state.summary.errorMessage || '',
    };
  }
}

export { StoredSchemasManagerController, buildPreviewText };
