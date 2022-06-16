import { DelimiterOptions } from "../../data_formats/delimiter-options.js";
import {HtmlDataValues} from "./html-options-data-utils.js";

class DelimitedOptions{

    delimiterMappings={
      "tab": "\t",
      "comma": ",",
      "hash": "#",
      "colon": ":",
      "pipe": "|",
      "space": " ",
      "semicolon": ";",
      "slash": "/",
      "backslash": "\\",
      "semicolon": ";",
    }

    constructor(parentElement) {
        this.parent = parentElement;
        this.htmlData = new HtmlDataValues(this.parent);
    }

    addToGui(){
        this.parent.innerHTML =
        `
        <div class="delimited-options" style="width:100%">
          <div><p><strong>Options</strong></p></div>

          <div class="delimiter">
            <label for="delimiter">Delimiter</label>
            <select name="delimiter">
              <option value="tab">Tab [\\t]</option>
              <option value="comma">Comma [,]</option>
              <option value="hash">Hash [#]</option>
              <option value="colon">Colon [:]</option>
              <option value="pipe">Pipe [|]</option>
              <option value="space">Space [ ]</option>
              <option value="semicolon">Semicolon [;]</option>
              <option value="slash">Slash [/]</option>
              <option value="backslash">Slash [\\]</option>
              <option value="custom">Custom Value</option>
            </select>
            <br>
          </div>
          <div class="custom-delimiter">
            <label for="custom-delimiter">Custom</label>
            <input type="text" name="custom-delimiter" value='' style="width:5em">
            <br>
          </div>  

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

      let delimiterOptions = new DelimiterOptions("\t");

      // special type for htmlData getSelectWithCustomInput(selectLocator, inputLocator, default)
      let delimiter = this.htmlData.getSelectWithCustomInput("div.delimiter select", "custom", ".custom-delimiter input", this.delimiterMappings,  "\t");
      delimiterOptions.options.delimiter = delimiter;
      delimiterOptions.options.quotes = this.htmlData.getCheckBoxValueFrom(".quotes input");
      delimiterOptions.options.header = this.htmlData.getCheckBoxValueFrom(".headerVal input");
      delimiterOptions.options.quoteChar = this.htmlData.getTextInputValueFrom(".quoteChar input");
      delimiterOptions.options.escapeChar = this.htmlData.getTextInputValueFrom(".escapeChar input");

      return delimiterOptions;
    }

    setFromOptions(delimiterOptions){

      let options = delimiterOptions.options;

      this.htmlData.setCheckBoxFrom(".quotes input", options.quotes, true);
      this.htmlData.setCheckBoxFrom(".headerVal input", options.header, true);
      this.htmlData.setTextFieldToValue(".quoteChar input", options.quoteChar, "\"");
      this.htmlData.setTextFieldToValue(".escapeChar input", options.escapeChar, "\"");

      // TODO : turn this into a custom method
      this.htmlData.setSelectWithCustomInput(`select[name='delimiter']`, "custom",
                                      ".custom-delimiter input", this.delimiterMappings,
                                      options.delimiter);

    }

}

export {DelimitedOptions};