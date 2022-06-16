class HtmlDataValues{

    constructor(parentElement) {
        this.parent = parentElement;
    }

    getSelectedValueFrom(selector, adefault){
        let selectElem = this.parent.querySelector(selector);
        let value=undefined;
        if(selectElem){
          value= selectElem.options[selectElem.selectedIndex].value;
        }
        return value ? value : adefault;        
    }

    getCheckBoxValueFrom(locator){
        let checkboxElem =this.parent.querySelector(locator);
        return checkboxElem.checked;
    }

    setCheckBoxFrom(locator,value, adefault){
        let elem = this.parent.querySelector(locator);
        let valueToUse = value!==undefined ? value : adefault;
        
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
        let setValue = value!==undefined ? value : "";

        let elem = this.parent.querySelector(locator);
        if(elem){
            elem.value=setValue;
        }
    }

    getTextInputValueFrom(locator){
        let elem = this.parent.querySelector(locator);
        if(elem){
            return elem.value;
        }else{
            return "";
        }
    }

    getSelectWithCustomInput(selectLocator, customItemKey, inputLocator, keyMappings, aDefault){

        let selectElem = this.parent.querySelector(selectLocator);
        let delimiterName = selectElem.options[selectElem.selectedIndex].value;
        let delimiter=undefined;
        if(delimiterName===customItemKey){
          delimiter = this.parent.querySelector(inputLocator).value;
        }else{
          for(const key in keyMappings){
            if(delimiterName===key){
              delimiter = keyMappings[key];
            }
          }
        }
  
        if(delimiter===undefined){
          console.log("unknown item found - using default");
          delimiter=aDefault;
        }

        return delimiter;
    }

    setSelectWithCustomInput(selectLocator, customItemKey, inputLocator, keyMappings, theValue){
        // set input to empty
        this.parent.querySelector(inputLocator).value="";

        // vind the value in the key mappings if present
        let foundDelim=false;
        for(const key in keyMappings){
          if(theValue===keyMappings[key]){
            let optionelem = this.parent.querySelector(selectLocator + ` option[value='${key}']`);
            if(optionelem!==undefined){
              optionelem.selected=true;
            }
            
            foundDelim=true;
          }
        }
        
        // if not there then set to the custom
        if(!foundDelim){
          let optionelem = this.parent.querySelector(selectLocator + ` option[value='${customItemKey}']`);
          if(optionelem!==undefined){
            optionelem.selected=true;
          }
          // and set the text field
          this.parent.querySelector(inputLocator).value = theValue;
        }
    }

}


export {HtmlDataValues}