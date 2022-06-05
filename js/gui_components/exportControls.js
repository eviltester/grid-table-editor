import {Download} from './download.js';
import {fileTypes} from '../data_formats/file-types.js';

class ExportsPageMap{

    constructor(){
        this.fileDownloadButtonQuery = "#filedownload";
        this.markdownTextArea = "#markdownarea";
        this.copyTextButton = "#copyTextButton";
    }
}

class ExportControls {

    constructor(exporter) {
        this.pageMap = new ExportsPageMap();
        this.exporter = exporter;
    }

    addHooksToPage(container){

        var element = container.querySelector(this.pageMap.fileDownloadButtonQuery);
        var addDownloadButtonListener = this.fileDownload.bind(this);
        element.addEventListener('click', addDownloadButtonListener, false);

        var copyButton = container.querySelector(this.pageMap.copyTextButton);
        var copyTextButtonListener = this.copyText.bind(this);
        copyButton.addEventListener('click', copyTextButtonListener, false);
    }

    fileDownload(){

        this.renderTextFromGrid();

        var type = document.querySelector("li.active-type a").getAttribute("data-type");

        if(!this.exporter.canExport(type)){
            console.log(`Data Type ${type} not supported`)
            return;
        }

        var filename = "export" + fileTypes[type].fileExtension;

        var text = document.querySelector(this.pageMap.markdownTextArea).value;
        new Download(filename).downloadFile(text);
    }

    copyText() {

        var copyText = document.querySelector(this.pageMap.markdownTextArea);

        // select text
        copyText.select();
        copyText.setSelectionRange(0, 99999);

        document.execCommand("copy");

        let copyButton = document.querySelector(this.pageMap.copyTextButton);
        copyButton.innerText = "Copied";
        setTimeout(
            function(aButton){ aButton.innerText = "Copy"; }
            , 3000, copyButton);
    }

    renderTextFromGrid() {

        let type = document.querySelector("li.active-type a").getAttribute("data-type");
      
        if(!this.exporter.canExport(type)){
          console.log(`Data Type ${type} not supported for exporting`);
          return;
        }
      
        let textToRender = this.exporter.getGridAs(type);
        this.setTextFromString(textToRender);
        
    }

    setTextFromString(someText){
        document.getElementById('markdownarea').value = someText;
    }
}

export {ExportControls, ExportsPageMap}