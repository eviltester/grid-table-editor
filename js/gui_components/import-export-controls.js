import {ExportControls} from "./exportControls.js"
import {DragDropControl} from "./drag-drop-control.js"
import { fileTypes } from "../data_formats/file-types.js";
import { CsvDelimitedOptions } from "./options-csv-delimited-controls.js";
import { DelimitedOptions } from "./options-delimited-controls.js";

class ImportExportControls {

    constructor(){
        this.csvDelimiter = {};
        this.delimited={};
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

        let settextfrombridbutton = parentelement.querySelector("#settextfromgridbutton");
        let setTextAreaClickListener = this.renderTextFromGrid.bind(this);
        settextfrombridbutton.addEventListener('click', setTextAreaClickListener, false);      

        let setgridfromtextbutton = parentelement.querySelector("#setgridfromtextbutton");
        let importTextAreaClickListener = this.importTextArea.bind(this);
        setgridfromtextbutton.addEventListener('click', importTextAreaClickListener, false);

        this.fileInputElement = parentelement.querySelector('#csvinput');
        let csvinputchangelistener = this.loadFile.bind(this);
        this.fileInputElement.addEventListener('change', csvinputchangelistener, false);

        // setup the drop zone
        const dragDropZone = new DragDropControl(this.readFile.bind(this));
        dragDropZone.configureAsDropZone(parentelement.querySelector("#dropzone"));

        this.csvDelimiter={};
        this.csvDelimiter.options = {
            quotes: true, //or array of booleans
            quoteChar: '"',
            escapeChar: '"',
            delimiter: ",",
            header: true,
            newline: "\n",
        }

        this.delimiter={};
        this.delimiter.options = {
            quotes: true, //or array of booleans
            quoteChar: '"',
            escapeChar: '"',
            delimiter: "\t",
            header: true,
            newline: "\n",
        }

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
    
        if(type=="csv") {
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
            this.importer.setImportOptions(this.csvDelimiter.options);
        }
        if(type==="dsv"){
            this.importer.setImportOptions(this.delimiter.options);
        }

        importControls.forEach(e => e.style.visibility = importVisibility);
      
        if(!fileTypes.hasOwnProperty(type)){
            console.log(`Data Type ${type} not supported`);
            return;
        }

        const fileType = fileTypes[type].fileExtension;
      
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
            this.csvDelimitedOptions.setFromOptions(this.csvDelimiter.options);
            this.csvDelimitedOptions.setApplyCallback(this.setCsvDelimterOptions.bind(this));
        }
        if(type=="dsv"){
            if(this.delimitedOptions===undefined){
                this.delimitedOptions = new DelimitedOptions(optionsparent);
            }
            this.delimitedOptions.addToGui();
            this.delimitedOptions.setFromOptions(this.delimiter.options);
            this.delimitedOptions.setApplyCallback(this.setDelimterOptions.bind(this));
        }

        optionsparent.style.display = "block";

        // configure the display options based on type
        // configure the apply button to apply the styles and export the grid
    }

    setCsvDelimterOptions(options){

        this.csvDelimiter.options = {...this.csvDelimiter.options, ...options};
        this.exporter.setCsvDelimiterOptions(this.csvDelimiter.options)
        this.renderTextFromGrid();
    }

    setDelimterOptions(options){

        this.delimiter.options = {...this.delimiter.options, ...options};
        this.exporter.setDelimiterOptions(this.delimiter.options)
        this.renderTextFromGrid();
    }
  

}

export {ImportExportControls}