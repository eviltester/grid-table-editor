import { PhpConvertorOptions } from '@anywaydata/core/data_formats/php-convertor.js';
import { HtmlDataValues } from './html-options-data-utils.js';

class PhpOptionsPanel {
  constructor(parentElement) {
    this.parent = parentElement;
    this.htmlData = new HtmlDataValues(this.parent);
  }

  addToGui() {
    this.parent.innerHTML = `
      <div class="php-options" style="width:100%">
        <div><p><strong>Options</strong> <span data-help="php-options" class="helpicon"></span></p></div>
        <div class="collectiontype">
          <label>Collection Type
            <select name="collectiontype">
              <option value="array">Array array()</option>
              <option value="list">List [ ]</option>
            </select>
          </label>
        </div>
        <div class="includephptag">
          <label><input type="checkbox" name="includephptag"> Include &lt;?php Tag</label>
        </div>
        <div class="shortarraysyntax">
          <label><input type="checkbox" name="shortarraysyntax"> Prefer Short Array Syntax [ ]</label>
        </div>
        <div class="assigntovariable">
          <label><input type="checkbox" name="assigntovariable"> Assign to Variable</label>
        </div>
        <div class="variablename option-child">
          <label>Variable Name <input type="text" name="variablename" value="data" style="width:8em"></label>
        </div>
        <div class="quotenumbers">
          <label><input type="checkbox" name="quotenumbers"> Number Convert (Quote Numbers)</label>
        </div>
        <div class="useanonymousobjects">
          <label>Object Representation
            <select name="objectrepresentation">
              <option value="array">Associative Array</option>
              <option value="stdclass">stdClass (object cast)</option>
              <option value="class">Named Class Instances</option>
            </select>
          </label>
        </div>
        <div class="objectclassname option-child">
          <label>Object Name <input type="text" name="objectclassname" value="Row" style="width:8em"></label>
        </div>
        <div class="arraykeyquotestyle">
          <label>Array Key Quote Style
            <select name="arraykeyquotestyle">
              <option value="quoted">Quoted Keys</option>
              <option value="unquoted">Unquoted Keys</option>
            </select>
          </label>
        </div>
        <div class="blankvaluebehavior">
          <label>Blank Value Behavior
            <select name="blankvaluebehavior">
              <option value="empty-string">Empty String</option>
              <option value="null">null</option>
            </select>
          </label>
        </div>
        <div class="coercebooleanliterals">
          <label><input type="checkbox" name="coercebooleanliterals"> Coerce "true"/"false" to booleans</label>
        </div>
        <div class="coercenullliteral">
          <label><input type="checkbox" name="coercenullliteral"> Coerce "null" to null</label>
        </div>
        <div class="phpcompatibility">
          <label>PHP Compatibility
            <select name="phpcompatibility">
              <option value="7+">PHP 7+</option>
              <option value="8+">PHP 8+</option>
            </select>
          </label>
        </div>
        <div class="classpropertytyping option-child">
          <label>Class Property Typing
            <select name="classpropertytyping">
              <option value="none">Untyped Properties</option>
              <option value="typed">Typed Properties (mixed)</option>
            </select>
          </label>
        </div>
        <div class="useconstructorpromotion option-child">
          <label><input type="checkbox" name="useconstructorpromotion"> Use Constructor Promotion (PHP 8+)</label>
        </div>
        <div class="constructorargstyle option-child">
          <label>Constructor Arg Style
            <select name="constructorargstyle">
              <option value="positional">Positional Args</option>
              <option value="named">Named Args (PHP 8+)</option>
            </select>
          </label>
        </div>
        <div class="prettyprint">
          <label><input type="checkbox" name="prettyprint"> Pretty Print</label>
        </div>
        <div class="prettydelimiter option-child">
          <label>Delimiter
            <select name="prettydelimiter">
              <option value="tab">Tab [\t]</option>
              <option value="space">Space [ ]</option>
              <option value="custom">Custom Value</option>
            </select>
          </label>
        </div>
        <div class="custom-pretty-delimiter option-child">
          <label>Custom Delimiter <input type="text" name="custom-pretty-delimiter" value="" style="width:8em"></label>
        </div>
        <div class="apply">
          <button class="apply-options">Apply</button>
        </div>
      </div>
    `;
  }

  setApplyCallback(callbackFunc) {
    const button = this.parent.querySelector('.apply button');
    button.onclick = function () {
      callbackFunc(this.getOptionsFromGui());
    }.bind(this);
  }

  getOptionsFromGui() {
    const newOptions = new PhpConvertorOptions();
    newOptions.options.collectionType = this.htmlData.getSelectedValueFrom("select[name='collectiontype']", 'array');
    newOptions.options.includePhpTag = this.htmlData.getCheckBoxValueFrom('.includephptag label input');
    newOptions.options.preferShortArraySyntax = this.htmlData.getCheckBoxValueFrom('.shortarraysyntax label input');
    newOptions.options.assignToVariable = this.htmlData.getCheckBoxValueFrom('.assigntovariable label input');
    newOptions.options.variableName = this.htmlData.getTextInputValueFrom('.variablename label input') || 'data';
    newOptions.options.quoteNumbers = this.htmlData.getCheckBoxValueFrom('.quotenumbers label input');
    newOptions.options.objectRepresentation = this.htmlData.getSelectedValueFrom(
      "select[name='objectrepresentation']",
      'array'
    );
    newOptions.options.objectClassName = this.htmlData.getTextInputValueFrom('.objectclassname label input') || 'Row';
    newOptions.options.arrayKeyQuoteStyle = this.htmlData.getSelectedValueFrom(
      "select[name='arraykeyquotestyle']",
      'quoted'
    );
    newOptions.options.blankValueBehavior = this.htmlData.getSelectedValueFrom(
      "select[name='blankvaluebehavior']",
      'empty-string'
    );
    newOptions.options.coerceBooleanLiterals = this.htmlData.getCheckBoxValueFrom('.coercebooleanliterals label input');
    newOptions.options.coerceNullLiteral = this.htmlData.getCheckBoxValueFrom('.coercenullliteral label input');
    newOptions.options.phpCompatibility = this.htmlData.getSelectedValueFrom("select[name='phpcompatibility']", '8+');
    newOptions.options.classPropertyTyping = this.htmlData.getSelectedValueFrom(
      "select[name='classpropertytyping']",
      'none'
    );
    newOptions.options.useConstructorPromotion = this.htmlData.getCheckBoxValueFrom(
      '.useconstructorpromotion label input'
    );
    newOptions.options.constructorArgStyle = this.htmlData.getSelectedValueFrom(
      "select[name='constructorargstyle']",
      'positional'
    );
    newOptions.options.prettyPrint = this.htmlData.getCheckBoxValueFrom('.prettyprint label input');
    newOptions.options.prettyPrintDelimiter = this.htmlData.getSelectWithCustomInput(
      "select[name='prettydelimiter']",
      'custom',
      '.custom-pretty-delimiter label input',
      newOptions.delimiterMappings,
      '    '
    );
    return newOptions;
  }

  setFromOptions(mainOptions) {
    const options = mainOptions?.options ?? {};
    const delimiterMappings = mainOptions?.delimiterMappings ?? new PhpConvertorOptions().delimiterMappings;
    this.htmlData.setDropDownOptionToKeyValue("select[name='collectiontype']", options.collectionType, 'array');
    this.htmlData.setCheckBoxFrom('.includephptag label input', options.includePhpTag, false);
    this.htmlData.setCheckBoxFrom('.shortarraysyntax label input', options.preferShortArraySyntax, false);
    this.htmlData.setCheckBoxFrom('.assigntovariable label input', options.assignToVariable, true);
    this.htmlData.setTextFieldToValue('.variablename label input', options.variableName ?? 'data');
    this.htmlData.setCheckBoxFrom('.quotenumbers label input', options.quoteNumbers, false);
    this.htmlData.setDropDownOptionToKeyValue(
      "select[name='objectrepresentation']",
      options.objectRepresentation,
      'array'
    );
    this.htmlData.setTextFieldToValue('.objectclassname label input', options.objectClassName ?? 'Row');
    this.htmlData.setDropDownOptionToKeyValue(
      "select[name='arraykeyquotestyle']",
      options.arrayKeyQuoteStyle,
      'quoted'
    );
    this.htmlData.setDropDownOptionToKeyValue(
      "select[name='blankvaluebehavior']",
      options.blankValueBehavior,
      'empty-string'
    );
    this.htmlData.setCheckBoxFrom('.coercebooleanliterals label input', options.coerceBooleanLiterals, false);
    this.htmlData.setCheckBoxFrom('.coercenullliteral label input', options.coerceNullLiteral, false);
    this.htmlData.setDropDownOptionToKeyValue("select[name='phpcompatibility']", options.phpCompatibility, '8+');
    this.htmlData.setDropDownOptionToKeyValue(
      "select[name='classpropertytyping']",
      options.classPropertyTyping,
      'none'
    );
    this.htmlData.setCheckBoxFrom('.useconstructorpromotion label input', options.useConstructorPromotion, false);
    this.htmlData.setDropDownOptionToKeyValue(
      "select[name='constructorargstyle']",
      options.constructorArgStyle,
      'positional'
    );
    this.htmlData.setCheckBoxFrom('.prettyprint label input', options.prettyPrint, true);
    this.htmlData.setSelectWithCustomInput(
      "select[name='prettydelimiter']",
      'custom',
      '.custom-pretty-delimiter label input',
      delimiterMappings,
      options.prettyPrintDelimiter
    );
  }
}

export { PhpOptionsPanel };
