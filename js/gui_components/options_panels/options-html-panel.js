import { HtmlConvertorOptions } from "../../data_formats/html-convertor.js";
import {HtmlDataValues} from "./html-options-data-utils.js";

class HtmlOptionsPanel{

    constructor(parentElement) {
        this.parent = parentElement;
        this.parentDivClass= "html-options";
        this.htmlData = new HtmlDataValues(this.parent);
    }

    addToGui(){
        this.parent.innerHTML =
        `
        <div class="${this.parentDivClass}" style="width:100%">
          <div><p><strong>Options</strong></p></div>

      
          <div class="compacthtml">            
            <label for="compacthtml">Compact</label>
            <input type="checkbox" name="compacthtml" value="compacthtml">
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
              <option value="custom">Custom Value</option>
            </select>
          <br>
          </div>
          <div class="custom-pretty-delimiter">
            <label for="custom-pretty-delimiter">Custom</label>
            <input type="text" name="custom-pretty-delimiter" value='' style="width:5em">
            <br>
          </div>  

          <div class="addthead">            
            <label for="addthead">Add &lt;thead&gt;</label>
            <input type="checkbox" name="addthead" value="addthead">
            <br>
          </div>

          <div class="addtbody">            
            <label for="addtbody">Add &lt;tbody&gt;</label>
            <input type="checkbox" name="addtbody" value="addtbody">
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

      let newOptions = new HtmlConvertorOptions();

      newOptions.options.compact = this.htmlData.getCheckBoxValueFrom(".compacthtml input");
      newOptions.options.prettyPrint = this.htmlData.getCheckBoxValueFrom(".prettyprint input");

      let prettyPrintDelimiter = this.htmlData.getSelectWithCustomInput("select[name='prettydelimiter']", "custom", 
                                            ".custom-pretty-delimiter input", newOptions.delimiterMappings,  "\t");
      newOptions.options.prettyPrintDelimiter = prettyPrintDelimiter;

      newOptions.options.addTheadToTable = this.htmlData.getCheckBoxValueFrom(".addthead input");
      newOptions.options.addTbodyToTable = this.htmlData.getCheckBoxValueFrom(".addtbody input");

      return newOptions;

    }


    setFromOptions(mainOptions){

      let options = mainOptions?.options ? mainOptions.options : {};

      // TODO: create 'defaults' in the main options class and use these in the panel settings
      this.htmlData.setCheckBoxFrom(".compacthtml input", options?.compact, false);
      this.htmlData.setCheckBoxFrom(".prettyprint input", options?.prettyPrint, false);
      this.htmlData.setCheckBoxFrom(".addthead input", options?.addTheadToTable, false);
      this.htmlData.setCheckBoxFrom(".addtbody input", options?.addTbodyToTable, false);

      this.htmlData.setSelectWithCustomInput(`select[name='prettydelimiter']`, "custom",
                                      ".custom-pretty-delimiter input", mainOptions.delimiterMappings,
                                      options.prettyPrintDelimiter);
    }

}

export {HtmlOptionsPanel};