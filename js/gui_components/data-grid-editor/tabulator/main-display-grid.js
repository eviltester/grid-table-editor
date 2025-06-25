import { GridExtension } from "./gridExtension-tabulator.js";
import { GridControl, GridControlsPageMap } from "../gridControl.js"
import { GenericDataTable } from "../../../data_formats/generic-data-table.js";
//import { CustomHeaderAgGrid } from "./customHeader-ag-grid.js";


/*
    Grid Features Used:
    - custom column header to add buttons for add new etc.
    - in cell editing
    - user row moving - drag drop
    - user column dragging - left right
    - column sorting
    - table filtering
    - row select (for deleting row, and adding above below)
*/


class ExtendedDataGrid {

    constructor() {
        var rowData = [];

        var columnDefs = [
            {
                title: '~rename-me',
                field: 'column1',
                sorter: "string"
            }
        ];

        this.gridOptions = {
            columns: columnDefs,
            data: rowData,

            columnDefaults: {
                //wrapText: true,
                //autoHeight: true,
                resizable: true,
                rowHandle: true,
                //editable: true,
                //filter:true,
                sorter: "string",
            },

            autoColumns: true,
            headerSort: true,

            // components: {
            //     agColumnHeader: CustomHeaderAgGrid,
            // },
            
            // rowDragManaged: true,
            // rowDragMultiRow: true,
            // rowSelection: {
            //     mode: 'multiRow',
            //     checkboxes: false,
            //     headerCheckbox: false,
            //     enableClickSelection: true,
            // },
            //onColumnResized: (params) => {params.api.resetRowHeights();}
        };
    }

    createChildGrid(parentGridDiv){

        let gridControls = new GridControl(new GridControlsPageMap());
        gridControls.addGuiIn(parentGridDiv)

        //let gridDiv = document.querySelector('#myGrid');

        this.gridApi = new Tabulator("#myGrid", this.gridOptions);

        this.gridExtras = new GridExtension(this.gridApi);

        // this.gridApi = agGrid.createGrid(gridDiv, this.gridOptions);

        // having setup the grid, make it a little more responsive - removed when adding tippy as it need doctype html
        // TODO: add some resizing div controls
        //setTimeout(function(gridDiv){gridDiv.style.height="40%";},1000, gridDiv);

        // gridControls.useThisGridFunctionality(this.gridExtras);
        gridControls.addHooksToPage(document);
    }

    sizeColumnsToFit(){
        //this.gridApi.sizeColumnsToFit();
    }

    getGridExtras(){
        return this.gridExtras;
    }
}

export {ExtendedDataGrid};