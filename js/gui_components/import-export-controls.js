import {ExportControls} from "./exportControls.js"
import {DragDropControl} from "./drag-drop-control.js"
import { CsvDelimitedOptions } from "./options_panels/options-csv-delimited-controls.js";
import { DelimitedOptions } from "./options_panels/options-delimited-controls.js";
import { AsciiTableOptionsPanel } from "./options_panels/options-ascii-table.js";
import { MarkdownOptionsPanel } from "./options_panels/options-markdown-panel.js";
import { JsonOptionsPanel } from "./options_panels/options-json-panel.js";
import { JavascriptOptionsPanel } from "./options_panels/options-javascript-panel.js";

class ImportExportControls {

    constructor(){
    }

    addHTMLtoGui(parentelement){
        parentelement.innerHTML = `
            <button id="settextfromgridbutton">v Set Text From Grid v</button>
            <button id="setgridfromtextbutton">^ Set Grid From Text ^</button>
            <label id="csvinputlabel" for="csvinput"><span class="fileFormat">.csv</span> import ^:</label><input type="file" id="csvinput"/>
            <button id="filedownload"><span class="fileFormat">.csv</span> Download</button>
            <label id="dropzone">
            <span>[Drag And Drop <span class="fileFormat">.csv</span> File Here]</span>
            </label>
        `;

        let settextfromgridbutton = parentelement.querySelector("#settextfromgridbutton");
        let setTextAreaClickListener = this.renderTextFromGrid.bind(this);
        settextfromgridbutton.addEventListener('click', setTextAreaClickListener, false);      

        let setgridfromtextbutton = parentelement.querySelector("#setgridfromtextbutton");
        let importTextAreaClickListener = this.importTextArea.bind(this);
        setgridfromtextbutton.addEventListener('click', importTextAreaClickListener, false);

        this.fileInputElement = parentelement.querySelector('#csvinput');
        let csvinputchangelistener = this.loadFile.bind(this);
        this.fileInputElement.addEventListener('change', csvinputchangelistener, false);

        // setup the drop zone
        const dragDropZone = new DragDropControl(this.readFile.bind(this));
        dragDropZone.configureAsDropZone(parentelement.querySelector("#dropzone"));


    }

    setImporter(anImporter){
        this.importer = anImporter;
    }

    setExporter(anExporter){
        this.exporter = anExporter;

        this.exportControls = new ExportControls(this.exporter);
        this.exportControls.addHooksToPage(document);
    }

    getExportControls(){
        return this.exportControls;
    }

    importTextArea(){
        const typeToImport = document.querySelector("li.active-type a").getAttribute("data-type");
        const textToImport = document.getElementById("markdownarea").value;

        this.importer.importText(typeToImport, textToImport);
    }

    renderTextFromGrid() {
       this.exportControls.renderTextFromGrid();
    }

      // use papa parse for csv parsing https://www.papaparse.com/demo
    loadFile() {

        let type = document.querySelector("li.active-type a").getAttribute("data-type");
    
        // TODO : why is this 'different' and not just using the normal readFile approach?
        if(type=="csv" || type=="dsv") {
        //console.log(this.files[0]);
        Papa.parse(this.fileInputElement.files[0], {
            complete: function (results) {
            this.importer.setGridFromData(results.data);
            this.exportControls.renderTextFromGrid();
            }.bind(this)
        });
        return;
        }
    
        this.readFile(this.fileInputElement.files[0]);
    }
  
    readFile(aFile){
        const reader = new FileReader();
        reader.addEventListener('load', (event)=>{
          this.exportControls.setTextFromString(event.target.result);
          this.importTextArea();
        });
        reader.readAsText(aFile);
    }

    setFileFormatType(){

        // TODO : these should not be document based locators, they should work from the parent
        
        // get data format type
        const type = document.querySelector("li.active-type a").getAttribute("data-type");
      
        // set import control visibility
        const importControlLocators = ["#setgridfromtextbutton", "#dropzone", "#csvinputlabel", "#csvinput"];
        let importControls = [];
        importControlLocators.forEach(locator =>{ 
            let elem = document.querySelector(locator);
            if(elem){
              importControls.push(elem);
            }
        })

        let importVisibility = "visible";

        if(!this.importer.canImport(type)){
            console.log(`Data Type ${type} not supported for importing`);
            importVisibility="hidden";
        }
        
        importControls.forEach(e => e.style.visibility = importVisibility);

        // set export controls visibility
        const exportControlLocators = ["#filedownload"];
        let exportControls = [];
        exportControlLocators.forEach(locator =>{ 
            let elem = document.querySelector(locator);
            if(elem){
              exportControls.push(elem);
            }
        })
            
        let exportVisibility = "visible";
      
        if(!this.exporter.canExport(type)){
            console.log(`Data Type ${type} not supported for exporting`);
            exportVisibility="hidden";
        }

        exportControls.forEach(e => e.style.visibility = exportVisibility);

        // set options for type
        // TODO : why are we not setting export options here too
        if(type==="csv"){
            this.importer.setImportOptions(this.csvDelimiter);
        }
        if(type==="dsv"){
            this.importer.setImportOptions(this.delimiter);
        }

        // TODO : allow export and import to have different file types
        // configure file type display
        const fileType = this.importer.getFileExtensionFor(type);
      
        document.querySelectorAll(".fileFormat").forEach(elem => elem.innerText = fileType);
    }

    setupOptionsPanelsWithin(optionsparent){
        if(this.optionsPanels===undefined){
            if(optionsparent){
                this.optionsPanels={};
                this.optionsPanels["csv"] =new CsvDelimitedOptions(optionsparent);
                this.optionsPanels["dsv"] =new DelimitedOptions(optionsparent);
                this.optionsPanels["asciitable"] =new AsciiTableOptionsPanel(optionsparent);
                this.optionsPanels["markdown"] =new MarkdownOptionsPanel(optionsparent);
                this.optionsPanels["json"] =new JsonOptionsPanel(optionsparent);
                this.optionsPanels["javascript"] =new JavascriptOptionsPanel(optionsparent);
            }
        }
    }
    setOptionsViewForFormatType(){

        const type = document.querySelector("li.active-type a").getAttribute("data-type");

        const edit_area = document.querySelector("div.edit-area");
        const optionsparent = document.querySelector("div.options-parent");
        const text_area = document.getElementById("markdown");

        edit_area.style.width="100%";
        edit_area.style.height="30%";

        if(this.optionsPanels===undefined){
            this.setupOptionsPanelsWithin(optionsparent);
        }

        let optionsPanel = this.optionsPanels[type]

        if(optionsPanel===undefined){
            console.log("undefined panel type for " + type);
            edit_area.style.display="block";
            optionsparent.style.display="none";
            text_area.style.width="100%";
            text_area.style.height="100%";
            return;
        }

        edit_area.style.display="flex";

        text_area.style.width="100%";
        text_area.style.height="100%";

        optionsparent.style.width="17em";
        optionsparent.style.height="100%";

        optionsparent.innerHTML = "";


        if(optionsPanel){
            console.log("using generic panel setup for " + type);
            optionsPanel.addToGui();
            //this.optionsPanel.setFromOptions(this.typeOptions[type]);
            optionsPanel.setFromOptions(this.exporter.getOptionsForType(type));
            optionsPanel.setApplyCallback(this.setCurrentTypeOptions.bind(this));
        }

        optionsparent.style.display = "block";
    }

    setCurrentTypeOptions(options){
        const type = document.querySelector("li.active-type a").getAttribute("data-type");
        console.log("using generic options setting for " + type);
        this.exporter.setOptionsForType(type,options);
        this.renderTextFromGrid();
    }
}

export {ImportExportControls}