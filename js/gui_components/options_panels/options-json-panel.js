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
          <div><p><strong>Options</strong></p></div>

      
          <div class="numbersnumeric">            
            <label for="numbersnumeric">Number Convert</label>
            <input type="checkbox" name="numbersnumeric" value="numbersnumeric">
            <br>
          </div>

          <div class="prettyprint">            
            <label for="prettyprint">Pretty Print</label>
            <input type="checkbox" name="prettyprint" value="prettyprint">
            <br>
          </div>

          <div class="prettydelimiter">
            <label for="prettydelimiter">Delimiter</label>
            <select name="prettydelimiter">
              <option value="tab">Tab [\\t]</option>
              <option value="space">Space [ ]</option>
              <!--<option value="dot">Dot [.]</option>
              <option value="dash">Dash- [-]</option>
              <option value="underline">Underline [_]</option>
              <option value="plus">Plus [+]</option>-->
              <option value="custom">Custom Value</option>
            </select>
          <br>
          </div>
          <div class="custom-pretty-delimiter">
            <label for="custom-pretty-delimiter">Custom</label>
            <input type="text" name="custom-pretty-delimiter" value='' style="width:5em">
            <br>
          </div>  

          <div class="asobject">            
            <label for="asobject">As Object</label>
            <input type="checkbox" name="asobject" value="asobject">
            <br>
          </div>
          
          <div class="propertynamed">
            <label for="propertynamed">Property Name</label>
            <input type="text" name="propertynamed" value='"' style="width:10em">
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

      newOptions.options.makeNumbersNumeric = this.htmlData.getCheckBoxValueFrom(".numbersnumeric input");
      newOptions.options.prettyPrint = this.htmlData.getCheckBoxValueFrom(".prettyprint input");
      newOptions.options.asObject = this.htmlData.getCheckBoxValueFrom(".asobject input");
      newOptions.options.asPropertyNamed = this.htmlData.getTextInputValueFrom(".propertynamed input");

      let prettyPrintDelimiter = this.htmlData.getSelectWithCustomInput("select[name='prettydelimiter']", "custom", 
                                            ".custom-pretty-delimiter input", newOptions.delimiterMappings,  "\t");

      newOptions.options.prettyPrintDelimiter = prettyPrintDelimiter;

      return newOptions;

    }


    setFromOptions(mainOptions){

      let options = mainOptions?.options ? mainOptions.options : {};

      this.htmlData.setCheckBoxFrom(".numbersnumeric input", options?.makeNumbersNumeric, false);
      this.htmlData.setCheckBoxFrom(".prettyprint input", options?.prettyPrint, true);
      this.htmlData.setCheckBoxFrom(".asobject input", options?.asObject, false);
      this.htmlData.setTextFieldToValue(".propertynamed input", options?.asPropertyNamed);

      this.htmlData.setSelectWithCustomInput(`select[name='prettydelimiter']`, "custom",
                                      ".custom-pretty-delimiter input", mainOptions.delimiterMappings,
                                      options.prettyPrintDelimiter);
    }

}

export {JsonOptionsPanel};