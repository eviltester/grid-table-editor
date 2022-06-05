class DelimitedOptions{

    constructor(parentElement, theImportExportControls) {
        this.parent = parentElement;
    }

    addToGui(){
        this.parent.innerHTML =
        `
        <div class="delimited-options" style="width:100%">
          <div><p><strong>Options</strong></p></div>
          <div class="quotes">
            <input type="checkbox" name="quotes" value="quotes">
            <label for="quotes"> Use Quotes</label><br>
          </div>

          <div class="apply">
            <button class="apply-options">Apply</button>
          </div>
      
        </div>
        `;
    }
}

export {DelimitedOptions};