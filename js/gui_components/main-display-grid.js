import { GridExtension } from "../grid/gridExtension.js";
import { GridControl, GridControlsPageMap } from "./gridControl.js"
import { CustomHeader } from "../grid/customHeader.js";

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
                headerName: '~rename-me',
                field: 'column1'
            }
        ];

        this.gridOptions = {
            columnDefs: columnDefs,
            rowData: rowData,

            defaultColDef: {
                wrapText: true,
                autoHeight: true,
                resizable: true,
                rowDrag: true,
                editable: true,
                filter:true,
                sortable:true,
            },

            components: {
                agColumnHeader: CustomHeader,
            },
            
            rowDragManaged: true,
            rowDragMultiRow: true,
            rowSelection: 'multiple',
            //onColumnResized: (params) => {params.api.resetRowHeights();}
        };
    }

    createChildGrid(parentGridDiv){

        let gridControls = new GridControl(new GridControlsPageMap());
        gridControls.addGuiIn(parentGridDiv)

        let gridDiv = document.querySelector('#myGrid');

        new agGrid.Grid(gridDiv, this.gridOptions);

        // having setup the grid, make it a little more responsive - removed when adding tippy as it need doctype html
        // TODO: add some resizing div controls
        //setTimeout(function(gridDiv){gridDiv.style.height="40%";},1000, gridDiv);

        this.gridExtras = new GridExtension(this.gridOptions.api, this.gridOptions.columnApi);

        gridControls.useThisGridFunctionality(this.gridExtras);
        gridControls.addHooksToPage(document);
    }

    getGridApi(){
        return this.gridOptions.api;
    }

    getGridExtras(){
        return this.gridExtras;
    }
}

export {ExtendedDataGrid};