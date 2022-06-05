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

    getRowCount(){
        return this.rows.length;
    }

    getCell(rowIndex, colIndex){
        return this.rows[rowIndex][colIndex];
    }

    getRow(rowIndex){
        return this.rows[rowIndex].map(cell => cell);
    }
}

export {GenericDataTable}