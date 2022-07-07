import { JavascriptConvertorOptions } from "../../data_formats/javascript-convertor.js";
import { JsonConvertorOptions } from "../../data_formats/json-convertor.js";
import {HtmlDataValues} from "./html-options-data-utils.js";

class JsonOptionsPanel{

    constructor(parentElement, parentDivClassname) {
        this.parent = parentElement;
        this.parentDivClass= parentDivClassname ? parentDivClassname : "json-options";
        this.htmlData = new HtmlDataValues(this.parent);
    }

    addToGui(){
        this.parent.innerHTML =
        `
        <div class="${this.parentDivClass}" style="width:100%">
          <div><p><strong>Options</strong> <span data-help="${this.parentDivClass}" class="helpicon"></p></div>

      
          <div class="numbersnumeric">            
            <label>
              <input type="checkbox" name="numbersnumeric" value="numbersnumeric">
              Number Convert
            </label>
            <br>
          </div>

          <div class="prettyprint">            
            <label>
              <input type="checkbox" name="prettyprint" value="prettyprint">
              Pretty Print
            </label>
            <br>
          </div>

          <div class="prettydelimiter">
            <label>Delimiter
              <select name="prettydelimiter">
                <option value="tab">Tab [\\t]</option>
                <option value="space">Space [ ]</option>
                <!--<option value="dot">Dot [.]</option>
                <option value="dash">Dash- [-]</option>
                <option value="underline">Underline [_]</option>
                <option value="plus">Plus [+]</option>-->
                <option value="custom">Custom Value</option>
              </select>
            </label>
          <br>
          </div>
          <div class="custom-pretty-delimiter">
            <label>Custom
              <input type="text" name="custom-pretty-delimiter" value='' style="width:5em">
            </label>
            <br>
          </div>  

          <div class="asobject">            
            <label>
              <input type="checkbox" name="asobject" value="asobject">
              As Object
            </label>
            <br>
          </div>
          
          <div class="propertynamed">
            <label>Property Name
              <input type="text" name="propertynamed" value='"' style="width:10em">
            </label>
            <br>
          </div>
          

          <div class="apply">
            <button class="apply-options">Apply</button>
          </div>
      
        </div>
        `;
    }

    setApplyCallback(callbackFunc){

      let button = this.parent.querySelector(".apply button");
      button.onclick = function (){
          callbackFunc(this.getOptionsFromGui())
      }.bind(this);

    }


    getOptionsFromGui(){

      let newOptions = new JsonConvertorOptions();

      // todo: split this into javascript options panel
      if(this.parentDivClass.startsWith("javascript-")){
        newOptions = new JavascriptConvertorOptions();
      }

      newOptions.options.makeNumbersNumeric = this.htmlData.getCheckBoxValueFrom(".numbersnumeric label input");
      newOptions.options.prettyPrint = this.htmlData.getCheckBoxValueFrom(".prettyprint label input");
      newOptions.options.asObject = this.htmlData.getCheckBoxValueFrom(".asobject label input");
      newOptions.options.asPropertyNamed = this.htmlData.getTextInputValueFrom(".propertynamed label input");

      let prettyPrintDelimiter = this.htmlData.getSelectWithCustomInput("select[name='prettydelimiter']", "custom", 
                                            ".custom-pretty-delimiter label input", newOptions.delimiterMappings,  "\t");

      newOptions.options.prettyPrintDelimiter = prettyPrintDelimiter;

      return newOptions;

    }


    setFromOptions(mainOptions){

      let options = mainOptions?.options ? mainOptions.options : {};

      this.htmlData.setCheckBoxFrom(".numbersnumeric label input", options?.makeNumbersNumeric, false);
      this.htmlData.setCheckBoxFrom(".prettyprint label input", options?.prettyPrint, true);
      this.htmlData.setCheckBoxFrom(".asobject label input", options?.asObject, false);
      this.htmlData.setTextFieldToValue(".propertynamed label input", options?.asPropertyNamed);

      this.htmlData.setSelectWithCustomInput(`select[name='prettydelimiter']`, "custom",
                                      ".custom-pretty-delimiter label input", mainOptions.delimiterMappings,
                                      options.prettyPrintDelimiter);
    }

}

export {JsonOptionsPanel};