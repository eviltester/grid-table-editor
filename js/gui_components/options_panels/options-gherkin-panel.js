import { GherkinOptions } from "../../data_formats/gherkin-convertor.js";
import {HtmlDataValues} from "./html-options-data-utils.js";

class GherkinOptionsPanel{

    constructor(parentElement) {
        this.parent = parentElement;
        this.htmlData = new HtmlDataValues(this.parent);
    }

    addToGui(){
        this.parent.innerHTML =
        `
        <div class="gherkin-options" style="width:100%">
          <div><p><strong>Options</strong></p></div>

          <div class="incellpadding">
            <label for="incellpadding">In Cell Padding</label>
            <select name="incellpadding">
              <option value="none">None</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
              <option value="both">Both</option>
            </select>
            <br>
          </div>

          
          <div class="prettyprint">            
            <label for="prettyprint">Pretty Print</label>
            <input type="checkbox" name="prettyprint" value="prettyprint">
            <br>
          </div>

          <div class="showheadings">            
            <label for="showheadings">Show Headers</label>
            <input type="checkbox" name="showheadings" value="showheadings">
            <br>
          </div>
          
          <div class="leftindent">
            <label for="leftindent">Left Indent</label>
            <input type="text" name="leftindent" value='' style="width:5em">
            <br>
          </div>
          

          <div class="apply">
            <button class="apply-options">Apply</button>
          </div>
      
        </div>
        `;
    }

    setApplyCallback(callbackFunc){

      let button = this.parent.querySelector(".gherkin-options .apply button");
      button.onclick = function (){
          callbackFunc(this.getOptionsFromGui())
      }.bind(this);

    }

    getOptionsFromGui(){

      let options = new GherkinOptions();

      let newOptions = {};
      newOptions.options = {};

      newOptions.options.showHeadings = this.htmlData.getCheckBoxValueFrom(".showheadings input");

      // todo: have the hard coded tab, space, custom options
      newOptions.options.leftIndent = this.htmlData.getTextInputValueFrom(".leftindent input");

      newOptions.options.inCellPadding = this.htmlData.getSelectedValueFrom(".incellpadding select", "none");
      // todo: control the in cell padder
      newOptions.options.prettyPrint = this.htmlData.getCheckBoxValueFrom(".prettyprint input");

      options.mergeOptions(newOptions);
      return options;

    }


    setFromOptions(theOptions){

      let options = theOptions?.options ? theOptions.options : {};

      this.htmlData.setCheckBoxFrom(".showheadings input", options?.showHeadings, true);
      this.htmlData.setTextFieldToValue(".leftindent input", options?.leftIndent);
      this.htmlData.setDropDownOptionToKeyValue(".incellpadding select", options?.inCellPadding);
      this.htmlData.setCheckBoxFrom(".prettyprint input", options?.prettyPrint, false);
    }

}

export {GherkinOptionsPanel};