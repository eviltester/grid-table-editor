import {AsciiTableConvertor, AsciiTableOptions} from "../../data_formats/asciitable-convertor.js"
import {HtmlDataValues} from "./html-options-data-utils.js";

class AsciiTableOptionsPanel{

    constructor(parentElement) {
        this.parent = parentElement;
        this.htmlData = new HtmlDataValues(this.parent);
    }

    addToGui(){

      let stylesAsOptions = "";
      let asciiTableConverter = new AsciiTableConvertor();

      for (const [readable, internal] of Object.entries(asciiTableConverter.options.styleNames)) {
          stylesAsOptions = stylesAsOptions + 
          `<option value="${internal}">${readable}</option>`
      }

        this.parent.innerHTML =
        `
        <div class="delimited-options" style="width:100%">
          <div><p><strong>Options</strong></p></div>
          <div class="style">
            <label for="style">Style</label>
            <select name="style">
              ${stylesAsOptions}
            </select>
            <br>
          </div>

          <div class="apply">
            <button class="apply-options">Apply</button>
          </div>
      
        </div>
        `;
    }

    setApplyCallback(callbackFunc){
      let button = this.parent.querySelector(".delimited-options .apply button");
      button.onclick = function (){
          callbackFunc(this.getOptionsFromGui())
      }.bind(this);
    }

    getOptionsFromGui(){
      let newOptions = new AsciiTableOptions();
      newOptions.options.style = this.htmlData.getSelectedValueFrom("div.style select","ramac");
      return newOptions;
    }

    setFromOptions(asciiTableOptions){
        this.htmlData.setDropDownOptionToKeyValue("div.style select", asciiTableOptions.options.style, "default");
    }
}

export {AsciiTableOptionsPanel};