class DragDropControl {

    constructor(readFileFunction) {
        this.readFileFunction = readFileFunction;
    }

    // file drop handling
    // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
    // https://css-tricks.com/drag-and-drop-file-uploading/

    configureAsDropZone(element){

        if(typeof element === 'undefined') return;
        if( element === null) return;

        element.classList.add("dragdropzone");

        ['drag','dragstart',
         'dragend', 'dragover',
         'dragenter', 'dragleave'].
            forEach(e => element.addEventListener(e, function(e) {
                e.preventDefault();
                e.stopPropagation();
        }, false));

        ['dragover','dragenter'].
        forEach(e => element.addEventListener(e, function(e) {
            element.classList.add('is-dragover')
        }, false));

        ['dragleave','dragend','drop'].
        forEach(e => element.addEventListener(e, function(e) {
            element.classList.remove('is-dragover')
        }, false));

        this.onDropListener = this.fileDropHandler.bind(this);
        element.addEventListener('drop',this.onDropListener);

    }

    fileDropHandler(ev) {
        console.log('File(s) dropped');

        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();
        ev.stopPropagation();

        if (ev.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            for (var i = 0; i < ev.dataTransfer.items.length; i++) {
                // If dropped items aren't files, ignore them
                if (ev.dataTransfer.items[i].kind === 'file') {
                    var file = ev.dataTransfer.items[i].getAsFile();
                    console.log('... file[' + i + '].name = ' + file.name);
                    this.readFileFunction(file);
                    break;  // only process first file
                }
            }
        } else {
            this.readFileFunction(ev.dataTransfer.files[i]);
        }
    }
}

export {DragDropControl}