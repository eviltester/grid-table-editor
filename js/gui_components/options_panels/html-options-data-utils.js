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

    getTextInputValueFrom(locator){
        let elem = this.parent.querySelector(locator);
        if(elem){
            return elem.value;
        }else{
            return "";
        }
    }



}


export {HtmlDataValues}