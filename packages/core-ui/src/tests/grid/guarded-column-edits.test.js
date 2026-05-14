import { jest } from '@jest/globals';
import { GuardedColumnEdits } from '../../../js/grid/guarded-column-edits.js';
import { GuardedTabulatorColumnEdits } from '../../../js/gui_components/data-grid-editor/tabulator/guarded-tabulator-column-edits.js';

function createColumn(title = 'Old Name') {
  const definition = { title };
  return {
    getDefinition: () => definition,
  };
}

describe('GuardedColumnEdits (AG abstraction)', () => {
  let gridExtras;
  let guarded;
  let surfaceError;
  let requestTextInput;
  let requestConfirm;

  beforeEach(() => {
    gridExtras = {
      getColumnDef: jest.fn(() => ({ headerName: 'Old Name' })),
      nameAlreadyExists: jest.fn(() => false),
      renameColId: jest.fn(),
      getNumberOfColumns: jest.fn(() => 2),
      deleteColumnId: jest.fn(),
      duplicateColumn: jest.fn(),
      addNeighbourColumnId: jest.fn(),
    };
    surfaceError = jest.fn();
    requestTextInput = jest.fn();
    requestConfirm = jest.fn(async () => true);
    guarded = new GuardedColumnEdits(gridExtras, { surfaceError, requestTextInput, requestConfirm });
  });

  test('rename validates and delegates', async () => {
    requestTextInput.mockResolvedValue('Renamed');
    await guarded.renameColId('column1');
    expect(gridExtras.renameColId).toHaveBeenCalledWith('column1', 'Renamed');

    requestTextInput.mockResolvedValue('Old Name');
    await guarded.renameColId('column1');
    expect(gridExtras.renameColId).toHaveBeenCalledTimes(1);
    expect(surfaceError).not.toHaveBeenCalled();

    gridExtras.nameAlreadyExists.mockReturnValue(true);
    requestTextInput.mockResolvedValue('Existing');
    await guarded.renameColId('column1');
    expect(surfaceError).toHaveBeenCalled();
  });

  test('delete prevents removing last column and requires confirm', async () => {
    gridExtras.getNumberOfColumns.mockReturnValue(1);
    await guarded.deleteColId('column1');
    expect(surfaceError).toHaveBeenCalledWith('Cannot Delete The Only Column');
    expect(gridExtras.deleteColumnId).not.toHaveBeenCalled();

    gridExtras.getNumberOfColumns.mockReturnValue(2);
    requestConfirm.mockResolvedValue(false);
    await guarded.deleteColId('column1');
    expect(gridExtras.deleteColumnId).not.toHaveBeenCalled();

    requestConfirm.mockResolvedValue(true);
    await guarded.deleteColId('column1');
    expect(gridExtras.deleteColumnId).toHaveBeenCalledWith('column1');
  });

  test('duplicate and add-neighbour validate names', async () => {
    requestTextInput.mockResolvedValue('Copy');
    await guarded.duplicateColumnId(1, 'column1');
    expect(gridExtras.duplicateColumn).toHaveBeenCalledWith(1, 'column1', 'Copy');

    requestTextInput.mockResolvedValue('Neighbour');
    await guarded.addNeighbourColumnId(-1, 'column1');
    expect(gridExtras.addNeighbourColumnId).toHaveBeenCalledWith(-1, 'column1', 'Neighbour');
  });

  test('duplicate name checks can be disabled', async () => {
    gridExtras.nameAlreadyExists.mockReturnValue(true);
    const unguarded = new GuardedColumnEdits(gridExtras, {
      surfaceError,
      requestTextInput: jest.fn(async () => 'Existing'),
      requestConfirm,
      shouldEnforceUniqueNames: () => false,
    });

    await unguarded.renameColId('column1');
    expect(gridExtras.renameColId).toHaveBeenCalledWith('column1', 'Existing');
    expect(surfaceError).not.toHaveBeenCalled();
  });
});

describe('GuardedTabulatorColumnEdits', () => {
  let gridExtras;
  let guarded;
  let column;
  let surfaceError;
  let requestTextInput;
  let requestConfirm;

  beforeEach(() => {
    gridExtras = {
      nameAlreadyExists: jest.fn(() => false),
      renameColumn: jest.fn(),
      getNumberOfColumns: jest.fn(() => 2),
      deleteColumn: jest.fn(),
      duplicateColumn: jest.fn(),
      addNeighbourColumn: jest.fn(),
    };
    surfaceError = jest.fn();
    requestTextInput = jest.fn();
    requestConfirm = jest.fn(async () => true);
    guarded = new GuardedTabulatorColumnEdits(gridExtras, { surfaceError, requestTextInput, requestConfirm });
    column = createColumn('Old Name');
  });

  test('rename validates column existence and uniqueness', async () => {
    await guarded.renameColumn(null);
    expect(surfaceError).toHaveBeenCalledWith('Column not found');

    requestTextInput.mockResolvedValue('Renamed');
    await guarded.renameColumn(column);
    expect(gridExtras.renameColumn).toHaveBeenCalledWith(column, 'Renamed');

    requestTextInput.mockResolvedValue('Old Name');
    await guarded.renameColumn(column);
    expect(gridExtras.renameColumn).toHaveBeenCalledTimes(1);

    gridExtras.nameAlreadyExists.mockReturnValue(true);
    requestTextInput.mockResolvedValue('Existing');
    await guarded.renameColumn(column);
    expect(surfaceError).toHaveBeenCalled();
  });

  test('delete validates constraints and confirmation', async () => {
    await guarded.deleteColumn(undefined);
    expect(surfaceError).toHaveBeenCalledWith('Column not found');

    gridExtras.getNumberOfColumns.mockReturnValue(1);
    await guarded.deleteColumn(column);
    expect(surfaceError).toHaveBeenCalledWith('Cannot Delete The Only Column');

    gridExtras.getNumberOfColumns.mockReturnValue(2);
    requestConfirm.mockResolvedValue(false);
    await guarded.deleteColumn(column);
    expect(gridExtras.deleteColumn).not.toHaveBeenCalled();

    requestConfirm.mockResolvedValue(true);
    await guarded.deleteColumn(column);
    expect(gridExtras.deleteColumn).toHaveBeenCalledWith(column);
  });

  test('duplicate and add-neighbour prompt-driven actions delegate', async () => {
    requestTextInput.mockResolvedValue('Copy');
    await guarded.duplicateColumn(1, column);
    expect(gridExtras.duplicateColumn).toHaveBeenCalledWith(1, column, 'Copy');

    await guarded.addNeighbourColumn(1, null);
    expect(surfaceError).toHaveBeenCalledWith('Column not found');

    requestTextInput.mockResolvedValue('Neighbour');
    await guarded.addNeighbourColumn(-1, column);
    expect(gridExtras.addNeighbourColumn).toHaveBeenCalledWith(-1, column, 'Neighbour');
  });

  test('tabulator duplicate name checks can be disabled', async () => {
    gridExtras.nameAlreadyExists.mockReturnValue(true);
    const unguarded = new GuardedTabulatorColumnEdits(gridExtras, {
      surfaceError,
      requestTextInput: jest.fn(async () => 'Existing'),
      requestConfirm,
      shouldEnforceUniqueNames: () => false,
    });

    await unguarded.renameColumn(column);
    expect(gridExtras.renameColumn).toHaveBeenCalledWith(column, 'Existing');
    expect(surfaceError).not.toHaveBeenCalled();
  });
});
