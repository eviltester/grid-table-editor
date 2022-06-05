class TabbedTextControl{

    constructor(parentElement, theImportExportControls) {
        this.parent = parentElement;
        this.importExportController = theImportExportControls;
    }

    addToGui(){
        this.parent.innerHTML =
        `
        <div class="conversionTabs">
          <div id="conversionTypes" class="conversionTypes">
            <ul class="conversionTypesList">
              <li id="type-markdown" class="type-select">
                <a class="type-select-action" data-type="markdown" href="#">Markdown</a>
              </li>
              <li id="type-csv" class="type-select active-type">
                <a class="type-select-action" data-type="csv" href="#">CSV</a>
              </li>
              <li id="type-json" class="type-select">
                <a class="type-select-action" data-type="json" href="#">JSON</a>
              </li>
              <li id="type-javascript" class="type-select">
                <a class="type-select-action" data-type="javascript" href="#">JavaScript</a>
              </li>
              <li id="type-gherkin" class="type-select">
                <a class="type-select-action" data-type="gherkin" href="#">Gherkin</a>
              </li>
              <li id="type-html" class="type-select">
                <a class="type-select-action" data-type="html" href="#">HTML</a>
              </li>
            </ul>
          </div>
          <div class="rightbuttons">
            <button title="Copy text to clipboard" id="copyTextButton">Copy</button>
          </div>
        </div>

        <div class="edit-area">
            <div class="options-parent" style="display: none"></div>
            <div id="markdown" style="height: 30%; width:100%;">
              <textarea class="textrepresentation" name="Markdown" id="markdownarea"></textarea>
            </div>
        </div>
        `;


    document.querySelectorAll(".type-select-action").forEach( lielem => lielem.addEventListener("click", (e) => {

        // set the display buttons
        document.querySelectorAll(".type-select").forEach(elem => elem.classList.remove("active-type"));
    
        e.target.parentElement.classList.add("active-type");
    
        // switched tab so re-render text
        this.importExportController.renderTextFromGrid();
        this.importExportController.setFileFormatType();
        this.importExportController.setOptionsViewForFormatType();
        // don't try to navigate
        return false;
        }));

    }
}

export {TabbedTextControl};