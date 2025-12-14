import { GridExtension } from "./gridExtension-tabulator.js";
import { GridControl, GridControlsPageMap } from "../gridControl.js"
import { GenericDataTable } from "../../../data_formats/generic-data-table.js";
import { GuardedTabulatorColumnEdits } from "./guarded-tabulator-column-edits.js";


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



        //create header popup contents
        const headerPopupFormatter = function(e, column, onRendered){
            var container = document.createElement("div");

            var label = document.createElement("label");
            label.innerHTML = "Filter Column:";
            label.style.display = "block";
            label.style.fontSize = ".7em";

            var input = document.createElement("input");
            input.placeholder = "Filter Column...";
            input.value = column.getHeaderFilterValue() || "";

            input.addEventListener("keyup", (e) => {
                //console.log("set filter to " + input.value);
                column.setHeaderFilterValue(input.value);
            });

            var buttons = document.createElement("div");
            buttons.classList.add("headerbuttons");
            buttons.innerHTML = `
                        <hr>
                        <span class="customHeaderAddLeftButton" title="add left">[<+]</span>
                        <span class="customHeaderRenameButton" title="rename">[~]</span>
                        <span class="customHeaderDeleteButton" title="delete">[x]</span>
                        <span class="customHeaderDuplicateButton" title="duplicate">[+=]</span>
                        <span class="customHeaderAddRightButton" title="add right">[+>]</span>
            `;

            container.appendChild(label);
            container.appendChild(input);
            container.appendChild(buttons);

            this.guardedColumnEdits = new GuardedTabulatorColumnEdits(new GridExtension(column.getTable()));

            const headerAddLeftButton = buttons.querySelector('.customHeaderAddLeftButton');
            headerAddLeftButton.addEventListener('click', 
                function(){
                    this.guardedColumnEdits.addNeighbourColumn(-1,column);
                    //document.activeElement.blur()
                }.bind(this));

            const headerRenameButton = buttons.querySelector('.customHeaderRenameButton');
            headerRenameButton.addEventListener('click', 
                function(){this.guardedColumnEdits.renameColumn(column)}.bind(this));

            const headerDeleteButton = buttons.querySelector('.customHeaderDeleteButton');
            headerDeleteButton.addEventListener('click', 
                function(){
                    this.guardedColumnEdits.deleteColumn(column);
                    document.activeElement.blur();
                }.bind(this));

            const headerDuplicateButton = buttons.querySelector('.customHeaderDuplicateButton');
            headerDuplicateButton.addEventListener('click', 
                function(){this.guardedColumnEdits.duplicateColumn(1,column)}.bind(this));

            const headerAddRightButton = buttons.querySelector('.customHeaderAddRightButton');
            headerAddRightButton.addEventListener('click', 
                function(){this.guardedColumnEdits.addNeighbourColumn(1,column)}.bind(this));

            return container;
        }

        //create dummy header filter to allow popup to filter
        const emptyHeaderFilter = function(){
            return document.createElement("div");;
        }


        this.gridOptions = {
            columns: columnDefs,
            data: rowData,

            columnDefaults: {
                //wrapText: true,
                //autoHeight: true,
                resizable: true,
                rowHandle: true,
                //editable: true,
                editor:"input", editorParams:{selectContents:true},
                //filter:true,
                sorter: "string",

                //headerFilter: "input",
                headerPopup: headerPopupFormatter,
                //headerPopupIcon:"<i class='fas fa-filter' title='Filter column'>[...]</i>",
                
                headerFilter:emptyHeaderFilter,
                headerFilterFunc:"like"
            },

            autoColumns: true,
            headerSort: true,

            movableColumns: true,

            movableRows: true,
            // rowDragManaged: true,
            // rowDragMultiRow: true,

            // make rows selectable when clicked,
            // with multi-row selection where click first then click last with shift
            selectableRows:true,
            selectableRowsRangeMode:"click",
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

        gridControls.useThisGridFunctionality(this.gridExtras);
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