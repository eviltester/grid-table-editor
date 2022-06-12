import {AsciiTableConvertor} from "../../data_formats/asciitable-convertor.js"

class AsciiTableOptionsPanel{

    constructor(parentElement) {
        this.parent = parentElement;
    }

    addToGui(){

      let stylesAsOptions = "";
      let asciiTableConverter = new AsciiTableConvertor();

      for (const [readable, internal] of Object.entries(asciiTableConverter.styleNames)) {
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

      let selectElem = this.parent.querySelector(".delimited-options div.style select");
      let styleName = selectElem.options[selectElem.selectedIndex].value;

      return {
          style: styleName,
      }

    }

    setFromOptions(options){

      let style = options?.style ? options.style : "default";

      let foundStyle=false;
      let optionelem = this.parent.querySelector(`.delimited-options div.style option[value='${style}']`);
      if(optionelem){
          optionelem.selected=true;
          foundStyle=true;
      }
      
      if(!foundStyle){
        let optionelem = this.parent.querySelector(".delimited-options div.style option[value='default']");
        if(optionelem){
          optionelem.selected=true;
        }
      }
    }

}

export {AsciiTableOptionsPanel};