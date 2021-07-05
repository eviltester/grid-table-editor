/*
 https://www.ag-grid.com/javascript-grid/component-header/

  for icons on header
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css"/>

 */

class CustomHeader {
    init(agParams) {
      this.agParams = agParams;
      this.eGui = document.createElement('div');
      this.eGui.classList.add('headerWrapper');
      this.eGui.innerHTML = `
               <div class="customHeaderTop">
                <div class="customFilterMenuButton">
                    <i class="ag-icon ag-icon-filter"></i>
                </div>
                <div class="customHeaderLabel">${this.agParams.displayName}</div>
                <div class="customSort">
                  <span class="customSortDownLabel inactive">
                      <i class="ag-icon ag-icon-desc"></i>
                  </span>
                  <span class="customSortUpLabel inactive">
                      <i class="ag-icon ag-icon-asc"></i>
                  </span>
                  <span class="customSortRemoveLabel inactive">
                      <i class="ag-icon ag-icon-cancel"></i>
                  </span>
                </div>
              </div>
              <div class="headerbuttons">
                <span title="add left" onclick="addNeighbourColumnId(-1,'${this.agParams.column.colId}')">[<+]</span>
                <span title="rename" onclick="renameColId('${this.agParams.column.colId}')">[~]</span>
                <span title="delete" onclick="deleteColId('${this.agParams.column.colId}')">[x]</span>
                <span title="duplicate" onclick="duplicateColumnId(1,'${this.agParams.column.colId}')">[+=]</span>
                <span title="add right" onclick="addNeighbourColumnId(1,'${this.agParams.column.colId}')">[+>]</span>
            </div>

          `;
  
      this.eMenuButton = this.eGui.querySelector('.customFilterMenuButton');
      this.eSortDownButton = this.eGui.querySelector('.customSortDownLabel');
      this.eSortUpButton = this.eGui.querySelector('.customSortUpLabel');
      this.eSortRemoveButton = this.eGui.querySelector('.customSortRemoveLabel');
  
      if (this.agParams.enableMenu) {
        this.onMenuClickListener = this.onMenuClick.bind(this);
        this.eMenuButton.addEventListener('click', this.onMenuClickListener);
      } else {
        this.eGui.removeChild(this.eMenuButton);
      }
  
      if (this.agParams.enableSorting) {
        this.onSortAscRequestedListener = this.onSortRequested.bind(this, 'asc');
        this.eSortDownButton.addEventListener(
          'click',
          this.onSortAscRequestedListener
        );
        this.onSortDescRequestedListener = this.onSortRequested.bind(
          this,
          'desc'
        );
        this.eSortUpButton.addEventListener(
          'click',
          this.onSortDescRequestedListener
        );
        this.onRemoveSortListener = this.onSortRequested.bind(this, '');
        this.eSortRemoveButton.addEventListener(
          'click',
          this.onRemoveSortListener
        );
  
        this.onSortChangedListener = this.onSortChanged.bind(this);
        this.agParams.column.addEventListener(
          'sortChanged',
          this.onSortChangedListener
        );
        this.onSortChanged();

        this.onFilterChangedListener = this.onFilterChanged.bind(this);
        this.agParams.column.addEventListener(
            'filterChanged',
            this.onFilterChangedListener
        );
        this.onFilterChanged();

      } else {
        this.eGui.removeChild(this.eSortDownButton);
        this.eGui.removeChild(this.eSortUpButton);
        this.eGui.removeChild(this.eSortRemoveButton);
      }
    }

    deactivateIcon(toDeactivateItems){
      toDeactivateItems.forEach((toDeactivate) => {
        toDeactivate.classList.remove("active");
      });
    }

    activateIcon(toActivate){
      toActivate.classList.add("active");
    }

    onFilterChanged(){

      if (this.agParams.column.isFilterActive()) {
        this.activateIcon(this.eMenuButton);
      }else{
        this.deactivateIcon([this.eMenuButton]);
      }

    }
  
    onSortChanged() {
      if (this.agParams.column.isSortAscending()) {
        this.deactivateIcon([this.eSortUpButton, this.eSortRemoveButton]);
        this.activateIcon(this.eSortDownButton);
      } else if (this.agParams.column.isSortDescending()) {
        this.deactivateIcon([this.eSortDownButton, this.eSortRemoveButton]);
        this.activateIcon(this.eSortUpButton);
      } else {
        this.deactivateIcon([this.eSortUpButton, this.eSortDownButton]);
        this.activateIcon(this.eSortRemoveButton);
      }
    }
  
    getGui() {
      return this.eGui;
    }
  
    onMenuClick() {
      this.agParams.showColumnMenu(this.eMenuButton);
    }
  
    onSortRequested(order, event) {
      this.agParams.setSort(order, event.shiftKey);
    }
  
    destroy() {
      if (this.onMenuClickListener) {
        this.eMenuButton.removeEventListener('click', this.onMenuClickListener);
      }
      this.eSortDownButton.removeEventListener(
        'click',
        this.onSortRequestedListener
      );
      this.eSortUpButton.removeEventListener(
        'click',
        this.onSortRequestedListener
      );
      this.eSortRemoveButton.removeEventListener(
        'click',
        this.onSortRequestedListener
      );
      this.agParams.column.removeEventListener(
        'sortChanged',
        this.onSortChangedListener
      );
    }
  }
  