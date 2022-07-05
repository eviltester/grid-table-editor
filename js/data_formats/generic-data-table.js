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

    setFromDataArray(aDataArray){
        // first row are headings
        // rest are data
        if(aDataArray===undefined){
            return true;
        }
        if(aDataArray===null){
            // clear the table
            this.headers = [];
            this.rows=[];
            return true;
        }
        if(aDataArray.length == 0){
            return false;
        }

        // process headers
        const dataHeaders = aDataArray[0];
        if(dataHeaders===undefined){
            // do not change the headers
        }else{
            if(dataHeaders===null){
                // bad idea to try and set headers to null
                // leave data as it is
                console.log("Cannot set headers to null, data unchanged");
                return false;
            }
            if(dataHeaders.length==0){
                // what are you doing? table needs headers
                // leave data as it is
                console.log("Cannot set headers to none, data unchanged");
                return false;
            }
        }

        this.headers = [];
        for(let header of dataHeaders){
            // add header value to the grid
            this.addHeader(header);
        }

        this.rows=[];
        // process data
        for( let rowId = 1; rowId<aDataArray.length; rowId++){
            let rowData = aDataArray[rowId];
            if(!this.appendDataRow(rowData)){
                return false;
            }
        }

        return true;
    }

    setFromDataObjects(dataObjects){

        if(dataObjects===undefined){
            return;
        }

        if(dataObjects===null){
            return;
        }

        if(dataObjects.length===0){
            return;
        }

        // assume all headers are in the first object
        let headers = [];
        for(const header in dataObjects[0]){
            headers.push(header);
        }

        this.setHeaders(headers);

        // process all rows
        dataObjects.forEach(row => {
            let rowData = [];
            headers.forEach(header => {
                let cellValue = row[header];
                if(cellValue===undefined){
                    cellValue="";
                }
                rowData.push(cellValue);
            });
            this.appendDataRow(rowData);
        });   

    }

    // convert to the old format to ease migration
    asDataArray(){

        let data = [];

        if(this.headers.length==0){
            return data;
        }

        data.push(this.headers.map(header => header));
        for(let row of this.rows){
            data.push(row.map(cell => cell));
        }
        return data;
    }

    appendDataRow(rowData){
        let numberOfEmptyCellsToAdd = this.headers.length;
        let rowToAdd = [];
        if(rowData!==undefined && rowData !==null){
            if(rowData.length>this.headers.length){
                // problem, the row is too long for the table
                console.log("Tried to add " + rowData.length + " columns to a table with " + this.headers.length + " columns");
                return false;
            }
            // add the data into the row
            numberOfEmptyCellsToAdd = this.headers.length - rowData.length;

            for(let cell of rowData){
                rowToAdd.push(cell ? String(cell) : '');
            }
        }
        
        // add the empty cells
        while(numberOfEmptyCellsToAdd>0){
            rowToAdd.push("");
            numberOfEmptyCellsToAdd--;
        }

        this.rows.push(rowData);
        return true;
    }

    addHeader(aHeader){
        this.headers.push(aHeader ? String(aHeader) : '');
    }

    setHeaders(aHeaderArray){
        this.headers = [];
        for(let header of aHeaderArray){
            this.addHeader(header);
        }
    }

    getColumnCount(){
        return this.headers.length;
    }

    getHeader(headerIndex){
        return this.headers[headerIndex];
    }

    getHeaders(){
        return this.headers.map(header => header);
    }

    getRowCount(){
        return this.rows.length;
    }

    getCell(rowIndex, colIndex){
        return this.rows[rowIndex][colIndex];
    }

    getRow(rowIndex){
        return this.rows[rowIndex].map(cell => cell);
    }

    getRowAsObject(rowIndex){

      let fieldnames = this.getHeaders();
      let vals = {};
      let row = this.getRow(rowIndex);
      for (const propertyid in fieldnames) {
        vals[fieldnames[propertyid]] = row[propertyid];
      }
      return vals;
    }

    getRowAsObjectUsingHeadings(rowIndex, fieldnames){
        let vals = {};
        let row = this.getRow(rowIndex);
        for (const propertyid in fieldnames) {
            vals[fieldnames[propertyid]] = row[propertyid];
        }
        return vals;
    }
}

export {GenericDataTable}