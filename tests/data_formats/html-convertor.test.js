import { GenericDataTable } from '../../js/data_formats/generic-data-table';
import {HtmlConvertor} from '../../js/data_formats/html-convertor';

describe("Can convert generic data grids to html tables",()=>{

    test('convert an HTML and escape chars', () => {
        const expected =
`<table>
<tr>
<th>heading&lt; 1</th><th>heading 2</th><th>h3</th><th>h4</th>
</tr>
<tr>
<td>&lt;start</td><td>data &gt; bar</td><td>end bar&gt;</td><td>&lt;start and end bar&gt;</td>
</tr>
</table>`    

        let table = new GenericDataTable();
        table.setHeaders(["heading< 1", "heading 2", "h3", "h4"]);
        table.appendDataRow(["<start","data > bar", "end bar>", "<start and end bar>"])

        let output = new HtmlConvertor().fromDataTable(table);

        expect(output).toBe(expected);
    });

});