import { DelimiterOptions } from '../../data_formats/delimiter-options.js';
import { HtmlDataValues } from './html-options-data-utils.js';

class DelimitedOptions {
  delimiterMappings = {
    tab: '\t',
    comma: ',',
    hash: '#',
    colon: ':',
    pipe: '|',
    space: ' ',
    semicolon: ';',
    slash: '/',
    backslash: '\\',
  };

  constructor(parentElement) {
    this.parent = parentElement;
    this.htmlData = new HtmlDataValues(this.parent);
  }

  // TODO: create some HTML constructor objects to make building the options panels simpler
  // e.g.         let html = new HtmlControlPanelElements();
  // html.selectWithCustomInput({select:{name:"delimiter",text:"Delimiter", }})
  // but that feels a bit clumsy, possibly factory methods
  addToGui() {
    this.parent.innerHTML = `
        <div class="delimited-options" style="width:100%">
          <div><p><strong>Options</strong>  <span data-help="delimiter-options" class="helpicon"></span></p></div>

          <div class="delimiter">
            <label><span class="helpicon option-help-icon" data-help="dsv-option-delimiter" data-help-text="Choose the delimiter character used between values in each row."></span>Delimiter
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
            </label>
            <br>
          </div>
          <div class="custom-delimiter">
            <label><span class="helpicon option-help-icon" data-help="dsv-option-custom-delimiter" data-help-text="When Delimiter is set to Custom Value, enter the delimiter character here."></span>Custom
              <input type="text" name="custom-delimiter" value='' style="width:5em">
            </label>
            <br>
          </div>  

          <div class="quotes">            
            <label>
              <span class="helpicon option-help-icon" data-help="dsv-option-quotes" data-help-text="Wrap fields in quote characters when exporting delimited data."></span>
              <input type="checkbox" name="quotes" value="quotes">
              Use Quotes
            </label>
            <br>
          </div>

          <div class="headerval">            
            <label>
              <span class="helpicon option-help-icon" data-help="dsv-option-header" data-help-text="Include the header row as the first line of output."></span>
              <input type="checkbox" name="header" value="header">
              Use Header
            </label>
            <br>
          </div>
          

          <div class="quoteChar">
            <label>
              <span class="helpicon option-help-icon" data-help="dsv-option-quote-char" data-help-text="Character used to quote string values."></span>
              <input type="text" name="quoteChar" value='"' style="width:5em">
              Quote Char
            </label>
            <br>
          </div>

          <div class="escapeChar">
            <label>
              <span class="helpicon option-help-icon" data-help="dsv-option-escape-char" data-help-text="Character used to escape quote characters inside field values."></span>
              <input type="text" name="escapeChar" value='"' style="width:5em">
              Escape Char
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

  setApplyCallback(callbackFunc) {
    let button = this.parent.querySelector('.delimited-options .apply button');
    button.onclick = function () {
      callbackFunc(this.getOptionsFromGui());
    }.bind(this);
  }

  getOptionsFromGui() {
    let delimiterOptions = new DelimiterOptions('\t');

    // special type for htmlData getSelectWithCustomInput(selectLocator, inputLocator, default)
    let delimiter = this.htmlData.getSelectWithCustomInput(
      'div.delimiter label select',
      'custom',
      '.custom-delimiter label input',
      this.delimiterMappings,
      '\t'
    );
    delimiterOptions.options.delimiter = delimiter;
    delimiterOptions.options.quotes = this.htmlData.getCheckBoxValueFrom('.quotes label input');
    delimiterOptions.options.header = this.htmlData.getCheckBoxValueFrom('.headerval label input');
    delimiterOptions.options.quoteChar = this.htmlData.getTextInputValueFrom('.quoteChar label input');
    delimiterOptions.options.escapeChar = this.htmlData.getTextInputValueFrom('.escapeChar label input');

    return delimiterOptions;
  }

  setFromOptions(delimiterOptions) {
    let options = delimiterOptions.options;

    this.htmlData.setCheckBoxFrom('.quotes label input', options.quotes, true);
    this.htmlData.setCheckBoxFrom('.headerval label input', options.header, true);
    this.htmlData.setTextFieldToValue('.quoteChar label input', options.quoteChar, '"');
    this.htmlData.setTextFieldToValue('.escapeChar label input', options.escapeChar, '"');

    this.htmlData.setSelectWithCustomInput(
      `select[name='delimiter']`,
      'custom',
      '.custom-delimiter label input',
      this.delimiterMappings,
      options.delimiter
    );
  }
}

export { DelimitedOptions };
