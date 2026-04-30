import { GuardedColumnEdits } from '../../packages/core-ui/js/grid/guarded-column-edits.js';
import { GuardedTabulatorColumnEdits } from '../../packages/core-ui/js/gui_components/data-grid-editor/tabulator/guarded-tabulator-column-edits.js';

function createColumn(title = 'Old Name') {
  const definition = { title };
  return {
    getDefinition: () => definition,
  };
}

describe('GuardedColumnEdits (AG abstraction)', () => {
  let gridExtras;
  let guarded;

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
    guarded = new GuardedColumnEdits(gridExtras);
    global.prompt = jest.fn();
    global.confirm = jest.fn(() => true);
    global.alert = jest.fn();
  });

  test('rename validates and delegates', () => {
    global.prompt.mockReturnValue('Renamed');
    guarded.renameColId('column1');
    expect(gridExtras.renameColId).toHaveBeenCalledWith('column1', 'Renamed');

    gridExtras.nameAlreadyExists.mockReturnValue(true);
    guarded.renameColId('column1');
    expect(global.alert).toHaveBeenCalled();
  });

  test('delete prevents removing last column and requires confirm', () => {
    gridExtras.getNumberOfColumns.mockReturnValue(1);
    guarded.deleteColId('column1');
    expect(global.alert).toHaveBeenCalledWith('Cannot Delete The Only Column');
    expect(gridExtras.deleteColumnId).not.toHaveBeenCalled();

    gridExtras.getNumberOfColumns.mockReturnValue(2);
    global.confirm.mockReturnValue(false);
    guarded.deleteColId('column1');
    expect(gridExtras.deleteColumnId).not.toHaveBeenCalled();

    global.confirm.mockReturnValue(true);
    guarded.deleteColId('column1');
    expect(gridExtras.deleteColumnId).toHaveBeenCalledWith('column1');
  });

  test('duplicate and add-neighbour validate names', () => {
    global.prompt.mockReturnValue('Copy');
    guarded.duplicateColumnId(1, 'column1');
    expect(gridExtras.duplicateColumn).toHaveBeenCalledWith(1, 'column1', 'Copy');

    global.prompt.mockReturnValue('Neighbour');
    guarded.addNeighbourColumnId(-1, 'column1');
    expect(gridExtras.addNeighbourColumnId).toHaveBeenCalledWith(-1, 'column1', 'Neighbour');
  });
});

describe('GuardedTabulatorColumnEdits', () => {
  let gridExtras;
  let guarded;
  let column;

  beforeEach(() => {
    gridExtras = {
      nameAlreadyExists: jest.fn(() => false),
      renameColumn: jest.fn(),
      getNumberOfColumns: jest.fn(() => 2),
      deleteColumn: jest.fn(),
      duplicateColumn: jest.fn(),
      addNeighbourColumn: jest.fn(),
    };
    guarded = new GuardedTabulatorColumnEdits(gridExtras);
    column = createColumn('Old Name');
    global.prompt = jest.fn();
    global.confirm = jest.fn(() => true);
    global.alert = jest.fn();
  });

  test('rename validates column existence and uniqueness', () => {
    guarded.renameColumn(null);
    expect(global.alert).toHaveBeenCalledWith('Column not found');

    global.prompt.mockReturnValue('Renamed');
    guarded.renameColumn(column);
    expect(gridExtras.renameColumn).toHaveBeenCalledWith(column, 'Renamed');

    gridExtras.nameAlreadyExists.mockReturnValue(true);
    guarded.renameColumn(column);
    expect(global.alert).toHaveBeenCalled();
  });

  test('delete validates constraints and confirmation', () => {
    guarded.deleteColumn(undefined);
    expect(global.alert).toHaveBeenCalledWith('Column not found');

    gridExtras.getNumberOfColumns.mockReturnValue(1);
    guarded.deleteColumn(column);
    expect(global.alert).toHaveBeenCalledWith('Cannot Delete The Only Column');

    gridExtras.getNumberOfColumns.mockReturnValue(2);
    global.confirm.mockReturnValue(false);
    guarded.deleteColumn(column);
    expect(gridExtras.deleteColumn).not.toHaveBeenCalled();

    global.confirm.mockReturnValue(true);
    guarded.deleteColumn(column);
    expect(gridExtras.deleteColumn).toHaveBeenCalledWith(column);
  });

  test('duplicate and add-neighbour prompt-driven actions delegate', () => {
    global.prompt.mockReturnValue('Copy');
    guarded.duplicateColumn(1, column);
    expect(gridExtras.duplicateColumn).toHaveBeenCalledWith(1, column, 'Copy');

    guarded.addNeighbourColumn(1, null);
    expect(global.alert).toHaveBeenCalledWith('Column not found');

    global.prompt.mockReturnValue('Neighbour');
    guarded.addNeighbourColumn(-1, column);
    expect(gridExtras.addNeighbourColumn).toHaveBeenCalledWith(-1, column, 'Neighbour');
  });
});
