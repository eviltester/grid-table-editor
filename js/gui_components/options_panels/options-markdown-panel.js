import { MarkdownOptions } from "../../data_formats/markdown-convertor.js";
import {getNumberArrayFrom} from "../../utils/number-convertor.js";

class MarkdownOptionsPanel{

    constructor(parentElement) {
        this.parent = parentElement;
    }

    addToGui(){
        this.parent.innerHTML =
        `
        <div class="markdown-options" style="width:100%">
          <div><p><strong>Options</strong></p></div>

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

    getSelectedValueFrom(selector, adefault){
        let selectElem = this.parent.querySelector(selector);
        let value=undefined;
        if(selectElem){
          value= selectElem.options[selectElem.selectedIndex].value;
        }
        return value ? value : adefault;        
    }



    getOptionsFromGui(){

      let options = new MarkdownOptions();

      let newOptions = {};
      newOptions.options = {};
      newOptions.options.spacePadding = this.getSelectedValueFrom(".markdown-options div.spacepadding select", "none");
      newOptions.options.tabPadding = this.getSelectedValueFrom(".markdown-options div.tabpadding select", "none");
      newOptions.options.borderBars = this.parent.querySelector(".markdown-options .borderbars input").checked;
      newOptions.options.emboldenHeaders = this.parent.querySelector(".markdown-options .emboldenheaders input").checked;
      newOptions.options.emphasisHeaders = this.parent.querySelector(".markdown-options .emphasisheaders input").checked;
      newOptions.options.globalColumnAlign = this.getSelectedValueFrom(".markdown-options div.globalcolumnalign select", "default");

      newOptions.options.emboldenColumns = getNumberArrayFrom(
        this.parent.querySelector(".markdown-options .emboldencolumns input").value,
      );

      newOptions.options.emphasisColumns = getNumberArrayFrom(
        this.parent.querySelector(".markdown-options .emphasiscolumns input").value,
      );

      options.mergeOptions(newOptions);
      return options;

    }

    setCheckBoxFrom(locator,value, adefault){
      let elem = this.parent.querySelector(locator);
      let valueToUse = value ? value : adefault;
      
      if(elem){
        elem.checked = valueToUse;
      }
    }

    setDropDownOptionToKeyValue(locator, key, adefault){
      let elem = this.parent.querySelector(`${locator} option[value='${key}']`);
      if(elem){
        elem.selected=true;
      }else{
        elem = this.parent.querySelector(`${locator} option[value='${adefault}']`);
        if(elem){
          elem.selected=true;
        }
      }
    }

    setTextFieldToValue(locator, value){
      let setValue = value ? value : "";

      let elem = this.parent.querySelector(locator);
      if(elem){
        elem.value=setValue;
      }
    }

    setFromOptions(markdownOptions){

      let options = markdownOptions?.options ? markdownOptions.options : {};

      this.setCheckBoxFrom(".markdown-options .borderbars input", options?.borderBars, true);
      this.setCheckBoxFrom(".markdown-options .emboldenheaders input", options?.emboldenHeaders, false);
      this.setCheckBoxFrom(".markdown-options .emphasisheaders input", options?.emphasisHeaders, false);

      this.setDropDownOptionToKeyValue(".markdown-options div.spacepadding select", options?.spacePadding, "none");
      this.setDropDownOptionToKeyValue(".markdown-options div.tabpadding select", options?.tabPadding, "none");
      this.setDropDownOptionToKeyValue(".markdown-options div.globalcolumnalign select", options?.globalColumnAlign, "default");

      let values = options?.emboldenColumns?.join(" ");
      this.setTextFieldToValue(".markdown-options .emboldencolumns input", values);

      values = options?.emphasisColumns?.join(" ");
      this.setTextFieldToValue(".markdown-options .emphasiscolumns input", values);
    }

}

export {MarkdownOptionsPanel};