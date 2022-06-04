import {ExportControls} from "./exportControls.js"
import {DragDropControl} from "./drag-drop-control.js"
import { fileTypes } from "../data_formats/file-types.js";

class ImportExportControls {

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
      
        importControls.forEach(e => e.style.visibility = importVisibility);
      
        if(!fileTypes.hasOwnProperty(type)){
            console.log(`Data Type ${type} not supported`);
            return;
        }

        const fileType = fileTypes[type].fileExtension;
      
        document.querySelectorAll(".fileFormat").forEach(elem => elem.innerText = fileType);
    }
  

}

export {ImportExportControls}