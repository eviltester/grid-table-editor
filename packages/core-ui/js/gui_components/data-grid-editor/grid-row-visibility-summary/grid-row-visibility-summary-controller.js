function normalizeCount(value) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    return 0;
  }
  return Math.max(0, parsed);
}

function normalizeProps(props = {}) {
  return {
    totalRowCount: normalizeCount(props.totalRowCount),
    visibleRowCount: normalizeCount(props.visibleRowCount),
    hasActiveFilters: props.hasActiveFilters === true,
    className: props.className || 'data-grid-total-rows',
    totalLabel: props.totalLabel || 'Total rows',
    filteredLabel: props.filteredLabel || 'Filtered Visible',
    roleName: props.roleName || 'grid-total-rows',
  };
}

class GridRowVisibilitySummaryController {
  constructor({ props = {} } = {}) {
    this.state = normalizeProps(props);
  }

  updateProps(nextProps = {}) {
    this.state = normalizeProps({ ...this.state, ...nextProps });
  }

  getState() {
    return { ...this.state };
  }

  getDisplayText() {
    const state = this.getState();
    const totalText = `${state.totalLabel}: ${state.totalRowCount}`;
    if (!state.hasActiveFilters) {
      return totalText;
    }
    return `${totalText} | ${state.filteredLabel}: ${state.visibleRowCount}`;
  }
}

export { GridRowVisibilitySummaryController };
