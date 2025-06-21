/*
    Helper class to set GenericDataTable data from various formats
*/
class GenericDataTableUtils {

    setGenericDataTableFromDataArray(aGenericDataTable, aDataArray){
        // first row are headings
        // rest are data
        if(aDataArray===undefined){
            return true;
        }
        if(aDataArray===null){
            // clear the table
            return aGenericDataTable.clear();
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
            aGenericDataTable.addHeader(header);
        }

        this.rows=[];
        // process data
        for( let rowId = 1; rowId<aDataArray.length; rowId++){
            let rowData = aDataArray[rowId];
            if(!aGenericDataTable.appendDataRow(rowData)){
                return false;
            }
        }

        return true;
    }

    setGenericDataTableFromDataObjects(aGenericDataTable,dataObjects){

        if(dataObjects===undefined){
            return false;
        }

        if(dataObjects===null){
            return false;
        }

        if(dataObjects.length===0){
            return false;
        }

        // assume all headers are in the first object
        let headers = [];
        for(const header in dataObjects[0]){
            headers.push(header);
        }

        aGenericDataTable.setHeaders(headers);

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
            aGenericDataTable.appendDataRow(rowData);
        });   

        return true;
    }
}

export {GenericDataTableUtils}