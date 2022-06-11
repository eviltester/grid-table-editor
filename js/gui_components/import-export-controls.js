import {ExportControls} from "./exportControls.js"
import {DragDropControl} from "./drag-drop-control.js"
import { CsvDelimitedOptions } from "./options_panels/options-csv-delimited-controls.js";
import { DelimitedOptions } from "./options_panels/options-delimited-controls.js";
import { DelimiterOptions } from "../data_formats/delimiter-options.js"

class ImportExportControls {

    constructor(){
        this.csvDelimiter = new DelimiterOptions(",");
        this.delimiter= new DelimiterOptions("\t");
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
        const type = document.querySelector("li.active-type a").getAttribute("data-type");
      
        const importControlLocators = ["#setgridfromtextbutton", "#filedownload", "#dropzone", "#csvinputlabel", "#csvinput"];
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
      
        if(type==="csv"){
            this.importer.setImportOptions(this.csvDelimiter);
        }
        if(type==="dsv"){
            this.importer.setImportOptions(this.delimiter);
        }

        importControls.forEach(e => e.style.visibility = importVisibility);
      
        const fileType = this.importer.getFileExtensionFor(type);
      
        document.querySelectorAll(".fileFormat").forEach(elem => elem.innerText = fileType);
    }

    setOptionsViewForFormatType(){

        const type = document.querySelector("li.active-type a").getAttribute("data-type");

        const edit_area = document.querySelector("div.edit-area");
        const optionsparent = document.querySelector("div.options-parent");
        const text_area = document.getElementById("markdown");

        edit_area.style.width="100%";
        edit_area.style.height="30%";

        if(type!=="csv" && type!="dsv"){
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

        if(type=="csv"){
            if(this.csvDelimitedOptions===undefined){
                this.csvDelimitedOptions = new CsvDelimitedOptions(optionsparent);
            }
            this.csvDelimitedOptions.addToGui();
            this.csvDelimitedOptions.setFromOptions(this.csvDelimiter);
            this.csvDelimitedOptions.setApplyCallback(this.setCsvDelimterOptions.bind(this));
        }
        if(type=="dsv"){
            if(this.delimitedOptions===undefined){
                this.delimitedOptions = new DelimitedOptions(optionsparent);
            }
            this.delimitedOptions.addToGui();
            this.delimitedOptions.setFromOptions(this.delimiter);
            this.delimitedOptions.setApplyCallback(this.setDelimterOptions.bind(this));
        }

        optionsparent.style.display = "block";

        // configure the display options based on type
        // configure the apply button to apply the styles and export the grid
    }

    setCsvDelimterOptions(options){

        this.csvDelimiter.mergeOptions(options);

        if(this.csvDelimiter.options.header===false){
            // store headers from the grid in the options
            this.csvDelimiter.headers = this.exporter.getHeadersFromGrid();
        }

        this.exporter.setCsvDelimiterOptions(this.csvDelimiter)
        this.renderTextFromGrid();
    }

    setDelimterOptions(options){

        this.delimiter.mergeOptions(options);

        if(this.delimiter.options.header===false){
            // store headers from the grid in the options
            this.delimiter.headers = this.exporter.getHeadersFromGrid();
        }

        this.exporter.setDelimiterOptions(this.delimiter)
        this.renderTextFromGrid();
    }
  

}

export {ImportExportControls}