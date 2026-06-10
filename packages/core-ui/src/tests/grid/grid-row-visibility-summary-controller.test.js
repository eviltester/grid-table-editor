import { GridRowVisibilitySummaryController } from '../../../js/gui_components/data-grid-editor/grid-row-visibility-summary/grid-row-visibility-summary-controller.js';

describe('GridRowVisibilitySummaryController', () => {
  test('renders total rows only when filters are inactive', () => {
    const controller = new GridRowVisibilitySummaryController({
      props: {
        totalRowCount: 8,
        visibleRowCount: 8,
        hasActiveFilters: false,
      },
    });

    expect(controller.getState()).toMatchObject({
      totalRowCount: 8,
      visibleRowCount: 8,
      hasActiveFilters: false,
    });
    expect(controller.getDisplayText()).toBe('Total rows: 8');
  });

  test('renders filtered visible count when filters are active', () => {
    const controller = new GridRowVisibilitySummaryController({
      props: {
        totalRowCount: 8,
        visibleRowCount: 3,
        hasActiveFilters: true,
      },
    });

    expect(controller.getDisplayText()).toBe('Total rows: 8 | Filtered Visible: 3');
  });

  test('normalizes invalid counts to zero on creation and update', () => {
    const controller = new GridRowVisibilitySummaryController({
      props: {
        totalRowCount: 'bad',
        visibleRowCount: -4,
      },
    });

    expect(controller.getState()).toMatchObject({
      totalRowCount: 0,
      visibleRowCount: 0,
    });

    controller.updateProps({
      totalRowCount: '12',
      visibleRowCount: undefined,
      hasActiveFilters: true,
    });

    expect(controller.getState()).toMatchObject({
      totalRowCount: 12,
      visibleRowCount: 0,
      hasActiveFilters: true,
    });
    expect(controller.getDisplayText()).toBe('Total rows: 12 | Filtered Visible: 0');
  });
});
