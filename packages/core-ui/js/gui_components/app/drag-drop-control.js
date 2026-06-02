class DragDropControl {
  constructor(readFileFunction) {
    this.readFileFunction = readFileFunction;
    this.boundElement = null;
    this.boundListeners = [];
  }

  // file drop handling
  // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
  // https://css-tricks.com/drag-and-drop-file-uploading/

  configureAsDropZone(element) {
    if (typeof element === 'undefined') return;
    if (element === null) return;

    this.boundElement = element;
    element.classList.add('dragdropzone');

    ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave'].forEach((eventName) => {
      const listener = function (event) {
        event.preventDefault();
        event.stopPropagation();
      };
      this.boundListeners.push({ eventName, listener });
      element.addEventListener(eventName, listener, false);
    });

    ['dragover', 'dragenter'].forEach((eventName) => {
      const listener = function () {
        element.classList.add('is-dragover');
      };
      this.boundListeners.push({ eventName, listener });
      element.addEventListener(eventName, listener, false);
    });

    ['dragleave', 'dragend', 'drop'].forEach((eventName) => {
      const listener = function () {
        element.classList.remove('is-dragover');
      };
      this.boundListeners.push({ eventName, listener });
      element.addEventListener(eventName, listener, false);
    });

    this.onDropListener = this.fileDropHandler.bind(this);
    this.boundListeners.push({ eventName: 'drop', listener: this.onDropListener });
    element.addEventListener('drop', this.onDropListener);
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
          break; // only process first file
        }
      }
    } else {
      this.readFileFunction(ev.dataTransfer.files[0]);
    }
  }

  destroy() {
    if (!this.boundElement) {
      return;
    }

    this.boundListeners.forEach(({ eventName, listener }) => {
      this.boundElement.removeEventListener(eventName, listener, false);
    });
    this.boundListeners = [];
    this.boundElement.classList.remove('dragdropzone', 'is-dragover');
    this.boundElement = null;
  }
}

export { DragDropControl };
