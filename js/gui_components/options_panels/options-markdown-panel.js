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
            <label for="spacepadding">Space Padding</label>
            <select name="spacepadding">
              <option value="none">None</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
              <option value="both">Both</option>
            </select>
            <br>
          </div>

          <div class="tabpadding">
            <label for="tabpadding">Tab Padding</label>
            <select name="tabpadding">
              <option value="none">None</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
              <option value="both">Both</option>
            </select>
            <br>
          </div>          


          <div class="borderbars">            
            <label for="borderbars">Border Bars</label>
            <input type="checkbox" name="borderbars" value="borderbars">
            <br>
          </div>

          <div class="emboldenheaders">            
            <label for="emboldenheaders">Bold Headers</label>
            <input type="checkbox" name="emboldenheaders" value="emboldenheaders">
            <br>
          </div>

          <div class="emphasisheaders">            
            <label for="emphasisheaders">Italic Headers</label>
            <input type="checkbox" name="emphasisheaders" value="emphasisheaders">
            <br>
          </div>
          

          <div class="emboldencolumns">
            <label for="emboldencolumns">Add Bold to Cols</label>
            <input type="text" name="emboldencolumns" value='"' style="width:5em">
            <br>
          </div>

          <div class="emphasiscolumns">
          <label for="emphasiscolumns">Italics on Cols</label>
          <input type="text" name="emphasiscolumns" value='"' style="width:5em">
          <br>
          </div>

          <div class="prettyprint">
          <label for="prettyprint">Pretty Print</label>
          <input type="checkbox" name="prettyprint" value="prettyprint">
          <br>
          </div>

        <div class="globalcolumnalign">
        <label for="globalcolumnalign">Column Align</label>
        <select name="globalcolumnalign">
          <option value="default">Default</option>
          <option value="left">Left</option>
          <option value="right">Right</option>
          <option value="center">Center</option>
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

      let button = this.parent.querySelector(".markdown-options .apply button");
      button.onclick = function (){
          callbackFunc(this.getOptionsFromGui())
      }.bind(this);

    }

    getOptionsFromGui(){

      let options = new MarkdownOptions();

      let newOptions = {};
      newOptions.options = {};
      newOptions.options.spacePadding = this.htmlData.getSelectedValueFrom(".markdown-options div.spacepadding select", "none");
      newOptions.options.tabPadding = this.htmlData.getSelectedValueFrom(".markdown-options div.tabpadding select", "none");

      newOptions.options.borderBars = this.htmlData.getCheckBoxValueFrom(".markdown-options .borderbars input");
      newOptions.options.emboldenHeaders = this.htmlData.getCheckBoxValueFrom(".markdown-options .emboldenheaders input");
      newOptions.options.emphasisHeaders = this.htmlData.getCheckBoxValueFrom(".markdown-options .emphasisheaders input");
      newOptions.options.prettyPrint = this.htmlData.getCheckBoxValueFrom(".markdown-options .prettyprint input");

      newOptions.options.globalColumnAlign = this.htmlData.getSelectedValueFrom(".markdown-options div.globalcolumnalign select", "default");

      newOptions.options.emboldenColumns = getNumberArrayFrom(
        this.parent.querySelector(".markdown-options .emboldencolumns input").value,
      );

      newOptions.options.emphasisColumns = getNumberArrayFrom(
        this.parent.querySelector(".markdown-options .emphasiscolumns input").value,
      );

      options.mergeOptions(newOptions);
      return options;

    }


    setFromOptions(markdownOptions){

      let options = markdownOptions?.options ? markdownOptions.options : {};

      this.htmlData.setCheckBoxFrom(".markdown-options .borderbars input", options?.borderBars, true);
      this.htmlData.setCheckBoxFrom(".markdown-options .emboldenheaders input", options?.emboldenHeaders, false);
      this.htmlData.setCheckBoxFrom(".markdown-options .emphasisheaders input", options?.emphasisHeaders, false);

      this.htmlData.setDropDownOptionToKeyValue(".markdown-options div.spacepadding select", options?.spacePadding, "none");
      this.htmlData.setDropDownOptionToKeyValue(".markdown-options div.tabpadding select", options?.tabPadding, "none");
      this.htmlData.setDropDownOptionToKeyValue(".markdown-options div.globalcolumnalign select", options?.globalColumnAlign, "default");

      let values = options?.emboldenColumns?.join(" ");
      this.htmlData.setTextFieldToValue(".markdown-options .emboldencolumns input", values);

      values = options?.emphasisColumns?.join(" ");
      this.htmlData.setTextFieldToValue(".markdown-options .emphasiscolumns input", values);

      this.htmlData.setCheckBoxFrom(".markdown-options .prettyprint input", options?.prettyPrint, false);

    }

}

export {MarkdownOptionsPanel};