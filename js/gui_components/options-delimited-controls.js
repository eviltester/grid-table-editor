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

      let selectElem = this.parent.querySelector(".delimited-options div.delimiter select");
      let delimiterName = selectElem.options[selectElem.selectedIndex].value;
      let delimiter=undefined;
      if(delimiterName==="custom"){
        delimiter = this.parent.querySelector(".delimited-options .custom-delimiter input").value;
      }else{
        for(const key in this.delimiterMappings){
          if(delimiterName===key){
            delimiter = this.delimiterMappings[key];
          }
        }
      }

      if(delimiter===undefined){
        console.log("unknown delimiter found - using tab");
        delimiter="\t";
      }
      return {
          quotes: this.parent.querySelector(".delimited-options .quotes input").checked,
          header: this.parent.querySelector(".delimited-options .headerVal input").checked,
          quoteChar: this.parent.querySelector(".delimited-options .quoteChar input").value,
          escapeChar: this.parent.querySelector(".delimited-options .escapeChar input").value,
          delimiter: delimiter
      }

    }

    setFromOptions(options){

      this.parent.querySelector(".delimited-options .quotes input").checked = options.quotes!==undefined ? options.quotes : true;
      this.parent.querySelector(".delimited-options .headerVal input").checked = options.header!==undefined ? options.header : true;
      this.parent.querySelector(".delimited-options .quoteChar input").value = options.quoteChar!==undefined ? options.quoteChar : "\"";
      this.parent.querySelector(".delimited-options .escapeChar input").value = options.escapeChar!==undefined ? options.escapeChar : "\"";

      let foundDelim=false;
      for(const key in this.delimiterMappings){
        if(options.delimiter===this.delimiterMappings[key]){
          let optionelem = this.parent.querySelector(`.delimited-options div.delimiter option[value='${key}']`);
          if(optionelem!==undefined){
            optionelem.selected=true;
          }
          
          foundDelim=true;
        }
      }

      if(!foundDelim){
        let optionelem = this.parent.querySelector(".delimited-options div.delimiter option[value='custom']");
        if(optionelem!==undefined){
          optionelem.selected=true;
        }
        this.parent.querySelector(".delimited-options .custom-delimiter input").value = options.delimiter;
      }

      // if(options.hasOwnProperty("newline")){
      //   this.options.newline = localoptions.newline;
      // }
    }

}

export {DelimitedOptions};