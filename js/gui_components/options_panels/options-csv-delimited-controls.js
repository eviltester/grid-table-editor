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
            <label>
              <input type="checkbox" name="quotes" value="quotes">
              Use Quotes
            </label>
            <br>
          </div>

          <div class="headerval">            
            <label>
              <input type="checkbox" name="header" value="header">
              Use Header
            </label>
            <br>
          </div>
          

          <div class="quoteChar">
            <label>Quote Char
              <input type="text" name="quoteChar" value='"' style="width:5em">
            </label>
            <br>
          </div>

          <div class="escapeChar">
            <label>Escape Char
              <input type="text" name="escapeChar" value='"' style="width:5em">
            </label>
            <br>
          </div>

          <!--
          <div class="newline">
            <label>Newline
              <select name="newline">
                <option value="lf">\n</option>
                <option value="crlf">\r\n</option>
              </select>
              <input type="text" name="newline" value='"' style="width:5em">
            </label>
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

      delimiterOptions.options.quotes = this.htmlData.getCheckBoxValueFrom(".quotes label input");
      delimiterOptions.options.header = this.htmlData.getCheckBoxValueFrom(".headerval label input");
      delimiterOptions.options.quoteChar =  this.htmlData.getTextInputValueFrom(".quoteChar label input");
      delimiterOptions.options.escapeChar = this.htmlData.getTextInputValueFrom(".escapeChar label input");
      return delimiterOptions;
    }

    setFromOptions(delimiterOptions){

      if(!delimiterOptions.options){
        return;
      }

      let options = delimiterOptions.options;

      this.htmlData.setCheckBoxFrom(".quotes label input", options.quotes, true);
      this.htmlData.setCheckBoxFrom(".headerval label input", options.header, true);
      this.htmlData.setTextFieldToValue(".quoteChar label input", options.quoteChar, "\"");
      this.htmlData.setTextFieldToValue(".escapeChar label input", options.escapeChar, "\"");
    }

}

export {CsvDelimitedOptions};