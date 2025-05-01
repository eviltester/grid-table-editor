import { GenericDataTable } from '../../js/data_formats/generic-data-table';
import {HtmlConvertor, HtmlConvertorOptions, Indent} from '../../js/data_formats/html-convertor';
import { JSDOM } from "jsdom";


describe("Can use indent class as expected",()=>{
    test('by default no indent', () => {
        let indent = new Indent();
        expect(indent.currIndent).toBe(0);
        expect(indent.getIndent()).toBe("");
    });
    test('can indent using tabs', () => {
        let indent = new Indent();
        indent.indent();
        expect(indent.currIndent).toBe(1);
        expect(indent.getIndent()).toBe("\t");
    });
    test('can indent using multiple tabs', () => {
        let indent = new Indent();
        indent.indent();
        indent.indent();
        expect(indent.currIndent).toBe(2);
        expect(indent.getIndent()).toBe("\t\t");
    });
    
    test('can indent using multiple spaces', () => {
        let indent = new Indent("   ");
        indent.indent();
        indent.indent();
        expect(indent.currIndent).toBe(2);
        expect(indent.getIndent()).toBe("      ");
    }); 

});

describe("Can convert generic data grids to html tables",()=>{

    test('convert an HTML and escape chars', () => {
        const expected =
`<table>
<tr>
<th>heading&lt; 1</th>
<th>heading 2</th>
<th>h3</th>
<th>h4</th>
</tr>
<tr>
<td>&lt;start</td>
<td>data &gt; bar</td>
<td>end bar&gt;</td>
<td>&lt;start and end bar&gt;</td>
</tr>
</table>`    

        let table = new GenericDataTable();
        table.setHeaders(["heading< 1", "heading 2", "h3", "h4"]);
        table.appendDataRow(["<start","data > bar", "end bar>", "<start and end bar>"])

        let output = new HtmlConvertor().fromDataTable(table);

        expect(output).toBe(expected);
    });

    test('compact output', () => {
        const expected =
`<table><tr><th>heading&lt; 1</th><th>heading 2</th><th>h3</th><th>h4</th></tr><tr><td>&lt;start</td><td>data &gt; bar</td><td>end bar&gt;</td><td>&lt;start and end bar&gt;</td></tr></table>`    

        let table = new GenericDataTable();
        table.setHeaders(["heading< 1", "heading 2", "h3", "h4"]);
        table.appendDataRow(["<start","data > bar", "end bar>", "<start and end bar>"])

        let newOptions = new HtmlConvertorOptions();
        newOptions.options.compact = true;
        let convertor = new HtmlConvertor();
        convertor.setOptions(newOptions);
        let output = convertor.fromDataTable(table);

        expect(output).toBe(expected);
    });

    test('tabbed pretty print HTML', () => {
        const expected =
`<table>
\t<tr>
\t\t<th>heading&lt; 1</th>
\t\t<th>heading 2</th>
\t\t<th>h3</th>
\t\t<th>h4</th>
\t</tr>
\t<tr>
\t\t<td>&lt;start</td>
\t\t<td>data &gt; bar</td>
\t\t<td>end bar&gt;</td>
\t\t<td>&lt;start and end bar&gt;</td>
\t</tr>
</table>`    

        let table = new GenericDataTable();
        table.setHeaders(["heading< 1", "heading 2", "h3", "h4"]);
        table.appendDataRow(["<start","data > bar", "end bar>", "<start and end bar>"])

        let newOptions = new HtmlConvertorOptions();
        newOptions.options.prettyPrint = true;

        let convertor = new HtmlConvertor();
        convertor.setOptions(newOptions);
        let output = convertor.fromDataTable(table);
        expect(output).toBe(expected);
    });   


    test('spaces pretty print HTML', () => {
        const expected =
`<table>
   <tr>
      <th>heading&lt; 1</th>
      <th>heading 2</th>
      <th>h3</th>
      <th>h4</th>
   </tr>
   <tr>
      <td>&lt;start</td>
      <td>data &gt; bar</td>
      <td>end bar&gt;</td>
      <td>&lt;start and end bar&gt;</td>
   </tr>
</table>`    

        let table = new GenericDataTable();
        table.setHeaders(["heading< 1", "heading 2", "h3", "h4"]);
        table.appendDataRow(["<start","data > bar", "end bar>", "<start and end bar>"])

        let newOptions = new HtmlConvertorOptions();
        newOptions.options.prettyPrint = true;
        newOptions.options.prettyPrintDelimiter = "   ";

        let convertor = new HtmlConvertor();
        convertor.setOptions(newOptions);
        let output = convertor.fromDataTable(table);
        expect(output).toBe(expected);
    });  


    test('can add thead to table output', () => {
        const expected =
`<table>
<thead>
<tr>
<th>h1</th>
</tr>
</thead>
<tr>
<td>data</td>
</tr>
</table>`    

        let table = new GenericDataTable();
        table.setHeaders(["h1"]);
        table.appendDataRow(["data"])

        let newOptions = new HtmlConvertorOptions();
        newOptions.options.addTheadToTable = true;

        let convertor = new HtmlConvertor();
        convertor.setOptions(newOptions);
        let output = convertor.fromDataTable(table);

        expect(output).toBe(expected);
    });

    test('can add tbody to table output', () => {
        const expected =
`<table>
<tr>
<th>h1</th>
</tr>
<tbody>
<tr>
<td>data</td>
</tr>
</tbody>
</table>`    

        let table = new GenericDataTable();
        table.setHeaders(["h1"]);
        table.appendDataRow(["data"])

        let newOptions = new HtmlConvertorOptions();
        newOptions.options.addTbodyToTable = true;

        let convertor = new HtmlConvertor();
        convertor.setOptions(newOptions);
        let output = convertor.fromDataTable(table);

        expect(output).toBe(expected);
    });    

    test('can pretty print with all table elements on', () => {
        const expected =
`<table>
  <thead>
    <tr>
      <th>h1</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>data</td>
    </tr>
  </tbody>
</table>`    

        let table = new GenericDataTable();
        table.setHeaders(["h1"]);
        table.appendDataRow(["data"])

        let newOptions = new HtmlConvertorOptions();
        newOptions.options.addTbodyToTable = true;
        newOptions.options.addTheadToTable = true;
        newOptions.options.prettyPrint = true;
        newOptions.options.prettyPrintDelimiter = "  ";

        let convertor = new HtmlConvertor();
        convertor.setOptions(newOptions);
        let output = convertor.fromDataTable(table);

        expect(output).toBe(expected);
    });       
});

describe("Can convert html tables to generic data grids",()=>{

    const documentHTML = '<!doctype html><html><body><div id="root"></div></body></html>';
    global.dom = new JSDOM(documentHTML);
    global.window = dom.window;
    global.document = dom.window.document;
    
    console.log(global.document);
    console.log(global.document.createElement);

    test('convert minimal table to grid', () => {
        const inputtable =
`<table>
<tr>
<th>h1</th>
</tr>
<tr>
<td>data</td>
</tr>
</table>`    

        let newOptions = new HtmlConvertorOptions();

        let convertor = new HtmlConvertor();
        convertor.setOptions(newOptions);
        let output = convertor.toDataTable(inputtable);

        expect(output.getHeaders()[0]).toBe("h1");
        expect(output.getRow(0)[0]).toBe("data");

    });    

    test('no table no grid', () => {
        const inputtable =
``    

        let newOptions = new HtmlConvertorOptions();

        let convertor = new HtmlConvertor();
        convertor.setOptions(newOptions);
        let output = convertor.toDataTable(inputtable);

        expect(output.getHeaders().length).toBe(0);
        expect(output.getRowCount()).toBe(0);

    }); 


    test('no rows no grid', () => {
        const inputtable =
`<table></table>`;

        let newOptions = new HtmlConvertorOptions();

        let convertor = new HtmlConvertor();
        convertor.setOptions(newOptions);
        let output = convertor.toDataTable(inputtable);

        expect(output.getHeaders().length).toBe(0);
        expect(output.getRowCount()).toBe(0);

    }); 

    test('no headers no grid', () => {
        const inputtable =
`<table><tr></tr></table>`;

        let newOptions = new HtmlConvertorOptions();

        let convertor = new HtmlConvertor();
        convertor.setOptions(newOptions);
        let output = convertor.toDataTable(inputtable);

        expect(output.getHeaders().length).toBe(0);
        expect(output.getRowCount()).toBe(0);

    }); 

    test('header can come from td', () => {
        const inputtable =
`<table><tr><td>h1</td></tr></table>`;

        let newOptions = new HtmlConvertorOptions();

        let convertor = new HtmlConvertor();
        convertor.setOptions(newOptions);
        let output = convertor.toDataTable(inputtable);

        expect(output.getHeaders().length).toBe(1);
        expect(output.getHeaders()[0]).toBe("h1");
        expect(output.getRowCount()).toBe(0);
    }); 

    test('table can come from all tr td', () => {
        const inputtable =
`<table><tr><td>h1</td></tr><tr><td>data</td></tr></table>`;

        let newOptions = new HtmlConvertorOptions();

        let convertor = new HtmlConvertor();
        convertor.setOptions(newOptions);
        let output = convertor.toDataTable(inputtable);

        expect(output.getHeaders().length).toBe(1);
        expect(output.getHeaders()[0]).toBe("h1");
        expect(output.getRowCount()).toBe(1);
        expect(output.getRow(0)[0]).toBe("data");
    }); 
});