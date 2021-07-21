class ExportsPageMap{

    constructor(){
        this.fileDownloadButtonQuery = "#filedownload";
        this.markdownTextArea = "#markdownarea";
    }
}

class ExportControls {

    constructor(exporter, pageMap, fileTypes, renderTextFunction) {
        this.pageMap = pageMap;
        this.exporter = exporter;
        this.fileTypes = fileTypes;
        this.renderTextFromGrid = renderTextFunction;
    }

    addHooksToPage(container){

        var element = container.querySelector(this.pageMap.fileDownloadButtonQuery);
        var addDownloadButtonListener = this.fileDownload.bind(this);
        element.addEventListener('click', addDownloadButtonListener, false);
    }

    fileDownload(){

        this.renderTextFromGrid();

        var type = document.querySelector("li.active-type a").getAttribute("data-type");

        if(!exporter.canExport(type)){
            console.log(`Data Type ${type} not supported`)
            return;
        }

        if(type=="csv"){
            this.exporter.csvExport();
            return;
        }

        var filename = "export" + this.fileTypes[type].fileExtension;

        var text = document.querySelector(this.pageMap.markdownTextArea).value;
        new Download(filename).downloadFile(text);
    }
}