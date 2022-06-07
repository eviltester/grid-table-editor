class CsvDelimitedOptions{

    constructor(parentElement) {
        this.parent = parentElement;
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

      return {
          quotes: this.parent.querySelector(".delimited-options .quotes input").checked,
          header: this.parent.querySelector(".delimited-options .headerVal input").checked,
          quoteChar: this.parent.querySelector(".delimited-options .quoteChar input").value,
          escapeChar: this.parent.querySelector(".delimited-options .escapeChar input").value
      }

    }

    setFromOptions(options){
      let tempElem=undefined;

      this.parent.querySelector(".delimited-options .quotes input").checked = options.quotes ? options.quotes : true;
      this.parent.querySelector(".delimited-options .headerVal input").checked = options.header ? options.header : true;
      this.parent.querySelector(".delimited-options .quoteChar input").value = options.quoteChar ? options.quoteChar : "\"";
      this.parent.querySelector(".delimited-options .escapeChar input").value = options.escapeChar ? options.escapeChar : "\"";


      // if(options.hasOwnProperty("newline")){
      //   this.options.newline = localoptions.newline;
      // }
    }

}

export {CsvDelimitedOptions};