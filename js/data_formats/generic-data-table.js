/*

GenericDataTable will be the intermediate data format for all conversions.

ie.

- all import from format will be to a GenericDataTable
- grid setting will be from a GenericDataTable
- grid will export to GenericDataTable
- all exports will format from a GenericData Table

e.g.

csv -> to GenericDataTable -> grid
markdown -> to GenericDataTable -> grid
csv -> to GenericDataTable -> markdown
grid -> to GenericDataTable -> markdown

This way we only have to support conversion to, and from GenericDataTable and this
can be more easily unit tested.

*/
class GenericDataTable {
  constructor() {
    this.headers = [];
    this.rows = [];
  }

  clear() {
    // clear the table
    this.headers = [];
    this.rows = [];
    return true;
  }

  appendDataRow(rowData) {
    let numberOfEmptyCellsToAdd = this.headers.length;
    let rowToAdd = [];
    if (rowData !== undefined && rowData !== null) {
      if (rowData.length > this.headers.length) {
        // problem, the row is too long for the table
        console.log('Tried to add ' + rowData.length + ' columns to a table with ' + this.headers.length + ' columns');
        return false;
      }
      // add the data into the row
      numberOfEmptyCellsToAdd = this.headers.length - rowData.length;

      for (let cell of rowData) {
        rowToAdd.push(cell ? String(cell) : '');
      }
    }

    // add the empty cells
    while (numberOfEmptyCellsToAdd > 0) {
      rowToAdd.push('');
      numberOfEmptyCellsToAdd--;
    }

    this.rows.push(rowData);
    return true;
  }

  addHeader(aHeader) {
    this.headers.push(aHeader ? String(aHeader) : '');
  }

  setHeaders(aHeaderArray) {
    this.headers = [];
    for (let header of aHeaderArray) {
      this.addHeader(header);
    }
  }

  getColumnCount() {
    return this.headers.length;
  }

  getHeader(headerIndex) {
    return this.headers[headerIndex];
  }

  getHeaders() {
    return this.headers.map((header) => header);
  }

  getRowCount() {
    return this.rows.length;
  }

  getCell(rowIndex, colIndex) {
    return this.rows[rowIndex][colIndex];
  }

  getRow(rowIndex) {
    return this.rows[rowIndex].map((cell) => cell);
  }

  getRowAsObject(rowIndex) {
    let fieldnames = this.getHeaders();
    return this.getRowAsObjectUsingHeadings(rowIndex, fieldnames);
  }

  getRowAsObjectUsingHeadings(rowIndex, fieldnames) {
    let vals = {};
    let row = this.getRow(rowIndex);
    for (const propertyid in fieldnames) {
      vals[fieldnames[propertyid]] = row[propertyid];
    }
    return vals;
  }
}

export { GenericDataTable };
