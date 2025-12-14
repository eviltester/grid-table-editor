class TabulatorHelper{

    constructor(tabulator) {
        this.tabulator = tabulator;
    }


    filterAcrossAllColumns(value) {
        const query = value.trim().toLowerCase();

        // If nothing typed, clear all filters
        if (!query) {
            this.tabulator.clearFilter();
            return;
        }

        // Custom filter – keep rows where *any* value contains the query
        this.tabulator.setFilter(function (row) {
            const values = Object.values(row);
            return values.some(val => {
                // Convert to string and search case‑insensitively
                return String(val).toLowerCase().includes(query);
            });
        });
    }

    addRowToBottom(rowToAdd){
        // add row to bottom of table - false for bottom, true for top
        addRow(rowToAdd, false);
    }

    addRowToBottom(rowToAdd){
        // add row to bottom of table - false for bottom, true for top
        addRow(rowToAdd, true);
    }

    addRow(rowToAdd,addToTop){
        // add row to bottom of table - false for bottom, true for top
        this.tabulator.addData([rowToAdd], addToTop);
    }

}

export {TabulatorHelper as TabulatorHelper}