class ExportsPageMap{

    constructor(){
        this.fileDownloadButtonQuery = "#filedownload";
        this.markdownTextArea = "#markdownarea";
        this.copyTextButton = "#copyTextButton";
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

        var copyButton = container.querySelector(this.pageMap.copyTextButton);
        var copyTextButtonListener = this.copyText.bind(this);
        copyButton.addEventListener('click', copyTextButtonListener, false);
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

    copyText() {

        var copyText = document.querySelector(this.pageMap.markdownTextArea);

        // select text
        copyText.select();
        copyText.setSelectionRange(0, 99999);

        document.execCommand("copy");

        document.querySelector(this.pageMap.copyTextButton).innerText = "Copied";
        setTimeout(
            function(){ document.querySelector(this.pageMap.copyTextButton).innerText = "Copy"; }
            , 3000);
    }
}