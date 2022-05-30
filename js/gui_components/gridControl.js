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

// todo: don't hook into existing controls in HTML create them here and then hook into them
// The buttons above a grid
class GridControl {

    constructor(gridExtension, pageMap) {
        this.gridExtras = gridExtension;
        this.pageMap = pageMap;
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