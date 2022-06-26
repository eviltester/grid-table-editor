import { MarkdownOptions } from "../../data_formats/markdown-convertor.js";
import {getNumberArrayFrom} from "../../utils/number-convertor.js";
import {HtmlDataValues} from "./html-options-data-utils.js";

class MarkdownOptionsPanel{

    constructor(parentElement) {
        this.parent = parentElement;
        this.htmlData = new HtmlDataValues(this.parent);
    }

    addToGui(){
        this.parent.innerHTML =
        `
        <div class="markdown-options" style="width:100%">
          <div><p><strong>Options</strong> <span data-help="markdown-table-options" class="helpicon"></span></p></div>

          <div class="spacepadding">
            <label>Space Padding
              <select name="spacepadding">
                <option value="none">None</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
                <option value="both">Both</option>
              </select>
            </label>
            <br>
          </div>

          <div class="tabpadding">
            <label>Tab Padding
              <select name="tabpadding">
                <option value="none">None</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
                <option value="both">Both</option>
              </select>
            </label>
            <br>
          </div>          


          <div class="borderbars">            
            <label>
              <input type="checkbox" name="borderbars" value="borderbars">
              Border Bars
            </label>
            <br>
          </div>

          <div class="emboldenheaders">            
            <label>
             <input type="checkbox" name="emboldenheaders" value="emboldenheaders">
             Bold Headers
            </label>
            <br>
          </div>

          <div class="emphasisheaders">            
            <label>
              <input type="checkbox" name="emphasisheaders" value="emphasisheaders">
              Italic Headers
            </label>
            <br>
          </div>
          

          <div class="emboldencolumns">
            <label>Add Bold to Cols
              <input type="text" name="emboldencolumns" value='"' style="width:5em">
            </label>
            <br>
          </div>

          <div class="emphasiscolumns">
          <label>Italics on Cols
            <input type="text" name="emphasiscolumns" value='"' style="width:5em">
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

        <div class="globalcolumnalign">
        <label>Column Align
          <select name="globalcolumnalign">
            <option value="default">Default</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
            <option value="center">Center</option>
          </select>
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

      let button = this.parent.querySelector(".markdown-options .apply button");
      button.onclick = function (){
          callbackFunc(this.getOptionsFromGui())
      }.bind(this);

    }

    getOptionsFromGui(){

      let options = new MarkdownOptions();

      let newOptions = {};
      newOptions.options = {};
      newOptions.options.spacePadding = this.htmlData.getSelectedValueFrom(".markdown-options div.spacepadding label select", "none");
      newOptions.options.tabPadding = this.htmlData.getSelectedValueFrom(".markdown-options div.tabpadding label select", "none");

      newOptions.options.borderBars = this.htmlData.getCheckBoxValueFrom(".markdown-options .borderbars label input");
      newOptions.options.emboldenHeaders = this.htmlData.getCheckBoxValueFrom(".markdown-options .emboldenheaders label input");
      newOptions.options.emphasisHeaders = this.htmlData.getCheckBoxValueFrom(".markdown-options .emphasisheaders label input");
      newOptions.options.prettyPrint = this.htmlData.getCheckBoxValueFrom(".markdown-options .prettyprint label input");

      newOptions.options.globalColumnAlign = this.htmlData.getSelectedValueFrom(".markdown-options div.globalcolumnalign label select", "default");

      newOptions.options.emboldenColumns = getNumberArrayFrom(
        this.parent.querySelector(".markdown-options .emboldencolumns label input").value,
      );

      newOptions.options.emphasisColumns = getNumberArrayFrom(
        this.parent.querySelector(".markdown-options .emphasiscolumns label input").value,
      );

      options.mergeOptions(newOptions);
      return options;

    }


    setFromOptions(markdownOptions){

      let options = markdownOptions?.options ? markdownOptions.options : {};

      this.htmlData.setCheckBoxFrom(".markdown-options .borderbars label input", options?.borderBars, true);
      this.htmlData.setCheckBoxFrom(".markdown-options .emboldenheaders label input", options?.emboldenHeaders, false);
      this.htmlData.setCheckBoxFrom(".markdown-options .emphasisheaders label input", options?.emphasisHeaders, false);

      this.htmlData.setDropDownOptionToKeyValue(".markdown-options div.spacepadding label select", options?.spacePadding, "none");
      this.htmlData.setDropDownOptionToKeyValue(".markdown-options div.tabpadding label select", options?.tabPadding, "none");
      this.htmlData.setDropDownOptionToKeyValue(".markdown-options div.globalcolumnalign label select", options?.globalColumnAlign, "default");

      let values = options?.emboldenColumns?.join(" ");
      this.htmlData.setTextFieldToValue(".markdown-options .emboldencolumns label input", values);

      values = options?.emphasisColumns?.join(" ");
      this.htmlData.setTextFieldToValue(".markdown-options .emphasiscolumns label input", values);

      this.htmlData.setCheckBoxFrom(".markdown-options .prettyprint label input", options?.prettyPrint, false);

    }

}

export {MarkdownOptionsPanel};