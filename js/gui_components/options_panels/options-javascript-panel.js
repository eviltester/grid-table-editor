import {JsonOptionsPanel} from './options-json-panel.js';

class JavascriptOptionsPanel{

    constructor(parentElement) {
        this.parent = parentElement;
        this.panel = new JsonOptionsPanel(parentElement, "javascript-options");
    }

    addToGui(){
        this.panel.addToGui();
    }

    setApplyCallback(callbackFunc){
        this.panel.setApplyCallback( function (){
          callbackFunc(this.getOptionsFromGui())
      }.bind(this));

    }


    getOptionsFromGui(){
      return this.panel.getOptionsFromGui();
    }

    setFromOptions(mainOptions){
      this.panel.setFromOptions(mainOptions);
    }

}

export {JavascriptOptionsPanel};