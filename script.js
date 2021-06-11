var rowData = [];

var columnDefs = [
  {
    headerName: 'Column',
    field: 'column1'
  }
];

var gridOptions = {
  columnDefs: columnDefs,
  rowData: rowData,

  defaultColDef: {
    wrapText: true,
    autoHeight: true,
    resizable: true,
    rowDrag: true,
    editable: true
  },
  rowDragManaged: true,
  enableMultiRowDragging: true,
  rowSelection: 'multiple'
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
  var gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);
});

function addColumn() {
  var colTitle = prompt('Column Name?');

  if (colTitle != null && colTitle != '') {
    console.log('create a new column with this name: ' + colTitle);
  } else {
    return;
  }

  var colDefs = gridOptions.api.getColumnDefs();
  //var newCol = Object.assign({}, colDefs[0]);
  var newCol = {};
  newCol.headerName = colTitle;
  newCol.field = 'column' + (colDefs.length + 1);
  //newCol.colId = newCol.field;
  //delete newCol.rowGroup;
  //delete newCol.pivot;

  colDefs.push(newCol);

  console.log(newCol);
  gridOptions.api.setColumnDefs(colDefs);

  // todo add default value for that column to all rows in rowData
}

function renameColumn(id) {
  var colTitle = prompt('Column Name?');

  if (colTitle != null && colTitle != '') {
    console.log('rename column ' + id + ' with this name: ' + colTitle);
  } else {
    return;
  }

  var colDefs = gridOptions.api.getColumnDefs();
  colDefs[id - 1].headerName = colTitle;
  gridOptions.api.setColumnDefs(colDefs);
}

function addRow() {
  gridOptions.api.applyTransaction({ add: [{}] });
}

function logMarkdown() {
  var markdownTable = '';

  // output headers
  var headers = gridOptions.api.getColumnDefs().map(col => col.headerName);

  //console.log(headers);
  // output rows
  //console.log(rowData);
  var gridRowData = [];
  gridOptions.api.forEachNode(node => {
    var vals = [];
    //console.log(node.data);
    for (const property in node.data) {
      //console.log(`${property}: ${node.data[property]}`);
      vals.push(node.data[property]);
    }
    gridRowData.push(vals);
  });
  //console.log(gridRowData);

  markdownTable = markdownTable + '|' + headers.join('|') + '|' + '\n';
  markdownTable =
    markdownTable + '|' + headers.map(name => '-----').join('|') + '|' + '\n';
  gridRowData.forEach(values => {
    markdownTable = markdownTable + '|' + values.join('|') + '|' + '\n';
  });
  console.log(markdownTable);
}
