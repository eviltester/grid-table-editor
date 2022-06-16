import { DelimiterOptions } from "../../data_formats/delimiter-options.js";
import {HtmlDataValues} from "./html-options-data-utils.js";

class CsvDelimitedOptions{

    constructor(parentElement) {
        this.parent = parentElement;
        this.htmlData = new HtmlDataValues(this.parent);
    }

    addToGui(){
        this.parent.innerHTML =
        `
        <div class="delimited-options" style="width:100%">
          <div><p><strong>Options</strong></p></div>
          <div class="quotes">            
            <label for="quotes"> Use Quotes</label>
            <input type="checkbox" name="quotes" value="quotes">
            <br>
          </div>

          <div class="headerval">            
            <label for="header"> Use Header</label>
            <input type="checkbox" name="header" value="header">
            <br>
          </div>
          

          <div class="quoteChar">
            <label for="quoteChar">Quote Char</label>
            <input type="text" name="quoteChar" value='"' style="width:5em">
            <br>
          </div>

          <div class="escapeChar">
            <label for="escapeChar">Escape Char</label>
            <input type="text" name="escapeChar" value='"' style="width:5em">
            <br>
          </div>

          <!--
          <div class="newline">
            <label for="newline">Newline</label>
            <select name="newline">
              <option value="lf">\n</option>
              <option value="crlf">\r\n</option>
            </select>
            <input type="text" name="newline" value='"' style="width:5em">
            <br>
          </div>
          -->
          

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

      // TODO : create a CsvDelimiterOptions()
      let delimiterOptions = new DelimiterOptions(",");

      delimiterOptions.options.quotes = this.htmlData.getCheckBoxValueFrom(".quotes input");
      delimiterOptions.options.header = this.htmlData.getCheckBoxValueFrom(".headerVal input");
      delimiterOptions.options.quoteChar =  this.htmlData.getTextInputValueFrom(".quoteChar input");
      delimiterOptions.options.escapeChar = this.htmlData.getTextInputValueFrom(".escapeChar input");
      return delimiterOptions;
    }

    setFromOptions(delimiterOptions){

      if(!delimiterOptions.options){
        return;
      }

      let options = delimiterOptions.options;

      this.htmlData.setCheckBoxFrom(".quotes input", options.quotes, true);
      this.htmlData.setCheckBoxFrom(".headerVal input", options.header, true);
      this.htmlData.setTextFieldToValue(".quoteChar input", options.quoteChar, "\"");
      this.htmlData.setTextFieldToValue(".escapeChar input", options.escapeChar, "\"");
    }

}

export {CsvDelimitedOptions};