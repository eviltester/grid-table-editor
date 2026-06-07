function getFirstDroppedFile(dataTransfer) {
  if (!dataTransfer) {
    return null;
  }

  if (dataTransfer.items) {
    for (let index = 0; index < dataTransfer.items.length; index += 1) {
      const item = dataTransfer.items[index];
      if (item?.kind === 'file') {
        return item.getAsFile?.() || null;
      }
    }
    return null;
  }

  return dataTransfer.files?.[0] || null;
}

function createDragDropAdapter({ onFileDrop } = {}) {
  let boundElement = null;
  let boundListeners = [];

  const addBoundListener = (eventName, listener) => {
    boundListeners.push({ eventName, listener });
    boundElement.addEventListener(eventName, listener, false);
  };

  const destroy = () => {
    if (!boundElement) {
      return;
    }

    boundListeners.forEach(({ eventName, listener }) => {
      boundElement.removeEventListener(eventName, listener, false);
    });
    boundListeners = [];
    boundElement.classList.remove('dragdropzone', 'is-dragover');
    boundElement = null;
  };

  const configureAsDropZone = (element) => {
    if (!element) {
      return;
    }

    destroy();
    boundElement = element;
    boundElement.classList.add('dragdropzone');

    ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave'].forEach((eventName) => {
      addBoundListener(eventName, (event) => {
        event.preventDefault();
        event.stopPropagation();
      });
    });

    ['dragover', 'dragenter'].forEach((eventName) => {
      addBoundListener(eventName, () => {
        boundElement?.classList.add('is-dragover');
      });
    });

    ['dragleave', 'dragend', 'drop'].forEach((eventName) => {
      addBoundListener(eventName, () => {
        boundElement?.classList.remove('is-dragover');
      });
    });

    addBoundListener('drop', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const file = getFirstDroppedFile(event.dataTransfer);
      if (file) {
        onFileDrop?.(file);
      }
    });
  };

  return {
    configureAsDropZone,
    destroy,
  };
}

export { createDragDropAdapter };
