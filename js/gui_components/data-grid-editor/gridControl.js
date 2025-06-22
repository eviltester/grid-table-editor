class GridControlsPageMap{

    constructor(){
        this.addRowButtonQuery = "#addRowButton";
        this.addRowsAboveButtonQuery = "#addRowsAboveButton";
        this.addRowsBelowButtonQuery = "#addRowsBelowButton";
        this.deleteSelectedRowsButtonQuery = "#deleteSelectedRowsButton";
        this.clearFiltersButtonQuery = "#clearFiltersButton";
        this.filtersTextBoxQuery = "#filter-text-box";
        this.clearTableButtonQuery ="#clearTableButton";
    }
}

// TODO : don't hook into existing controls in HTML create them here and then hook into them
// The buttons above a grid
class GridControl {

    constructor(pageMap) {

        this.pageMap = pageMap;
    }

    // TODO : avoid hard coded IDs use relative to the parent, so store the parent e.g. like option panels
    addGuiIn(parent){
        parent.innerHTML =`
        <div class="toolbar">
            <button id="addRowButton">Add Row</button>
            <button id="addRowsAboveButton">Add Rows Above</button>
            <button id="addRowsBelowButton">Add Rows Below</button>
            <button id="deleteSelectedRowsButton">Delete Selected Rows</button>
            <label>Filter: <input type="text" id="filter-text-box" placeholder="Filter..."></label>
            <button id="clearFiltersButton" title="Clear Filters">Clear Filters</button>
            <button id="clearTableButton" title="Clear All Data">Reset Table</button>
        </div>
        <!-- ag-theme-alpine -->
        <div id="myGrid" style="height: 500px; width:100%;" class="ag-theme-alpine"></div>
        `;
    }

    useThisGridFunctionality(gridExtension){
        this.gridExtras = gridExtension;
    }

    addHooksToPage(container){

        let element = container.querySelector(this.pageMap.addRowButtonQuery);
        let addRowListener = this.addRow.bind(this);
        element.addEventListener('click', addRowListener, false);

        element = container.querySelector(this.pageMap.addRowsAboveButtonQuery);
        let addRowsListener = this.addRows.bind(this);
        element.addEventListener('click', function(){addRowsListener(-1)}, false);

        element = container.querySelector(this.pageMap.addRowsBelowButtonQuery);
        let addRowsBelowListener = this.addRows.bind(this);
        element.addEventListener('click', function(){addRowsBelowListener(1)}, false);

        element = container.querySelector(this.pageMap.deleteSelectedRowsButtonQuery);
        let deleteRowsListener = this.deleteSelectedRows.bind(this);
        element.addEventListener('click', deleteRowsListener, false);

        element = container.querySelector(this.pageMap.clearFiltersButtonQuery);
        let clearFiltersListener = this.clearFilters.bind(this);
        element.addEventListener('click', clearFiltersListener, false);

        element = container.querySelector(this.pageMap.filtersTextBoxQuery);
        let filterTextListener = this.filterTextBoxChanged.bind(this);
        element.addEventListener('input', filterTextListener, false);

        element = container.querySelector(this.pageMap.clearTableButtonQuery);
        let clearTableListener = this.clearTable.bind(this);
        element.addEventListener('click', clearTableListener, false);

    }

    addRow() {
        this.gridExtras.addRow();
    }

    addRows(position) {
        this.gridExtras.addRowsRelativeToSelection(position);
    }

    deleteSelectedRows() {

        if(this.gridExtras.getNumberOfSelectedRows()<=0){
            console.log("no rows selected");
            return;
        }

        if(!confirm('Are you Sure You Want to Delete Rows?'))
            return;

        this.gridExtras.deleteSelectedRows();
    }

    clearFilters(){
        document.getElementById('filter-text-box').value='';
        this.gridExtras.clearFilters();
    }

    filterTextBoxChanged(){
        this.gridExtras.filterText(document.getElementById('filter-text-box').value);
    }

    clearTable() {
        if(confirm('Are you sure you want to reset the table and all data?')){
            this.gridExtras.clearGrid();
        }
    }
}

export {GridControl, GridControlsPageMap}