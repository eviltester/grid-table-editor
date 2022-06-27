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
          <div><p><strong>Options</strong> <span data-help="html-table-options" class="helpicon"></span></p></div>

      
          <div class="compacthtml">            
            <label>
              <input type="checkbox" name="compacthtml" value="compacthtml">
              Compact
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

          <div class="addthead">            
            <label>
              <input type="checkbox" name="addthead" value="addthead">
              Add &lt;thead&gt;
            </label>
            <br>
          </div>

          <div class="addtbody">            
            <label>
              <input type="checkbox" name="addtbody" value="addtbody">
              Add &lt;tbody&gt;
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

      let newOptions = new HtmlConvertorOptions();

      newOptions.options.compact = this.htmlData.getCheckBoxValueFrom(".compacthtml label input");
      newOptions.options.prettyPrint = this.htmlData.getCheckBoxValueFrom(".prettyprint label input");

      let prettyPrintDelimiter = this.htmlData.getSelectWithCustomInput("select[name='prettydelimiter']", "custom", 
                                            ".custom-pretty-delimiter label input", newOptions.delimiterMappings,  "\t");
      newOptions.options.prettyPrintDelimiter = prettyPrintDelimiter;

      newOptions.options.addTheadToTable = this.htmlData.getCheckBoxValueFrom(".addthead label input");
      newOptions.options.addTbodyToTable = this.htmlData.getCheckBoxValueFrom(".addtbody label input");

      return newOptions;

    }


    setFromOptions(mainOptions){

      let options = mainOptions?.options ? mainOptions.options : {};

      // TODO: create 'defaults' in the main options class and use these in the panel settings
      this.htmlData.setCheckBoxFrom(".compacthtml label input", options?.compact, false);
      this.htmlData.setCheckBoxFrom(".prettyprint label input", options?.prettyPrint, false);
      this.htmlData.setCheckBoxFrom(".addthead label input", options?.addTheadToTable, false);
      this.htmlData.setCheckBoxFrom(".addtbody label input", options?.addTbodyToTable, false);

      this.htmlData.setSelectWithCustomInput(`select[name='prettydelimiter']`, "custom",
                                      ".custom-pretty-delimiter label input", mainOptions.delimiterMappings,
                                      options.prettyPrintDelimiter);
    }

}

export {HtmlOptionsPanel};