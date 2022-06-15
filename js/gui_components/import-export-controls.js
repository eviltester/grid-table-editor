import {ExportControls} from "./exportControls.js"
import {DragDropControl} from "./drag-drop-control.js"
import { CsvDelimitedOptions } from "./options_panels/options-csv-delimited-controls.js";
import { DelimitedOptions } from "./options_panels/options-delimited-controls.js";
import { DelimiterOptions } from "../data_formats/delimiter-options.js"
import { AsciiTableOptionsPanel } from "./options_panels/options-ascii-table.js";
import { MarkdownOptionsPanel } from "./options_panels/options-markdown-panel.js";
import { JsonOptionsPanel } from "./options_panels/options-json-panel.js";
import { MarkdownOptions} from "../data_formats/markdown-convertor.js"
import { JsonConvertorOptions } from "../data_formats/json-convertor.js";

class ImportExportControls {

    constructor(){
        this.csvDelimiter = new DelimiterOptions(",");
        this.delimiter= new DelimiterOptions("\t");
        this.asciiTableStyleOptions = {style: "default"};
        this.markdownOptions = new MarkdownOptions();
        this.jsonConvertorOptions = new JsonConvertorOptions();

        this.typesWithOptionsPanels = ["csv", "dsv", "asciitable", "markdown", "json"];
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
    
        // todo: why is this 'different' and not just using the normal readFile approach?
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

        // todo: these should not be document based locators, they should work from the parent
        
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
        // todo: why are we not setting export options here too
        if(type==="csv"){
            this.importer.setImportOptions(this.csvDelimiter);
        }
        if(type==="dsv"){
            this.importer.setImportOptions(this.delimiter);
        }

        // todo: allow export and import to have different file types
        // configure file type display
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

        if(!this.typesWithOptionsPanels.includes(type)){
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
        if(type=="asciitable"){
            if(this.asciiTableOptionsPanel===undefined){
                this.asciiTableOptionsPanel = new AsciiTableOptionsPanel(optionsparent);
            }
            this.asciiTableOptionsPanel.addToGui();
            this.asciiTableOptionsPanel.setFromOptions(this.asciiTableStyleOptions);
            this.asciiTableOptionsPanel.setApplyCallback(this.setAsciiTableOptions.bind(this));
        }
        if(type=="markdown"){
            if(this.markdownOptionsPanel===undefined){
                this.markdownOptionsPanel = new MarkdownOptionsPanel(optionsparent);
            }
            this.markdownOptionsPanel.addToGui();
            this.markdownOptionsPanel.setFromOptions(this.markdownOptions);
            this.markdownOptionsPanel.setApplyCallback(this.setMarkdownOptions.bind(this));
        }
        if(type=="json"){
            if(this.jsonOptionsPanel===undefined){
                this.jsonOptionsPanel = new JsonOptionsPanel(optionsparent);
            }
            this.jsonOptionsPanel.addToGui();
            this.jsonOptionsPanel.setFromOptions(this.jsonConvertorOptions);
            this.jsonOptionsPanel.setApplyCallback(this.setJsonConvertorOptions.bind(this));
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
  
    setAsciiTableOptions(options){

        if(options?.style){
            this.asciiTableStyleOptions.style = options.style;
        }

        this.exporter.setAsciiTableOptions(this.asciiTableStyleOptions)
        this.renderTextFromGrid();
    }

    setMarkdownOptions(options){

        this.markdownOptions.mergeOptions(options);

        this.exporter.setMarkdownOptions(this.markdownOptions);
        this.renderTextFromGrid();
    }

    setJsonConvertorOptions(options){

        this.jsonConvertorOptions.mergeOptions(options);

        this.exporter.setJsonConvertorOptions(this.jsonConvertorOptions);
        this.renderTextFromGrid();
    }

}

export {ImportExportControls}