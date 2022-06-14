import { JsonConvertorOptions } from "../../data_formats/json-convertor.js";
import {HtmlDataValues} from "./html-options-data-utils.js";

class JsonOptionsPanel{

    constructor(parentElement) {
        this.parent = parentElement;
        this.divLocator= ".json-options";
        this.htmlData = new HtmlDataValues(this.parent);
    }

    addToGui(){
        this.parent.innerHTML =
        `
        <div class="json-options" style="width:100%">
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

      let button = this.parent.querySelector(this.divLocator + " .apply button");
      button.onclick = function (){
          callbackFunc(this.getOptionsFromGui())
      }.bind(this);

    }


    getOptionsFromGui(){

      let options = new JsonConvertorOptions();

      let newOptions = {};
      newOptions.options = {};
      newOptions.options.makeNumbersNumeric = this.htmlData.getCheckBoxValueFrom(this.divLocator + " .numbersnumeric input");
      newOptions.options.prettyPrint = this.htmlData.getCheckBoxValueFrom(this.divLocator + " .prettyprint input");
      newOptions.options.asObject = this.htmlData.getCheckBoxValueFrom(this.divLocator + " .asobject input");
      newOptions.options.asPropertyNamed = this.htmlData.getTextInputValueFrom(this.divLocator + " .propertynamed input");


      let selectElem = this.parent.querySelector("select[name='prettydelimiter']");
      let delimiterName = selectElem.options[selectElem.selectedIndex].value;
      let delimiter=undefined;
      if(delimiterName==="custom"){
        delimiter = this.parent.querySelector(".custom-pretty-delimiter input").value;
      }else{
        for(const key in options.delimiterMappings){
          if(delimiterName===key){
            delimiter = options.delimiterMappings[key];
          }
        }
      }

      if(delimiter===undefined){
        console.log("unknown delimiter found - using tab");
        delimiter="\t";
      }

      newOptions.options.prettyPrintDelimiter = delimiter;

      options.mergeOptions(newOptions);
      return options;

    }


    setFromOptions(mainOptions){

      let options = mainOptions?.options ? mainOptions.options : {};

      this.htmlData.setCheckBoxFrom(this.divLocator + " .numbersnumeric input", options?.makeNumbersNumeric, false);
      this.htmlData.setCheckBoxFrom(this.divLocator + " .prettyprint input", options?.prettyPrint, true);
      this.htmlData.setCheckBoxFrom(this.divLocator + " .asobject input", options?.asObject, false);
      this.htmlData.setTextFieldToValue(this.divLocator + " .propertynamed input", options?.asPropertyNamed);


      this.parent.querySelector(".custom-pretty-delimiter input").value="";
      let foundDelim=false;
      for(const key in mainOptions.delimiterMappings){
        if(options.prettyPrintDelimiter===mainOptions.delimiterMappings[key]){
          let optionelem = this.parent.querySelector(`select[name='prettydelimiter'] option[value='${key}']`);
          if(optionelem!==undefined){
            optionelem.selected=true;
          }
          
          foundDelim=true;
        }
      }

      if(!foundDelim){
        let optionelem = this.parent.querySelector("select[name='prettydelimiter'] option[value='custom']");
        if(optionelem!==undefined){
          optionelem.selected=true;
        }
        this.parent.querySelector(".custom-pretty-delimiter input").value = options.prettyPrintDelimiter;
      }
    }

}

export {JsonOptionsPanel};