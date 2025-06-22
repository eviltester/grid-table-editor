// create a simple editor that shows the list of values but with a search component
// https://www.ag-grid.com/javascript-data-grid/component-cell-editor/
/* <input list="values">
<datalist id="values">
  <option value="Value 1">
  <option value="Value 2">
  <option value="Value 3">
</datalist>   */


class SelectFilterEditor {
    init(params) {
        this.value = params.value;
 
        this.gui = document.createElement('div');
        this.input = document.createElement('input');
        this.gui.appendChild(this.input);
        this.input.setAttribute("list", 'selectionValuesDataList');
        let datalist = document.createElement('datalist');
        datalist.id="selectionValuesDataList";
        this.gui.appendChild(datalist);
        //console.log(params.values);
        params.values.forEach((value)=>{
            var option = document.createElement("option");
            option.setAttribute("value",value);
            datalist.appendChild(option);
        })
        this.validValues = params.values;
 
        this.input.addEventListener('input', (event) => {
            this.value = event.target.value;
        });
    }
 
    /* Component Editor Lifecycle methods */
    // gets called once when grid ready to insert the element
    getGui() {
        return this.gui;
    }
 
    // the final value to send to the grid, on completion of editing
    getValue() {
        return this.value;
    }
 
    // Gets called once before editing starts, to give editor a chance to
    // cancel the editing before it even starts.
    isCancelBeforeStart() {
        return false;
    }
 
    // Gets called once when editing is finished (eg if Enter is pressed).
    // If you return true, then the result of the edit will be ignored.
    isCancelAfterEnd() {
        // value must be from the list
        return !this.validValues.includes(this.value);
    }
 
    // after this component has been created and inserted into the grid
    afterGuiAttached() {
        this.input.focus();
    }
 }

 export {SelectFilterEditor}