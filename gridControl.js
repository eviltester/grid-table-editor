class PageMap{

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

class GridControl {

    constructor(gridExtension, pageMap) {
        this.gridExtras = gridExtension;
        this.pageMap = pageMap;
    }

    addHooksToPage(container){

        var element = container.querySelector(this.pageMap.addRowButtonQuery);
        var addRowListener = this.addRow.bind(this);
        element.addEventListener('click', addRowListener, false);

        var element = container.querySelector(this.pageMap.addRowsAboveButtonQuery);
        var addRowsListener = this.addRows.bind(this);
        element.addEventListener('click', function(){addRowsListener(-1)}, false);

        var element = container.querySelector(this.pageMap.addRowsBelowButtonQuery);
        var addRowsBelowListener = this.addRows.bind(this);
        element.addEventListener('click', function(){addRowsBelowListener(1)}, false);

        var element = container.querySelector(this.pageMap.deleteSelectedRowsButtonQuery);
        var deleteRowsListener = this.deleteSelectedRows.bind(this);
        element.addEventListener('click', deleteRowsListener, false);

        var element = container.querySelector(this.pageMap.clearFiltersButtonQuery);
        var clearFiltersListener = this.clearFilters.bind(this);
        element.addEventListener('click', clearFiltersListener, false);

        var element = container.querySelector(this.pageMap.filtersTextBoxQuery);
        var filterTextListener = this.filterTextBoxChanged.bind(this);
        element.addEventListener('input', filterTextListener, false);

        var element = container.querySelector(this.pageMap.clearTableButtonQuery);
        var clearTableListener = this.clearTable.bind(this);
        element.addEventListener('click', clearTableListener, false);

    }

    addRow() {
        this.gridExtras.addRow();
    }

    addRows(position) {
        gridExtras.addRowsRelativeToSelection(position);
    }

    deleteSelectedRows() {
        if(!confirm('Are you Sure You Want to Delete Rows?'))
            return;

        gridExtras.deleteSelectedRows();
    }

    clearFilters(){
        document.getElementById('filter-text-box').value='';
        gridExtras.clearFilters();
    }

    filterTextBoxChanged(){
        gridExtras.filterText(document.getElementById('filter-text-box').value);
    }

    clearTable() {
        if(confirm('Are you sure you want to reset the table and all data?')){
            gridExtras.clearGrid();
        }
    }
}