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

function createColumns(columnNames) {
  var colDefs = [];
  columnNames.forEach(column => {
    var newCol = {};
    newCol.headerName = column;
    newCol.field = 'column' + (colDefs.length + 1);
    colDefs.push(newCol);
    console.log(newCol);
  });
  gridOptions.api.setColumnDefs(colDefs);
}

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

  //console.log(newCol);
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

function csvExport(){
  gridOptions.api.exportDataAsCsv();
}

function logMarkdown() {
  var markdownTable = '';

  //console.log(gridOptions.api.getColumnDefs())
  // output headers
  var headers = gridOptions.api.getColumnDefs().map(col => col.headerName);
  //console.log(headers);

  var fieldnames = gridOptions.api.getColumnDefs().map(col => col.field);
  //console.log(fieldnames);

  // output rows
  //console.log(rowData);
  var gridRowData = [];
  gridOptions.api.forEachNode(node => {
    var vals = [];
    //console.log(node.data);

    for (const propertyid in fieldnames) {
      property = fieldnames[propertyid];
      //console.log(property);
      //console.log(`- ${property}: ${node.data[property]}`);
      vals.push(node.data[property] ? node.data[property] : ' ');
    }
    gridRowData.push(vals);
  });
  //console.log(gridRowData);

  markdownTable = markdownTable + '|' + headers.join('|') + '|' + '\n';
  markdownTable =
    markdownTable + '|' + headers.map(name => '-----').join('|') + '|' + '\n';
  //console.log(gridRowData);
  gridRowData.forEach(values => {
    markdownTable = markdownTable + '|' + values.join('|') + '|' + '\n';
  });
  console.log(markdownTable);
  document.getElementById('markdownarea').innerHTML = markdownTable;
}

// use papa parse for csv parsing https://www.papaparse.com/demo
document.addEventListener('DOMContentLoaded', function() {
  const inputElement = document.getElementById('csvinput');
  inputElement.addEventListener('change', handleFiles, false);
});

function handleFiles() {
  console.log(this.files[0]);
  Papa.parse(this.files[0], {
    complete: function(results) {
      var header = true;
      results.data.forEach(row => {
        if (header) {
          createColumns(row);
          header = false;
          gridOptions.api.setRowData([]);
        } else {
          var fieldnames = gridOptions.api
            .getColumnDefs()
            .map(col => col.field);
          var vals = {};
          for (const propertyid in fieldnames) {
            vals[fieldnames[propertyid]] = row[propertyid];
          }
          //console.log(vals);
          gridOptions.api.applyTransaction({ add: [vals] });
        }
      });
    }
  });
}
