var de=Object.defineProperty;var me=(a,t,e)=>t in a?de(a,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):a[t]=e;var W=(a,t,e)=>me(a,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function e(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(i){if(i.ep)return;i.ep=!0;const s=e(i);fetch(i.href,s)}})();class V{constructor(t){this.options={quotes:!0,quoteChar:'"',escapeChar:'"',delimiter:'"',header:!0,newline:`
`,skipEmptyLines:!1,columns:null},t!==void 0&&(this.options.delimiter=t),this.headers=[]}mergeOptions(t){t.options?this.options={...this.options,...t.options}:this.options={...this.options,...t},Object.prototype.hasOwnProperty.call(t,"headers")?this.headers=t.headers.map(e=>e):this.headers=[]}}class _{constructor(){this.headers=[],this.rows=[]}clear(){return this.headers=[],this.rows=[],!0}appendDataRow(t){if(this.headers.length,t!=null){if(t.length>this.headers.length)return console.log("Tried to add "+t.length+" columns to a table with "+this.headers.length+" columns"),!1;this.headers.length-t.length;for(let e of t);}return this.rows.push(t),!0}addHeader(t){this.headers.push(t?String(t):"")}setHeaders(t){this.headers=[];for(let e of t)this.addHeader(e)}getColumnCount(){return this.headers.length}getHeader(t){return this.headers[t]}getHeaders(){return this.headers.map(t=>t)}getRowCount(){return this.rows.length}getCell(t,e){return this.rows[t][e]}getRow(t){return this.rows[t].map(e=>e)}getRowAsObject(t){let e=this.getHeaders();return this.getRowAsObjectUsingHeadings(t,e)}getRowAsObjectUsingHeadings(t,e){let n={},i=this.getRow(t);for(const s in e)n[e[s]]=i[s];return n}}class jt{constructor(){this.options={showHeadings:!0,leftIndent:"",inCellPadding:"none",inCellPadder:" ",prettyPrint:!1}}mergeOptions(t){t.options?this.options={...this.options,...t.options}:this.options={...this.options,...t},(this.options.leftIndent===null||this.options.leftIndent===void 0)&&(this.options.leftIndent=""),(this.options.inCellPadder===null||this.options.inCellPadder===void 0)&&(this.options.inCellPadder="")}}class fe{constructor(t){this.options=new jt,t!=null&&t.options&&this.setOptions(t)}setOptions(t){this.options.mergeOptions(t)}unescapeGherkinCellValue(t){let e="";for(let n=0;n<t.length;n++){const i=t[n],s=n+1<t.length?t[n+1]:"";if(i==="\\"&&(s==="\\"||s==="|")){e+=s,n++;continue}e+=i}return e}getValidTableCellValueFromInputFormatCell(t){let e=t.trim();return e=e.replaceAll("&#124;","\\|"),e=this.unescapeGherkinCellValue(e),e}getOutputCellsFromTableRow(t){let e=t.trim();return e.charAt(0)=="|"&&(e=e.substring(1)),e.charAt(e.length-1)=="|"&&(e=e.slice(0,-1)),e=e.replaceAll("\\|","&#124;"),e.split("|").map(s=>this.getValidTableCellValueFromInputFormatCell(s))}getValidOutputFormatCellValue(t){return String(t).replaceAll("\\","\\\\").replaceAll("|","\\|")}formatCell(t){let e="",n="",i=this.options.options;return i.inCellPadding!=="none"&&((i.inCellPadding==="left"||i.inCellPadding==="both")&&(e=i.inCellPadder),(i.inCellPadding==="right"||i.inCellPadding==="both")&&(n=i.inCellPadder)),e+this.getValidOutputFormatCellValue(t)+n}getPrettyPrintColumnWidths(t){let e=[];this.options.options.showHeadings&&t.getHeaders().forEach((i,s)=>{let r=this.formatCell(i);e[s]=r.length});for(let i=0;i<t.getRowCount();i++)t.getRow(i).forEach((r,o)=>{let l=this.formatCell(r);l.length>e[o]&&(e[o]=l.length)});return e}padCell(t,e){if(e==null)return t;let n="";if(e>t.length){let i=e-t.length;n=Array(i+1).join(" ")}return t+n}fromDataTable(t){let e=[];this.options.options.prettyPrint&&(e=this.getPrettyPrintColumnWidths(t));let n="",i=this.options.options,s=i.leftIndent;if(i.showHeadings){var r=t.getHeaders().map((l,p)=>this.padCell(this.formatCell(l),e[p]));n=s+"|"+r.join("|")+`|
`}for(let l=0;l<t.getRowCount();l++){var o=t.getRow(l).map((c,u)=>this.padCell(this.formatCell(c),e[u]));n=n+s+"|"+o.join("|")+`|
`}return n}toDataTable(t){let e=new _,n=[];n=t.split(`
`);let i=0,s=!1;for(const r of n){let o=r.trim();if(!(s===!1&&o.length===0)){if(s=!0,s===!0&&o.length===0)break;if(o.length>0&&i===0){let l=this.getOutputCellsFromTableRow(o);e.setHeaders(l)}if(o.length>0&&i!==0){let l=this.getOutputCellsFromTableRow(o);e.appendDataRow(l)}i++}}return e}}class Tt{constructor(){this.options={spacePadding:"none",tabPadding:"none",borderBars:!0,emboldenHeaders:!1,emphasisHeaders:!1,emboldenColumns:[],emphasisColumns:[],globalColumnAlign:"default",prettyPrint:!1},this.validateSeparatorLength=!1}mergeOptions(t){t.options?this.options={...this.options,...t.options}:(console.log("Warning: Using legacy fallback options setter in markdown-convertor.js"),this.options={...this.options,...t}),t.validateSeparatorLength&&(this.validateSeparatorLength=t.validateSeparatorLength)}}class ge{constructor(t){this.options=new Tt,t!=null&&t.options&&this.setOptions(t)}setOptions(t){this.options.mergeOptions(t)}isMarkdownTableSeparatorRowValid(t){let e=t.trim();if(!e.startsWith("|")||!e.endsWith("|"))return!1;let n=this.getOutputCellsFromTableRow(e);return!(n.filter(s=>(s.startsWith(":")&&(s=s.slice(1)),s.endsWith(":")&&(s=s.slice(0,-1)),s.replace(/-/g,"").length!=0?!1:!(s.length<3))).length<n.length)}getValidTableCellValueFromInputFormatCell(t){let e=t.trim();e=e.replaceAll("&#124;","|");const n=/(^| )_([\S]+)_($| )/g;e=e.replace(n,"$1$2$3");const i=/(^| )\*\*([\S]+)\*\*($| )/g;return e=e.replace(i,"$1$2$3"),e}getOutputCellsFromTableRow(t){let e=t.trim();e.charAt(0)=="|"&&(e=e.substring(1)),e.charAt(e.length-1)=="|"&&(e=e.slice(0,-1));var n=e.split("|"),i=n.map(s=>this.getValidTableCellValueFromInputFormatCell(s));return i}toDataTable(t){let e=[];e=t.split(`
`);let n=new _,i=0,s=!1;for(const l of e){let p=l.trim();if(!(s===!1&&p.length===0)){if(s=!0,s===!0&&p.length===0)break;if(p.length>0&&i===0){var r=this.getOutputCellsFromTableRow(p);n.setHeaders(r)}if(p.length>0&&i===1&&this.options.validateSeparatorLength&&!this.isMarkdownTableSeparatorRowValid(p))return new _;if(p.length>0&&i>=2){var o=this.getOutputCellsFromTableRow(p);n.appendDataRow(o)}i++}}return n}getValidOutputFormatCellValue(t){return String(t).replaceAll("|","&#124;")}formatCell(t,e,n){let i="",s="";return n===void 0&&((this.options.options.globalColumnAlign==="left"||this.options.options.globalColumnAlign==="center")&&(i=":"+i),(this.options.options.globalColumnAlign==="right"||this.options.options.globalColumnAlign==="center")&&(s=s+":")),e?((this.options.options.emboldenHeaders===!0||this.options.options.emboldenColumns.includes(n))&&(i="**"+i,s=s+"**"),(this.options.options.emphasisHeaders===!0||this.options.options.emphasisColumns.includes(n))&&(i="_"+i,s=s+"_")):(this.options.options.emboldenColumns.includes(n)&&(i="**"+i,s=s+"**"),this.options.options.emphasisColumns.includes(n)&&(i="_"+i,s=s+"_")),(this.options.options.spacePadding==="left"||this.options.options.spacePadding==="both")&&(i=" "+i),(this.options.options.spacePadding==="right"||this.options.options.spacePadding==="both")&&(s=s+" "),(this.options.options.tabPadding==="left"||this.options.options.tabPadding==="both")&&(i="	"+i),(this.options.options.tabPadding==="right"||this.options.options.tabPadding==="both")&&(s=s+"	"),i+this.getValidOutputFormatCellValue(t)+s}getPrettyPrintColumnWidths(t){let e=[];t.getHeaders().forEach((n,i)=>{let s=this.formatCell(n,!0,i+1);e[i]=s.length});for(let n=0;n<t.getRowCount();n++)t.getRow(n).forEach((s,r)=>{let o=this.formatCell(s,!1,r+1);o.length>e[r]&&(e[r]=o.length)});return e}padCell(t,e,n){if(e==null)return t;let i=n||" ",s="";if(e>t.length){let l=e-t.length;s=Array(l+1).join(i)}let r="",o="";if(o=s,this.options.options.globalColumnAlign==="right"&&(r=s,o=""),this.options.options.globalColumnAlign==="center"&&s.length>0){let l=Math.floor(s.length/2);l>0&&(r=Array(l+1).join(i));let p=s.length-l;p>0&&(o=Array(p+1).join(i))}return r+t+o}fromDataTable(t){let e=[];this.options.options.prettyPrint&&(e=this.getPrettyPrintColumnWidths(t));let n=t.getHeaders().map((r,o)=>this.padCell(this.formatCell(r,!0,o+1),e[o])),i="|";this.options.options.borderBars===!1&&(i="");let s=i+n.join("|")+i+`
`;s=s+i+t.getHeaders().map((r,o)=>{let l=this.formatCell(this.padCell("-----",e[o],"-"),!1,void 0);if(l.length>e[o]){let p=l.length-e[o];for(;p>0;)l=l.replace("-",""),p--}return l}).join("|")+i+`
`;for(let r=0;r<t.getRowCount();r++){let l=t.getRow(r).map((p,c)=>this.padCell(this.formatCell(p,!1,c+1),e[c]));s=s+i+l.join("|")+i+`
`}return s}async fromDataTableAsync(t,e){let n=[];this.options.options.prettyPrint&&(e==null||e("Calculating widths..."),n=this.getPrettyPrintColumnWidths(t),await this._yieldToUi());let i=t.getHeaders().map((p,c)=>this.padCell(this.formatCell(p,!0,c+1),n[c])),s="|";this.options.options.borderBars===!1&&(s="");let r=[];r.push(s+i.join("|")+s),r.push(s+t.getHeaders().map((p,c)=>{let u=this.formatCell(this.padCell("-----",n[c],"-"),!1,void 0);if(u.length>n[c]){let h=u.length-n[c];for(;h>0;)u=u.replace("-",""),h--}return u}).join("|")+s);const o=t.getRowCount(),l=150;e==null||e(`Formatting rows... 0/${o} (0%)`);for(let p=0;p<o;p+=l){const c=Math.min(p+l,o);for(let h=p;h<c;h++){let b=t.getRow(h).map((y,m)=>this.padCell(this.formatCell(y,!1,m+1),n[m]));r.push(s+b.join("|")+s)}const u=Math.round(c/Math.max(o,1)*100);e==null||e(`Formatting rows... ${c}/${o} (${u}%)`),c<o&&await this._yieldToUi()}return r.join(`
`)+`
`}_yieldToUi(){return new Promise(t=>{if(typeof requestAnimationFrame!="function"){setTimeout(t,0);return}requestAnimationFrame(()=>{setTimeout(t,0)})})}}class kt{constructor(){this.delimiterMappings={tab:"	",space:" "},this.options={compact:!1,prettyPrint:!1,prettyPrintDelimiter:"	",addTheadToTable:!1,addTbodyToTable:!1}}mergeOptions(t){t.options?this.options={...this.options,...t.options}:this.options={...this.options,...t}}}class be{constructor(t){this.currIndent=0,this.indentChar=t||"	",this.amIndenting=!0}activateIndentation(t){this.amIndenting=t,this.amIndenting||(this.currIndent=0)}indent(){this.amIndenting&&this.currIndent++}outdent(){this.amIndenting&&this.currIndent>0&&this.currIndent--}getIndent(){if(!this.amIndenting)return"";let t="";for(let e=0;e<this.currIndent;e++)t+=this.indentChar;return t}}class ye{constructor(){this.exportOptions=new kt}validHTMLCellValue(t){return String(t).replaceAll("<","&lt;").replaceAll(">","&gt;")}setOptions(t){this.exportOptions.mergeOptions(t)}fromDataTable(t){let e=`
`,n=new be(this.exportOptions.options.prettyPrintDelimiter);n.activateIndentation(this.exportOptions.options.prettyPrint),this.exportOptions.options.compact&&(e="");var i=n.getIndent()+"<table>"+e;this.exportOptions.options.addTheadToTable&&(n.indent(),i+=n.getIndent()+"<thead>"+e),n.indent(),i=i+n.getIndent()+"<tr>"+e;var s=t.getHeaders().map(o=>this.validHTMLCellValue(o));n.indent(),s.forEach(o=>{i+=n.getIndent()+"<th>"+o+`</th>${e}`}),n.outdent(),i=i+n.getIndent()+"</tr>"+e,this.exportOptions.options.addTheadToTable&&(n.outdent(),i+=n.getIndent()+"</thead>"+e),this.exportOptions.options.addTbodyToTable&&(i+=n.getIndent()+"<tbody>"+e,n.indent());for(let o=0;o<t.getRowCount();o++){let l=t.getRow(o);i=i+n.getIndent()+"<tr>"+e,n.indent();var r=l.map(p=>this.validHTMLCellValue(p));r.forEach(p=>{i+=n.getIndent()+"<td>"+p+`</td>${e}`}),n.outdent(),i=i+n.getIndent()+"</tr>"+e}return this.exportOptions.options.addTbodyToTable&&(n.outdent(),i+=n.getIndent()+"</tbody>"+e),n.outdent(),i+=n.getIndent()+"</table>",i}toDataTable(t){const e=new _;let n=document.createElement("div");n.innerHTML=t;let i=n.querySelector("table");if(i===null)return console.log("Error: could not find table in the HTML import"),e;let s=i.querySelectorAll("tr");if(s==null||s.length===0)return console.log("Error: could not find any rows in the table"),e;let o=s[0].querySelectorAll("td, th");if(o===null||o.length===0)return console.log("Error: could not find any headers in the table"),e;e.setHeaders(this.getCellContentsArrayFromNodeList(o));for(let l=1;l<s.length;l++){let p=s[l].querySelectorAll("td");e.appendDataRow(this.getCellContentsArrayFromNodeList(p))}return n.innerHTML="",n=void 0,e}getCellContentsArrayFromNodeList(t){return[...t].map(e=>this.getTableCellContents(e))}getTableCellContents(t){let e=t.innerText;return e===void 0&&(e=t.textContent),e.replaceAll(`
`," ").trim()}}class Zt{setGenericDataTableFromDataArray(t,e){if(e===void 0)return!0;if(e===null)return t.clear();if(e.length==0)return!1;const n=e[0];if(n!==void 0){if(n===null)return console.log("Cannot set headers to null, data unchanged"),!1;if(n.length==0)return console.log("Cannot set headers to none, data unchanged"),!1}this.headers=[];for(let i of n)t.addHeader(i);this.rows=[];for(let i=1;i<e.length;i++){let s=e[i];if(!t.appendDataRow(s))return!1}return!0}setGenericDataTableFromDataObjects(t,e){if(e===void 0||e===null||e.length===0)return!1;let n=[];for(const i in e[0])n.push(i);return t.setHeaders(n),e.forEach(i=>{let s=[];n.forEach(r=>{let o=i[r];o===void 0&&(o=""),s.push(o)}),t.appendDataRow(s)}),!0}}class we{constructor(t={}){this.setOptions(t)}setOptions(t={}){this.options={delimiter:",",quoteChar:'"',escapeChar:'"',quotes:!0,...t}}formatCell(t,e=0){const n=t==null?"":String(t),i=this.escapeQuotes(n);return this.shouldQuote(i,e)?`${this.options.quoteChar}${i}${this.options.quoteChar}`:i}escapeQuotes(t){const e=this.options.quoteChar;if(!e||!t.includes(e))return t;const n=this.options.escapeChar??e,i=n===e?`${e}${e}`:`${n}${e}`;return t.split(e).join(i)}shouldQuote(t,e){const n=this.options.quotes;if(Array.isArray(n)?!!n[e]:!!n)return!0;const s=this.options.delimiter,r=this.options.quoteChar;return t.includes(s)||t.includes(`
`)||t.includes("\r")||(r?t.includes(r):!1)}}class Yt{constructor(t={}){this.setOptions(t)}setOptions(t={}){this.options={delimiter:",",newline:`
`,header:!0,...t},this.cellFormatter=new we(this.options)}fromDataTable(t){const e=[];this.options.header&&e.push(this.formatRow(t.getHeaders()));const n=t.getRowCount();for(let i=0;i<n;i++)e.push(this.formatRow(t.getRow(i)));return e.join(this.options.newline)}async fromDataTableAsync(t,e){const n=[];this.options.header&&n.push(this.formatRow(t.getHeaders()));const i=t.getRowCount(),s=200;e==null||e(`Formatting rows... 0/${i} (0%)`);for(let r=0;r<i;r+=s){const o=Math.min(r+s,i);for(let p=r;p<o;p++)n.push(this.formatRow(t.getRow(p)));const l=Math.round(o/Math.max(i,1)*100);e==null||e(`Formatting rows... ${o}/${i} (${l}%)`),o<i&&await this._yieldToUi()}return n.join(this.options.newline)}_yieldToUi(){return new Promise(t=>{if(typeof requestAnimationFrame!="function"){setTimeout(t,0);return}requestAnimationFrame(()=>{setTimeout(t,0)})})}formatRow(t=[]){const e=new Array(t.length);for(let n=0;n<t.length;n++)e[n]=this.cellFormatter.formatCell(t[n],n);return e.join(this.options.delimiter)}}class ve extends Yt{constructor(t={}){super({...t,delimiter:","})}setOptions(t={}){super.setOptions({...t,delimiter:","})}}class St{constructor(t){this.delimiterOptions=new V,this.dsvExporter=new Yt(this.delimiterOptions.options),t!==void 0&&this.setOptions(t)}setOptions(t){this.delimiterOptions.mergeOptions(t),this.dsvExporter.setOptions(this.delimiterOptions.options)}setPapaParse(t){this.papaparse=t}fromDataTable(t){return this.dsvExporter.fromDataTable(t)}toDataTable(t){let e="";if(this.delimiterOptions&&this.delimiterOptions.options.header==!1){let o=this.delimiterOptions.headers;o!==void 0&&o.length>0&&(e=this.papaparse.unparse([this.delimiterOptions.headers],this.delimiterOptions.options),e=e+this.delimiterOptions.options.newline)}let n;this.delimiterOptions&&(n=this.delimiterOptions.options.header,this.delimiterOptions.options.header=!1);var i=this.papaparse.parse(e+t,this.delimiterOptions.options);n!==void 0&&(this.delimiterOptions.options.header=n);let s=new _;return new Zt().setGenericDataTableFromDataArray(s,i.data),s}}class xe{constructor(t){this.options=new V(","),this.delegateTo=new St(this.options),this.csvExporter=new ve(this.options.options),t!==void 0&&this.setOptions(t)}setOptions(t){this.options.mergeOptions(t),this.options.delimiter=",",this.delegateTo=new St(this.options),this.delegateTo.setPapaParse(this.papaparse),this.csvExporter.setOptions(this.options.options)}setPapaParse(t){this.papaparse=t,this.delegateTo.setPapaParse(t)}fromDataTable(t){return this.csvExporter.fromDataTable(t)}async fromDataTableAsync(t,e){return this.csvExporter.fromDataTableAsync(t,e)}toDataTable(t){return this.delegateTo.toDataTable(t)}}function te(a){var t=/^\d+$/;return t.test(a)}function Ot(a){let t=[];if(a==null)return t;let e=a.trim();if(e.length===0)return t;let n=/[^0-9]/gi,i=e.replace(n," ");i=i.trim();let s=i.split(" ");for(const r of s)if(!(r==null||r.trim().length===0)){if(te(r)){const o=parseInt(r);isNaN(o)||t.push(o)}}return t}class H{constructor(){this.delimiterMappings={tab:"	",dot:".",dash:"-",underline:"_",space:" ",plus:"+"},this.options={makeNumbersNumeric:!1,prettyPrint:!0,prettyPrintDelimiter:"	",asObject:!1,asPropertyNamed:"data",outputAsJsonLines:!1},this.headerNameConvertor=t=>t}mergeOptions(t){t.options?this.options={...this.options,...t.options}:this.options={...this.options,...t},t.headerNameConvertor&&(this.headerNameConvertor=t.headerNameConvertor)}}class Ct{constructor(t){this.config=new H,t!==void 0&&this.setOptions(t)}setOptions(t){this.config.mergeOptions(t)}formatAsObjects(t){let e=t.getHeaders().map(i=>this.config.headerNameConvertor(i)),n=[];for(let i=0;i<t.getRowCount();i++)n.push(t.getRowAsObjectUsingHeadings(i,e));return n}fromDataTable(t){let e=null;this.config.options.makeNumbersNumeric&&(e=(r,o)=>o*1==0?0:o==o*1?o*1:o);let n=this.formatAsObjects(t);if(this.config.options.outputAsJsonLines)return n.map(r=>JSON.stringify(r,e)).join(`
`);let i=null;this.config.options.prettyPrint&&(i=this.config.options.prettyPrintDelimiter),te(i)&&(i=i*1);let s;return this.config.options.asObject?(s={},s[this.config.options.asPropertyNamed]=n):s=n,JSON.stringify(s,e,i)}toDataTable(t){let e=[];this.config.options.asObject?e=JSON.parse(t)[this.config.options.asPropertyNamed]:e=JSON.parse(t);const n=new Zt;let i=new _;return n.setGenericDataTableFromDataObjects(i,e),i}}function ee(a){return a.replace(/[^A-Za-z0-9_]/g,"_")}class Rt{constructor(){this.jsonoptions=new H,this.options=this.jsonoptions.options,this.delimiterMappings=this.jsonoptions.delimiterMappings,this.headerNameConvertor=ee}mergeOptions(t){t.options?this.options={...this.options,...t.options}:this.options={...this.options,...t},t.headerNameConvertor&&(this.headerNameConvertor=t.headerNameConvertor)}}class Se{constructor(t){this.delegateTo=new Ct(new Rt),t&&this.setOptions(t)}setOptions(t){this.delegateTo.config.mergeOptions(t)}formatAsObjects(t){return this.delegateTo.formatAsObjects(t)}setPapaParse(t){this.papaparse=t,this.delegateTo.setPapaParse(t)}fromDataTable(t){let e=this.delegateTo.fromDataTable(t);const n=/(\s|^]*){([\s]*)"([a-zA-Z0-9_ ]+)"( ?):( ?)\[/g;if(this.delegateTo.config.options.asObject){e=e.replace(n,"$1{$2$3$4:$5[");let o=ee(this.delegateTo.config.options.asPropertyNamed);o!==this.delegateTo.config.options.asPropertyNamed&&(e=e.replace(this.delegateTo.config.options.asPropertyNamed,o))}const i=/"([a-zA-Z0-9_]*)":( ?)"/g;let s=e.replaceAll(i,'$1:$2"');const r=/"([a-zA-Z0-9_]*)"( ?):( ?)([0-9]*[,}\n])/g;return s=s.replace(r,"$1$2:$3$4"),s}toDataTable(t){let e=t;const n=/(\s|^]*){([\s]*)([a-zA-Z0-9_]+)( ?):( ?)\[/g;this.delegateTo.config.options.asObject&&(e=e.replace(n,'$1{$2"$3"$4:$5['));const i=/([\t ]*)([a-zA-Z0-9_]*)( ?):( ?)"/g;e=e.replace(i,'"$2"$3:$4"');const s=/([\t ]*)([a-zA-Z0-9_]*)( ?):( ?)([0-9]*[,}\n])/g;return e=e.replace(s,'"$2"$3:$4$5'),this.delegateTo.toDataTable(e)}}const w={};w.csv={type:"csv",fileExtension:".csv"};w.dsv={type:"dsv",fileExtension:".txt"};w.markdown={type:"markdown",fileExtension:".md"};w.json={type:"json",fileExtension:".json"};w.jsonl={type:"jsonl",fileExtension:".jsonl"};w.javascript={type:"javascript",fileExtension:".js"};w.python={type:"python",fileExtension:".py"};w.php={type:"php",fileExtension:".php"};w.ruby={type:"ruby",fileExtension:".rb"};w.kotlin={type:"kotlin",fileExtension:".kt"};w.csharp={type:"csharp",fileExtension:".cs"};w.perl={type:"perl",fileExtension:".pl"};w.java={type:"java",fileExtension:".java"};w.typescript={type:"typescript",fileExtension:".ts"};w.junit4={type:"junit4",fileExtension:".java"};w.junit5={type:"junit5",fileExtension:".java"};w.junit6={type:"junit6",fileExtension:".java"};w.testng={type:"testng",fileExtension:".java"};w.pytest={type:"pytest",fileExtension:".py"};w.unittest={type:"unittest",fileExtension:".py"};w.nose2={type:"nose2",fileExtension:".py"};w.jest={type:"jest",fileExtension:".js"};w.vitest={type:"vitest",fileExtension:".ts"};w.mocha={type:"mocha",fileExtension:".js"};w.xunit={type:"xunit",fileExtension:".cs"};w.nunit={type:"nunit",fileExtension:".cs"};w.mstest={type:"mstest",fileExtension:".cs"};w.rspec={type:"rspec",fileExtension:".rb"};w.minitest={type:"minitest",fileExtension:".rb"};w.phpunit={type:"phpunit",fileExtension:".php"};w.pest={type:"pest",fileExtension:".php"};w.kotest={type:"kotest",fileExtension:".kt"};w["junit5-kotlin"]={type:"junit5-kotlin",fileExtension:".kt"};w.spek={type:"spek",fileExtension:".kt"};w["test-more"]={type:"test-more",fileExtension:".pl"};w["test2-suite"]={type:"test2-suite",fileExtension:".pl"};w.xml={type:"xml",fileExtension:".xml"};w.sql={type:"sql",fileExtension:".sql"};w.gherkin={type:"gherkin",fileExtension:".gherkin"};w.html={type:"html",fileExtension:".html"};w.asciitable={type:"asciitable",fileExtension:".txt"};class Vt{parse(t,e){return e?Papa.parse(t,e):Papa.parse(t)}unparse(t,e){return e?Papa.unparse(t,e):Papa.unparse(t)}}function ht(a){let t=String(a).replace(/[^A-Za-z0-9_$]/g,"_");return/^[0-9]/.test(t)&&(t="_"+t),t}function dt(a){return a===""||a===null||a===void 0?!1:!isNaN(a)&&!isNaN(parseFloat(a))}function Ce(a){return a===""||a===null||a===void 0?!1:/^-?\d+$/.test(String(a).trim())}class Z{constructor(){this.delimiterMappings={tab:"	",space:" "},this.options={collectionType:"list",assignToVariable:!0,variableName:"data",quoteNumbers:!1,useAnonymousMaps:!0,objectClassName:"Row",blankValueBehavior:"null",includeImports:!0,prettyPrint:!0,prettyPrintDelimiter:"    "}}mergeOptions(t){const e=t.options!==void 0?t.options:t;this.options={...this.options,...e}}}class $e{constructor(t){this.config=new Z,t&&this.setOptions(t)}setOptions(t){this.config.mergeOptions(t)}_escape(t){let e=String(t).replace(/\\/g,"\\\\");return e=e.replace(/\n/g,"\\n"),e=e.replace(/\r/g,"\\r"),e=e.replace(/\t/g,"\\t"),e=e.replace(/"/g,'\\"'),e}_quote(t){return`"${this._escape(t)}"`}_formatValue(t){const e=this.config.options;return t===""||t===null||t===void 0?e.blankValueBehavior==="null"?"null":this._quote(""):!e.quoteNumbers&&dt(t)?String(Number(t)):this._quote(t)}_indent(t){if(!this.config.options.prettyPrint)return"";let e=this.config.options.prettyPrintDelimiter??"    ";return/^\s+$/.test(String(e))||(e="    "),String(e).repeat(t)}_inferColumnType(t,e){if(this.config.options.quoteNumbers)return"String";let n=!0,i=!0,s=!1,r=!1;for(let o=0;o<e.getRowCount();o++){const p=e.getRow(o)[t];if(p===""||p===null||p===void 0){r=!0;continue}if(s=!0,!dt(p)){i=!1,n=!1;break}Ce(p)||(n=!1)}return!s||!i?"String":r?n?"Integer":"Double":n?"int":"double"}_buildImportLines(t,e){if(!this.config.options.includeImports)return[];const n=[];return t&&n.push("import java.util.Map;"),e&&(n.push("import java.util.List;"),n.push("import java.util.ArrayList;")),n}_buildAnonymousMapRow(t,e,n){const i=this.config.options;if(t.length<=10){const r=[];return t.forEach((o,l)=>{r.push(this._quote(o)),r.push(this._formatValue(e[l]))}),i.prettyPrint?`${n}Map.of(${r.join(", ")})`:`Map.of(${r.join(", ")})`}const s=t.map((r,o)=>`Map.entry(${this._quote(r)}, ${this._formatValue(e[o])})`);if(i.prettyPrint){const r=n+this._indent(1);return`${n}Map.ofEntries(
${s.map(o=>`${r}${o}`).join(`,
`)}
${n})`}return`Map.ofEntries(${s.join(", ")})`}_buildNamedObjectRow(t,e,n,i,s){const r=this.config.options,o=e.map((l,p)=>{const c=i[p];return c===""||c===null||c===void 0?r.blankValueBehavior==="null"?"null":this._quote(""):n[p]!=="String"&&dt(c)?String(Number(c)):this._quote(c)});return r.prettyPrint?`${s}new ${t}(${o.join(", ")})`:`new ${t}(${o.join(", ")})`}_buildClassDefinition(t,e,n){const i="    ",s=[];s.push(`class ${t} {`),e.forEach((o,l)=>{s.push(`${i}${n[l]} ${o};`)}),s.push("");const r=e.map((o,l)=>`${n[l]} ${o}`).join(", ");return s.push(`${i}${t}(${r}) {`),e.forEach(o=>{s.push(`${i}${i}this.${o} = ${o};`)}),s.push(`${i}}`),s.push("}"),s}fromDataTable(t){const e=this.config.options,n=t.getHeaders(),i=n.map(m=>ht(m)),s=new Set,r=i.map(m=>{if(!s.has(m))return s.add(m),m;let f=2,g=`${m}_${f}`;for(;s.has(g);)f++,g=`${m}_${f}`;return s.add(g),g}),o=ht(e.variableName||"data"),l=ht(e.objectClassName||"Row"),p=e.useAnonymousMaps,c=e.collectionType==="list",u=r.map((m,f)=>this._inferColumnType(f,t)),h=[],d=[],b=this._indent(1);for(let m=0;m<t.getRowCount();m++){const f=t.getRow(m);p?d.push(this._buildAnonymousMapRow(n,f,b)):d.push(this._buildNamedObjectRow(l,r,u,f,b))}const y=this._buildImportLines(p,c);if(y.length>0&&h.push(...y,""),p||h.push(...this._buildClassDefinition(l,r,u),""),c){const m=p?"List<Map<String, Object>>":`List<${l}>`,f=e.assignToVariable?`${m} ${o} = `:"";e.prettyPrint?(h.push(`${f}new ArrayList<>(List.of(`),d.length>0&&h.push(d.join(`,
`)),h.push("));")):h.push(`${f}new ArrayList<>(List.of(${d.join(", ")}));`)}else{const m=p?"Map<String, Object>[]":`${l}[]`,f=p?"Map":l,g=e.assignToVariable?`${m} ${o} = `:"";p&&e.assignToVariable&&h.push('@SuppressWarnings("unchecked")'),e.prettyPrint?(h.push(`${g}new ${f}[]{`),d.length>0&&h.push(d.join(`,
`)),h.push("};")):h.push(`${g}new ${f}[]{${d.join(", ")}};`)}return h.join(`
`)}}function U(a){let t=String(a).replace(/[^A-Za-z0-9_]/g,"_");return/^[0-9]/.test(t)&&(t="_"+t),t}function De(a){return a===""||a===null||a===void 0?!1:!isNaN(a)&&!isNaN(parseFloat(a))}function je(a){return a===""||a===null||a===void 0?!1:/^-?\d+\.\d+$/.test(String(a).trim())}function Te(a){return a===""||a===null||a===void 0?!1:/^-?\d+$/.test(String(a).trim())}class Y{constructor(){this.delimiterMappings={tab:"	",space:" "},this.options={collectionType:"list",assignToVariable:!0,variableName:"data",quoteNumbers:!1,useAnonymousDicts:!0,objectClassName:"Row",useDecimalType:!1,decimalColumnsCsv:"",decimalTreatIntegersAsDecimal:!1,blankValueBehavior:"empty-string",quoteStyle:"double",includeImports:!1,importStatements:"",prettyPrint:!0,prettyPrintDelimiter:"    "}}mergeOptions(t){const e=t.options!==void 0?t.options:t;this.options={...this.options,...e}}}class ke{constructor(t){this.config=new Y,this.usedDecimal=!1,t&&this.setOptions(t)}setOptions(t){this.config.mergeOptions(t)}_quoteChar(){return this.config.options.quoteStyle==="single"?"'":'"'}_escapeForQuoteStyle(t){const e=this._quoteChar();let n=String(t).replace(/\\/g,"\\\\");return n=n.replace(/\n/g,"\\n"),n=n.replace(/\r/g,"\\r"),n=n.replace(/\t/g,"\\t"),e==="'"?n=n.replace(/'/g,"\\'"):n=n.replace(/"/g,'\\"'),n}_quote(t){const e=this._quoteChar();return`${e}${this._escapeForQuoteStyle(t)}${e}`}_getDecimalColumnNamesSet(t){const e=String(this.config.options.decimalColumnsCsv||"").split(",").map(i=>i.trim().toLowerCase()).filter(i=>i.length>0);if(e.length===0)return null;const n=new Set(e);return(t||[]).forEach(i=>{const s=String(i||"").trim().toLowerCase(),r=U(i).toLowerCase();s.length>0&&n.has(s)&&n.add(r),r.length>0&&n.has(r)&&n.add(s)}),n}_shouldTreatAsDecimal(t,e){if(!this.config.options.useDecimalType||this.config.options.quoteNumbers)return!1;const n=this.decimalColumnNamesSet;if(n===null)return!0;const i=String(t||"").trim().toLowerCase(),s=String(e||"").trim().toLowerCase();return n.has(i)||n.has(s)}_formatValue(t,e,n){const i=this.config.options;return t===""||t===null||t===void 0?i.blankValueBehavior==="none"?"None":this._quote(""):this._shouldTreatAsDecimal(e,n)&&(je(t)||i.decimalTreatIntegersAsDecimal&&Te(t))?(this.usedDecimal=!0,`Decimal(${this._quote(String(t).trim())})`):!i.quoteNumbers&&De(t)?String(t):this._quote(t)}_buildImportLines(){const t=[],e=String(this.config.options.importStatements||"").split(`
`).map(n=>n.trim()).filter(n=>n.length>0);return this.config.options.includeImports&&e.forEach(n=>t.push(n)),this.usedDecimal&&!t.includes("from decimal import Decimal")&&t.unshift("from decimal import Decimal"),t}_joinRows(t){return this.config.options.prettyPrint?t.join(`,
`):t.join(", ")}_indent(t){if(!this.config.options.prettyPrint)return"";let e=this.config.options.prettyPrintDelimiter??"    ";return/^\s+$/.test(String(e))||(e="    "),String(e).repeat(t)}fromDataTable(t){const e=this.config.options,n=t.getHeaders(),i=n.map(S=>U(S)),s=new Set,r=i.map(S=>{if(!s.has(S))return s.add(S),S;let P=2,T=`${S}_${P}`;for(;s.has(T);)P++,T=`${S}_${P}`;return s.add(T),T}),o=U(e.variableName||"data"),l=U(e.objectClassName||"Row");this.usedDecimal=!1,this.decimalColumnNamesSet=this._getDecimalColumnNamesSet(n);const p=this._quoteChar(),c=[],u=[],h="    ",d="        ";e.useAnonymousDicts||(c.push(`class ${l}:`),c.push(`${h}def __init__(self, ${r.join(", ")}):`),r.forEach(S=>{c.push(`${d}self.${S} = ${S}`)}),c.push(""));const b=e.collectionType==="tuple"?"(":"[",y=e.collectionType==="tuple"?")":"]",m=e.assignToVariable?`${o} = `:"";for(let S=0;S<t.getRowCount();S++){const P=t.getRow(S);if(e.useAnonymousDicts){const T=r.map((M,q)=>`${p}${this._escapeForQuoteStyle(M)}${p}: ${this._formatValue(P[q],n[q],M)}`);e.prettyPrint?u.push(`${this._indent(1)}{${T.join(", ")}}`):u.push(`{${T.join(", ")}}`)}else{const T=r.map((M,q)=>`${M}=${this._formatValue(P[q],n[q],M)}`);e.prettyPrint?u.push(`${this._indent(1)}${l}(${T.join(", ")})`):u.push(`${l}(${T.join(", ")})`)}}const f=this._buildImportLines();if(f.length>0&&c.unshift(...f,""),e.prettyPrint)return c.push(`${m}${b}`),u.length>0&&c.push(`${this._joinRows(u)},`),c.push(`${y}`),c.join(`
`);const g=this._joinRows(u),x=e.collectionType==="tuple"&&u.length===1?`${b}${g},${y}`:`${b}${g}${y}`;return c.push(`${m}${x}`),c.join(`
`)}}function mt(a){let t=String(a).replace(/[^A-Za-z0-9_]/g,"_");return/^[0-9]/.test(t)&&(t="_"+t),t}function Re(a){return a===""||a===null||a===void 0?!1:!isNaN(a)&&!isNaN(parseFloat(a))}class tt{constructor(){this.delimiterMappings={tab:"	",space:" "},this.options={includePhpTag:!1,collectionType:"array",preferShortArraySyntax:!1,assignToVariable:!0,variableName:"data",quoteNumbers:!1,objectRepresentation:"array",objectClassName:"Row",arrayKeyQuoteStyle:"quoted",blankValueBehavior:"empty-string",coerceBooleanLiterals:!1,coerceNullLiteral:!1,phpCompatibility:"8+",classPropertyTyping:"none",useConstructorPromotion:!1,constructorArgStyle:"positional",prettyPrint:!0,prettyPrintDelimiter:"    "}}mergeOptions(t){const e=t.options!==void 0?t.options:t;this.options={...this.options,...e}}}class Ne{constructor(t){this.config=new tt,t&&this.setOptions(t)}setOptions(t){this.config.mergeOptions(t)}_quote(t){let e=String(t).replace(/\\/g,"\\\\");return e=e.replace(/'/g,"\\'"),e=e.replace(/\n/g,"\\n"),e=e.replace(/\r/g,"\\r"),e=e.replace(/\t/g,"\\t"),`'${e}'`}_formatValue(t){if(t===""||t===null||t===void 0)return this.config.options.blankValueBehavior==="null"?"null":this._quote("");const e=String(t).trim();if(this.config.options.coerceNullLiteral&&e.toLowerCase()==="null")return"null";if(this.config.options.coerceBooleanLiterals){if(e.toLowerCase()==="true")return"true";if(e.toLowerCase()==="false")return"false"}return!this.config.options.quoteNumbers&&Re(t)?String(t):this._quote(t)}_indent(t){if(!this.config.options.prettyPrint)return"";const e=this.config.options.prettyPrintDelimiter??"    ";return String(e).repeat(t)}_buildAssocArrayPairs(t,e){return t.map((n,i)=>{const s=String(n),r=/^-?(?:\d+\.?\d*|\.\d+)$/.test(s);return`${this.config.options.arrayKeyQuoteStyle==="unquoted"&&r?s:this._quote(s)} => ${this._formatValue(e[i])}`})}_buildAnonymousRow(t,e){const n=this._buildAssocArrayPairs(t,e),i=this.config.options.preferShortArraySyntax||this.config.options.collectionType==="list";return this.config.options.prettyPrint?i?`${this._indent(1)}[${n.join(", ")}]`:`${this._indent(1)}array(${n.join(", ")})`:i?`[${n.join(", ")}]`:`array(${n.join(", ")})`}_buildStdClassRow(t,e){const n=this._buildAssocArrayPairs(t,e),s=this.config.options.preferShortArraySyntax||this.config.options.collectionType==="list"?`[${n.join(", ")}]`:`array(${n.join(", ")})`;return this.config.options.prettyPrint?`${this._indent(1)}(object)${s}`:`(object)${s}`}_buildObjectRow(t,e){return this.config.options.prettyPrint?`${this._indent(1)}new ${e}(${t.join(", ")})`:`new ${e}(${t.join(", ")})`}_buildClassDefinition(t,e){const n=[];n.push(`class ${e} {`);const s=this.config.options.classPropertyTyping==="typed"&&this.config.options.phpCompatibility==="8+",r=this.config.options.useConstructorPromotion&&this.config.options.phpCompatibility==="8+",o=t.map(l=>r?s?`public mixed $${l}`:`public $${l}`:`$${l}`).join(", ");return r||(t.forEach(l=>{const p=s?"public mixed":"public";n.push(`${this._indent(1)}${p} $${l};`)}),n.push("")),n.push(`${this._indent(1)}public function __construct(${o}) {`),r||t.forEach(l=>{n.push(`${this._indent(2)}$this->${l} = $${l};`)}),n.push(`${this._indent(1)}}`),n.push("}"),n.push(""),n}fromDataTable(t){const e=this.config.options,i=t.getHeaders().map(m=>{const f=mt(m);return f===""?"field":f}),s=new Set,r=i.map(m=>{if(!s.has(m))return s.add(m),m;let f=2,g=`${m}_${f}`;for(;s.has(g);)f++,g=`${m}_${f}`;return s.add(g),g}),o=mt(e.variableName||"data"),l=mt(e.objectClassName||"Row"),p=e.assignToVariable?`$${o} = `:"",c=e.preferShortArraySyntax||e.collectionType==="list",u=[];for(let m=0;m<t.getRowCount();m++){const f=t.getRow(m);if(e.objectRepresentation==="array"||e.objectRepresentation===void 0&&e.useAnonymousObjects)u.push(this._buildAnonymousRow(r,f));else if(e.objectRepresentation==="stdclass")u.push(this._buildStdClassRow(r,f));else{const g=e.constructorArgStyle==="named"&&e.phpCompatibility==="8+"?r.map((x,S)=>`${x}: ${this._formatValue(f[S])}`):r.map((x,S)=>`${this._formatValue(f[S])}`);u.push(this._buildObjectRow(g,l))}}const h=c?"[":"array(",d=c?"]":")",b=[];if(e.includePhpTag&&b.push("<?php",""),(e.objectRepresentation==="class"||!e.objectRepresentation&&e.useAnonymousObjects===!1)&&b.push(...this._buildClassDefinition(r,l)),e.prettyPrint)return b.push(`${p}${h}`),u.length>0&&b.push(`${u.join(`,
`)},`),b.push(`${d};`),b.join(`
`);const y=u.join(", ");return b.push(`${p}${h}${y}${d};`),b.join(`
`)}}function J(a){let t=String(a).replace(/[^A-Za-z0-9_]/g,"_");return/^[0-9]/.test(t)&&(t="_"+t),t}function It(a){return String(a).replace(/([a-z0-9])([A-Z])/g,"$1_$2").replace(/[^A-Za-z0-9_]/g,"_").replace(/_+/g,"_").replace(/^_+|_+$/g,"").toLowerCase()}function Pe(a){return a===""||a===null||a===void 0?!1:!isNaN(a)&&!isNaN(parseFloat(a))}class et{constructor(){this.delimiterMappings={tab:"	",space:" "},this.options={collectionType:"array",assignToVariable:!0,variableName:"data",outputWrapper:"plain",quoteNumbers:!1,hashKeyStyle:"string",useAnonymousObjects:!0,objectClassName:"Row",objectRepresentation:"class",fieldNameStyle:"preserve",prettyPrint:!0,prettyPrintDelimiter:"  ",hashPrettyStyle:"compact"}}mergeOptions(t){const e=t.options!==void 0?t.options:t;this.options={...this.options,...e}}}class Ae{constructor(t){this.config=new et,t&&this.setOptions(t)}setOptions(t){this.config.mergeOptions(t)}_quote(t){let e=String(t).replace(/\\/g,"\\\\");return e=e.replace(/'/g,"\\'"),e=e.replace(/\n/g,"\\n"),e=e.replace(/\r/g,"\\r"),e=e.replace(/\t/g,"\\t"),`'${e}'`}_formatValue(t){return t===""||t===null||t===void 0?this._quote(""):!this.config.options.quoteNumbers&&Pe(t)?String(t):this._quote(t)}_indent(t){if(!this.config.options.prettyPrint)return"";const e=this.config.options.prettyPrintDelimiter??"  ";return String(e).repeat(t)}_buildHashPairs(t,e){return t.map((n,i)=>this.config.options.hashKeyStyle==="symbol"?`${n}: ${this._formatValue(e[i])}`:`${this._quote(n)} => ${this._formatValue(e[i])}`)}_buildAnonymousRow(t,e){const n=this._buildHashPairs(t,e),s=this.config.options.hashPrettyStyle==="aligned"&&this.config.options.prettyPrint?`{
${this._indent(2)}${n.join(`,
${this._indent(2)}`)},
${this._indent(1)}}`:`{ ${n.join(", ")} }`;return this.config.options.prettyPrint?`${this._indent(1)}${s}`:s}_buildObjectRow(t,e,n){const i=t.map((s,r)=>`${s}: ${this._formatValue(e[r])}`);return this.config.options.prettyPrint?`${this._indent(1)}${n}.new(${i.join(", ")})`:`${n}.new(${i.join(", ")})`}_buildStructRow(t,e,n){const i=t.map((s,r)=>`${s}: ${this._formatValue(e[r])}`);return this.config.options.prettyPrint?`${this._indent(1)}${n}.new(${i.join(", ")})`:`${n}.new(${i.join(", ")})`}_buildClassDefinition(t,e){const n=[];return n.push(`class ${e}`),n.push(`${this._indent(1)}attr_accessor ${t.map(i=>`:${i}`).join(", ")}`),n.push(""),n.push(`${this._indent(1)}def initialize(${t.map(i=>`${i}:`).join(", ")})`),t.forEach(i=>{n.push(`${this._indent(2)}@${i} = ${i}`)}),n.push(`${this._indent(1)}end`),n.push("end"),n.push(""),n}_buildStructDefinition(t,e){const n=this.config.options.objectRepresentation==="data"?"define":"new",i=this.config.options.objectRepresentation==="data"?"Data":"Struct";return[`${e} = ${i}.${n}(${t.map(s=>`:${s}`).join(", ")})`,""]}_dedupeHeaders(t){const e=new Set;return t.map(n=>{if(!e.has(n))return e.add(n),n;let i=2,s=`${n}_${i}`;for(;e.has(s);)i++,s=`${n}_${i}`;return e.add(s),s})}fromDataTable(t){const e=this.config.options,n=t.getHeaders(),i=n.map(y=>{const m=e.fieldNameStyle==="snake_case"?It(y):String(y);return J(m)}),s=this._dedupeHeaders(i),r=this._dedupeHeaders(n.map(y=>J(It(y)))),o=J(e.variableName||"data"),l=J(e.objectClassName||"Row"),p=[];for(let y=0;y<t.getRowCount();y++){const m=t.getRow(y);e.useAnonymousObjects?p.push(this._buildAnonymousRow(s,m)):e.objectRepresentation==="struct"||e.objectRepresentation==="data"?p.push(this._buildStructRow(r,m,l)):p.push(this._buildObjectRow(r,m,l))}const c=e.collectionType==="list"?"Array[":"[",u="]",h=this.config.options.prettyPrint?p.join(`,
`):p.join(", "),d=[];!e.useAnonymousObjects&&e.objectRepresentation==="class"?d.push(...this._buildClassDefinition(r,l)):!e.useAnonymousObjects&&(e.objectRepresentation==="struct"||e.objectRepresentation==="data")&&d.push(...this._buildStructDefinition(r,l));const b=e.outputWrapper==="rspec-let"?`let(:${o}) do`:e.assignToVariable?`${o} = `:"";return e.prettyPrint?(e.outputWrapper==="rspec-let"?(d.push(b),d.push(`${this._indent(1)}${c}`)):d.push(`${b}${c}`),p.length>0&&d.push(`${e.outputWrapper==="rspec-let"?this._indent(1):""}${h},`),d.push(`${e.outputWrapper==="rspec-let"?this._indent(1):""}${u}`),e.outputWrapper==="rspec-let"&&d.push("end"),d.join(`
`)):(e.outputWrapper==="rspec-let"?d.push(`let(:${o}) do ${c}${h}${u} end`):d.push(`${b}${c}${h}${u}`),d.join(`
`))}}function Mt(a){let t=String(a).replace(/[^A-Za-z0-9_]/g,"_");return/^[0-9]/.test(t)&&(t="_"+t),t}function Fe(a){const t=String(a).replace(/[^A-Za-z0-9]+/g," ").trim().split(/\s+/).filter(n=>n.length>0);if(t.length===0)return"Row";const e=t.map(n=>n.charAt(0).toUpperCase()+n.slice(1)).join("");return/^[0-9]/.test(e)?`Row${e}`:e}const _e=new Set(["as","break","class","continue","do","else","false","for","fun","if","in","interface","is","null","object","package","return","super","this","throw","true","try","typealias","val","var","when","while"]);function ft(a){return _e.has(a)?`\`${a}\``:a}function Ee(a){return a===""||a===null||a===void 0?!1:!isNaN(a)&&!isNaN(parseFloat(a))}class nt{constructor(){this.delimiterMappings={tab:"	",space:" "},this.options={collectionType:"list",assignToVariable:!0,mutableAssignment:!1,variableName:"data",quoteNumbers:!1,useAnonymousObjects:!0,objectClassName:"Row",useMutableCollections:!1,prettyPrint:!0,prettyPrintDelimiter:"    ",trailingComma:!0}}mergeOptions(t){const e=t.options!==void 0?t.options:t;this.options={...this.options,...e}}}class Oe{constructor(t){this.config=new nt,t&&this.setOptions(t)}setOptions(t){this.config.mergeOptions(t)}_quote(t){let e=String(t).replace(/\\/g,"\\\\");return e=e.replace(/"/g,'\\"'),e=e.replace(/\n/g,"\\n"),e=e.replace(/\r/g,"\\r"),e=e.replace(/\t/g,"\\t"),`"${e}"`}_formatValue(t){return t===""||t===null||t===void 0?this._quote(""):!this.config.options.quoteNumbers&&Ee(t)?String(t):this._quote(t)}_indent(t){if(!this.config.options.prettyPrint)return"";const e=this.config.options.prettyPrintDelimiter??"    ";return String(e).repeat(t)}_buildMapPairs(t,e){return t.map((n,i)=>`${this._quote(n)} to ${this._formatValue(e[i])}`)}_buildAnonymousRow(t,e){const n=this._buildMapPairs(t,e),i=this.config.options.useMutableCollections?"mutableMapOf":"mapOf";return this.config.options.prettyPrint?`${this._indent(1)}${i}(${n.join(", ")})`:`${i}(${n.join(", ")})`}_buildObjectRow(t,e,n){const i=t.map((s,r)=>`${ft(s)} = ${this._formatValue(e[r])}`);return this.config.options.prettyPrint?`${this._indent(1)}${n}(${i.join(", ")})`:`${n}(${i.join(", ")})`}_buildClassDefinition(t,e){return[`data class ${e}(${t.map(n=>`val ${ft(n)}: Any`).join(", ")})`,""]}fromDataTable(t){const e=this.config.options,i=t.getHeaders().map(y=>Mt(y)),s=new Set,r=i.map(y=>{if(!s.has(y))return s.add(y),y;let m=2,f=`${y}_${m}`;for(;s.has(f);)m++,f=`${y}_${m}`;return s.add(f),f}),o=Mt(e.variableName||"data"),l=Fe(e.objectClassName||"Row"),p=[];for(let y=0;y<t.getRowCount();y++){const m=t.getRow(y);e.useAnonymousObjects?p.push(this._buildAnonymousRow(r,m)):p.push(this._buildObjectRow(r,m,l))}const c=e.collectionType==="array"?"arrayOf(":e.useMutableCollections?"mutableListOf(":"listOf(",u=")",h=e.mutableAssignment?"var":"val",d=e.assignToVariable?`${h} ${ft(o)} = `:"",b=[];if(e.useAnonymousObjects||b.push(...this._buildClassDefinition(r,l)),e.prettyPrint){if(b.push(`${d}${c}`),p.length>0){const y=e.trailingComma?",":"";b.push(`${p.join(`,
`)}${y}`)}return b.push(u),b.join(`
`)}return b.push(`${d}${c}${p.join(", ")}${u}`),b.join(`
`)}}function qt(a){let t=String(a).replace(/[^A-Za-z0-9_]/g,"_");return/^[0-9]/.test(t)&&(t="_"+t),t}const Ve=new Set(["abstract","as","base","bool","break","byte","case","catch","char","checked","class","const","continue","decimal","default","delegate","do","double","else","enum","event","explicit","extern","false","finally","fixed","float","for","foreach","goto","if","implicit","in","int","interface","internal","is","lock","long","namespace","new","null","object","operator","out","override","params","private","protected","public","readonly","ref","return","sbyte","sealed","short","sizeof","stackalloc","static","string","struct","switch","this","throw","true","try","typeof","uint","ulong","unchecked","unsafe","ushort","using","virtual","void","volatile","while"]);function gt(a){return Ve.has(a)?`@${a}`:a}function Lt(a){const t=String(a).replace(/[^A-Za-z0-9]+/g," ").trim().split(/\s+/).filter(n=>n.length>0);if(t.length===0)return"Row";const e=t.map(n=>n.charAt(0).toUpperCase()+n.slice(1)).join("");return/^[0-9]/.test(e)?`Row${e}`:e}function Ie(a){return a===""||a===null||a===void 0?!1:!isNaN(a)&&!isNaN(parseFloat(a))}class it{constructor(){this.delimiterMappings={tab:"	",space:" "},this.options={collectionType:"list",collectionTargetType:"",assignToVariable:!0,variableName:"data",quoteNumbers:!1,dictionaryValueType:"auto",useAnonymousObjects:!0,objectClassName:"Row",prettyPrint:!0,prettyPrintDelimiter:"    "}}mergeOptions(t){const e=t.options!==void 0?t.options:t;this.options={...this.options,...e}}}class Me{constructor(t){this.config=new it,t&&this.setOptions(t)}setOptions(t){this.config.mergeOptions(t)}_quote(t){let e=String(t).replace(/\\/g,"\\\\");return e=e.replace(/"/g,'\\"'),e=e.replace(/\n/g,"\\n"),e=e.replace(/\r/g,"\\r"),e=e.replace(/\t/g,"\\t"),`"${e}"`}_formatValue(t,e=!1){return t===""||t===null||t===void 0?this._quote(""):!e&&!this.config.options.quoteNumbers&&Ie(t)?String(t):this._quote(t)}_indent(t){if(!this.config.options.prettyPrint)return"";const e=this.config.options.prettyPrintDelimiter??"    ";return String(e).repeat(t)}_buildAnonymousRow(t,e){const n=this.config.options.dictionaryValueType||"auto",i=n==="string"?"string":n==="object"?"object":this.config.options.quoteNumbers?"string":"object",s=i==="string",r=t.map((o,l)=>`{ ${this._quote(o)}, ${this._formatValue(e[l],s)} }`);return this.config.options.prettyPrint?`${this._indent(1)}new Dictionary<string, ${i}> { ${r.join(", ")} }`:`new Dictionary<string, ${i}> { ${r.join(", ")} }`}_buildObjectRow(t,e,n){const i=t.map((s,r)=>`${s} = ${this._formatValue(e[r])}`);return this.config.options.prettyPrint?`${this._indent(1)}new ${n} { ${i.join(", ")} }`:`new ${n} { ${i.join(", ")} }`}_buildClassDefinition(t,e){const n=[`public class ${e}`,"{"];return t.forEach(i=>{n.push(`${this._indent(1)}public object ${i} { get; set; }`)}),n.push("}"),n.push(""),n}fromDataTable(t){const e=this.config.options,i=t.getHeaders().map(f=>qt(f)),s=new Set,r=i.map(f=>{if(!s.has(f))return s.add(f),f;let g=2,x=`${f}_${g}`;for(;s.has(x);)g++,x=`${f}_${g}`;return s.add(x),x}),o=gt(qt(e.variableName||"data")),l=gt(Lt(e.objectClassName||"Row")),p=[],c=new Set;r.forEach(f=>{const g=gt(Lt(f));if(!c.has(g)){c.add(g),p.push(g);return}const x=g.startsWith("@")?"@":"",S=x?g.slice(1):g;let P=2,T=`${x}${S}_${P}`;for(;c.has(T);)P++,T=`${x}${S}_${P}`;c.add(T),p.push(T)});const u=[];for(let f=0;f<t.getRowCount();f++){const g=t.getRow(f);e.useAnonymousObjects?u.push(this._buildAnonymousRow(r,g)):u.push(this._buildObjectRow(p,g,l))}const h=e.collectionTargetType||(e.collectionType==="array"?"array":"list"),d=h==="array"?"new[] {":"new List<object> {",b="}";let y="";e.assignToVariable&&(h==="ireadonlylist"?y=`IReadOnlyList<object> ${o} = `:h==="ienumerable"?y=`IEnumerable<object> ${o} = `:y=`var ${o} = `);const m=[];return e.useAnonymousObjects||m.push(...this._buildClassDefinition(p,l)),e.prettyPrint?(m.push(`${y}${d}`),u.length>0&&m.push(`${u.join(`,
`)},`),m.push(b+";"),m.join(`
`)):(m.push(`${y}${d} ${u.join(", ")} ${b};`),m.join(`
`))}}function bt(a){let t=String(a).replace(/[^A-Za-z0-9_]/g,"_");return/^[0-9]/.test(t)&&(t="_"+t),t}function qe(a){return a===""||a===null||a===void 0?!1:!isNaN(a)&&!isNaN(parseFloat(a))}class at{constructor(){this.delimiterMappings={tab:"	",space:" "},this.options={collectionType:"array",assignToVariable:!0,variableName:"data",quoteNumbers:!1,hashKeyStyle:"quoted",useAnonymousObjects:!0,objectClassName:"Row",objectInstantiationStyle:"bless",prettyPrint:!0,prettyPrintDelimiter:"  "}}mergeOptions(t){const e=t.options!==void 0?t.options:t;this.options={...this.options,...e}}}class Le{constructor(t){this.config=new at,t&&this.setOptions(t)}setOptions(t){this.config.mergeOptions(t)}_quote(t){let e=String(t).replace(/\\/g,"\\\\");return e=e.replace(/'/g,"\\'"),e=e.replace(/\n/g,"\\n"),e=e.replace(/\r/g,"\\r"),e=e.replace(/\t/g,"\\t"),`'${e}'`}_formatValue(t){return t===""||t===null||t===void 0?this._quote(""):!this.config.options.quoteNumbers&&qe(t)?String(t):this._quote(t)}_indent(t){if(!this.config.options.prettyPrint)return"";const e=this.config.options.prettyPrintDelimiter??"  ";return String(e).repeat(t)}_buildAnonymousRow(t,e){const n=t.map((i,s)=>`${this._formatHashKey(i)} => ${this._formatValue(e[s])}`);return this.config.options.prettyPrint?`${this._indent(1)}{ ${n.join(", ")} }`:`{ ${n.join(", ")} }`}_buildObjectRow(t,e,n){const i=t.map((s,r)=>`${s} => ${this._formatValue(e[r])}`);return this.config.options.objectInstantiationStyle==="constructor"?this.config.options.prettyPrint?`${this._indent(1)}${n}->new({ ${i.join(", ")} })`:`${n}->new({ ${i.join(", ")} })`:this.config.options.prettyPrint?`${this._indent(1)}bless({ ${i.join(", ")} }, '${n}')`:`bless({ ${i.join(", ")} }, '${n}')`}_formatHashKey(t){return this.config.options.hashKeyStyle==="bareword"?t:this._quote(t)}fromDataTable(t){const e=this.config.options,n=t.getHeaders(),i=n.map(f=>bt(f)),s=new Set,r=i.map(f=>{if(!s.has(f))return s.add(f),f;let g=2,x=`${f}_${g}`;for(;s.has(x);)g++,x=`${f}_${g}`;return s.add(x),x}),o=bt(e.variableName||"data"),l=bt(e.objectClassName||"Row"),p=e.collectionType==="list"?"@":"$",c=e.hashKeyStyle==="bareword"?r:n,u=[];for(let f=0;f<t.getRowCount();f++){const g=t.getRow(f);e.useAnonymousObjects?u.push(this._buildAnonymousRow(c,g)):u.push(this._buildObjectRow(r,g,l))}const h=e.collectionType==="array"?"[":"(",d=e.collectionType==="array"?"]":")",b=e.assignToVariable?`my ${p}${o} = ${h}`:h,y=";",m=[];return e.prettyPrint?(m.push(b),u.length>0&&m.push(`${u.join(`,
`)},`),m.push(`${d}${y}`),m.join(`
`)):(m.push(`${b}${u.join(", ")}${d}${y}`),m.join(`
`))}}function yt(a){let t=String(a).replace(/[^A-Za-z0-9_$]/g,"_");return/^[0-9]/.test(t)&&(t="_"+t),t}function wt(a){return a===""||a===null||a===void 0?!1:!isNaN(a)&&!isNaN(parseFloat(a))}class st{constructor(){this.delimiterMappings={tab:"	",space:" "},this.options={collectionType:"list",assignToVariable:!0,variableName:"data",quoteNumbers:!1,useAnonymousObjects:!0,objectClassName:"Row",blankValueBehavior:"null",prettyPrint:!0,prettyPrintDelimiter:"    "}}mergeOptions(t){const e=t.options!==void 0?t.options:t;this.options={...this.options,...e}}}class Be{constructor(t){this.config=new st,t&&this.setOptions(t)}setOptions(t){this.config.mergeOptions(t)}_escape(t){let e=String(t).replace(/\\/g,"\\\\");return e=e.replace(/\n/g,"\\n"),e=e.replace(/\r/g,"\\r"),e=e.replace(/\t/g,"\\t"),e=e.replace(/"/g,'\\"'),e}_quote(t){return`"${this._escape(t)}"`}_formatValue(t){const e=this.config.options;return t===""||t===null||t===void 0?e.blankValueBehavior==="null"?"null":this._quote(""):!e.quoteNumbers&&wt(t)?String(Number(t)):this._quote(t)}_indent(t){if(!this.config.options.prettyPrint)return"";let e=this.config.options.prettyPrintDelimiter??"    ";return/^\s+$/.test(String(e))||(e="    "),String(e).repeat(t)}_inferColumnType(t,e){const n=this.config.options;let i=!0,s=!1,r=!1;for(let l=0;l<e.getRowCount();l++){const c=e.getRow(l)[t];if(c===""||c===null||c===void 0){r=!0;continue}if(s=!0,!wt(c)){i=!1;break}}const o=n.blankValueBehavior==="null"&&r;return n.quoteNumbers||!s?o?"string | null":"string":i?o?"number | null":"number":o?"string | null":"string"}_buildAnonymousObjectRow(t,e,n){const i=this.config.options,s=t.map((r,o)=>`${this._quote(r)}: ${this._formatValue(e[o])}`);return i.prettyPrint?`${n}{${s.join(", ")}}`:`{${s.join(", ")}}`}_buildNamedObjectRow(t,e,n,i,s){const r=e.map((o,l)=>{const p=i[l];return p===""||p===null||p===void 0?this.config.options.blankValueBehavior==="null"?"null":this._quote(""):n[l].includes("number")&&wt(p)?String(Number(p)):this._quote(p)});return this.config.options.prettyPrint?`${s}new ${t}(${r.join(", ")})`:`new ${t}(${r.join(", ")})`}_buildClassDefinition(t,e,n){const i=[];i.push(`class ${t} {`),e.forEach((r,o)=>{i.push(`    ${r}: ${n[o]};`)}),i.push("");const s=e.map((r,o)=>`${r}: ${n[o]}`).join(", ");return i.push(`    constructor(${s}) {`),e.forEach(r=>{i.push(`        this.${r} = ${r};`)}),i.push("    }"),i.push("}"),i}fromDataTable(t){const e=this.config.options,n=t.getHeaders(),i=n.map(g=>yt(g)),s=new Set,r=i.map(g=>{if(!s.has(g))return s.add(g),g;let x=2,S=`${g}_${x}`;for(;s.has(S);)x++,S=`${g}_${x}`;return s.add(S),S}),o=yt(e.variableName||"data"),l=yt(e.objectClassName||"Row"),p=e.useAnonymousObjects,c=e.collectionType==="list",u=[],h=[],d=this._indent(1),b=r.map((g,x)=>this._inferColumnType(x,t));for(let g=0;g<t.getRowCount();g++){const x=t.getRow(g);p?h.push(this._buildAnonymousObjectRow(n,x,d)):h.push(this._buildNamedObjectRow(l,r,b,x,d))}p||u.push(...this._buildClassDefinition(l,r,b),"");const y=p?"Record<string, unknown>":l,m=c?`Array<${y}>`:`${y}[]`,f=e.assignToVariable?`const ${o}: ${m} = `:"";return e.prettyPrint?(u.push(`${f}[`),h.length>0&&u.push(h.join(`,
`)),u.push("];"),u.join(`
`)):(u.push(`${f}[${h.join(", ")}];`),u.join(`
`))}}class C{constructor(){this.options={suiteName:"GeneratedDataTests",testNamePrefix:"row",includeSetup:!0,prettyPrint:!0,dataSourceStrategy:"provider"}}mergeOptions(t){if(t!=null&&t.options){this.options={...this.options,...t.options};return}this.options={...this.options,...t||{}}}}function He(a,t){const e={};return a.forEach((n,i)=>{e[n]=t[i]}),e}function ne(a){return JSON.stringify(a)}const Ge=new Set(["class","def","function","return","import","package","public","private","protected","internal","static","void","new","null","true","false","object","string","int","double","var","val","when","is","in","and","as","assert","async","await","break","continue","del","elif","else","except","finally","for","from","global","if","lambda","nonlocal","not","or","pass","raise","try","while","with","yield","const","let","default","switch","module","end","elsif","unless","my"]);function O(a,t="value"){const n=(a==null?"":String(a)).replace(/[^A-Za-z0-9_]/g,"_").replace(/_+/g,"_");if(!n)return t;const s=(/^[A-Za-z_]/.test(n)?n:`_${n}`)||t;return Ge.has(s.toLowerCase())?`${s}_value`:s}function ze(a,t="value"){const e=new Map;return a.map(n=>{const i=O(n,t),s=e.get(i)||0;return e.set(i,s+1),s===0?i:`${i}_${s+1}`})}function L(a){return String(a).replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/\r/g,"\\r").replace(/\n/g,"\\n")}function We(a){return String(a).replace(/\\/g,"\\\\").replace(/`/g,"\\`").replace(/\$\{/g,"\\${").replace(/\r/g,"\\r").replace(/\n/g,"\\n")}function B(a){return String(a).replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/\r/g,"\\r").replace(/\n/g,"\\n")}function Bt(a){return String(a).replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/\r/g,"\\r").replace(/\n/g,"\\n")}function Ue(a){return String(a).replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/\r/g,"\\r").replace(/\n/g,"\\n")}function rt(a){return String(a).replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\r/g,"\\r").replace(/\n/g,"\\n")}function ie(a){try{return JSON.stringify(a)}catch{return String(a)}}function G(a){return a===null?"null":typeof a=="string"?JSON.stringify(String(a)):typeof a=="boolean"?a?"true":"false":typeof a=="number"?String(a):JSON.stringify(ie(a))}function Ht(a){return`"${String(a).replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/\t/g,"\\t")}"`}function ot(a){return a===null?"null":typeof a=="string"?Ht(a):typeof a=="boolean"?a?"true":"false":typeof a=="number"?String(a):Ht(ie(a))}function Je(a,t){return(a==="junit5"||a==="junit6")&&t==="csv"?"inline":t}function I(a){return a===null?"null":typeof a=="string"?JSON.stringify(String(a)):typeof a=="number"||typeof a=="boolean"?String(a):Array.isArray(a)?`listOf(${a.map(t=>I(t)).join(", ")})`:typeof a=="object"?`mapOf(${Object.entries(a).map(([t,e])=>`${JSON.stringify(String(t))} to ${I(e)}`).join(", ")})`:"null"}function z(a){return a===null?"None":typeof a=="string"?JSON.stringify(a):typeof a=="boolean"?a?"True":"False":typeof a=="number"?String(a):Array.isArray(a)?`[${a.map(t=>z(t)).join(", ")}]`:typeof a=="object"?`{${Object.entries(a).map(([t,e])=>`${JSON.stringify(t)}: ${z(e)}`).join(", ")}}`:JSON.stringify(a)}function lt(a){return a===null?"nil":typeof a=="string"?JSON.stringify(a):typeof a=="number"||typeof a=="boolean"?String(a):Array.isArray(a)?`[${a.map(t=>lt(t)).join(", ")}]`:typeof a=="object"?`{ ${Object.entries(a).map(([t,e])=>`${JSON.stringify(String(t))} => ${lt(e)}`).join(", ")} }`:JSON.stringify(a)}function $t(a){return a===null?"undef":typeof a=="string"?`'${String(a).replace(/\\/g,"\\\\").replace(/'/g,"\\'")}'`:typeof a=="number"?String(a):typeof a=="boolean"?a?"1":"0":Array.isArray(a)?`[${a.map(t=>$t(t)).join(", ")}]`:typeof a=="object"?`{${Object.entries(a).map(([t,e])=>`'${String(t).replace(/\\/g,"\\\\").replace(/'/g,"\\'")}' => ${$t(e)}`).join(", ")}}`:"undef"}function pt(a){return a===null?"null":typeof a=="string"?`'${String(a).replace(/\\/g,"\\\\").replace(/'/g,"\\'")}'`:typeof a=="number"||typeof a=="boolean"?String(a):Array.isArray(a)?`[${a.map(t=>pt(t)).join(", ")}]`:typeof a=="object"?`[${Object.entries(a).map(([t,e])=>`'${String(t).replace(/\\/g,"\\\\").replace(/'/g,"\\'")}' => ${pt(e)}`).join(", ")}]`:"null"}function Ke(a,t){const e=a.getHeaders(),n=[];for(let i=0;i<a.getRowCount();i+=1)n.push(He(e,a.getRow(i)));return{schemaVersion:"1.0",suiteName:t.suiteName,testNamePrefix:t.testNamePrefix,safeSuiteName:O(t.suiteName,"GeneratedDataTests"),safeTestNamePrefix:O(t.testNamePrefix,"row"),safePythonRowIdentifier:O(t.testNamePrefix,"row"),includeSetup:t.includeSetup,prettyPrint:t.prettyPrint,dataSourceStrategy:t.dataSourceStrategy,headers:e,rows:n}}function N(a,t,e,n=""){if(!e)return`[${a.map(s=>t(s)).join(", ")}]`;const i=`${n}  `;return`[
${a.map(s=>`${i}${t(s)}`).join(`,
`)}
${n}]`}function Qe(a){const t=(s,r)=>`        assertEquals(expected[${s}], actual[${s}]); // ${r}`;if(a.dataSourceStrategy!=="provider"){const s=a.rows.map(l=>`            new Object[] { ${Object.values(l).map(p=>G(p)).join(", ")} }`),r=a.includeSetup?["    @Before","    public void setUp() {","        // setup","    }",""]:[];return["import static org.junit.Assert.assertEquals;",...a.includeSetup?["import org.junit.Before;"]:[],"import org.junit.experimental.theories.DataPoints;","import org.junit.experimental.theories.FromDataPoints;","import org.junit.experimental.theories.Theories;","import org.junit.experimental.theories.Theory;","import org.junit.runner.RunWith;","","@RunWith(Theories.class)",`public class ${a.safeSuiteName} {`,'    @DataPoints("rows")',"    public static Object[][] rows = new Object[][] {",s.join(`,
`),"    };","","    private Object[] mapRowUnderTest(Object[] input) {","        // Example: return PersonMapper.normalize(input);","        return input; // replace with your system-under-test call","    }","",...r,"    @Theory",`    public void ${a.safeTestNamePrefix}_parameterized(@FromDataPoints("rows") Object[] row) {`,"        Object[] expected = row;","        Object[] actual = mapRowUnderTest(row);",a.headers.map((l,p)=>t(p,l)).join(`
`),"    }","}"].join(`
`)}const e=a.rows.map(s=>`            new Object[] { ${Object.values(s).map(r=>G(r)).join(", ")} }`),n=a.includeSetup?["    @Before","    public void setUp() {","        // setup","    }",""]:[];return["import static org.junit.Assert.assertEquals;","import java.util.Arrays;","import java.util.Collection;",...a.includeSetup?["import org.junit.Before;"]:[],"import org.junit.Test;","import org.junit.runner.RunWith;","import org.junit.runners.Parameterized;","","@RunWith(Parameterized.class)",`public class ${a.safeSuiteName} {`,'    @Parameterized.Parameters(name = "{index}")',"    public static Collection<Object[]> data() {","        return Arrays.asList(",e.join(`,
`),"        );","    }","","    private final Object[] row;","",`    public ${a.safeSuiteName}(Object... row) {`,"        this.row = row;","    }","","    private Object[] mapRowUnderTest(Object[] input) {","        // Example: return PersonMapper.normalize(input);","        return input; // replace with your system-under-test call","    }","",...n,"    @Test",`    public void ${a.safeTestNamePrefix}_parameterized() {`,"        Object[] expected = row;","        Object[] actual = mapRowUnderTest(row);",a.headers.map((s,r)=>t(r,s)).join(`
`),"    }","}"].join(`
`)}function Gt(a){const t=(s,r)=>`        assertEquals(expected[${s}], actual[${s}]); // ${r}`;if(a.dataSourceStrategy==="inline"){const s=a.rows.map(l=>Object.values(l).map(p=>typeof p=="string"?`"${String(p).replace(/\\/g,"\\\\").replace(/"/g,'\\"')}"`:String(p)).join(", ")),r=a.includeSetup?["    @BeforeEach","    void setUp() {","        // setup","    }",""]:[];return["import static org.junit.jupiter.api.Assertions.assertEquals;",...a.includeSetup?["import org.junit.jupiter.api.BeforeEach;"]:[],"import org.junit.jupiter.params.ParameterizedTest;","import org.junit.jupiter.params.provider.CsvSource;","",`public class ${a.safeSuiteName} {`,...r,"    @ParameterizedTest","    @CsvSource(value = {",...s.map(l=>`        ${JSON.stringify(l)},`),`    }, quoteCharacter = '"')`,`    void ${a.safeTestNamePrefix}_parameterized(Object... row) {`,"        Object[] expected = row;","        Object[] actual = mapRowUnderTest(row);",a.headers.map((l,p)=>t(p,l)).join(`
`),"    }","","    private Object[] mapRowUnderTest(Object[] input) {","        // Example: return PersonMapper.normalize(input);","        return input; // replace with your system-under-test call","    }","}"].join(`
`)}const e=a.rows.map(s=>`            Arguments.of(${Object.values(s).map(r=>G(r)).join(", ")})`),n=a.includeSetup?["    @BeforeEach","    void setUp() {","        // setup","    }",""]:[];return["import static org.junit.jupiter.api.Assertions.assertEquals;","import java.util.stream.Stream;",...a.includeSetup?["import org.junit.jupiter.api.BeforeEach;"]:[],"import org.junit.jupiter.params.ParameterizedTest;","import org.junit.jupiter.params.provider.Arguments;","import org.junit.jupiter.params.provider.MethodSource;","",`public class ${a.safeSuiteName} {`,"    static Stream<Arguments> data() {","        return Stream.of(",e.join(`,
`),"        );","    }","",...n,"    @ParameterizedTest",'    @MethodSource("data")',`    void ${a.safeTestNamePrefix}_parameterized(Object... row) {`,"        Object[] expected = row;","        Object[] actual = mapRowUnderTest(row);",a.headers.map((s,r)=>t(r,s)).join(`
`),"    }","","    private Object[] mapRowUnderTest(Object[] input) {","        // Example: return PersonMapper.normalize(input);","        return input; // replace with your system-under-test call","    }","}"].join(`
`)}function Xe(a){const t=(s,r)=>`        assertEquals(expected[${s}], actual[${s}]); // ${r}`;if(a.dataSourceStrategy!=="provider"){const s=a.rows.map(l=>`            new Object[] { ${Object.values(l).map(p=>G(p)).join(", ")} }`),r=a.includeSetup?["    @BeforeMethod","    public void setUp() {","        // setup","    }",""]:[];return["import static org.testng.Assert.assertEquals;","import org.testng.annotations.Factory;",...a.includeSetup?["import org.testng.annotations.BeforeMethod;"]:[],"import org.testng.annotations.Test;","",`public class ${a.safeSuiteName} {`,"    private final Object[] row;","",`    public ${a.safeSuiteName}(Object... row) {`,"        this.row = row;","    }","","    @Factory",`    public static Object[] ${a.safeTestNamePrefix}Factory() {`,"        Object[][] rows = new Object[][] {",s.join(`,
`),"        };","        Object[] instances = new Object[rows.length];","        for (int i = 0; i < rows.length; i++) {",`            instances[i] = new ${a.safeSuiteName}(rows[i]);`,"        }","        return instances;","    }","",...r,"    @Test",`    public void ${a.safeTestNamePrefix}_parameterized() {`,"        Object[] expected = row;","        Object[] actual = mapRowUnderTest(row);",a.headers.map((l,p)=>t(p,l)).join(`
`),"    }","","    private Object[] mapRowUnderTest(Object[] input) {","        // Example: return PersonMapper.normalize(input);","        return input; // replace with your system-under-test call","    }","}"].join(`
`)}const e=a.rows.map(s=>`            new Object[] { ${Object.values(s).map(r=>G(r)).join(", ")} }`),n=a.includeSetup?["    @BeforeMethod","    public void setUp() {","        // setup","    }",""]:[];return["import static org.testng.Assert.assertEquals;",...a.includeSetup?["import org.testng.annotations.BeforeMethod;"]:[],"import org.testng.annotations.DataProvider;","import org.testng.annotations.Test;","",`public class ${a.safeSuiteName} {`,'    @DataProvider(name = "rows")',"    public Object[][] rows() {","        return new Object[][] {",e.join(`,
`),"        };","    }","",...n,'    @Test(dataProvider = "rows")',`    public void ${a.safeTestNamePrefix}_parameterized(Object... row) {`,"        Object[] expected = row;","        Object[] actual = mapRowUnderTest(row);",a.headers.map((s,r)=>t(r,s)).join(`
`),"    }","","    private Object[] mapRowUnderTest(Object[] input) {","        // Example: return PersonMapper.normalize(input);","        return input; // replace with your system-under-test call","    }","}"].join(`
`)}function Ze(a){const t=a.headers.flatMap(o=>[`    assert actual[${JSON.stringify(o)}] == expected[${JSON.stringify(o)}]`,`    assert type(actual[${JSON.stringify(o)}]) is type(expected[${JSON.stringify(o)}])`]),e=N(a.rows,z,a.prettyPrint,"    "),n=["def map_row_under_test(row):","    # Example: return normalize_person(row)","    return row  # replace with your system-under-test call",""],i=a.includeSetup?["@pytest.fixture","def setup_context():","    return {}",""]:[],s=a.includeSetup?`${a.safePythonRowIdentifier}, setup_context`:a.safePythonRowIdentifier;return a.dataSourceStrategy==="provider"?["import pytest","",...n,...i,"def row_provider():",`    return ${e}`,"",`@pytest.mark.parametrize("${a.safePythonRowIdentifier}", row_provider())`,`def test_${a.safeTestNamePrefix}_parameterized(${s}):`,`    expected = ${a.safePythonRowIdentifier}`,`    actual = map_row_under_test(${a.safePythonRowIdentifier})`,...t].join(`
`):["import pytest","",...n,...i,`ROWS = ${e}`,"",`@pytest.mark.parametrize("${a.safePythonRowIdentifier}", ROWS)`,`def test_${a.safeTestNamePrefix}_parameterized(${s}):`,`    expected = ${a.safePythonRowIdentifier}`,`    actual = map_row_under_test(${a.safePythonRowIdentifier})`,...t].join(`
`)}function ae(a,t){const{importLines:e=[],eachKeyword:n,includeProviderFunction:i}=t,s=N(a.rows,ne,a.prettyPrint,"  "),r="toStrictEqual",o=a.includeSetup?["  beforeEach(() => {","    // setup","  });",""]:[],l=i?[`const getRows = () => ${s};`,"",`describe('${L(a.suiteName)}', () => {`,...o,`  ${n}(getRows())('${L(a.testNamePrefix)} parameterized', (row) => {`]:[`const rows = ${s};`,"",`describe('${L(a.suiteName)}', () => {`,...o,`  ${n}(rows)('${L(a.testNamePrefix)} parameterized', (row) => {`];return[...e,...e.length?[""]:[],"const mapRowUnderTest = (row) => {","  // Example: return normalizePerson(row);","  return row; // replace with your system-under-test call","};","",...l,"    const expected = row;","    const actual = mapRowUnderTest(row);",...a.headers.map(p=>`    expect(actual[${JSON.stringify(p)}]).${r}(expected[${JSON.stringify(p)}]);`),"  });","});"].join(`
`)}function Ye(a){return ae(a,{eachKeyword:"test.each",includeProviderFunction:a.dataSourceStrategy==="provider"})}function tn(a){const t=(s,r)=>`        Assert.Equal(expected[${s}], actual[${s}]); // ${r}`,e=a.includeSetup?[`    public ${a.safeSuiteName}()`,"    {","        // setup","    }",""]:[];if(a.dataSourceStrategy!=="provider"){const s=a.rows.map(o=>`    [InlineData(${Object.values(o).map(l=>ot(l)).join(", ")})]`);return["using Xunit;","",`public class ${a.safeSuiteName}`,"{",...e,"    [Theory]",...s,`    public void ${a.safeTestNamePrefix}_parameterized(params object[] row)`,"    {","        var expected = row;","        var actual = MapRowUnderTest(row);",...a.headers.map((o,l)=>t(l,o)),"    }","","    private object[] MapRowUnderTest(object[] input)","    {","        // Example: return PersonMapper.Normalize(input);","        return input; // replace with your system-under-test call","    }","}"].join(`
`)}const n=a.rows.map(s=>`            new object[] { ${Object.values(s).map(r=>ot(r)).join(", ")} }`);return["using System.Collections.Generic;","using Xunit;","",`public class ${a.safeSuiteName}`,"{",...e,"    public static IEnumerable<object[]> Rows => new List<object[]>","    {",n.join(`,
`),"    };","","    [Theory]","    [MemberData(nameof(Rows))]",`    public void ${a.safeTestNamePrefix}_parameterized(params object[] row)`,"    {","        var expected = row;","        var actual = MapRowUnderTest(row);",...a.headers.map((s,r)=>t(r,s)),"    }","","    private object[] MapRowUnderTest(object[] input)","    {","        // Example: return PersonMapper.Normalize(input);","        return input; // replace with your system-under-test call","    }","}"].join(`
`)}function en(a){const t="eql",e=N(a.rows,lt,a.prettyPrint,"  "),n=a.includeSetup?["  before do","    # setup","  end",""]:[];return a.dataSourceStrategy==="provider"?["def row_provider",`  ${e.replace(/\n/g,`
  `)}`,"end","","def map_row_under_test(row)","  # Example: PersonNormalizer.normalize(row)","  row # replace with your system-under-test call","end","",`RSpec.describe '${B(a.suiteName)}' do`,...n,`  it '${B(a.testNamePrefix)} parameterized' do`,"    row_provider.each do |row|","      expected = row","      actual = map_row_under_test(row)",...a.headers.map(r=>`      expect(actual[${JSON.stringify(r)}]).to ${t}(expected[${JSON.stringify(r)}])`),"    end","  end","end"].join(`
`):[`ROWS = ${e}`,"def map_row_under_test(row)","  # Example: PersonNormalizer.normalize(row)","  row # replace with your system-under-test call","end","",`RSpec.describe '${B(a.suiteName)}' do`,...n,`  it '${B(a.testNamePrefix)} parameterized' do`,"    ROWS.each do |row|","      expected = row","      actual = map_row_under_test(row)",...a.headers.map(s=>`      expect(actual[${JSON.stringify(s)}]).to ${t}(expected[${JSON.stringify(s)}])`),"    end","  end","end"].join(`
`)}function nn(a){const t="assertSame",e=a.rows.map(s=>`            [${Object.values(s).map(r=>pt(r)).join(", ")}]`),n=a.includeSetup?["    protected function setUp(): void","    {","        // setup","    }",""]:[];return a.dataSourceStrategy!=="provider"?["<?php","","use PHPUnit\\Framework\\TestCase;","",`final class ${a.safeSuiteName} extends TestCase`,"{",...n,`    public function test_${a.safeTestNamePrefix}_parameterized(): void`,"    {","        $rows = [",e.join(`,
`),"        ];","        foreach ($rows as $row) {","            $expected = $row;","            $actual = $this->mapRowUnderTest($row);",...a.headers.map((r,o)=>`            $this->${t}($expected[${o}], $actual[${o}]); // ${r}`),"        }","    }","","    private function mapRowUnderTest(array $row): array","    {","        // Example: return PersonMapper::normalize($row);","        return $row; // replace with your system-under-test call","    }","}"].join(`
`):["<?php","","use PHPUnit\\Framework\\TestCase;","",`final class ${a.safeSuiteName} extends TestCase`,"{","    public static function rowProvider(): array","    {","        return [",e.join(`,
`),"        ];","    }","",...n,"    /** @dataProvider rowProvider */",`    public function test_${a.safeTestNamePrefix}_parameterized(...$row): void`,"    {","        $expected = $row;","        $actual = $this->mapRowUnderTest($row);",...a.headers.map((s,r)=>`        $this->${t}($expected[${r}], $actual[${r}]); // ${s}`),"    }","","    private function mapRowUnderTest(array $row): array","    {","        // Example: return PersonMapper::normalize($row);","        return $row; // replace with your system-under-test call","    }","}"].join(`
`)}function an(a){const t=a.headers.flatMap(s=>[`            actual[${JSON.stringify(s)}] shouldBe expected[${JSON.stringify(s)}]`,`            actual[${JSON.stringify(s)}]?.let { it::class } shouldBe expected[${JSON.stringify(s)}]?.let { it::class }`]),e=N(a.rows,I,a.prettyPrint,"        "),n=a.includeSetup?["    beforeTest {","        // setup","    }",""]:[];return a.dataSourceStrategy==="provider"?["import io.kotest.core.spec.style.StringSpec","import io.kotest.matchers.shouldBe","",`class ${a.safeSuiteName} : StringSpec({`,...n,"    val mapRowUnderTest: (Map<String, Any?>) -> Map<String, Any?> = { row ->","        // Example: PersonMapper.normalize(row)","        row // replace with your system-under-test call","    }","",`    fun rowProvider() = ${e}`,"",`    "${rt(a.testNamePrefix)} parameterized" {`,"        rowProvider().forEach { row ->","            val expected = row","            val actual = mapRowUnderTest(row)",...t,"        }","    }","})"].join(`
`):["import io.kotest.core.spec.style.StringSpec","import io.kotest.matchers.shouldBe","",`class ${a.safeSuiteName} : StringSpec({`,...n,"    val mapRowUnderTest: (Map<String, Any?>) -> Map<String, Any?> = { row ->","        // Example: PersonMapper.normalize(row)","        row // replace with your system-under-test call","    }","",`    "${rt(a.testNamePrefix)} parameterized" {`,`        val rows = ${e}`,"        rows.forEach { row ->","            val expected = row","            val actual = mapRowUnderTest(row)",...t,"        }","    }","})"].join(`
`)}function se(a){const t=N(a.rows,$t,a.prettyPrint,"");return["use strict;","use warnings;","use Test::More;","","sub map_row_under_test {","    my ($row) = @_;","    # Example: return normalize_person($row);","    return $row; # replace with your system-under-test call","}","",...a.includeSetup?["my $setup = {};",""]:[],...a.dataSourceStrategy==="provider"?["sub row_provider {",`    return ${t};`,"}","","my $rows = row_provider();"]:[`my $rows = ${t};`],"","foreach my $row (@$rows) {","    my $expected = $row;","    my $actual = map_row_under_test($row);",...a.headers.map(n=>`    is_deeply($actual->{${JSON.stringify(n)}}, $expected->{${JSON.stringify(n)}}, '${Ue(`${a.testNamePrefix} ${n}`)}');`),"}","","done_testing();"].join(`
`)}function sn(a){const t=a.headers.flatMap(o=>[`            self.assertEqual(actual[${JSON.stringify(o)}], expected[${JSON.stringify(o)}])`,`            self.assertIs(type(actual[${JSON.stringify(o)}]), type(expected[${JSON.stringify(o)}]))`]),e=N(a.rows,z,a.prettyPrint,"        "),n=a.includeSetup?["    def setUp(self):","        self.setup_context = {}",""]:[],i=a.dataSourceStrategy==="provider"?["    @staticmethod","    def row_provider():",`        return ${e}`,""]:[`    ROWS = ${e}`,""],s=a.dataSourceStrategy==="provider"?"self.row_provider()":"self.ROWS";return["import unittest","","def map_row_under_test(row):","    # Example: return normalize_person(row)","    return row  # replace with your system-under-test call","",`class ${a.safeSuiteName}(unittest.TestCase):`,...n,...i,`    def test_${a.safeTestNamePrefix}_parameterized(self):`,`        for ${a.safePythonRowIdentifier} in ${s}:`,`            expected = ${a.safePythonRowIdentifier}`,`            actual = map_row_under_test(${a.safePythonRowIdentifier})`,...t,"","if __name__ == '__main__':","    unittest.main()"].join(`
`)}function rn(a){const t=a.headers.flatMap(o=>[`        self.assertEqual(actual[${JSON.stringify(o)}], expected[${JSON.stringify(o)}])`,`        self.assertIs(type(actual[${JSON.stringify(o)}]), type(expected[${JSON.stringify(o)}]))`]),e=N(a.rows,z,a.prettyPrint,"    "),n=a.includeSetup?["    def setUp(self):","        self.setup_context = {}",""]:[],i=a.dataSourceStrategy==="provider"?["def row_provider():",`    return ${e}`,""]:[`ROWS = ${e}`,""],s=a.dataSourceStrategy==="provider"?"row_provider()":"ROWS";return["import unittest","from nose2.tools import params","","def map_row_under_test(row):","    # Example: return normalize_person(row)","    return row  # replace with your system-under-test call","",...i,`class ${a.safeSuiteName}(unittest.TestCase):`,...n,`    @params(*${s})`,`    def test_${a.safeTestNamePrefix}_parameterized(self, ${a.safePythonRowIdentifier}):`,`        expected = ${a.safePythonRowIdentifier}`,`        actual = map_row_under_test(${a.safePythonRowIdentifier})`,...t,"","if __name__ == '__main__':","    unittest.main()"].join(`
`)}function on(a){return ae(a,{importLines:["import { describe, it, expect, beforeEach } from 'vitest';"],eachKeyword:"it.each",includeProviderFunction:a.dataSourceStrategy==="provider"})}function ln(a){const t=N(a.rows,ne,a.prettyPrint,"  "),e="deepStrictEqual",n=a.includeSetup?["  beforeEach(() => {","    // setup","  });",""]:[];return["const assert = require('node:assert/strict');","",...a.dataSourceStrategy==="provider"?[`const getRows = () => ${t};`,"const rows = getRows();"]:[`const rows = ${t};`],"const mapRowUnderTest = (row) => {","  // Example: return normalizePerson(row);","  return row; // replace with your system-under-test call","};","",`describe('${L(a.suiteName)}', () => {`,...n,"  rows.forEach((row, index) => {",`    it(\`${We(a.testNamePrefix)} parameterized \${index}\`, () => {`,"      const expected = row;","      const actual = mapRowUnderTest(row);",...a.headers.map(r=>`      assert.${e}(actual[${JSON.stringify(r)}], expected[${JSON.stringify(r)}]);`),"    });","  });","});"].join(`
`)}function re(a,t){const{usingLine:e,classAttributeLine:n,setupAttributeLine:i,testMethodAttributeLine:s,providerAttributeLine:r,assertStrictLine:o,assertLooseLine:l}=t,p=(h,d)=>o(h,d),c=a.includeSetup?[i,"    public void SetUp() {","        // setup","    }",""]:[],u=a.rows.map(h=>`        new object[] { ${Object.values(h).map(d=>ot(d)).join(", ")} }`);return["using System.Collections.Generic;",e,"",...n?[n]:[],`public class ${a.safeSuiteName}`,"{",...c,...a.dataSourceStrategy==="provider"?["    public static IEnumerable<object[]> Rows()","    {","        return new[]","        {",...a.rows.map(h=>`            new object[] { ${Object.values(h).map(d=>ot(d)).join(", ")} },`),"        };","    }","",s,r,`    public void ${a.safeTestNamePrefix}_parameterized(params object[] row)`,"    {","        var expected = row;","        var actual = MapRowUnderTest(row);",...a.headers.map((h,d)=>p(d,h)),"    }"]:["    private static readonly object[][] Rows = new object[][]","    {",u.join(`,
`),"    };","",s,`    public void ${a.safeTestNamePrefix}_parameterized()`,"    {","        foreach (var row in Rows)","        {","            var expected = row;","            var actual = MapRowUnderTest(row);",...a.headers.map((h,d)=>p(d,h)),"        }","    }"],"","    private object[] MapRowUnderTest(object[] input)","    {","        // Example: return PersonMapper.Normalize(input);","        return input; // replace with your system-under-test call","    }","}"].join(`
`)}function pn(a){return re(a,{usingLine:"using NUnit.Framework;",classAttributeLine:"",setupAttributeLine:"    [SetUp]",testMethodAttributeLine:a.dataSourceStrategy==="provider"?"    [TestCaseSource(nameof(Rows))]":"    [Test]",providerAttributeLine:"",assertStrictLine:(t,e)=>`            Assert.AreEqual(expected[${t}], actual[${t}], "${e}");`,assertLooseLine:(t,e)=>`            Assert.That(object.Equals(expected[${t}], actual[${t}]), Is.True, "${e}");`})}function cn(a){return re(a,{usingLine:"using Microsoft.VisualStudio.TestTools.UnitTesting;",classAttributeLine:"[TestClass]",setupAttributeLine:"    [TestInitialize]",testMethodAttributeLine:a.dataSourceStrategy==="provider"?"    [DataTestMethod]":"    [TestMethod]",providerAttributeLine:a.dataSourceStrategy==="provider"?"    [DynamicData(nameof(Rows), DynamicDataSourceType.Method)]":"",assertStrictLine:(t,e)=>`            Assert.AreEqual(expected[${t}], actual[${t}], "${e}");`,assertLooseLine:(t,e)=>`            Assert.IsTrue(object.Equals(expected[${t}], actual[${t}]), "${e}");`})}function un(a){const t=N(a.rows,lt,a.prettyPrint,"    "),e=a.includeSetup?["  def setup","    @setup_context = {}","  end",""]:[];return["require 'minitest/autorun'","","def map_row_under_test(row)","  # Example: PersonNormalizer.normalize(row)","  row # replace with your system-under-test call","end","",`class ${a.safeSuiteName} < Minitest::Test`,...e,...a.dataSourceStrategy==="provider"?["  def row_provider",`    ${t.replace(/\n/g,`
    `)}`,"  end",""]:[`  ROWS = ${t}`,""],`  def test_${a.safeTestNamePrefix}_parameterized`,a.dataSourceStrategy==="provider"?"    rows = row_provider":"    rows = ROWS","    rows.each do |row|","      expected = row","      actual = map_row_under_test(row)",...a.headers.map(i=>`      assert_equal(expected[${JSON.stringify(i)}], actual[${JSON.stringify(i)}], '${B(`${a.testNamePrefix} ${i}`)}')`),"    end","  end","end"].join(`
`)}function hn(a){const t="expect($actual[%i])->toBe($expected[%i]);",e=a.rows.map(s=>`    [${Object.values(s).map(r=>pt(r)).join(", ")}]`),n=a.headers.map((s,r)=>t.replaceAll("%i",String(r)));return["<?php","","function mapRowUnderTest(array $row): array","{","    // Example: return PersonMapper::normalize($row);","    return $row; // replace with your system-under-test call","}","",...a.dataSourceStrategy==="provider"?["function rowProvider(): array","{","    return [",e.join(`,
`),"    ];","}","",`it('${Bt(a.testNamePrefix)} parameterized', function (array $row): void {`,"    $expected = $row;","    $actual = mapRowUnderTest($row);",...n.map(s=>`    ${s}`),"})->with(rowProvider());"]:["$rows = [",e.join(`,
`),"];","",`it('${Bt(a.testNamePrefix)} parameterized', function () use ($rows): void {`,"    foreach ($rows as $row) {","        $expected = $row;","        $actual = mapRowUnderTest($row);",...n.map(s=>`        ${s}`),"    }","});"]].join(`
`)}function dn(a){const t=N(a.rows,I,a.prettyPrint,"        "),e=ze(a.headers,"value"),n=new Map(a.headers.map((p,c)=>[p,e[c]])),i=a.headers.flatMap(p=>[`        assertEquals(expected[${JSON.stringify(p)}], actual[${JSON.stringify(p)}])`,`        assertEquals(expected[${JSON.stringify(p)}]?.let { it::class }, actual[${JSON.stringify(p)}]?.let { it::class })`]),s=a.includeSetup?["    @BeforeEach","    fun setup() {","        // setup","    }",""]:[],r=["    companion object {","        @JvmStatic","        fun rows(): Stream<Arguments> = Stream.of(",a.rows.map(p=>`            Arguments.of(${a.headers.map(c=>I(p[c])).join(", ")})`).join(`,
`),"        )","    }",""],o=[`    private val rows = ${t}`,""];return["import org.junit.jupiter.api.Assertions.assertEquals","import org.junit.jupiter.api.Assertions.assertTrue","import org.junit.jupiter.api.BeforeEach","import org.junit.jupiter.api.Test","import org.junit.jupiter.params.ParameterizedTest","import org.junit.jupiter.params.provider.Arguments",...a.dataSourceStrategy==="provider"?["import org.junit.jupiter.params.provider.MethodSource"]:[],"import java.util.Objects","import java.util.stream.Stream","",`class ${a.safeSuiteName} {`,...s,"    private fun mapRowUnderTest(row: Map<String, Any?>): Map<String, Any?> {","        // Example: PersonMapper.normalize(row)","        return row // replace with your system-under-test call","    }","",...a.dataSourceStrategy==="provider"?r:o,...a.dataSourceStrategy==="provider"?[`    @ParameterizedTest(name = "${rt(a.testNamePrefix)} {index}")`,'    @MethodSource("rows")',`    fun ${O(a.testNamePrefix,"row")}Parameterized(${a.headers.map(p=>`${n.get(p)}: Any?`).join(", ")}) {`,`        val expected = mapOf(${a.headers.map(p=>`${JSON.stringify(p)} to ${n.get(p)}`).join(", ")})`,"        val actual = mapRowUnderTest(expected)",...i,"    }"]:["    @Test",`    fun ${O(a.testNamePrefix,"row")}ParameterizedInline() {`,"        rows.forEach { row ->","            val expected = row","            val actual = mapRowUnderTest(row)",...i,"        }","    }"],"}"].join(`
`)}function mn(a){const t=N(a.rows,I,a.prettyPrint,"            "),e=a.headers.flatMap(i=>[`                    assertEquals(expected[${JSON.stringify(i)}], actual[${JSON.stringify(i)}])`,`                    assertEquals(expected[${JSON.stringify(i)}]?.let { it::class }, actual[${JSON.stringify(i)}]?.let { it::class })`]);return["import kotlin.test.assertEquals","import org.spekframework.spek2.Spek","import org.spekframework.spek2.style.specification.describe","",`object ${a.safeSuiteName} : Spek({`,...a.includeSetup?["    beforeEachTest {","        // setup","    }",""]:[],"    fun mapRowUnderTest(row: Map<String, Any?>): Map<String, Any?> {","        // Example: PersonMapper.normalize(row)","        return row // replace with your system-under-test call","    }","",...a.dataSourceStrategy==="provider"?["    fun rowProvider() = "+t,""]:["    val rows = "+t,""],`    describe("${rt(a.testNamePrefix)} parameterized") {`,a.dataSourceStrategy==="provider"?"        rowProvider().forEachIndexed { index, row ->":"        rows.forEachIndexed { index, row ->",'            it("row $index") {',"                val expected = row","                val actual = mapRowUnderTest(row)",...e,"            }","        }","    }","})"].join(`
`)}function fn(a){return se(a).replace("use Test::More;","use Test2::V0;")}const zt={junit4:a=>Qe(a),junit5:a=>Gt(a),junit6:a=>Gt(a),testng:a=>Xe(a),pytest:a=>Ze(a),unittest:a=>sn(a),nose2:a=>rn(a),jest:a=>Ye(a),vitest:a=>on(a),mocha:a=>ln(a),xunit:a=>tn(a),nunit:a=>pn(a),mstest:a=>cn(a),rspec:a=>en(a),minitest:a=>un(a),phpunit:a=>nn(a),pest:a=>hn(a),kotest:a=>an(a),"junit5-kotlin":a=>dn(a),spek:a=>mn(a),"test-more":a=>se(a),"test2-suite":a=>fn(a)};class ${constructor(t){this.config=new C,t&&this.setOptions(t)}setOptions(t){this.config.mergeOptions(t)}setFramework(t){this.frameworkId=t}fromDataTable(t){const e=this.frameworkId;if(!e||!zt[e])return"";const n=Ke(t,this.config.options);return n.dataSourceStrategy=Je(e,n.dataSourceStrategy),zt[e](n)}}class Nt{constructor(){this.options={rootElementName:"root",itemElementName:"item",attributeColumnsCsv:"",includeXmlHeader:!0,xmlns:""}}mergeOptions(t){if(t!=null&&t.options){this.options={...this.options,...t.options};return}this.options={...this.options,...t}}}class gn{constructor(t){this.config=new Nt,this.warnings=[],t!==void 0&&this.setOptions(t)}setOptions(t){this.config.mergeOptions(t)}getWarnings(){return this.warnings.map(t=>t)}fromDataTable(t){this.warnings=[];const e=t.getHeaders(),n=this._parseAttributeColumns(this.config.options.attributeColumnsCsv),i=new Set;n.forEach(h=>{if(e.includes(h)){i.add(h);return}this.warnings.push(`Ignored unknown XML attribute column: ${h}`)});const s=this._normaliseXmlName(this.config.options.rootElementName,"root","root element"),r=this._normaliseXmlName(this.config.options.itemElementName,"item","item element"),o=new Set,l=e.map(h=>{const d=i.has(h)?"attribute column":"child element column";return this._normaliseXmlName(h,"column",d,o)}),p=[];this.config.options.includeXmlHeader&&p.push('<?xml version="1.0" encoding="utf-8"?>');const c=String(this.config.options.xmlns??"").trim(),u=c.length>0?` xmlns="${this._escapeXmlValue(c)}"`:"";p.push(`<${s}${u}>`);for(let h=0;h<t.getRowCount();h++){const d=t.getRow(h),b=[],y=[];e.forEach((f,g)=>{const x=this._sanitizeXmlCharacters(d[g]),S=l[g];if(i.has(f)){b.push(`${S}="${this._escapeXmlValue(x)}"`);return}y.push(`    <${S}>${this._escapeXmlValue(x)}</${S}>`)});const m=b.length>0?` ${b.join(" ")}`:"";p.push(`  <${r}${m}>`),y.forEach(f=>p.push(f)),p.push(`  </${r}>`)}return p.push(`</${s}>`),p.join(`
`)}_parseAttributeColumns(t){return String(t??"").split(",").map(e=>e.trim()).filter(e=>e.length>0)}_normaliseXmlName(t,e,n,i){const s=i||new Set,r=String(t??"").trim();let o=r.length>0?r:e;o=o.replace(/\s+/g,"_"),o=o.replace(/[^A-Za-z0-9_.-]/g,"_"),/^[A-Za-z_]/.test(o)||(o=`_${o}`),/^xml/i.test(o)&&(o=`_${o}`),o.length===0&&(o=e);let l=o,p=2;for(;s.has(l);)l=`${o}_${p}`,p++;return s.add(l),r!==l&&this.warnings.push(`Auto-fixed XML ${n} name "${r}" -> "${l}"`),l}_sanitizeXmlCharacters(t){const e=String(t??"");let n="";for(const i of e){const s=i.codePointAt(0);(s===9||s===10||s===13||s>=32&&s<=55295||s>=57344&&s<=65533||s>=65536&&s<=1114111)&&(n+=i)}return n}_escapeXmlValue(t){return String(t??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&apos;")}}class Pt{constructor(){this.options={tableName:"myTable",maxValuesPerInsert:100,quoteNumeric:!0,sqlDialect:"ansi",quoteIdentifiers:!0,wrapTransaction:!1,nullHandling:"empty-string"}}mergeOptions(t){if(t!=null&&t.options){this.options={...this.options,...t.options};return}this.options={...this.options,...t}}}class bn{constructor(t){this.config=new Pt,t!==void 0&&this.setOptions(t)}setOptions(t){this.config.mergeOptions(t)}fromDataTable(t){const e=this._normalizeDialect(this.config.options.sqlDialect),n=this._renderIdentifier(this._normalizeTableName(this.config.options.tableName),e),i=t.getHeaders().map((c,u)=>{const h=this._normalizeHeaderName(c,u);return this._renderIdentifier(h,e)}),s=t.getRowCount(),r=this._normalizeMaxValuesPerInsert(this.config.options.maxValuesPerInsert);if(i.length===0||s===0)return"";const o=[];for(let c=0;c<s;c+=r){const u=[],h=Math.min(c+r,s);for(let d=c;d<h;d++){const b=t.getRow(d),y=i.map((m,f)=>this._renderValue(b[f])).join(",");u.push(`	(${y})`)}o.push(`INSERT INTO ${n} (${i.join(",")}) values 
${u.join(`,
`)};`)}const l=o.join(`

`);if(this.config.options.wrapTransaction!==!0)return l;const p=this._getTransactionStatementsForDialect(e);return`${p.begin}

${l}

${p.commit}`}_normalizeTableName(t){const e=String(t??"").trim();return e.length===0?"myTable":e}_normalizeMaxValuesPerInsert(t){const e=Number.parseInt(t,10);return Number.isNaN(e)||e<1?100:e}_normalizeDialect(t){const e=String(t??"").trim().toLowerCase();return["ansi","postgresql","mysql","sqlserver"].includes(e)?e:"ansi"}_normalizeHeaderName(t,e){const n=String(t??"").trim();return n.length>0?n:`column${e+1}`}_renderIdentifier(t,e){const n=String(t??"").trim();return this.config.options.quoteIdentifiers!==!0?n:e==="mysql"?`\`${n.replaceAll("`","``")}\``:e==="sqlserver"?`[${n.replaceAll("]","]]")}]`:`"${n.replaceAll('"','""')}"`}_getTransactionStatementsForDialect(t){return t==="mysql"?{begin:"START TRANSACTION;",commit:"COMMIT;"}:t==="sqlserver"?{begin:"BEGIN TRANSACTION;",commit:"COMMIT TRANSACTION;"}:{begin:"BEGIN;",commit:"COMMIT;"}}_renderValue(t){const e=t,n=String(t??""),i=n.trim(),s=this.config.options.nullHandling;return e==null&&(s==="empty-as-null"||s==="empty-or-literal-null")||(s==="empty-as-null"||s==="empty-or-literal-null")&&i.length===0||s==="empty-or-literal-null"&&i.toUpperCase()==="NULL"?"NULL":this.config.options.quoteNumeric===!1&&this._isNumericLiteral(i)?i:`'${this._escapeSqlString(n)}'`}_isNumericLiteral(t){const e=String(t??"").trim();return e.length===0?!1:/^-?\d+(\.\d+)?$/.test(e)}_escapeSqlString(t){return String(t??"").replaceAll("'","''")}}const yn=[{name:"none",borders:{top:{left:"",center:" ",right:"",colSeparator:" "},middle:{left:"",center:" ",right:"",colSeparator:" "},bottom:{left:"",center:" ",right:"",colSeparator:" "},data:{left:"",center:" ",right:"",colSeparator:" "}}},{name:"compact",borders:{top:{left:"",center:"-",right:"",colSeparator:"-"},middle:{left:"",center:"-",right:"",colSeparator:" "},bottom:{left:"",center:"",right:"",colSeparator:""},data:{left:"",center:" ",right:"",colSeparator:" "}}},{name:"ramac",borders:{top:{left:"+",center:"-",right:"+",colSeparator:"+"},middle:{left:"+",center:"-",right:"+",colSeparator:"+"},bottom:{left:"+",center:"-",right:"+",colSeparator:"+"},data:{left:"|",center:" ",right:"|",colSeparator:"|"}}},{name:"ascii-table",borders:{top:{left:".",center:"-",right:".",colSeparator:"-"},middle:{left:"|",center:"-",right:"|",colSeparator:"-"},bottom:{left:".",center:"-",right:".",colSeparator:"-"},data:{left:"|",center:" ",right:"|",colSeparator:"|"}}},{name:"ascii-reStructuredText",borders:{top:{left:"+",center:"-",right:"+",colSeparator:"+"},middle:{left:"+",center:"=",right:"+",colSeparator:"+"},bottom:{left:"+",center:"-",right:"+",colSeparator:"+"},data:{left:"|",center:" ",right:"|",colSeparator:"|"}}},{name:"ascii-reStructuredText-simple",borders:{top:{left:"=",center:"=",right:"=",colSeparator:" "},middle:{left:"=",center:"=",right:"=",colSeparator:" "},bottom:{left:"=",center:"=",right:"=",colSeparator:" "},data:{left:" ",center:" ",right:" ",colSeparator:" "}}},{name:"ascii-dots",borders:{top:{left:".",center:".",right:".",colSeparator:"."},middle:{left:":",center:".",right:":",colSeparator:":"},bottom:{left:":",center:".",right:":",colSeparator:":"},data:{left:":",center:" ",right:":",colSeparator:":"}}},{name:"ascii-rounded",borders:{top:{left:".",center:"-",right:".",colSeparator:"."},middle:{left:":",center:"-",right:":",colSeparator:"+"},bottom:{left:"'",center:"-",right:"'",colSeparator:"'"},data:{left:"|",center:" ",right:"|",colSeparator:"|"}}},{name:"ascii-clean",borders:{top:{left:"",center:"-",right:"",colSeparator:"|"},middle:{left:"",center:"-",right:"",colSeparator:"|"},bottom:{left:"",center:"-",right:"",colSeparator:"|"},data:{left:"",center:" ",right:"",colSeparator:"|"}}},{name:"ascii-girder",borders:{top:{left:"//",center:"=",right:"\\\\",colSeparator:"[]"},middle:{left:"|]",center:"=",right:"[|",colSeparator:"[]"},bottom:{left:"\\\\",center:"=",right:"//",colSeparator:"[]"},data:{left:"||",center:" ",right:"||",colSeparator:"||"}}},{name:"unicode-single",borders:{top:{left:"┌",center:"─",right:"┐",colSeparator:"┬"},middle:{left:"├",center:"─",right:"┤",colSeparator:"┼"},bottom:{left:"└",center:"─",right:"┘",colSeparator:"┴"},data:{left:"│",center:" ",right:"│",colSeparator:"│"}}},{name:"unicode-double",borders:{top:{left:"╔",center:"═",right:"╗",colSeparator:"╦"},middle:{left:"╠",center:"═",right:"╣",colSeparator:"╬"},bottom:{left:"╚",center:"═",right:"╝",colSeparator:"╩"},data:{left:"║",center:" ",right:"║",colSeparator:"║"}}},{name:"unicode-mix",borders:{top:{left:"╔",center:"═",right:"╗",colSeparator:"╤"},middle:{left:"╟",center:"─",right:"╢",colSeparator:"┼"},bottom:{left:"╚",center:"═",right:"╝",colSeparator:"╧"},data:{left:"║",center:" ",right:"║",colSeparator:"│"}}},{name:"github-markdown",borders:{top:{left:"",center:"",right:"",colSeparator:""},middle:{left:"|",center:"-",right:"|",colSeparator:"|"},bottom:{left:"",center:"",right:"",colSeparator:""},data:{left:"|",center:" ",right:"|",colSeparator:"|"}}},{name:"reddit-markdown",borders:{top:{left:"",center:" ",right:"",colSeparator:" "},middle:{left:"",center:"-",right:"",colSeparator:"|"},bottom:{left:"",center:"",right:"",colSeparator:""},data:{left:"",center:" ",right:"",colSeparator:"|"}}}],oe="[\x1B][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]",wn="\0-\b\v-\x1B­​\u2028\u2029\uFEFF︀-️",Dt=`
`+wn,Wt=new RegExp("(?:"+oe+")|["+Dt+"]","g"),vt=new RegExp("((?:"+oe+")|[	"+Dt+"])?([^	"+Dt+"]*)","g");let At={strlen:a=>Array.from(a.replace(Wt,"")).length,isBlank:a=>a.replace(Wt,"").replace(/\s/g,"").length===0,partition(a){for(var t,e=[];vt.lastIndex!==a.length&&(t=vt.exec(a));)e.push([t[1]||"",t[2]]);return vt.lastIndex=0,e}};const vn=At.isBlank,K=At.partition,R=At.strlen,D={LEFT:0,RIGHT:1,CENTER:2,AUTO:3};class v{constructor(t=""){this.styles=yn,this.clear(),this.setTitle(t)}static isNumeric(t){return!isNaN(parseFloat(t))&&isFinite(t)}static padStart(t,e,n=" "){if(R(t)>=e)return t;{const r=K(t);var i;if(r.length>0){var s=r[0][1];s=n.repeat(e-s.length).concat(s),r[0][1]=s,i="",r.forEach(o=>i+=o[0]+o[1])}else i=n.repeat(e);return i}}static padEnd(t,e,n=" "){if(R(t)>=e)return t;{const r=K(t);var i="";if(r.length>1){var s=r[r.length-2][1];s=s.concat(n.repeat(e-s.length)),r[r.length-2][1]=s,r.forEach(o=>i+=o[0]+o[1])}else i=t.concat(n.repeat(e-t.length));return i}}static align(t,e,n,i=" "){const s=""+e;return t==D.RIGHT?v.padStart(s,n,i):t==D.LEFT?v.padEnd(s,n,i):t==D.CENTER?v.padEnd(v.padStart(s,R(s)+Math.floor((n-R(s))/2),i),n,i):v.alignAuto(e,n,i)}static alignLeft(t,e,n=" "){return this.align(D.LEFT,t,e,n)}static alignRight(t,e,n=" "){return this.align(D.RIGHT,t,e,n)}static alignCenter(t,e,n=" "){return this.align(D.CENTER,t,e,n)}static alignAuto(t,e,n=" "){return v.isNumeric(t)?this.alignRight(t,e,n):typeof t=="string"?this.alignLeft(t,e,n):this.alignLeft(t,e,n)}static wordWrap(t,e){const n=K(String(t));var i="";if(n.length>1)for(var s=0;s<n.length-1;s+=2){const[r,o]=n[s],l=n[s+1][0],p=v.wordWrapBasic(o,e);i+=r+p.split(`
`).join(l+`
`+r)+l}else i=v.wordWrapBasic(t,e);return i}static wordWrapBasic(t,e){const n=`
`;t=""+t;for(var i=!1,s="";R(t)>e;){i=!1;for(var r=e-1;r>=0;r--)if(vn(t.charAt(r))){s+=t.substring(0,r).trimStart()+n,t=t.slice(r+1),i=!0;break}i||(s+=t.substring(0,e).trimStart()+n,t=t.slice(e))}return s+t.trimStart()}static truncateString(t,e){const n="...";if(R(t)>e){var i="",s=0;for(const[r,o]of K(t)){const l=Array.from(o.substring(0,e-n.length).concat(n)).slice(0,e-s);i+=r+l.join(""),s+=l.length}return i}else return t}static arrayFill(t,e){const n=[];for(var i=0;i<t;i++)n.push(e);return n}static arrayResize(t,e,n){for(;e>t.length;)t.push(n)}setStyle(t){return this.style=this.styles.find(e=>e.name==t),this}getStyle(){return this.style}getStyles(){return Array.from(this.styles)}addStyle(t){return this.styles.push(t),this}removeBorder(){return this.setStyle("none")}clear(){return this.setStyle("ramac"),this.setTitle(),this.setHeading(),this.clearRows(),this.setTitleAlignCenter(),this.setHeadingAlignCenter(),this.setCellMargin(1),this.dataAlign=void 0,this.colWidths=void 0,this.wrapping=void 0,this.setJustify(!1),this}clearRows(){return this.rows=[],this}setTitle(t=""){return this.title=t,this}getTitle(){return this.title?this.title:""}setTitleAlign(t){return this.titleAlignment=t,this}setTitleAlignLeft(){return this.setTitleAlign(D.LEFT)}setTitleAlignRight(){return this.setTitleAlign(D.RIGHT)}setTitleAlignCenter(){return this.setTitleAlign(D.CENTER)}getTitleAlign(){return this.titleAlignment}setHeading(...t){this.heading=v.arrayFill(t.length);for(var e=0;e<t.length;e++)this.heading[e]=t[e];return this}getHeading(){return Array.from(this.heading)}setHeadingAlign(t){return this.headingAlign=t,this}setHeadingAlignLeft(){return this.setHeadingAlign(D.LEFT)}setHeadingAlignRight(){return this.setHeadingAlign(D.RIGHT)}setHeadingAlignCenter(){return this.setHeadingAlign(D.CENTER)}getHeadingAlign(){return this.headingAlign}addRow(...t){const e=v.arrayFill(t.length);for(var n=0;n<t.length;n++)e[n]=t[n];return this.rows.push(e),this}addNonZeroRow(...t){var e=!0;const n=v.arrayFill(t.length);for(var i=0;i<t.length;i++){const s=t[i];v.isNumeric(s)&&s!=0&&(e=!1),n[i]=t[i]}return e||this.rows.push(n),this}addRowMatrix(t){return t.forEach(e=>this.rows.push(e)),this}getRows(){return Array.from(this.rows)}setCell(t,e,n){this.rows[t-1][e-1]=n}getCell(t,e){return this.getRows()[t-1][e-1]}setWidth(t,e){return this.colWidths?v.arrayResize(this.colWidths,t):this.colWidths=v.arrayFill(t),this.colWidths[t-1]=e,this}getWidth(t){var e;return this.colWidths&&t<=this.colWidths.length&&(e=this.colWidths[t-1]),e}setWidths(t){return this.colWidths=t,this}getWidths(){return this.colWidths?this.colWidths:[]}setCellMargin(t){return this.cellMargin=t,this}getCellMargin(){return this.cellMargin}setAlign(t,e){return this.dataAlign?this.dataAlign.concat(v.arrayFill(t-this.dataAlign.length,D.AUTO)):this.dataAlign=v.arrayFill(t),this.dataAlign[t-1]=e,this}getAlign(t){var e=D.AUTO;return this.dataAlign&&t<=this.dataAlign.length&&(e=this.dataAlign[t-1]),e}setAligns(t){return this.dataAlign=Array.from(t),this}getAligns(){return this.dataAlign||(this.getRows().length>0?this.dataAlign=v.arrayFill(this.getRows()[0].length,D.AUTO):this.dataAlign=[]),Array.from(this.dataAlign)}setAlignLeft(t){return this.setAlign(t,D.LEFT)}setAlignRight(t){return this.setAlign(t,D.RIGHT)}setAlignCenter(t){return this.setAlign(t,D.CENTER)}setWrapped(t,e=!0){return this.wrapping?this.wrapping.concat(v.arrayFill(t-this.wrapping.length,!1)):this.wrapping=v.arrayFill(t,!1),this.wrapping[t-1]=e,this}isWrapped(t){var e=!1;return this.wrapping&&t<=this.wrapping.length&&(e=this.wrapping[t-1]),e}setWrappings(t){return this.wrapping=Array.from(t),this}getWrappings(){return this.wrapping||(this.getRows().length>0?this.wrapping=v.arrayFill(this.getRows()[0].length,!1):this.wrapping=[]),Array.from(this.wrapping)}setJustify(t=!0){return this.justify=t,this}isJustify(){return this.justify?this.justify:!1}transpose(){if(this.getHeading().length==0&&this.getRows().length==0)return this;const t=this.getHeading().length>0?this.getHeading().length:this.getRows()[0].length,e=this.getRows().length,n=v.arrayFill(t),i=this.getHeading().length>0?1:0;for(var s=0;s<n.length;s++){n[s]=v.arrayFill(e+i),this.getHeading().length>0&&(n[s][0]=this.getHeading()[s]);for(var r=i;r<n[0].length;r++)n[s][r]=this.getCell(r+Math.abs(i-1),s+1)}return new v(this.getTitle()).setHeadingAlign(this.getHeadingAlign()).addRowMatrix(n)}toJSON(){return`{
   "title": ${JSON.stringify(this.getTitle())},
   "heading": ${JSON.stringify(this.getHeading())},
   "rows": ${JSON.stringify(this.getRows())},
   "formatting": {
       "titleAlign": ${JSON.stringify(this.getTitleAlign())},
       "headingAlign": ${JSON.stringify(this.getHeadingAlign())},
       "columns": {
           "aligns": ${JSON.stringify(this.getAligns())},
           "widths": ${JSON.stringify(this.getWidths())},
           "wrappings": ${JSON.stringify(this.getWrappings())}
       },
       "justify": ${JSON.stringify(this.isJustify())}
   }
}`}fromJSON(t){return this.clear(),this.setTitle(t.title),this.heading=Array.from(t.heading),this.addRowMatrix(t.rows),this.setTitleAlign(t.formatting.titleAlign),this.setHeadingAlign(t.formatting.headingAlign),this.setAligns(t.formatting.columns.aligns),this.setWidths(t.formatting.columns.widths),this.setWrappings(t.formatting.columns.wrappings),this.setJustify(t.formatting.justify),this}sort(t){return this.rows.sort(t),this}sortColumn(t,e=function(n,i){return n>i?1:-1}){return this.rows.sort(function(n,i){return e(n[t-1],i[t-1])}),this}sortColumnDesc(t){const e=function(n,i){return i>n?1:-1};return this.sortColumn(t,e)}getColumnsWidth(){var t;const e=this.getHeading();e.length>0?t=v.arrayFill(e.length,0):t=v.arrayFill(this.getRows()[0].length,0);for(var n=0;n<e.length;n++){const s="".padStart(this.getCellMargin())+e[n]+"".padStart(this.getCellMargin());R(s)>t[n]&&(t[n]=R(s))}this.getRows().forEach(s=>{for(var r=0;r<s.length;r++){const o="".padStart(this.getCellMargin())+s[r]+"".padStart(this.getCellMargin());R(o)>t[r]&&(t[r]=R(o))}});for(var i=0;i<t.length;i++)this.getWidth(i+1)&&(t[i]=this.getWidth(i+1));return this.isJustify()&&(t=v.arrayFill(t.length,Math.max(...t))),t}getHorizontalLine(t,e){for(var n=t.left,i=0;i<e.length;i++)n+="".padStart(e[i],t.center),i<e.length-1&&(n+=t.colSeparator);return n+=t.right,n=n.trim(),n!=""&&(n=n+`
`),n}getWrappedRows(t){const e=v.arrayFill(t.length);for(var n=1,i=0;i<t.length;i++){const p=t[i];this.getWidth(i+1)&&this.isWrapped(i+1)?(e[i]=v.wordWrap(p,this.getWidth(i+1)-this.getCellMargin()*2).split(`
`),e[i].length>n&&(n=e[i].length)):e[i]=[p]}const s=v.arrayFill(n);for(var r=0;r<n;r++)s[r]=v.arrayFill(t.length,"");for(var o=0;o<t.length;o++)for(var l=0;l<e[o].length;l++)s[l][o]=e[o][l];return s}getHeadingRowTruncated(t,e,n){for(var i=t.left,s=0;s<n.length;s++){const r=""+n[s],o=v.align(this.getHeadingAlign(),r,e[s]-this.getCellMargin()*2);i+="".padStart(this.getCellMargin())+v.truncateString(o,e[s]-this.getCellMargin()*2)+"".padStart(this.getCellMargin()),s<n.length-1&&(i+=t.colSeparator)}return i+=t.right+`
`,i}getHeadingRow(t,e){var n="";return this.getWrappedRows(this.getHeading()).forEach(s=>{n+=this.getHeadingRowTruncated(t,e,s)}),n}getDataRowTruncated(t,e,n){for(var i=t.left,s=0;s<e.length;s++){const r=""+n[s],o=v.align(this.getAlign(s+1),r,e[s]-this.getCellMargin()*2);i+="".padStart(this.getCellMargin())+v.truncateString(o,e[s]-this.getCellMargin()*2)+"".padStart(this.getCellMargin()),s<e.length-1&&(i+=t.colSeparator)}return i+=t.right+`
`,i}getDataRow(t,e,n){var i="";return this.getWrappedRows(n).forEach(r=>{i+=this.getDataRowTruncated(t,e,r)}),i}toString(){const t=this.getColumnsWidth(),e=this.getStyle(),n=t.reduce(function(s,r){return s+r},0)+(t.length-1)*R(e.borders.data.colSeparator);var i="";if(this.getTitle().length>0){i+=e.borders.top.left+"".padStart(n,e.borders.top.center)+e.borders.top.right+`
`,i.trim()==""&&(i=""),i+=e.borders.data.left+v.align(this.getTitleAlign(),this.getTitle(),n)+e.borders.data.right+`
`;const s={left:e.borders.middle.left,right:e.borders.middle.right,center:e.borders.top.center,colSeparator:e.borders.top.colSeparator};(s.center!=""||s.colSeparator!="")&&(i+=this.getHorizontalLine(s,t))}else i+=this.getHorizontalLine(e.borders.top,t);return this.getHeading().length>0&&(i+=this.getHeadingRow(e.borders.data,t),i+=this.getHorizontalLine(e.borders.middle,t)),this.getRows().forEach(s=>{i+=this.getDataRow(e.borders.data,t,s)}),i+=this.getHorizontalLine(e.borders.bottom,t),i}}class Ft{constructor(){this.options={style:"ramac",linePrefix:""},this.styleNames={default:"ramac",blank:"none",compact:"compact","dot corner":"ascii-table",dotted:"ascii-dots",clean:"ascii-clean",girder:"ascii-girder","markdown (github)":"github-markdown","markdown (reddit)":"reddit-markdown",reStructuredText:"ascii-reStructuredText","reStructuredText simple":"ascii-reStructuredText-simple",rounded:"ascii-rounded","unicode single":"unicode-single","unicode double":"unicode-double","unicode mix":"unicode-mix"}}mergeOptions(t){let e={};t.options?e={...this.options,...t.options}:e={...this.options,...t},e!=null&&e.style&&(this.isValidStyleKey(e.style)?this.options.style=this.styleNames[e.style]:this.isValidStyleName(e.style)?this.options.style=e.style:console.log(`ascii table style ${e.style} not found`)),this.options.linePrefix=e.linePrefix?e.linePrefix:""}isValidStyleKey(t){return this.styleNames[t]!==void 0}isValidStyleName(t){for(const[,e]of Object.entries(this.styleNames))if(t==e)return!0;return!1}}class le{constructor(t){this.options=new Ft,t!=null&&t.options&&this.setOptions(t.options)}setOptions(t){this.options.mergeOptions(t)}fromDataTable(t){var e=new v;return e.setStyle(this.options.options.style).setHeading(...t.getHeaders()).addRowMatrix(t.rows),e.toString()}}class ni{constructor(t){this.gridExtensions=t,this.options={},this.options.csv=new V(","),this.options.dsv=new V("	"),this.options.asciitable=new Ft,this.options.markdown=new Tt,this.options.json=new H,this.options.jsonl=new H,this.options.jsonl.mergeOptions({options:{prettyPrint:!1,asObject:!1,asPropertyNamed:"",outputAsJsonLines:!0}}),this.options.java=new Z,this.options.javascript=new Rt,this.options.python=new Y,this.options.php=new tt,this.options.ruby=new et,this.options.kotlin=new nt,this.options.csharp=new it,this.options.perl=new at,this.options.typescript=new st,this.options.junit4=new C,this.options.junit5=new C,this.options.junit6=new C,this.options.testng=new C,this.options.pytest=new C,this.options.unittest=new C,this.options.nose2=new C,this.options.jest=new C,this.options.vitest=new C,this.options.mocha=new C,this.options.xunit=new C,this.options.nunit=new C,this.options.mstest=new C,this.options.rspec=new C,this.options.minitest=new C,this.options.phpunit=new C,this.options.pest=new C,this.options.kotest=new C,this.options["junit5-kotlin"]=new C,this.options.spek=new C,this.options["test-more"]=new C,this.options["test2-suite"]=new C,this.options.xml=new Nt,this.options.sql=new Pt,this.options.html=new kt,this.options.gherkin=new jt,this.exporters={},this.exporters.markdown=new ge,this.exporters.csv=new xe,this.exporters.csv.setPapaParse(new Vt),this.exporters.dsv=new St,this.exporters.dsv.setPapaParse(new Vt),this.exporters.json=new Ct,this.exporters.jsonl=new Ct,this.exporters.java=new $e,this.exporters.javascript=new Se,this.exporters.python=new ke,this.exporters.php=new Ne,this.exporters.ruby=new Ae,this.exporters.kotlin=new Oe,this.exporters.csharp=new Me,this.exporters.perl=new Le,this.exporters.typescript=new Be,this.exporters.junit4=new $,this.exporters.junit4.setFramework("junit4"),this.exporters.junit5=new $,this.exporters.junit5.setFramework("junit5"),this.exporters.junit6=new $,this.exporters.junit6.setFramework("junit6"),this.exporters.testng=new $,this.exporters.testng.setFramework("testng"),this.exporters.pytest=new $,this.exporters.pytest.setFramework("pytest"),this.exporters.unittest=new $,this.exporters.unittest.setFramework("unittest"),this.exporters.nose2=new $,this.exporters.nose2.setFramework("nose2"),this.exporters.jest=new $,this.exporters.jest.setFramework("jest"),this.exporters.vitest=new $,this.exporters.vitest.setFramework("vitest"),this.exporters.mocha=new $,this.exporters.mocha.setFramework("mocha"),this.exporters.xunit=new $,this.exporters.xunit.setFramework("xunit"),this.exporters.nunit=new $,this.exporters.nunit.setFramework("nunit"),this.exporters.mstest=new $,this.exporters.mstest.setFramework("mstest"),this.exporters.rspec=new $,this.exporters.rspec.setFramework("rspec"),this.exporters.minitest=new $,this.exporters.minitest.setFramework("minitest"),this.exporters.phpunit=new $,this.exporters.phpunit.setFramework("phpunit"),this.exporters.pest=new $,this.exporters.pest.setFramework("pest"),this.exporters.kotest=new $,this.exporters.kotest.setFramework("kotest"),this.exporters["junit5-kotlin"]=new $,this.exporters["junit5-kotlin"].setFramework("junit5-kotlin"),this.exporters.spek=new $,this.exporters.spek.setFramework("spek"),this.exporters["test-more"]=new $,this.exporters["test-more"].setFramework("test-more"),this.exporters["test2-suite"]=new $,this.exporters["test2-suite"].setFramework("test2-suite"),this.exporters.xml=new gn,this.exporters.sql=new bn,this.exporters.gherkin=new fe,this.exporters.html=new ye,this.exporters.asciitable=new le}canExport(t){return Object.prototype.hasOwnProperty.call(this.exporters,t)}getFileExtensionFor(t){return w[t].fileExtension}getGridAs(t){return this.getDataTableAs(t,this.getGridAsGenericDataTable())}async getGridAsAsync(t,e){const n=await this.getGridAsGenericDataTableAsync(void 0,e);return this.getDataTableAsAsync(t,n,e)}getDataTableAs(t,e){var n;if(!this.canExport(t))return console.log(`Data Type ${t} not supported for exporting`),"";if(Object.prototype.hasOwnProperty.call(this.exporters,t)){let i=this.exporters[t],s=this.options[t];return s!==void 0&&((n=i==null?void 0:i.setOptions)==null||n.call(i,s)),i==null?void 0:i.fromDataTable(e)}}async getDataTableAsAsync(t,e,n){var i;if(!this.canExport(t))return console.log(`Data Type ${t} not supported for exporting`),"";if(Object.prototype.hasOwnProperty.call(this.exporters,t)){let s=this.exporters[t],r=this.options[t];r!==void 0&&((i=s==null?void 0:s.setOptions)==null||i.call(s,r));const o=l=>{l&&(n==null||n(`${t.toUpperCase()}: ${l}`))};return o("Formatting... 0%"),typeof(s==null?void 0:s.fromDataTableAsync)=="function"?s.fromDataTableAsync(e,o):s==null?void 0:s.fromDataTable(e)}}getGridAsGenericDataTable(t){return this.gridExtensions.getGridAsGenericDataTable(t)}async getGridAsGenericDataTableAsync(t,e){return e==null||e("Reading grid data... 0%"),typeof this.gridExtensions.getGridAsGenericDataTableAsync=="function"?this.gridExtensions.getGridAsGenericDataTableAsync(t,e):this.gridExtensions.getGridAsGenericDataTable(t)}getHeadersFromGrid(){return this.gridExtensions.getHeadersFromGrid()}getOptionsForType(t){return this.options[t]}setOptionsForType(t,e){var n;if(this.options[t]){let i=this.options[t];i.mergeOptions(e),(t==="csv"||t==="dsv")&&((n=i.options)==null?void 0:n.header)===!1&&(i.headers=this.getHeadersFromGrid())}}}const Q={UNKNOWN:"",REGEX:"regex",FAKER:"faker",LITERAL:"literal",BOOLEAN:"boolean",ENUM:"enum"};class xn{constructor(t,e=""){this.name=t,this.ruleSpec=e,this.fakerCommand="",this.type=Q.UNKNOWN}setType(t){if(Object.values(Q).includes(t))this.type=t;else throw new Error(`Invalid rule type: ${t}. Must be one of: ${Object.values(Q).join(", ")}`)}isType(t){return this.type===t}static getRuleTypes(){return Q}}class Sn{constructor(){this.rules=[],this.errors=[]}getRules(){return JSON.parse(JSON.stringify(this.rules))}getRule(t){const e=String(t??"").toLowerCase().trim();return this.rules.filter(i=>String(i.name??"").toLowerCase().trim()===e)[0]}addRule(t,e){this.rules.push(new xn(t.trim(),e))}}class Cn{constructor(t,e,n={}){this.faker=t,this.RandExp=e,this.options=n,this.testDataRules=new Sn,this.errors=[]}parseText(t){const e=t.split(`
`);if(e.length%2!==0&&this.errors.push("ERROR: Specification should be ColumnName followed by RuleDefinition with an even number of lines"),e.length===0||e.length===1&&e[0].length===0){this.errors.push("ERROR: No Rules Defined");return}for(var n=0;n<e.length;n+=2){const i=e[n].trim();if(i.length===0){this.errors.push(`ERROR: Missing Name on line ${n+1}`);return}if(n+1==e.length){this.errors.push(`ERROR: Missing Rule Definition for ${i}`);return}const s=e[n+1];if(s.trim().length===0){this.errors.push(`ERROR: Missing Rule on line ${n+2}`);return}this.testDataRules.addRule(i.trim(),s.trim())}}isValid(){return this.errors.length===0}}class ct{constructor(t,e,n){this.isError=t||!1,this.errorMessage=e||"",this.data=n||""}}function k(a){return new ct(!0,a,"")}function F(a){return new ct(!1,"",a)}function $n(a){if(!a||a==="()")return[];const t=a.trim();if(!t.startsWith("(")||!t.endsWith(")"))throw new Error("Invalid argument format: must be enclosed in parentheses");const e=t.slice(1,-1).trim();if(e.length===0)return[];try{const n=`[${e}]`;return JSON.parse(n)}catch{throw new Error("NEEDS_FALLBACK")}}function Dn(a,t){const e=a.split(".");let n=t;for(const i of e){if(n==null)return;n=n[i]}return n}function jn(a,t,e,n=[]){const i={isError:!0,errorMessage:"Not Executed",data:""},s=Dn(a,e);if(typeof s!="function")throw new Error(`Could not find function: ${a}`);const r=$n(t);let o=s.apply(e,r);if(n&&n.length>0){for(const l of n)if(o=o[l],o===void 0)throw new Error(`Property accessor '${l}' returned undefined`)}return i.isError=!1,i.errorMessage="",i.data=o,i}function xt(a,t,e,n=[],i={}){const s={isError:!0,errorMessage:"Not Executed",data:""},r=t||"()",o=[/require\s*\(/,/process\./,/globalThis\./,/constructor/,/__proto__/,/prototype\./,/eval\s*\(/,/Function\s*\(/,/import\s*\(/,/document\./,/window\./,/location\./,/history\./,/navigator\./,/console\.(log|error|warn|info)/,/setTimeout|setInterval/,/XMLHttpRequest/,/fetch\s*\(/,/Promise\s*\(/,/async\s+/,/await\s+/];for(const h of o)if(h.test(r)||h.test(a))return s.errorMessage="Security: Potentially unsafe pattern detected",s;const l=String(r||""),p=String(a||"");if(l.includes("require(")||l.includes("process.")||l.includes("eval(")||p.includes("require(")||p.includes("process.")||p.includes("eval("))return s.errorMessage="Security: Dangerous function call detected",s;if(!i.unsafeFakerExpressions){const h=[/=>/,/`/,/\bthis\b/,/\bfunction\b/,/;/];for(const d of h)if(d.test(r)||d.test(a))return s.errorMessage="Security: Potentially unsafe pattern detected",s}var c="this.";const u="return "+c+a+r;try{s.isError=!1,s.errorMessage="";let h=Function(u).bind(e)();if(n&&n.length>0){for(const d of n)if(h=h[d],h===void 0)throw new Error(`Property accessor '${d}' returned undefined`)}return s.data=h,s}catch(h){return s.isError=!0,s.errorMessage="Error running Command "+a+r+" ERR: "+h,s.data="",s}}function Tn(a,t,e,n=[],i={}){try{return jn(a,t,e,n)}catch(s){if(i.unsafeFakerExpressions!==!0){if((s==null?void 0:s.message)==="NEEDS_FALLBACK"){const r=t||"",l=[/require\s*\(/,/process\./,/eval\s*\(/,/Function\s*\(/,/constructor/,/__proto__/,/prototype\./].some(c=>c.test(r)||c.test(a)),p=/^\(\s*['"][^'"]*['"]\s*(?:,\s*['"][^'"]*['"]\s*)*\)$/.test(r)||/^\(\s*\[\s*['"][^'"]*['"]\s*(?:,\s*['"][^'"]*['"]\s*)*\s*\]\s*\)$/.test(r)||/^\(\s*\d+\s*(?:,\s*\d+\s*)*\)$/.test(r)||/^\(\s*\)$/.test(r);return l||p?xt(a,t,e,n,i):k("Unsafe faker rule syntax detected: requires complex argument parsing")}return k((s==null?void 0:s.message)||"Error running faker command")}return xt(a,t,e,n,i)}}class pe{constructor(t,e={}){this.givenCommand=t,this.options=e,this.fakerFunctionCallHasArgs=!1,this.fakerFunctionName="",this.fakerFunctionCallArgs="",this.propertyAccessors=[],this.validationResult=k("Not Parsed")}parse(){var t=[];this.fakerFunctionCallHasArgs=!1,this.fakerFunctionName,this.fakerFunctionCallArgs="";var e=this.givenCommand;return e.startsWith("faker.")&&(e=e.replace("faker.","")),e.includes("(")?(this.fakerFunctionName=e.split("(")[0],this.fakerFunctionCallHasArgs=!0,this.fakerFunctionCallArgs=e.substr(this.fakerFunctionName.length),t=this.fakerFunctionName.split(".")):(t=e.split("."),this.fakerFunctionName=e,this.fakerFunctionCallHasArgs=!1,this.fakerFunctionCallArgs=""),t.length===0||t[0].length===0?(this.validationResult=k("Syntax Error: No faker API command found"),this.validationResult):t.length===1?(this.validationResult=k("Syntax Error: No faker API command found - commands have a minimum of two parts module.command"),this.validationResult):(this.validationResult=new ct(!1,"Parsed but Not Compiled",""),this.validationResult)}compile(t){if(this.validationResult.isError)return this.validationResult;const e=this.findFakerFunction(this.fakerFunctionName,t);if(e.fakerFunction===void 0)return this.validationResult=k("Could not find Faker API Command "+this.fakerFunctionName+` {${e.commandName}}`),this.validationResult;if(typeof e.fakerFunction=="function")return this.validationResult=F(""),this.fakerFunctionName=e.commandName,this.propertyAccessors=e.propertyAccessors||[],this.validationResult}findFakerFunction(t,e){for(var n=e,i=t.split("."),s="",r="",o=-1,l=0;l<i.length;l++){var p=i[l];if(new RegExp("^([A-Za-z]*)$").test(p)){if(o!==-1||(s=s+r,s=s+p,r=".",n=n[p],n===void 0))break;o===-1&&typeof n=="function"&&(o=l)}else{n=void 0;break}}const c=[];if(o!==-1&&o<i.length-1){for(let u=o+1;u<i.length;u++)c.push(i[u]);s=i.slice(0,o+1).join("."),n=this.findFakerFunction(s,e).fakerFunction}return{fakerFunction:n,commandName:s,propertyAccessors:c}}validate(t){if(this.validationResult.isError)return this.validationResult;const e=this.execute(t);return this.validationResult=new ct(e.isError,"Invalid Faker API Call "+e.errorMessage,e.data),this.validationResult}execute(t){return this.validationResult.isError?this.validationResult:Tn(this.fakerFunctionName,this.fakerFunctionCallHasArgs?this.fakerFunctionCallArgs:null,t,this.propertyAccessors,this.options)}isValid(){return!this.isError()}isError(){return this.validationResult.isError}validationError(){return this.validationResult.errorMessage}}class kn{constructor(t,e={}){this.faker=t,this.options=e}generateFrom(t){const e=new pe(t.ruleSpec,this.options);return e.parse(),e.compile(this.faker),e.execute(this.faker)}}class Rn{constructor(t){this.RandExp=t}generateFrom(t){try{const e=new this.RandExp(t.ruleSpec).gen();return F(e)}catch(e){return k("Regex Generation Error "+e)}}}class Nn{constructor(){}generateFrom(t){return F(t.ruleSpec)}}class _t{static isAwdEnumFormat(t){return/^(enum|datatype\.enum|awd\.datatype\.enum)\s*\(/.test(t)}static extractEnumValues(t){const e=String(t||"").trim();return this.isAwdEnumFormat(e)?this.extractAwdEnumValues(e):e.split(",").map(n=>n.trim())}static extractAwdEnumValues(t){const e=t.match(/^(?:enum|datatype\.enum|awd\.datatype\.enum)\s*\(\s*(.+)\s*\)$/);if(!e)throw new Error("Invalid enum format");const n=e[1].trim(),i=[];let s="",r=!1,o=0;for(;o<n.length;){const l=n[o];l==='"'&&(o===0||n[o-1]!=="\\")?r=!r:l===","&&!r?(s.trim().length>0&&i.push(s.trim()),s=""):s+=l,o++}if(s.trim().length>0&&i.push(s.trim()),i.length===0)throw new Error("No valid values found in enum");return i.map(l=>{const p=l.trim();return p.startsWith('"')&&p.endsWith('"')&&p.length>=2?p.slice(1,-1):p})}}class Pn{constructor(){}generateFrom(t){try{const e=String(t.ruleSpec||""),n=_t.extractEnumValues(e),i=Math.floor(Math.random()*n.length);return F(n[i])}catch(e){return k("Enum Generation Error: "+e.message)}}}class An{constructor(t,e,n={}){this.faker=t,this.RandExp=e,this.options=n,this.fakerGenerator=new kn(t,n),this.regexGenerator=new Rn(e),this.literalGenerator=new Nn,this.enumGenerator=new Pn,this.defaultGenerator=new Fn}generateFromRules(t,e){const n=[],i=e.map(r=>r.name);n.push(i);for(var s=0;s<t;s++){const r=this.generateRandomRow(e);n.push(r)}return n}generateRandomRow(t){return t.map(n=>{var i="",s,r;switch(n.type){case"faker":s=this.fakerGenerator;break;case"regex":s=this.regexGenerator;break;case"literal":s=this.literalGenerator;break;case"enum":s=this.enumGenerator;break;default:console.warn(`${n.name} has Unidentified rule type ${n.type} with spec ${n.ruleSpec}`),s=this.defaultGenerator}return r=s.generateFrom(n),r.isError?i="**ERROR**":i=r.data,i})}}class Fn{constructor(){}generateFrom(t){return F(t.ruleSpec)}}class Ut{constructor(t,e={}){this.validationError="",this.faker=t,this.options=e}validate(t){this.validationError="";try{const e=new pe(t.ruleSpec,this.options);e.parse(),e.compile(this.faker);const n=e.validate(this.faker);return n!=null&&n.isError===!1?(t.type="faker",t.fakerCommand=e.fakerFunctionName,!0):(this.validationError=n.errorMessage,!1)}catch(e){return this.validationError=e,!1}}isValid(){return this.validationError.length==0}getValidationError(){return this.validationError}}class Jt{constructor(t){this.RandExp=t,this.validationError=""}validate(t){this.validationError="";try{return new this.RandExp(t.ruleSpec).gen(),!0}catch(e){return this.validationError=e,!1}}isValid(){return this.validationError.length==0}getValidationError(){return this.validationError}}class Kt{constructor(){this.validationError=""}validate(t){this.validationError="";try{const e=String(t.ruleSpec||""),n=_t.extractEnumValues(e);return n.length<2?(this.validationError="Enum must have at least 2 values",!1):n.some(i=>i.length===0)?(this.validationError="Enum values cannot be empty",!1):!0}catch(e){return this.validationError=e.message||String(e),!1}}isValid(){return this.validationError.length===0}getValidationError(){return this.validationError}}class _n{constructor(t,e,n={}){this.faker=t,this.RandExp=e,this.options=n,this.rules=[],this.compilationReportLines=[],this.errors=[]}compile(t){this.rules=t,this.compilationReportLines=[],this.errors=[];const e=new Ut(this.faker,this.options),n=new Jt(this.RandExp),i=new Kt,s=["regex","faker","literal","enum"];this.rules.forEach(r=>{r.type==""?(this.compilationReportLines.push(`Identifying type for ${r.name}`),this.isEnumPattern(r.ruleSpec)?(i.validate(r),i.isValid()?(this.compilationReportLines.push(`${r.name} is a valid 'enum': ${r.ruleSpec}`),r.type="enum"):(this.compilationReportLines.push(`${r.name} is not a valid 'enum': ${i.getValidationError()}`),r.type="literal")):(e.validate(r),e.isValid()?(this.compilationReportLines.push(`${r.name} is a valid 'faker': ${r.ruleSpec}`),r.type="faker"):(this.compilationReportLines.push(`${r.name} is not a 'faker': ${e.getValidationError()}`),n.validate(r),n.isValid()?(this.compilationReportLines.push(`${r.name} is a valid 'regex': ${r.ruleSpec}`),r.type="regex"):(this.compilationReportLines.push(`${r.name} is not a 'regex': ${n.getValidationError()}`),this.errors.push(`Evaluating _${r.name}_ as 'literal'`),r.type="literal")))):s.includes(r.type)?this.compilationReportLines.push(`Type for '${r.name}' declared as '${r.type}'`):(this.compilationReportLines.push(`Warning: Unrecognised Type for '${r.name}' - '${r.type}' converting to 'literal'`),r.type="literal")})}validate(){this.errors=[];const t=new Ut(this.faker,this.options),e=new Jt(this.RandExp),n=new Kt;this.rules.forEach(i=>{switch(i.type){case"faker":t.validate(i),t.isValid()||this.errors.push(`ERROR: ${i.name} failed faker validation - ${t.getValidationError()}`);break;case"regex":e.validate(i),e.isValid()||this.errors.push(`ERROR: ${i.name} failed Regex validation - ${e.getValidationError()}`);break;case"literal":break;case"enum":n.validate(i),n.isValid()||this.errors.push(`ERROR: ${i.name} failed enum validation - ${n.getValidationError()}`);break;default:this.errors.push(`ERROR: ${i.name} has no defined type`)}})}isEnumPattern(t){const e=String(t||"").trim();if(e.match(/^(enum|datatype\.enum|awd\.datatype\.enum)\s*\(/))return!0;if(e.includes(",")){const n=e.split(",").map(i=>i.trim());if(n.length>=2&&n.every(i=>i.length>0&&i.length<=50)&&!n.some(i=>/[[\]{}()^$*+?|\\]/.test(i)||i.includes(".")&&/[A-Z]/.test(i)))return!0}return!1}isValid(){return this.errors.length==0}compilationReport(){return this.compilationReportLines.join(`
`)}validationErrors(){return this.errors.join(`
`)}}class ii{constructor(t,e,n={}){this.faker=t,this.RandExp=e,this.options=n,this.rulesParser=new Cn(t,e,n),this.generator=new An(t,e,n),this.compiler=new _n(t,e,n)}importSpec(t){this.rulesParser.parseText(t)}compile(){this.compiler.compile(this.rulesParser.testDataRules.rules),this.compiler.validate()}compilationReport(){return this.compiler.compilationReport()}testDataRules(){return this.rulesParser.testDataRules.rules}isValid(){return this.errors().length===0}errors(){return this.rulesParser.errors.concat(this.compiler.errors)}generate(t){return this.generator.generateFromRules(t,this.rulesParser.testDataRules.rules)}generateHeadersArray(){return this.rulesParser.testDataRules.rules.map(t=>t.name)}generateRow(){return this.generator.generateRandomRow(this.rulesParser.testDataRules.rules)}}class En{constructor(t){this.tabulator=t,this._activeGlobalFilterQuery=""}filterAcrossAllColumns(t){const e=String(t??"").trim().toLowerCase();if(!e){this.tabulator.clearFilter(),this._activeGlobalFilterQuery="";return}this._activeGlobalFilterQuery=e,this.tabulator.setFilter(n=>{const i=this._activeGlobalFilterQuery;for(const s in n){if(!Object.prototype.hasOwnProperty.call(n,s))continue;const r=n[s];if(r!=null&&String(r).toLowerCase().includes(i))return!0}return!1})}addRowToBottom(t){this.addRow(t,!1)}addRowToTop(t){this.addRow(t,!0)}addRow(t,e){this.tabulator.addData([t],e)}}class ai{constructor(t){this.tabulator=t,this.tabUtils=new En(t),this._pendingGridMutation=Promise.resolve()}clearGrid(){const t=[{title:"~rename-me",field:"column1"}];this._enqueueGridMutation(()=>Promise.resolve(this.tabulator.setColumns(t)).then(()=>this.tabulator.setData([])))}clearFilters(){this.tabulator.clearFilter(!0)}clearSort(){typeof this.tabulator.clearSort=="function"&&this.tabulator.clearSort()}filterText(t){this.tabUtils.filterAcrossAllColumns(t)}getNextFieldNumber(){const t=this.tabulator.getColumnDefinitions();let e=0;return t.forEach(n=>{let i=n.field,s=Number.parseInt(i.replace("column",""));s>e&&(e=s)}),e+1}getNewCol(t,e){let n={};return n.title=t,e===void 0&&(e=this.getNextFieldNumber()),n.field="column"+e,n}createColumns(t){let e=[],n=this.getNextFieldNumber();t.forEach(s=>{let r=this.getNewCol(s,n);e.push(r),n++}),this.tabulator.setColumns(e);var i=e.map(s=>s.field);this._addFieldsToData(i,"")}_addFieldsToData(t,e){!t||t.length===0||this._runWithoutRedraw(()=>{this.tabulator.getRows().forEach(n=>{let i={};t.forEach(s=>{i[s]=e}),n.update(i)})})}_addFieldToData(t,e){this._addFieldsToData([t],e)}async duplicateColumn(t,e,n){const i=this._resolveColumn(e);if(!i)return;const s=this.addNeighbourColumn(t,i,n);s&&await this._copyColumnData(i.getDefinition().field,s.field)}appendColumnToGrid(t){let e=this.getNewCol(t);return this.tabulator.addColumn(e,!1),this._addFieldToData(e.field,""),e}moveColumnTo(t,e,n){if(!e||!n)return;const i=t>0,s=this._resolveColumn(n);if(!s)return;const r=this._normaliseId(e);s.move(r,i)}addNeighbourColumn(t,e,n){if(n===void 0||n===""||n.length==0)return;const i=this.getNewCol(n),s=this._resolveColumn(e);if(s){var r=!0;return t>0&&(r=!1),this.tabulator.addColumn(i,r,s),i}}addNeighbourColumnId(t,e,n){const i=this._getColumnById(e);this.addNeighbourColumn(t,i,n)}deleteColumn(t){const e=this._resolveColumn(t);e&&e.delete()}deleteColumnId(t){this.deleteColumn(t)}getNumberOfColumns(){return this.tabulator.getColumnDefinitions().length}getNumberOfSelectedRows(){return this.tabulator.getSelectedRows().length}getRowCount(){const t=this._getActiveDataCount();return Number.isFinite(t)?t:typeof this.tabulator.getDataCount=="function"?this.tabulator.getDataCount():0}getSelectedRowIndexes(){const t=this.tabulator.getSelectedRows();if(!Array.isArray(t))return[];const e=t.map(s=>{if(typeof(s==null?void 0:s.getPosition)!="function")return;const r=s.getPosition();if(Number.isFinite(r))return Number.parseInt(r,10)}).filter(s=>Number.isFinite(s)),n=e.includes(0),i=e.map(s=>n?Math.max(0,s):Math.max(0,s-1));return[...new Set(i)].sort((s,r)=>s-r)}async applyGeneratedSchemaAmend({mode:t,desiredRowCount:e,schemaHeaders:n,generateRow:i,selectedRowIndexes:s=[]}={}){if(!Array.isArray(n)||n.length===0||typeof i!="function")return{noSelectedRows:t==="amend-selected",amendedRows:0};const r=Math.max(0,Number.parseInt(e??0,10)||0),o=await this._ensureColumnsForHeaders(n);let l=[];if(t==="amend-selected"){const u=Array.isArray(s)?s:[],h=[...new Set(u.filter(d=>Number.isFinite(d)).map(d=>Math.floor(d)).filter(d=>d>=0))].sort((d,b)=>d-b);if(h.length===0)return{noSelectedRows:!0,amendedRows:0};l=h.slice(0,Math.min(r,h.length))}else{const u=this.getRowCount(),h=Math.max(0,r-u);h>0&&await this._appendBlankRows(h)}let p=[];if(t==="amend-selected"?p=l.map(u=>this._getActiveRowDataAt(u)).filter(u=>u):p=this._getActiveRowDataSlice(Math.max(0,r)).filter(u=>u),p.length===0)return{noSelectedRows:!1,amendedRows:0};const c=n.length;return p.forEach(u=>{const h=i();for(let d=0;d<c;d++){const b=n[d],y=o[b];if(!y)continue;const m=h==null?void 0:h[d];u[y]=m==null?"":String(m)}}),this._refreshTableAfterBulkMutation(),{noSelectedRows:!1,amendedRows:p.length}}getColumnDef(t){const e=this.tabulator.getColumnDefinitions().find(n=>n.colId===t||n.field===t||n.title===t);if(e)return{...e,colId:e.colId||e.field,headerName:e.title}}nameAlreadyExists(t){var e=this.tabulator.getColumnDefinitions();for(const n of e)if(n.title===t)return!0;return!1}renameColumn(t,e){const n=this._resolveColumn(t);n&&n.updateDefinition({title:e})}renameColId(t,e){this.renameColumn(t,e)}deleteSelectedRows(){const t=this.tabulator.getSelectedRows();this.tabulator.deleteRow(t)}_getBlankRowData(){var t=this.tabulator.getColumnDefinitions(),e={};return t.forEach(n=>{e[n.field]=""}),e}addRow(){this.tabUtils.addRowToBottom(this._getBlankRowData())}addRowsRelativeToSelection(t){var e=this.tabulator.getSelectedRows();if(e.length==0)if(this.tabulator.getDataCount()==0||t<0){this.tabUtils.addRowToTop(this._getBlankRowData());return}else{this.tabUtils.addRowToBottom(this._getBlankRowData());return}var n;t<0?n=this._getMinRow(e):n=this._getMaxRow(e);for(var i=[],s=e.length,r=0;r<s;r++)i.push(this._getBlankRowData());var o=!0;t>0&&(o=!1),this.tabulator.addData(i,o,n)}_getMaxRow(t){var e=t[0];return t.forEach(n=>{n.getPosition()>e.getPosition()&&(e=n)}),e}_getMinRow(t){var e=t[0];return t.forEach(n=>{n.getPosition()<e.getPosition()&&(e=n)}),e}getGridAsGenericDataTable(t){let e=new _;const n=this.tabulator.getColumnDefinitions();e.setHeaders(n.map(l=>l.title));const i=n.map(l=>l.field),s=this._normaliseRowLimit(t);if(s!==void 0){const l=this._getLimitedActiveRowData(s),p=new Array(l.length);for(let c=0;c<l.length;c++)p[c]=this._rowObjectToValues(l[c],i);return e.rows=p,e}const r=this.tabulator.getData("active"),o=new Array(r.length);for(let l=0;l<r.length;l++)o[l]=this._rowObjectToValues(r[l],i);return e.rows=o,e}async getGridAsGenericDataTableAsync(t,e){const n=new _,i=this.tabulator.getColumnDefinitions();n.setHeaders(i.map(u=>u.title));const s=i.map(u=>u.field),r=this._normaliseRowLimit(t),o=r!==void 0?this._getLimitedActiveRowData(r):this.tabulator.getData("active"),l=Array.isArray(o)?o.length:0,p=new Array(l),c=200;e==null||e(`Reading grid data... 0/${l} rows (0%)`);for(let u=0;u<l;u+=c){const h=Math.min(u+c,l);for(let b=u;b<h;b++)p[b]=this._rowObjectToValues(o[b],s);const d=Math.round(h/Math.max(l,1)*100);e==null||e(`Reading grid data... ${h}/${l} rows (${d}%)`),h<l&&await this._yieldToBrowser()}return n.rows=p,n}_getRowAsGenericDataValsArray(t,e){var n=[];for(const s in e){var i=e[s];n.push(t[i]?String(t[i]):"")}return n}getHeadersFromGrid(){return this.tabulator.getColumnDefinitions().map(t=>t.title)}setGridFromGenericDataTable(t){t.getColumnCount()==0;const e=t.getHeaders(),n=e.map((o,l)=>{const p=`column${l+1}`;return{title:o,field:p}}),i=t.getRowCount(),s=new Array(i);let r=n.map(o=>o.field);for(let o=0;o<i;o++)s[o]=t.getRowAsObjectUsingHeadings(o,r);return this._enqueueGridMutation(async()=>{await Promise.resolve(this.tabulator.setColumns(n)),await Promise.resolve(this._setBulkData(s)),this._applyHeaderTitles(e),await this._autoFitFirstColumn()})}_applyHeaderTitles(t){const e=this.tabulator.getColumns();this._runWithoutRedraw(()=>{e.forEach((n,i)=>{const s=t[i];s===void 0||(n.getDefinition?n.getDefinition():{}).title===s||n.updateDefinition({title:s})})})}_runWithoutRedraw(t){if(typeof t!="function")return;if(!(typeof this.tabulator.blockRedraw=="function"&&typeof this.tabulator.restoreRedraw=="function")){t();return}this.tabulator.blockRedraw();try{t()}finally{this.tabulator.restoreRedraw()}}async _copyColumnData(t,e){const n=typeof this.tabulator.getRows=="function"?this.tabulator.getRows():null;if(Array.isArray(n)&&n.length>0){const s=[];this._runWithoutRedraw(()=>{n.forEach(r=>{var l;const o=(l=r.getData)==null?void 0:l.call(r)[t];s.push(Promise.resolve(r.update({[e]:o})))})}),await Promise.all(s);return}const i=typeof this.tabulator.getData=="function"?this.tabulator.getData():null;if(Array.isArray(i)&&i.length>0){const s=i.map(r=>({...r,[e]:r[t]}));await Promise.resolve(this._setBulkData(s))}}_enqueueGridMutation(t){return typeof t!="function"?this._pendingGridMutation:(this._pendingGridMutation=this._pendingGridMutation.catch(()=>{}).then(()=>t()),this._pendingGridMutation)}_yieldToBrowser(){return new Promise(t=>setTimeout(t,0))}_setBulkData(t){return typeof this.tabulator.replaceData=="function"?this.tabulator.replaceData(t):this.tabulator.setData(t)}async _autoFitFirstColumn(){var s,r;if(typeof this.tabulator.getColumnDefinitions!="function")return;const t=this.tabulator.getColumnDefinitions(),e=(s=t==null?void 0:t[0])==null?void 0:s.field;if(!e)return;let n;if(typeof this.tabulator.getColumn=="function"&&(n=this.tabulator.getColumn(e)),!n&&typeof this.tabulator.getColumns=="function"&&(n=(r=this.tabulator.getColumns())==null?void 0:r[0]),!n)return;await this._yieldToBrowser();const i=this._estimateFirstColumnWidth(e);if(typeof n.setWidth=="function"){n.setWidth(i);return}typeof n.updateDefinition=="function"&&await Promise.resolve(n.updateDefinition({width:i}))}_estimateFirstColumnWidth(t){var l,p,c;const e=((p=(l=this.tabulator).getColumnDefinitions)==null?void 0:p.call(l))||[],n=e.find(u=>u.field===t)||e[0]||{},i=String(n.title||"").length,s=typeof this.tabulator.getData=="function"?this.tabulator.getData("active"):[];let r=i;if(Array.isArray(s))for(let u=0;u<s.length;u++){const h=(c=s[u])==null?void 0:c[t],d=String(h??"").length;d>r&&(r=d)}const o=Math.ceil(r*8+32);return Math.max(120,Math.min(o,900))}_getLimitedActiveRowData(t){if(t<=0)return[];if(typeof this.tabulator.getRows=="function"){const n=this.tabulator.getRows("active");if(Array.isArray(n)){const i=Math.min(t,n.length),s=new Array(i);for(let r=0;r<i;r++){const o=n[r];s[r]=typeof(o==null?void 0:o.getData)=="function"?o.getData():{}}return s}}const e=this.tabulator.getData("active");return Array.isArray(e)?e.slice(0,t):[]}_rowObjectToValues(t,e){const n=new Array(e.length);for(let i=0;i<e.length;i++){const s=t==null?void 0:t[e[i]];n[i]=s==null?"":String(s)}return n}async _ensureColumnsForHeaders(t){const e={},n=this.tabulator.getColumnDefinitions();n.forEach(o=>{o!=null&&o.title&&(e[o.title]=o.field)});const i=[];for(let o=0;o<t.length;o++){const l=t[o];e[l]||i.push(l)}if(i.length===0)return e;const s=this.getNextFieldNumber(),r=i.map((o,l)=>{const p=this.getNewCol(o,s+l);return e[o]=p.field,p});return await Promise.resolve(this.tabulator.setColumns([...n,...r])),await this._addFieldsToExistingRowsBulk(r.map(o=>o.field),""),e}async _appendBlankRows(t){if(t<=0)return;const e=[];for(let n=0;n<t;n++)e.push(this._getBlankRowData());await Promise.resolve(this.tabulator.addData(e,!1))}_normaliseId(t){if(typeof t=="string")return t;if(t!=null&&t.getDefinition){const e=t.getDefinition();return e.colId||e.field||e.title}}_getColumnById(t){const e=this._normaliseId(t);return this.tabulator.getColumns().find(n=>{const i=n.getDefinition();return i.colId===e||i.field===e||i.title===e})}_resolveColumn(t){return t!=null&&t.getDefinition?t:this._getColumnById(t)}_normaliseRowLimit(t){if(!(typeof t!="number"||!Number.isFinite(t)))return Math.max(0,Math.floor(t))}_getActiveDataCount(){var e,n;if(typeof this.tabulator.getDataCount=="function"){const i=this.tabulator.getDataCount("active");if(Number.isFinite(i))return i}const t=(n=(e=this.tabulator)==null?void 0:e.rowManager)==null?void 0:n.activeRows;if(Array.isArray(t))return t.length}_getActiveRowComponentAt(t){var n,i;if(t<0)return;const e=(i=(n=this.tabulator)==null?void 0:n.rowManager)==null?void 0:i.activeRows;if(Array.isArray(e)&&e[t]){const s=e[t];return typeof s.getComponent=="function"?s.getComponent():s}if(typeof this.tabulator.getRows=="function"){const s=this.tabulator.getRows("active");if(Array.isArray(s))return s[t]}}_getActiveRowComponentsSlice(t){var n,i;if(t<=0)return[];const e=(i=(n=this.tabulator)==null?void 0:n.rowManager)==null?void 0:i.activeRows;if(Array.isArray(e))return e.slice(0,t).map(s=>typeof(s==null?void 0:s.getComponent)=="function"?s.getComponent():s).filter(Boolean);if(typeof this.tabulator.getRows=="function"){const s=this.tabulator.getRows("active");if(Array.isArray(s))return s.slice(0,t)}return[]}async _addFieldsToExistingRowsBulk(t,e){if(!Array.isArray(t)||t.length===0)return;const n=typeof this.tabulator.getData=="function"?this.tabulator.getData():void 0;if(Array.isArray(n)){for(let o=0;o<n.length;o++){const l=n[o];for(let p=0;p<t.length;p++)l[t[p]]=e}this._refreshTableAfterBulkMutation();return}const i={};t.forEach(o=>{i[o]=e});const s=typeof this.tabulator.getRows=="function"?this.tabulator.getRows():[];if(!Array.isArray(s)||s.length===0)return;const r=s.map(o=>Promise.resolve(o.update({...i})));await Promise.all(r)}_getActiveRowDataAt(t){var i,s,r;if(t<0)return;const e=(s=(i=this.tabulator)==null?void 0:i.rowManager)==null?void 0:s.activeRows;if(Array.isArray(e)&&e[t])return(r=e[t])==null?void 0:r.data;const n=typeof this.tabulator.getData=="function"?this.tabulator.getData("active"):void 0;if(Array.isArray(n))return n[t]}_getActiveRowDataSlice(t){var i,s;if(t<=0)return[];const e=(s=(i=this.tabulator)==null?void 0:i.rowManager)==null?void 0:s.activeRows;if(Array.isArray(e))return e.slice(0,t).map(r=>r==null?void 0:r.data).filter(Boolean);const n=typeof this.tabulator.getData=="function"?this.tabulator.getData("active"):void 0;return Array.isArray(n)?n.slice(0,t):[]}_refreshTableAfterBulkMutation(){if(typeof this.tabulator.refreshData=="function"){this.tabulator.refreshData();return}typeof this.tabulator.redraw=="function"&&this.tabulator.redraw(!0)}}const ce=["RegEx","datatype.boolean","date.month","date.weekday","date.timeZone","date.anytime","date.past","date.future","date.between","date.betweens","date.recent","date.soon","date.birthdate","helpers.fake","helpers.mustache","helpers.fromRegExp","helpers.maybe","helpers.arrayElement","helpers.slugify","helpers.replaceSymbols","helpers.replaceCreditCardSymbols","helpers.shuffle","helpers.uniqueArray","helpers.weightedArrayElement","helpers.arrayElements","helpers.rangeToNumber","helpers.multiple","number.int","number.float","number.binary","number.octal","number.hex","number.bigInt","number.romanNumeral","string.fromCharacters","string.alpha","string.alphanumeric","string.binary","string.octal","string.hexadecimal","string.numeric","string.sample","string.uuid","string.ulid","string.nanoid","string.symbol","airline.airport.name","airline.airport.iataCode","airline.airline.name","airline.airline.iataCode","airline.airplane.name","airline.airplane.iataTypeCode","airline.recordLocator","airline.seat","airline.aircraftType","airline.flightNumber","animal.dog","animal.cat","animal.snake","animal.bear","animal.lion","animal.cetacean","animal.horse","animal.bird","animal.cow","animal.fish","animal.crocodilia","animal.insect","animal.rabbit","animal.rodent","animal.type","animal.petName","book.author","book.format","book.genre","book.publisher","book.series","book.title","color.human","color.space","color.cssSupportedFunction","color.cssSupportedSpace","color.rgb","color.cmyk","color.hsl","color.hwb","color.lab","color.lch","color.colorByCSSColorSpace","commerce.department","commerce.productName","commerce.price","commerce.productAdjective","commerce.productMaterial","commerce.product","commerce.productDescription","commerce.isbn","company.name","company.catchPhrase","company.buzzPhrase","company.catchPhraseAdjective","company.catchPhraseDescriptor","company.catchPhraseNoun","company.buzzAdjective","company.buzzVerb","company.buzzNoun","database.column","database.type","database.collation","database.engine","database.mongodbObjectId","finance.accountNumber","finance.accountName","finance.routingNumber","finance.maskedNumber","finance.amount","finance.transactionType","finance.currency","finance.currencyCode","finance.currencyName","finance.currencySymbol","finance.currencyNumericCode","finance.bitcoinAddress","finance.litecoinAddress","finance.creditCardNumber","finance.creditCardCVV","finance.creditCardIssuer","finance.pin","finance.ethereumAddress","finance.iban","finance.bic","finance.transactionDescription","food.adjective","food.description","food.dish","food.ethnicCategory","food.fruit","food.ingredient","food.meat","food.spice","food.vegetable","git.branch","git.commitEntry","git.commitMessage","git.commitDate","git.commitSha","hacker.abbreviation","hacker.adjective","hacker.noun","hacker.verb","hacker.ingverb","hacker.phrase","image.avatar","image.avatarGitHub","image.personPortrait","image.avatarLegacy","image.url","image.urlLoremFlickr","image.urlPicsumPhotos","image.urlPlaceholder","image.dataUri","internet.email","internet.exampleEmail","internet.userName","internet.username","internet.displayName","internet.protocol","internet.httpMethod","internet.httpStatusCode","internet.url","internet.domainName","internet.domainSuffix","internet.domainWord","internet.ip","internet.ipv4","internet.ipv6","internet.port","internet.userAgent","internet.color","internet.mac","internet.password","internet.emoji","internet.jwtAlgorithm","internet.jwt","location.zipCode","location.city","location.buildingNumber","location.street","location.streetAddress","location.secondaryAddress","location.county","location.country","location.continent","location.countryCode","location.state","location.latitude","location.longitude","location.direction","location.cardinalDirection","location.ordinalDirection","location.nearbyGPSCoordinate","location.timeZone","location.language","lorem.word","lorem.words","lorem.sentence","lorem.slug","lorem.sentences","lorem.paragraph","lorem.paragraphs","lorem.text","lorem.lines","music.album","music.artist","music.genre","music.songName","person.firstName","person.lastName","person.middleName","person.fullName","person.gender","person.sex","person.sexType","person.bio","person.prefix","person.suffix","person.jobTitle","person.jobDescriptor","person.jobArea","person.jobType","person.zodiacSign","phone.number","phone.imei","science.chemicalElement.symbol","science.chemicalElement.name","science.chemicalElement.atomicNumber","science.unit","system.fileName","system.commonFileName","system.mimeType","system.commonFileType","system.commonFileExt","system.fileType","system.fileExt","system.directoryPath","system.filePath","system.semver","system.networkInterface","system.cron","vehicle.vehicle","vehicle.manufacturer","vehicle.model","vehicle.type","vehicle.fuel","vehicle.vin","vehicle.color","vehicle.vrm","vehicle.bicycle","word.adjective","word.adverb","word.conjunction","word.interjection","word.noun","word.preposition","word.verb","word.sample","word.words"];function ue(a,t){return a.localeCompare(t)}function si(){return[...ce].sort(ue)}function ri(){return[...ce].sort((a,t)=>t.length-a.length||ue(a,t))}class On{constructor(t){this.parameters=t,this.allPairs=new Map,this.dataRecords=[],this.coverage=new Map,this.initializeAllPairs()}serializeTuple(t,e){return JSON.stringify([t,e])}deserializeTuple(t){return JSON.parse(t)}initializeAllPairs(){for(let t=0;t<this.parameters.length;t++)for(let e=t+1;e<this.parameters.length;e++){const n=this.parameters[t],i=this.parameters[e],s=this.serializeTuple(n.name,i.name),r=new Set;for(const o of n.values)for(const l of i.values)r.add(this.serializeTuple(o,l));this.allPairs.set(s,r),this.coverage.set(s,new Set)}}generateDataSet(){for(this.dataRecords=[],this.resetCoverage();!this.isFullyCovered();){const t=this.findBestRecord();this.dataRecords.push(t),this.updateCoverage(t)}return this.dataRecords}findBestRecord(){let t=-1,e=null;const n=this.getFirstUncoveredPair();if(!n)return this.generateRandomRecord();const i=this.generateRecordsForPair(n);for(const s of i){const r=this.completeRecord(s),o=this.calculateCoverageScore(r);o>t&&(t=o,e=r)}return e||this.generateRandomRecord()}getFirstUncoveredPair(){for(const[t,e]of this.allPairs){const n=this.coverage.get(t);for(const i of e)if(!n.has(i)){const[s,r]=this.deserializeTuple(t),[o,l]=this.deserializeTuple(i);return{param1:s,param2:r,val1:o,val2:l}}}return null}generateRecordsForPair({param1:t,param2:e,val1:n,val2:i}){const s=[],r=new Map;return r.set(t,n),r.set(e,i),s.push(r),s}completeRecord(t){const e=new Map(t);for(const n of this.parameters)if(!e.has(n.name)){let i=n.values[0],s=-1;for(const r of n.values){e.set(n.name,r);const o=this.calculateCoverageScore(e);o>s&&(s=o,i=r)}e.set(n.name,i)}return e}calculateCoverageScore(t){let e=0;for(let n=0;n<this.parameters.length;n++)for(let i=n+1;i<this.parameters.length;i++){const s=this.parameters[n],r=this.parameters[i],o=this.serializeTuple(s.name,r.name),l=t.get(s.name),p=t.get(r.name),c=this.serializeTuple(l,p);this.coverage.get(o).has(c)||e++}return e}updateCoverage(t){for(let e=0;e<this.parameters.length;e++)for(let n=e+1;n<this.parameters.length;n++){const i=this.parameters[e],s=this.parameters[n],r=this.serializeTuple(i.name,s.name),o=t.get(i.name),l=t.get(s.name),p=this.serializeTuple(o,l);this.coverage.get(r).add(p)}}isFullyCovered(){for(const[t,e]of this.allPairs)if(this.coverage.get(t).size<e.size)return!1;return!0}resetCoverage(){for(const t of this.allPairs.keys())this.coverage.set(t,new Set)}generateRandomRecord(){const t=new Map;for(const e of this.parameters){const n=Math.floor(Math.random()*e.values.length);t.set(e.name,e.values[n])}return t}getCoverageStats(){let t=0,e=0;for(const[n,i]of this.allPairs)t+=i.size,e+=this.coverage.get(n).size;return{totalPairs:t,coveredPairs:e,coveragePercentage:t>0?e/t*100:100,totalRecords:this.dataRecords.length}}exportDataRecords(){return this.dataRecords.map(t=>{const e={};for(const[n,i]of t)e[n]=i;return e})}}class oi{constructor(t=null,e=null,n={}){this.options={enableLogging:!1,...n},this.pairwiseGenerator=null,this.dataRecords=[],this.currentRecordIndex=0,this.enumRules=[],this.nonEnumRules=[],this.faker=t,this.RandExp=e,t&&(this.fakerGenerator=this.createFakerGenerator()),e&&(this.randExpGenerator=this.createRandExpGenerator())}initializeFromRules(t){try{const{enumRules:e,nonEnumRules:n}=t.reduce((r,o)=>(o.isType("enum")?r.enumRules.push(o):r.nonEnumRules.push(o),r),{enumRules:[],nonEnumRules:[]});if(this.enumRules=e,this.nonEnumRules=n,this.enumRules.length<2)return k("Pairwise testing requires at least 2 ENUM parameters");const i=this.convertEnumRulesToParameters(this.enumRules);this.pairwiseGenerator=new On(i);const s=this.pairwiseGenerator.generateDataSet();if(this.dataRecords=this.generateCompleteDataRecords(s),this.currentRecordIndex=0,this.options.enableLogging){const r=this.pairwiseGenerator.getCoverageStats();console.log(`Generated ${this.dataRecords.length} data records with ${r.coveragePercentage.toFixed(1)}% pairwise coverage`)}return F(`Generated ${this.dataRecords.length} pairwise data records`)}catch(e){return k(e.message)}}convertEnumRulesToParameters(t){const e=[];for(const n of t){const i={name:n.name,values:_t.extractEnumValues(n.ruleSpec)};i.values.length>0&&e.push(i)}return e}createFakerGenerator(){return this.faker?{generateFrom:t=>{try{const e=t.ruleSpec.split(".");let n=this.faker;for(const i of e)if(n&&n[i])n=n[i];else return{isError:!0,errorMessage:`Faker function not found: ${t.ruleSpec}`};return typeof n=="function"?{data:n.call(this.faker),isError:!1}:{isError:!0,errorMessage:`${t.ruleSpec} is not a function`}}catch(e){return{isError:!0,errorMessage:e.message}}}}:null}createRandExpGenerator(){return this.RandExp?{generateFrom:t=>{try{return{data:new this.RandExp(t.ruleSpec).gen(),isError:!1}}catch(e){return{isError:!0,errorMessage:e.message}}}}:null}generateCompleteDataRecords(t){return t.map(e=>{const n={};for(const i of this.enumRules)n[i.name]=e.get(i.name);for(const i of this.nonEnumRules)n[i.name]=this.generateRandomValueForRule(i);return n})}generateRandomValueForRule(t){switch(t.type){case"literal":return t.ruleSpec;case"boolean":return Math.random()<.5?"true":"false";case"faker":return this.generateFakerValue(t);case"regex":return this.generateRegexValue(t);default:return`random_${t.name}_${Math.floor(Math.random()*1e3)}`}}generateFakerValue(t){try{if(this.fakerGenerator)return this.fakerGenerator.generateFrom(t).data??t.ruleSpec;const e=t.ruleSpec.split(".");if(e.length>=2&&this.faker){let n=this.faker;for(const i of e)if(n&&n[i])n=n[i];else return`faker_${t.ruleSpec}_${Math.floor(Math.random()*1e3)}`;if(typeof n=="function")return n.call(this.faker)}return`faker_${t.ruleSpec}_${Math.floor(Math.random()*1e3)}`}catch{return`faker_${t.ruleSpec}_${Math.floor(Math.random()*1e3)}`}}generateRegexValue(t){try{return this.randExpGenerator?this.randExpGenerator.generateFrom(t).data??t.ruleSpec:this.RandExp?new this.RandExp(t.ruleSpec).gen():`regex_match_${Math.floor(Math.random()*1e3)}`}catch{return`regex_match_${Math.floor(Math.random()*1e3)}`}}generateDataRecord(t){if(!this.dataRecords||!Number.isInteger(t)||t<0||t>=this.dataRecords.length)return k("No pairwise data records available");const e=this.dataRecords[t];return F({recordIndex:t,totalRecords:this.dataRecords.length,dataRecord:e})}generateNextDataRecord(){this.currentRecordIndex>=this.dataRecords.length&&(this.currentRecordIndex=0);const t=this.generateDataRecord(this.currentRecordIndex);return this.currentRecordIndex++,t}generateAllDataRecordsAsRows(){if(!this.pairwiseGenerator)return k("Pairwise generator not initialized");const e=[...this.enumRules,...this.nonEnumRules].map(i=>i.name),n=[e];for(const i of this.dataRecords){const s=e.map(r=>i[r]??"");n.push(s)}return F({data:n,stats:this.pairwiseGenerator.getCoverageStats()})}canGeneratePairwise(t){return t.filter(n=>n.isType("enum")).length>=2}getStats(){return this.pairwiseGenerator?{available:!0,...this.pairwiseGenerator.getCoverageStats()}:{available:!1}}}const ut="ag-grid",Et="tabulator",Vn="anywaydata:grid-engine";function X(a){if(!a||typeof a!="string")return;const t=a.trim().toLowerCase();if(t==="ag"||t==="aggrid"||t===ut)return ut;if(t==="tab"||t==="tabulator"||t==="tab-grid")return Et}function In(a={}){var p,c;const t=a.globalObject||globalThis,e=a.locationSearch??((p=t==null?void 0:t.location)==null?void 0:p.search),n=X(a.explicitEngine);if(n)return n;const i=new URLSearchParams(e||""),s=X(i.get("grid"));if(s)return s;let r;try{r=(c=t==null?void 0:t.localStorage)==null?void 0:c.getItem(Vn)}catch{r=void 0}const o=X(r);if(o)return o;const l=X(t==null?void 0:t.ANYWAYDATA_GRID_ENGINE);return l||Et}const Mn="ag-grid-script",qn="https://unpkg.com/ag-grid-community@33.3.0/dist/ag-grid-community.min.js",Ln="tabulator-script",Bn="tabulator-css",Hn="https://unpkg.com/tabulator-tables@6.3.1/dist/js/tabulator.min.js",Gn="https://unpkg.com/tabulator-tables@6.3.1/dist/css/tabulator.min.css",E={};function zn(a){return a||(globalThis==null?void 0:globalThis.document)}function he({id:a,src:t,globalName:e,doc:n}){return new Promise((i,s)=>{if(e&&(globalThis!=null&&globalThis[e])){i();return}const r=n.getElementById(a);if(r){r.addEventListener("load",()=>i(),{once:!0}),r.addEventListener("error",()=>s(new Error(`Failed loading script ${t}`)),{once:!0});return}const o=n.createElement("script");o.id=a,o.src=t,o.async=!0,o.onload=()=>i(),o.onerror=()=>s(new Error(`Failed loading script ${t}`)),n.head.appendChild(o)})}function Wn({id:a,href:t,doc:e}){if(e.getElementById(a))return;const i=e.createElement("link");i.id=a,i.rel="stylesheet",i.href=t,e.head.appendChild(i)}function Un(a){return he({id:Mn,src:qn,globalName:"agGrid",doc:a})}function Jn(a){return Wn({id:Bn,href:Gn,doc:a}),he({id:Ln,src:Hn,globalName:"Tabulator",doc:a})}function Kn(a){if(a){delete E[a];return}delete E[ut],delete E[Et]}function li(a={}){const t=zn(a.document);if(!t)return Promise.reject(new Error("No document available to load grid libraries"));const e=a.engine,n=e||In({explicitEngine:e,locationSearch:a.locationSearch,globalObject:a.globalObject});if(E[n])return E[n];let i;return n===ut?i=Un(t):i=Jn(t),E[n]=i.catch(s=>{throw Kn(n),s}),E[n]}class pi{constructor(t){this.filename=t}downloadFile(t){const e=new Blob([t],{type:"text/plain;charset=utf-8"}),n=URL.createObjectURL(e),i=document.createElement("a");i.setAttribute("href",n),i.setAttribute("download",this.filename),i.style.display="none",document.body.appendChild(i),i.click(),document.body.removeChild(i),URL.revokeObjectURL(n)}}class j{constructor(t){this.parent=t}getSelectedValueFrom(t,e){let n=this.parent.querySelector(t),i;return n&&(i=n.options[n.selectedIndex].value),i||e}getCheckBoxValueFrom(t){return this.parent.querySelector(t).checked}setCheckBoxFrom(t,e,n){let i=this.parent.querySelector(t),s=e!==void 0?e:n;i&&(i.checked=s)}setDropDownOptionToKeyValue(t,e,n){let i=this.parent.querySelector(`${t} option[value='${e}']`);i?i.selected=!0:(i=this.parent.querySelector(`${t} option[value='${n}']`),i&&(i.selected=!0))}setTextFieldToValue(t,e){let n=e!==void 0?e:"",i=this.parent.querySelector(t);i&&(i.value=n)}getTextInputValueFrom(t){let e=this.parent.querySelector(t);return e?e.value:""}getSelectWithCustomInput(t,e,n,i,s){let r=this.parent.querySelector(t),o=r.options[r.selectedIndex].value,l;if(o===e)l=this.parent.querySelector(n).value;else for(const p in i)o===p&&(l=i[p]);return l===void 0&&(console.log("unknown item found - using default"),l=s),l}setSelectWithCustomInput(t,e,n,i,s){this.parent.querySelector(n).value="";let r=!1;for(const o in i)if(s===i[o]){let l=this.parent.querySelector(t+` option[value='${o}']`);l!==void 0&&(l.selected=!0),r=!0}if(!r){let o=this.parent.querySelector(t+` option[value='${e}']`);o!==void 0&&(o.selected=!0),this.parent.querySelector(n).value=s}}}class ci{constructor(t){this.parent=t,this.htmlData=new j(this.parent)}addToGui(){this.parent.innerHTML=`
        <div class="delimited-options" style="width:100%">
          <div><p><strong>Options</strong> <span data-help="csv-options" class="helpicon"></span></p></div>
          <div class="quotes">            
            <label>
              <span class="helpicon option-help-icon" data-help="csv-option-quotes" data-help-text="Wrap fields in quote characters when exporting CSV."></span>
              <input type="checkbox" name="quotes" value="quotes">
              Use Quotes
            </label>
            <br>
          </div>

          <div class="headerval">            
            <label>
              <span class="helpicon option-help-icon" data-help="csv-option-header" data-help-text="Include the column header row as the first line of output."></span>
              <input type="checkbox" name="header" value="header">
              Use Header
            </label>
            <br>
          </div>
          

          <div class="quoteChar option-child">
            <label><span class="helpicon option-help-icon" data-help="csv-option-quote-char" data-help-text="Character used to quote string values, for example double quote."></span>Quote Char
              <input type="text" name="quoteChar" value='"' style="width:5em">
            </label>
            <br>
          </div>

          <div class="escapeChar option-child">
            <label><span class="helpicon option-help-icon" data-help="csv-option-escape-char" data-help-text="Character used to escape quote characters inside field values."></span>Escape Char
              <input type="text" name="escapeChar" value='"' style="width:5em">
            </label>
            <br>
          </div>

          <!--
          <div class="newline">
            <label>Newline
              <select name="newline">
                <option value="lf">
</option>
                <option value="crlf">\r
</option>
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
        `}setApplyCallback(t){let e=this.parent.querySelector(".delimited-options .apply button");e.onclick=(function(){t(this.getOptionsFromGui())}).bind(this)}getOptionsFromGui(){let t=new V(",");return t.options.quotes=this.htmlData.getCheckBoxValueFrom(".quotes label input"),t.options.header=this.htmlData.getCheckBoxValueFrom(".headerval label input"),t.options.quoteChar=this.htmlData.getTextInputValueFrom(".quoteChar label input"),t.options.escapeChar=this.htmlData.getTextInputValueFrom(".escapeChar label input"),t}setFromOptions(t){if(!t.options)return;let e=t.options;this.htmlData.setCheckBoxFrom(".quotes label input",e.quotes,!0),this.htmlData.setCheckBoxFrom(".headerval label input",e.header,!0),this.htmlData.setTextFieldToValue(".quoteChar label input",e.quoteChar,'"'),this.htmlData.setTextFieldToValue(".escapeChar label input",e.escapeChar,'"')}}class ui{constructor(t){W(this,"delimiterMappings",{tab:"	",comma:",",hash:"#",colon:":",pipe:"|",space:" ",semicolon:";",slash:"/",backslash:"\\"});this.parent=t,this.htmlData=new j(this.parent)}addToGui(){this.parent.innerHTML=`
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
          <div class="custom-delimiter option-child">
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
          

          <div class="quoteChar option-child">
            <label>
              <span class="helpicon option-help-icon" data-help="dsv-option-quote-char" data-help-text="Character used to quote string values."></span>
              <input type="text" name="quoteChar" value='"' style="width:5em">
              Quote Char
            </label>
            <br>
          </div>

          <div class="escapeChar option-child">
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
                <option value="lf">
</option>
                <option value="crlf">\r
</option>
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
        `}setApplyCallback(t){let e=this.parent.querySelector(".delimited-options .apply button");e.onclick=(function(){t(this.getOptionsFromGui())}).bind(this)}getOptionsFromGui(){let t=new V("	"),e=this.htmlData.getSelectWithCustomInput("div.delimiter label select","custom",".custom-delimiter label input",this.delimiterMappings,"	");return t.options.delimiter=e,t.options.quotes=this.htmlData.getCheckBoxValueFrom(".quotes label input"),t.options.header=this.htmlData.getCheckBoxValueFrom(".headerval label input"),t.options.quoteChar=this.htmlData.getTextInputValueFrom(".quoteChar label input"),t.options.escapeChar=this.htmlData.getTextInputValueFrom(".escapeChar label input"),t}setFromOptions(t){let e=t.options;this.htmlData.setCheckBoxFrom(".quotes label input",e.quotes,!0),this.htmlData.setCheckBoxFrom(".headerval label input",e.header,!0),this.htmlData.setTextFieldToValue(".quoteChar label input",e.quoteChar,'"'),this.htmlData.setTextFieldToValue(".escapeChar label input",e.escapeChar,'"'),this.htmlData.setSelectWithCustomInput("select[name='delimiter']","custom",".custom-delimiter label input",this.delimiterMappings,e.delimiter)}}class hi{constructor(t){this.parent=t,this.htmlData=new j(this.parent)}addToGui(){let t="",e=new le;for(const[n,i]of Object.entries(e.options.styleNames))t=t+`<option value="${i}">${n}</option>`;this.parent.innerHTML=`
        <div class="delimited-options" style="width:100%">
          <div><p><strong>Options</strong> <span data-help="ascii-table-options" class="helpicon"></span></p></div>
          <div class="style">
            <label><span class="helpicon option-help-icon" data-help="ascii-option-style" data-help-text="Choose the border and separator style used to render the ASCII table."></span>Style
            <select name="style">
              ${t}
            </select>
            </label>
            <br>
            
          </div>

          <div class="apply">
            <button class="apply-options">Apply</button>
          </div>
      
        </div>
        `}setApplyCallback(t){let e=this.parent.querySelector(".delimited-options .apply button");e.onclick=(function(){t(this.getOptionsFromGui())}).bind(this)}getOptionsFromGui(){let t=new Ft;return t.options.style=this.htmlData.getSelectedValueFrom("div.style select","ramac"),t}setFromOptions(t){this.htmlData.setDropDownOptionToKeyValue("div.style select",t.options.style,"default")}}class di{constructor(t){this.parent=t,this.htmlData=new j(this.parent)}addToGui(){this.parent.innerHTML=`
        <div class="markdown-options" style="width:100%">
          <div><p><strong>Options</strong> <span data-help="markdown-table-options" class="helpicon"></span></p></div>

          <div class="spacepadding">
            <label><span class="helpicon option-help-icon" data-help="md-option-space-padding" data-help-text="Add spaces around each cell value in markdown output."></span>Space Padding
              <select name="spacepadding">
                <option value="none">None</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
                <option value="both">Both</option>
              </select>
            </label>
            <br>
          </div>

          <div class="tabpadding">
            <label><span class="helpicon option-help-icon" data-help="md-option-tab-padding" data-help-text="Add tab characters around cell values. Useful when aligning output in tab-aware editors."></span>Tab Padding
              <select name="tabpadding">
                <option value="none">None</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
                <option value="both">Both</option>
              </select>
            </label>
            <br>
          </div>          


          <div class="borderbars">            
            <label>
              <span class="helpicon option-help-icon" data-help="md-option-border-bars" data-help-text="Include leading and trailing pipe characters on each markdown row."></span>
              <input type="checkbox" name="borderbars" value="borderbars">
              Border Bars
            </label>
            <br>
          </div>

          <div class="emboldenheaders">            
            <label>
             <span class="helpicon option-help-icon" data-help="md-option-bold-headers" data-help-text="Render header cells using markdown bold formatting."></span>
             <input type="checkbox" name="emboldenheaders" value="emboldenheaders">
             Bold Headers
            </label>
            <br>
          </div>

          <div class="emphasisheaders">            
            <label>
              <span class="helpicon option-help-icon" data-help="md-option-italic-headers" data-help-text="Render header cells using markdown italic formatting."></span>
              <input type="checkbox" name="emphasisheaders" value="emphasisheaders">
              Italic Headers
            </label>
            <br>
          </div>
          

          <div class="emboldencolumns option-child">
            <label><span class="helpicon option-help-icon" data-help="md-option-bold-columns" data-help-text="Column indexes to bold, separated by spaces. Example: 1 3 4"></span>Add Bold to Cols
              <input type="text" name="emboldencolumns" value='"' style="width:5em">
            </label>
            <br>
          </div>

          <div class="emphasiscolumns option-child">
          <label><span class="helpicon option-help-icon" data-help="md-option-italic-columns" data-help-text="Column indexes to italicise, separated by spaces. Example: 2 5"></span>Italics on Cols
            <input type="text" name="emphasiscolumns" value='"' style="width:5em">
          </label>
          <br>
          </div>

          <div class="prettyprint">
          <label>
            <span class="helpicon option-help-icon" data-help="md-option-pretty-print" data-help-text="Align column widths and spacing for easier reading."></span>
            <input type="checkbox" name="prettyprint" value="prettyprint">
            Pretty Print
          </label>
          <br>
          </div>

        <div class="globalcolumnalign">
        <label><span class="helpicon option-help-icon" data-help="md-option-column-align" data-help-text="Set a default text alignment for all columns in markdown output."></span>Column Align
          <select name="globalcolumnalign">
            <option value="default">Default</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
            <option value="center">Center</option>
          </select>
        </label>
        <br>
      </div> 
          

          <div class="apply">
            <button class="apply-options">Apply</button>
          </div>
      
        </div>
        `}setApplyCallback(t){let e=this.parent.querySelector(".markdown-options .apply button");e.onclick=(function(){t(this.getOptionsFromGui())}).bind(this)}getOptionsFromGui(){let t=new Tt,e={};return e.options={},e.options.spacePadding=this.htmlData.getSelectedValueFrom(".markdown-options div.spacepadding label select","none"),e.options.tabPadding=this.htmlData.getSelectedValueFrom(".markdown-options div.tabpadding label select","none"),e.options.borderBars=this.htmlData.getCheckBoxValueFrom(".markdown-options .borderbars label input"),e.options.emboldenHeaders=this.htmlData.getCheckBoxValueFrom(".markdown-options .emboldenheaders label input"),e.options.emphasisHeaders=this.htmlData.getCheckBoxValueFrom(".markdown-options .emphasisheaders label input"),e.options.prettyPrint=this.htmlData.getCheckBoxValueFrom(".markdown-options .prettyprint label input"),e.options.globalColumnAlign=this.htmlData.getSelectedValueFrom(".markdown-options div.globalcolumnalign label select","default"),e.options.emboldenColumns=Ot(this.parent.querySelector(".markdown-options .emboldencolumns label input").value),e.options.emphasisColumns=Ot(this.parent.querySelector(".markdown-options .emphasiscolumns label input").value),t.mergeOptions(e),t}setFromOptions(t){var i,s;let e=t!=null&&t.options?t.options:{};this.htmlData.setCheckBoxFrom(".markdown-options .borderbars label input",e==null?void 0:e.borderBars,!0),this.htmlData.setCheckBoxFrom(".markdown-options .emboldenheaders label input",e==null?void 0:e.emboldenHeaders,!1),this.htmlData.setCheckBoxFrom(".markdown-options .emphasisheaders label input",e==null?void 0:e.emphasisHeaders,!1),this.htmlData.setDropDownOptionToKeyValue(".markdown-options div.spacepadding label select",e==null?void 0:e.spacePadding,"none"),this.htmlData.setDropDownOptionToKeyValue(".markdown-options div.tabpadding label select",e==null?void 0:e.tabPadding,"none"),this.htmlData.setDropDownOptionToKeyValue(".markdown-options div.globalcolumnalign label select",e==null?void 0:e.globalColumnAlign,"default");let n=(i=e==null?void 0:e.emboldenColumns)==null?void 0:i.join(" ");this.htmlData.setTextFieldToValue(".markdown-options .emboldencolumns label input",n),n=(s=e==null?void 0:e.emphasisColumns)==null?void 0:s.join(" "),this.htmlData.setTextFieldToValue(".markdown-options .emphasiscolumns label input",n),this.htmlData.setCheckBoxFrom(".markdown-options .prettyprint label input",e==null?void 0:e.prettyPrint,!1)}}class Qn{constructor(t,e,n={}){this.parent=t,this.parentDivClass=e||"json-options",this.panelConfig={jsonlMode:(n==null?void 0:n.jsonlMode)===!0||this.parentDivClass==="jsonl-options"},this.htmlData=new j(this.parent)}addToGui(){const t=this.panelConfig.jsonlMode?"":`

          <div class="prettyprint">            
            <label>
              <span class="helpicon option-help-icon" data-help="json-option-pretty-print" data-help-text="Format output with indentation and line breaks for readability."></span>
              <input type="checkbox" name="prettyprint" value="prettyprint">
              Pretty Print
            </label>
            <br>
          </div>

          <div class="prettydelimiter option-child">
            <label><span class="helpicon option-help-icon" data-help="json-option-delimiter" data-help-text="Indentation character used for pretty print output."></span>Delimiter
              <select name="prettydelimiter">
                <option value="tab">Tab [\\t]</option>
                <option value="space">Space [ ]</option>
                <!--<option value="dot">Dot [.]</option>
                <option value="dash">Dash- [-]</option>
                <option value="underline">Underline [_]</option>
                <option value="plus">Plus [+]</option>-->
                <option value="custom">Custom Value</option>
              </select>
            </label>
          <br>
          </div>
          <div class="custom-pretty-delimiter option-child">
            <label><span class="helpicon option-help-icon" data-help="json-option-custom-delimiter" data-help-text="When Delimiter is Custom Value, enter the indentation character here."></span>Custom
              <input type="text" name="custom-pretty-delimiter" value='' style="width:5em">
            </label>
            <br>
          </div>  

          <div class="asobject">            
            <label>
              <span class="helpicon option-help-icon" data-help="json-option-as-object" data-help-text="Wrap rows in a single named object property instead of returning only an array."></span>
              <input type="checkbox" name="asobject" value="asobject">
              As Object
            </label>
            <br>
          </div>
          
          <div class="propertynamed option-child">
            <label><span class="helpicon option-help-icon" data-help="json-option-property-name" data-help-text="Name of the object property used when As Object is enabled."></span>Property Name
              <input type="text" name="propertynamed" value='"' style="width:10em">
            </label>
            <br>
          </div>
          `;this.parent.innerHTML=`
        <div class="${this.parentDivClass}" style="width:100%">
          <div><p><strong>Options</strong> <span data-help="${this.parentDivClass}" class="helpicon"></p></div>

      
          <div class="numbersnumeric">            
            <label>
              <span class="helpicon option-help-icon" data-help="json-option-number-convert" data-help-text="Convert numeric-looking strings to numbers in the output."></span>
              <input type="checkbox" name="numbersnumeric" value="numbersnumeric">
              Number Convert
            </label>
            <br>
          </div>
          ${t}

          <div class="apply">
            <button class="apply-options">Apply</button>
          </div>
      
        </div>
        `}setApplyCallback(t){let e=this.parent.querySelector(".apply button");e.onclick=(function(){t(this.getOptionsFromGui())}).bind(this)}getOptionsFromGui(){let t=new H;if(this.parentDivClass.startsWith("javascript-")&&(t=new Rt),t.options.makeNumbersNumeric=this.htmlData.getCheckBoxValueFrom(".numbersnumeric label input"),this.panelConfig.jsonlMode)return t.options.prettyPrint=!1,t.options.asObject=!1,t.options.asPropertyNamed="",t.options.outputAsJsonLines=!0,t;t.options.prettyPrint=this.htmlData.getCheckBoxValueFrom(".prettyprint label input"),t.options.asObject=this.htmlData.getCheckBoxValueFrom(".asobject label input"),t.options.asPropertyNamed=this.htmlData.getTextInputValueFrom(".propertynamed label input");let e=this.htmlData.getSelectWithCustomInput("select[name='prettydelimiter']","custom",".custom-pretty-delimiter label input",t.delimiterMappings,"	");return t.options.prettyPrintDelimiter=e,t}setFromOptions(t){let e=t!=null&&t.options?t.options:{};this.htmlData.setCheckBoxFrom(".numbersnumeric label input",e==null?void 0:e.makeNumbersNumeric,!1),!this.panelConfig.jsonlMode&&(this.htmlData.setCheckBoxFrom(".prettyprint label input",e==null?void 0:e.prettyPrint,!0),this.htmlData.setCheckBoxFrom(".asobject label input",e==null?void 0:e.asObject,!1),this.htmlData.setTextFieldToValue(".propertynamed label input",e==null?void 0:e.asPropertyNamed),this.htmlData.setSelectWithCustomInput("select[name='prettydelimiter']","custom",".custom-pretty-delimiter label input",t.delimiterMappings,e.prettyPrintDelimiter))}}class mi{constructor(t){this.parent=t,this.htmlData=new j(this.parent)}addToGui(){this.parent.innerHTML=`
        <div class="java-options" style="width:100%">
          <div><p><strong>Options</strong> <span data-help="java-options" class="helpicon"></span></p></div>

          <div class="collectiontype">
            <label>
              <span class="helpicon option-help-icon" data-help="java-option-collection-type" data-help-text="The Java collection type used for the outer container."></span>
              Collection Type
              <select name="collectiontype">
                <option value="list">List (ArrayList)</option>
                <option value="array">Array [ ]</option>
              </select>
            </label>
            <br>
          </div>

          <div class="assigntovariable">
            <label>
              <span class="helpicon option-help-icon" data-help="java-option-assign-variable" data-help-text="Assign the collection to a named Java variable."></span>
              <input type="checkbox" name="assigntovariable" value="assigntovariable" checked>
              Assign to Variable
            </label>
            <br>
          </div>

          <div class="variablename option-child">
            <label>
              <span class="helpicon option-help-icon" data-help="java-option-variable-name" data-help-text="Name of the Java variable the collection is assigned to."></span>
              Variable Name
              <input type="text" name="variablename" value="data" style="width:8em">
            </label>
            <br>
          </div>

          <div class="quotenumbers">
            <label>
              <span class="helpicon option-help-icon" data-help="java-option-quote-numbers" data-help-text="When checked, numeric values are output as quoted strings. When unchecked, they are output as numeric literals."></span>
              <input type="checkbox" name="quotenumbers" value="quotenumbers">
              Number Convert (Quote Numbers)
            </label>
            <br>
          </div>

          <div class="useanonymousmaps">
            <label>
              <span class="helpicon option-help-icon" data-help="java-option-anonymous-maps" data-help-text="When checked, each row is output as a Map. When unchecked, each row is output as a named class instance."></span>
              <input type="checkbox" name="useanonymousmaps" value="useanonymousmaps" checked>
              Use Anonymous Maps (Map.of)
            </label>
            <br>
          </div>

          <div class="objectclassname option-child">
            <label>
              <span class="helpicon option-help-icon" data-help="java-option-class-name" data-help-text="Class name used when Use Anonymous Maps is unchecked."></span>
              Class Name
              <input type="text" name="objectclassname" value="Row" style="width:8em">
            </label>
            <br>
          </div>

          <div class="blankvaluebehavior">
            <label>
              <span class="helpicon option-help-icon" data-help="java-option-blank-value" data-help-text="Choose how blank values are exported."></span>
              Blank Values
              <select name="blankvaluebehavior">
                <option value="null">null</option>
                <option value="empty-string">Empty String</option>
              </select>
            </label>
            <br>
          </div>

          <div class="includeimports">
            <label>
              <span class="helpicon option-help-icon" data-help="java-option-imports" data-help-text="Include import statements at the top of the output."></span>
              <input type="checkbox" name="includeimports" value="includeimports" checked>
              Include Imports
            </label>
            <br>
          </div>

          <div class="prettyprint">
            <label>
              <span class="helpicon option-help-icon" data-help="java-option-pretty-print" data-help-text="Format output with line breaks and indentation."></span>
              <input type="checkbox" name="prettyprint" value="prettyprint" checked>
              Pretty Print
            </label>
            <br>
          </div>

          <div class="prettydelimiter option-child">
            <label>
              <span class="helpicon option-help-icon" data-help="java-option-delimiter" data-help-text="Indentation character used when Pretty Print is enabled."></span>
              Delimiter
              <select name="prettydelimiter">
                <option value="tab">Tab [	]</option>
                <option value="space">Space [ ]</option>
                <option value="custom">Custom Value</option>
              </select>
            </label>
            <br>
          </div>

          <div class="custom-pretty-delimiter option-child">
            <label>
              <span class="helpicon option-help-icon" data-help="java-option-custom-delimiter" data-help-text="When Delimiter is Custom Value, this value is used as indentation."></span>
              Custom Delimiter
              <input type="text" name="custom-pretty-delimiter" value="" style="width:8em">
            </label>
            <br>
          </div>

          <div class="apply">
            <button class="apply-options">Apply</button>
          </div>
        </div>
        `}setApplyCallback(t){const e=this.parent.querySelector(".apply button");e.onclick=(function(){t(this.getOptionsFromGui())}).bind(this)}getOptionsFromGui(){const t=new Z;return t.options.collectionType=this.htmlData.getSelectedValueFrom("select[name='collectiontype']","list"),t.options.assignToVariable=this.htmlData.getCheckBoxValueFrom(".assigntovariable label input"),t.options.variableName=this.htmlData.getTextInputValueFrom(".variablename label input")||"data",t.options.quoteNumbers=this.htmlData.getCheckBoxValueFrom(".quotenumbers label input"),t.options.useAnonymousMaps=this.htmlData.getCheckBoxValueFrom(".useanonymousmaps label input"),t.options.objectClassName=this.htmlData.getTextInputValueFrom(".objectclassname label input")||"Row",t.options.blankValueBehavior=this.htmlData.getSelectedValueFrom("select[name='blankvaluebehavior']","null"),t.options.includeImports=this.htmlData.getCheckBoxValueFrom(".includeimports label input"),t.options.prettyPrint=this.htmlData.getCheckBoxValueFrom(".prettyprint label input"),t.options.prettyPrintDelimiter=this.htmlData.getSelectWithCustomInput("select[name='prettydelimiter']","custom",".custom-pretty-delimiter label input",t.delimiterMappings,"    "),t}setFromOptions(t){const e=(t==null?void 0:t.options)??{},n=(t==null?void 0:t.delimiterMappings)??new Z().delimiterMappings;this.htmlData.setDropDownOptionToKeyValue("select[name='collectiontype']",e.collectionType,"list"),this.htmlData.setCheckBoxFrom(".assigntovariable label input",e.assignToVariable,!0),this.htmlData.setTextFieldToValue(".variablename label input",e.variableName??"data"),this.htmlData.setCheckBoxFrom(".quotenumbers label input",e.quoteNumbers,!1),this.htmlData.setCheckBoxFrom(".useanonymousmaps label input",e.useAnonymousMaps,!0),this.htmlData.setTextFieldToValue(".objectclassname label input",e.objectClassName??"Row"),this.htmlData.setDropDownOptionToKeyValue("select[name='blankvaluebehavior']",e.blankValueBehavior,"null"),this.htmlData.setCheckBoxFrom(".includeimports label input",e.includeImports,!0),this.htmlData.setCheckBoxFrom(".prettyprint label input",e.prettyPrint,!0),this.htmlData.setSelectWithCustomInput("select[name='prettydelimiter']","custom",".custom-pretty-delimiter label input",n,e.prettyPrintDelimiter)}}class fi{constructor(t){this.parent=t,this.panel=new Qn(t,"javascript-options")}addToGui(){this.panel.addToGui()}setApplyCallback(t){this.panel.setApplyCallback((function(){t(this.getOptionsFromGui())}).bind(this))}getOptionsFromGui(){return this.panel.getOptionsFromGui()}setFromOptions(t){this.panel.setFromOptions(t)}}class gi{constructor(t){this.parent=t,this.htmlData=new j(this.parent)}addToGui(){this.parent.innerHTML=`
        <div class="python-options" style="width:100%">
          <div><p><strong>Options</strong> <span data-help="python-options" class="helpicon"></span></p></div>

          <div class="collectiontype">
            <label>
              <span class="helpicon option-help-icon" data-help="python-option-collection-type" data-help-text="The Python collection type used for the outer container."></span>
              Collection Type
              <select name="collectiontype">
                <option value="list">List [ ]</option>
                <option value="tuple">Tuple ( )</option>
              </select>
            </label>
            <br>
          </div>

          <div class="assigntovariable">
            <label>
              <span class="helpicon option-help-icon" data-help="python-option-assign-variable" data-help-text="Assign the collection to a named Python variable."></span>
              <input type="checkbox" name="assigntovariable" value="assigntovariable">
              Assign to Variable
            </label>
            <br>
          </div>

          <div class="variablename option-child">
            <label>
              <span class="helpicon option-help-icon" data-help="python-option-variable-name" data-help-text="Name of the Python variable the collection is assigned to."></span>
              Variable Name
              <input type="text" name="variablename" value="data" style="width:8em">
            </label>
            <br>
          </div>

          <div class="quotenumbers">
            <label>
              <span class="helpicon option-help-icon" data-help="python-option-quote-numbers" data-help-text="When checked, numeric values are output as quoted strings. When unchecked, they are output as numeric literals."></span>
              <input type="checkbox" name="quotenumbers" value="quotenumbers">
              Quote Numbers
            </label>
            <br>
          </div>

          <div class="usedecimaltype">
            <label>
              <span class="helpicon option-help-icon" data-help="python-option-use-decimal" data-help-text="When checked, decimal-looking numeric values are output as Decimal values."></span>
              <input type="checkbox" name="usedecimaltype" value="usedecimaltype">
              Use Decimal Type
            </label>
            <br>
          </div>

          <div class="decimalcolumnscsv option-child">
            <label>
              <span class="helpicon option-help-icon" data-help="python-option-decimal-columns" data-help-text="Comma-separated list of columns to treat as Decimal candidates. Example: Money, Column 2"></span>
              Decimal Columns (CSV)
              <input type="text" name="decimalcolumnscsv" value="" style="width:100%">
            </label>
            <br>
          </div>

          <div class="decimaltreatintegers option-child">
            <label>
              <span class="helpicon option-help-icon" data-help="python-option-decimal-integers" data-help-text="When checked, integer-looking values in decimal columns are also output as Decimal values."></span>
              <input type="checkbox" name="decimaltreatintegers" value="decimaltreatintegers">
              Treat Integers As Decimal
            </label>
            <br>
          </div>

          <div class="blankvaluebehavior">
            <label>
              <span class="helpicon option-help-icon" data-help="python-option-blank-value" data-help-text="Choose how blank values are exported."></span>
              Blank Values
              <select name="blankvaluebehavior">
                <option value="empty-string">Empty String</option>
                <option value="none">None</option>
              </select>
            </label>
            <br>
          </div>

          <div class="quotestyle">
            <label>
              <span class="helpicon option-help-icon" data-help="python-option-quote-style" data-help-text="Choose single or double quotes for Python string output."></span>
              Quote Style
              <select name="quotestyle">
                <option value="double">Double Quotes</option>
                <option value="single">Single Quotes</option>
              </select>
            </label>
            <br>
          </div>

          <div class="prettyprint">
            <label>
              <span class="helpicon option-help-icon" data-help="python-option-pretty-print" data-help-text="Format output with line breaks and indentation."></span>
              <input type="checkbox" name="prettyprint" value="prettyprint">
              Pretty Print
            </label>
            <br>
          </div>

          <div class="prettydelimiter option-child">
            <label>
              <span class="helpicon option-help-icon" data-help="python-option-delimiter" data-help-text="Indentation character used when Pretty Print is enabled."></span>
              Delimiter
              <select name="prettydelimiter">
                <option value="tab">Tab [	]</option>
                <option value="space">Space [ ]</option>
                <option value="custom">Custom Value</option>
              </select>
            </label>
            <br>
          </div>

          <div class="custom-pretty-delimiter option-child">
            <label>
              <span class="helpicon option-help-icon" data-help="python-option-custom-delimiter" data-help-text="When Delimiter is Custom Value, this value is used as indentation."></span>
              Custom Delimiter
              <input type="text" name="custom-pretty-delimiter" value="" style="width:8em">
            </label>
            <br>
          </div>

          <div class="includeimports">
            <label>
              <span class="helpicon option-help-icon" data-help="python-option-imports" data-help-text="Include import statements at the top of the output."></span>
              <input type="checkbox" name="includeimports" value="includeimports">
              Include Imports
            </label>
            <br>
          </div>

          <div class="importstatements option-child">
            <label>
              <span class="helpicon option-help-icon" data-help="python-option-import-statements" data-help-text="One import statement per line, for example: from dataclasses import dataclass."></span>
              Import Statements
              <textarea name="importstatements" rows="3" style="width:100%"></textarea>
            </label>
            <br>
          </div>

          <div class="useanonymousdicts">
            <label>
              <span class="helpicon option-help-icon" data-help="python-option-anonymous-dicts" data-help-text="When checked, each row is output as a plain dictionary. When unchecked, each row is output as a named class instance."></span>
              <input type="checkbox" name="useanonymousdicts" value="useanonymousdicts">
              Anonymous Dicts
            </label>
            <br>
          </div>

          <div class="objectclassname option-child">
            <label>
              <span class="helpicon option-help-icon" data-help="python-option-class-name" data-help-text="Class name used when Anonymous Dicts is unchecked."></span>
              Class Name
              <input type="text" name="objectclassname" value="Row" style="width:8em">
            </label>
            <br>
          </div>

          <div class="apply">
            <button class="apply-options">Apply</button>
          </div>
        </div>
        `}setApplyCallback(t){const e=this.parent.querySelector(".apply button");e.onclick=(function(){t(this.getOptionsFromGui())}).bind(this)}getOptionsFromGui(){const t=new Y;return t.options.collectionType=this.htmlData.getSelectedValueFrom("select[name='collectiontype']","list"),t.options.assignToVariable=this.htmlData.getCheckBoxValueFrom(".assigntovariable label input"),t.options.variableName=this.htmlData.getTextInputValueFrom(".variablename label input")||"data",t.options.quoteNumbers=this.htmlData.getCheckBoxValueFrom(".quotenumbers label input"),t.options.useDecimalType=this.htmlData.getCheckBoxValueFrom(".usedecimaltype label input"),t.options.decimalColumnsCsv=this.htmlData.getTextInputValueFrom(".decimalcolumnscsv label input")||"",t.options.decimalTreatIntegersAsDecimal=this.htmlData.getCheckBoxValueFrom(".decimaltreatintegers label input"),t.options.blankValueBehavior=this.htmlData.getSelectedValueFrom("select[name='blankvaluebehavior']","empty-string"),t.options.quoteStyle=this.htmlData.getSelectedValueFrom("select[name='quotestyle']","double"),t.options.prettyPrint=this.htmlData.getCheckBoxValueFrom(".prettyprint label input"),t.options.prettyPrintDelimiter=this.htmlData.getSelectWithCustomInput("select[name='prettydelimiter']","custom",".custom-pretty-delimiter label input",t.delimiterMappings,"    "),t.options.includeImports=this.htmlData.getCheckBoxValueFrom(".includeimports label input"),t.options.importStatements=this.htmlData.getTextInputValueFrom(".importstatements label textarea")||"",t.options.useAnonymousDicts=this.htmlData.getCheckBoxValueFrom(".useanonymousdicts label input"),t.options.objectClassName=this.htmlData.getTextInputValueFrom(".objectclassname label input")||"Row",t}setFromOptions(t){const e=(t==null?void 0:t.options)??{},n=(t==null?void 0:t.delimiterMappings)??new Y().delimiterMappings;this.htmlData.setDropDownOptionToKeyValue("select[name='collectiontype']",e.collectionType,"list"),this.htmlData.setCheckBoxFrom(".assigntovariable label input",e.assignToVariable,!0),this.htmlData.setTextFieldToValue(".variablename label input",e.variableName??"data"),this.htmlData.setCheckBoxFrom(".quotenumbers label input",e.quoteNumbers,!1),this.htmlData.setCheckBoxFrom(".usedecimaltype label input",e.useDecimalType,!1),this.htmlData.setTextFieldToValue(".decimalcolumnscsv label input",e.decimalColumnsCsv??""),this.htmlData.setCheckBoxFrom(".decimaltreatintegers label input",e.decimalTreatIntegersAsDecimal,!1),this.htmlData.setDropDownOptionToKeyValue("select[name='blankvaluebehavior']",e.blankValueBehavior,"empty-string"),this.htmlData.setDropDownOptionToKeyValue("select[name='quotestyle']",e.quoteStyle,"double"),this.htmlData.setCheckBoxFrom(".prettyprint label input",e.prettyPrint,!0),this.htmlData.setSelectWithCustomInput("select[name='prettydelimiter']","custom",".custom-pretty-delimiter label input",n,e.prettyPrintDelimiter),this.htmlData.setCheckBoxFrom(".includeimports label input",e.includeImports,!1),this.htmlData.setTextFieldToValue(".importstatements label textarea",e.importStatements??""),this.htmlData.setCheckBoxFrom(".useanonymousdicts label input",e.useAnonymousDicts,!0),this.htmlData.setTextFieldToValue(".objectclassname label input",e.objectClassName??"Row")}}class bi{constructor(t){this.parent=t,this.htmlData=new j(this.parent)}addToGui(){this.parent.innerHTML=`
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
              <option value="tab">Tab [	]</option>
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
    `}setApplyCallback(t){const e=this.parent.querySelector(".apply button");e.onclick=(function(){t(this.getOptionsFromGui())}).bind(this)}getOptionsFromGui(){const t=new tt;return t.options.collectionType=this.htmlData.getSelectedValueFrom("select[name='collectiontype']","array"),t.options.includePhpTag=this.htmlData.getCheckBoxValueFrom(".includephptag label input"),t.options.preferShortArraySyntax=this.htmlData.getCheckBoxValueFrom(".shortarraysyntax label input"),t.options.assignToVariable=this.htmlData.getCheckBoxValueFrom(".assigntovariable label input"),t.options.variableName=this.htmlData.getTextInputValueFrom(".variablename label input")||"data",t.options.quoteNumbers=this.htmlData.getCheckBoxValueFrom(".quotenumbers label input"),t.options.objectRepresentation=this.htmlData.getSelectedValueFrom("select[name='objectrepresentation']","array"),t.options.objectClassName=this.htmlData.getTextInputValueFrom(".objectclassname label input")||"Row",t.options.arrayKeyQuoteStyle=this.htmlData.getSelectedValueFrom("select[name='arraykeyquotestyle']","quoted"),t.options.blankValueBehavior=this.htmlData.getSelectedValueFrom("select[name='blankvaluebehavior']","empty-string"),t.options.coerceBooleanLiterals=this.htmlData.getCheckBoxValueFrom(".coercebooleanliterals label input"),t.options.coerceNullLiteral=this.htmlData.getCheckBoxValueFrom(".coercenullliteral label input"),t.options.phpCompatibility=this.htmlData.getSelectedValueFrom("select[name='phpcompatibility']","8+"),t.options.classPropertyTyping=this.htmlData.getSelectedValueFrom("select[name='classpropertytyping']","none"),t.options.useConstructorPromotion=this.htmlData.getCheckBoxValueFrom(".useconstructorpromotion label input"),t.options.constructorArgStyle=this.htmlData.getSelectedValueFrom("select[name='constructorargstyle']","positional"),t.options.prettyPrint=this.htmlData.getCheckBoxValueFrom(".prettyprint label input"),t.options.prettyPrintDelimiter=this.htmlData.getSelectWithCustomInput("select[name='prettydelimiter']","custom",".custom-pretty-delimiter label input",t.delimiterMappings,"    "),t}setFromOptions(t){const e=(t==null?void 0:t.options)??{},n=(t==null?void 0:t.delimiterMappings)??new tt().delimiterMappings;this.htmlData.setDropDownOptionToKeyValue("select[name='collectiontype']",e.collectionType,"array"),this.htmlData.setCheckBoxFrom(".includephptag label input",e.includePhpTag,!1),this.htmlData.setCheckBoxFrom(".shortarraysyntax label input",e.preferShortArraySyntax,!1),this.htmlData.setCheckBoxFrom(".assigntovariable label input",e.assignToVariable,!0),this.htmlData.setTextFieldToValue(".variablename label input",e.variableName??"data"),this.htmlData.setCheckBoxFrom(".quotenumbers label input",e.quoteNumbers,!1),this.htmlData.setDropDownOptionToKeyValue("select[name='objectrepresentation']",e.objectRepresentation,"array"),this.htmlData.setTextFieldToValue(".objectclassname label input",e.objectClassName??"Row"),this.htmlData.setDropDownOptionToKeyValue("select[name='arraykeyquotestyle']",e.arrayKeyQuoteStyle,"quoted"),this.htmlData.setDropDownOptionToKeyValue("select[name='blankvaluebehavior']",e.blankValueBehavior,"empty-string"),this.htmlData.setCheckBoxFrom(".coercebooleanliterals label input",e.coerceBooleanLiterals,!1),this.htmlData.setCheckBoxFrom(".coercenullliteral label input",e.coerceNullLiteral,!1),this.htmlData.setDropDownOptionToKeyValue("select[name='phpcompatibility']",e.phpCompatibility,"8+"),this.htmlData.setDropDownOptionToKeyValue("select[name='classpropertytyping']",e.classPropertyTyping,"none"),this.htmlData.setCheckBoxFrom(".useconstructorpromotion label input",e.useConstructorPromotion,!1),this.htmlData.setDropDownOptionToKeyValue("select[name='constructorargstyle']",e.constructorArgStyle,"positional"),this.htmlData.setCheckBoxFrom(".prettyprint label input",e.prettyPrint,!0),this.htmlData.setSelectWithCustomInput("select[name='prettydelimiter']","custom",".custom-pretty-delimiter label input",n,e.prettyPrintDelimiter)}}class yi{constructor(t){this.parent=t,this.htmlData=new j(this.parent)}addToGui(){this.parent.innerHTML=`
      <div class="ruby-options" style="width:100%">
        <div><p><strong>Options</strong> <span data-help="ruby-options" class="helpicon"></span></p></div>
        <div class="collectiontype">
          <label>Collection Type
            <select name="collectiontype">
              <option value="array">Array [ ]</option>
              <option value="list">List Array[ ]</option>
            </select>
          </label>
        </div>
        <div class="assigntovariable">
          <label><input type="checkbox" name="assigntovariable"> Assign to Variable</label>
        </div>
        <div class="variablename option-child">
          <label>Variable Name <input type="text" name="variablename" value="data" style="width:8em"></label>
        </div>
        <div class="outputwrapper">
          <label>Output Wrapper
            <select name="outputwrapper">
              <option value="plain">Plain Assignment</option>
              <option value="rspec-let">RSpec let</option>
            </select>
          </label>
        </div>
        <div class="quotenumbers">
          <label><input type="checkbox" name="quotenumbers"> Number Convert (Quote Numbers)</label>
        </div>
        <div class="hashkeystyle">
          <label>Hash Key Style
            <select name="hashkeystyle">
              <option value="string">String Keys ('name' =>)</option>
              <option value="symbol">Symbol Keys (name:)</option>
            </select>
          </label>
        </div>
        <div class="useanonymousobjects">
          <label><input type="checkbox" name="useanonymousobjects"> Anonymous Objects (Hash/Map)</label>
        </div>
        <div class="objectclassname option-child">
          <label>Object Name <input type="text" name="objectclassname" value="Row" style="width:8em"></label>
        </div>
        <div class="objectrepresentation option-child">
          <label>Object Representation
            <select name="objectrepresentation">
              <option value="class">Class</option>
              <option value="struct">Struct</option>
              <option value="data">Data</option>
            </select>
          </label>
        </div>
        <div class="fieldnamestyle">
          <label>Field Name Style
            <select name="fieldnamestyle">
              <option value="preserve">Preserve</option>
              <option value="snake_case">snake_case</option>
            </select>
          </label>
        </div>
        <div class="prettyprint">
          <label><input type="checkbox" name="prettyprint"> Pretty Print</label>
        </div>
        <div class="hashprettystyle option-child">
          <label>Hash Pretty Style
            <select name="hashprettystyle">
              <option value="compact">Compact</option>
              <option value="aligned">Aligned Multi-line</option>
            </select>
          </label>
        </div>
        <div class="prettydelimiter option-child">
          <label>Delimiter
            <select name="prettydelimiter">
              <option value="tab">Tab [	]</option>
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
    `}setApplyCallback(t){const e=this.parent.querySelector(".apply button");e.onclick=(function(){t(this.getOptionsFromGui())}).bind(this)}getOptionsFromGui(){const t=new et;return t.options.collectionType=this.htmlData.getSelectedValueFrom("select[name='collectiontype']","array"),t.options.assignToVariable=this.htmlData.getCheckBoxValueFrom(".assigntovariable label input"),t.options.variableName=this.htmlData.getTextInputValueFrom(".variablename label input")||"data",t.options.outputWrapper=this.htmlData.getSelectedValueFrom("select[name='outputwrapper']","plain"),t.options.quoteNumbers=this.htmlData.getCheckBoxValueFrom(".quotenumbers label input"),t.options.hashKeyStyle=this.htmlData.getSelectedValueFrom("select[name='hashkeystyle']","string"),t.options.useAnonymousObjects=this.htmlData.getCheckBoxValueFrom(".useanonymousobjects label input"),t.options.objectClassName=this.htmlData.getTextInputValueFrom(".objectclassname label input")||"Row",t.options.objectRepresentation=this.htmlData.getSelectedValueFrom("select[name='objectrepresentation']","class"),t.options.fieldNameStyle=this.htmlData.getSelectedValueFrom("select[name='fieldnamestyle']","preserve"),t.options.prettyPrint=this.htmlData.getCheckBoxValueFrom(".prettyprint label input"),t.options.hashPrettyStyle=this.htmlData.getSelectedValueFrom("select[name='hashprettystyle']","compact"),t.options.prettyPrintDelimiter=this.htmlData.getSelectWithCustomInput("select[name='prettydelimiter']","custom",".custom-pretty-delimiter label input",t.delimiterMappings,"  "),t}setFromOptions(t){const e=(t==null?void 0:t.options)??{},n=(t==null?void 0:t.delimiterMappings)??new et().delimiterMappings;this.htmlData.setDropDownOptionToKeyValue("select[name='collectiontype']",e.collectionType,"array"),this.htmlData.setCheckBoxFrom(".assigntovariable label input",e.assignToVariable,!0),this.htmlData.setTextFieldToValue(".variablename label input",e.variableName??"data"),this.htmlData.setDropDownOptionToKeyValue("select[name='outputwrapper']",e.outputWrapper,"plain"),this.htmlData.setCheckBoxFrom(".quotenumbers label input",e.quoteNumbers,!1),this.htmlData.setDropDownOptionToKeyValue("select[name='hashkeystyle']",e.hashKeyStyle,"string"),this.htmlData.setCheckBoxFrom(".useanonymousobjects label input",e.useAnonymousObjects,!0),this.htmlData.setTextFieldToValue(".objectclassname label input",e.objectClassName??"Row"),this.htmlData.setDropDownOptionToKeyValue("select[name='objectrepresentation']",e.objectRepresentation,"class"),this.htmlData.setDropDownOptionToKeyValue("select[name='fieldnamestyle']",e.fieldNameStyle,"preserve"),this.htmlData.setCheckBoxFrom(".prettyprint label input",e.prettyPrint,!0),this.htmlData.setDropDownOptionToKeyValue("select[name='hashprettystyle']",e.hashPrettyStyle,"compact"),this.htmlData.setSelectWithCustomInput("select[name='prettydelimiter']","custom",".custom-pretty-delimiter label input",n,e.prettyPrintDelimiter)}}class wi{constructor(t){this.parent=t,this.htmlData=new j(this.parent)}addToGui(){this.parent.innerHTML=`
      <div class="kotlin-options" style="width:100%">
        <div><p><strong>Options</strong> <span data-help="kotlin-options" class="helpicon"></span></p></div>
        <div class="collectiontype">
          <label>Collection Type
            <select name="collectiontype">
              <option value="array">Array arrayOf()</option>
              <option value="list">List listOf()</option>
            </select>
          </label>
        </div>
        <div class="assigntovariable">
          <label><input type="checkbox" name="assigntovariable"> Assign to Variable</label>
        </div>
        <div class="mutableassignment option-child">
          <label><input type="checkbox" name="mutableassignment"> Mutable Assignment (var)</label>
        </div>
        <div class="variablename option-child">
          <label>Variable Name <input type="text" name="variablename" value="data" style="width:8em"></label>
        </div>
        <div class="quotenumbers">
          <label><input type="checkbox" name="quotenumbers"> Number Convert (Quote Numbers)</label>
        </div>
        <div class="useanonymousobjects">
          <label><input type="checkbox" name="useanonymousobjects"> Anonymous Objects (Map)</label>
        </div>
        <div class="usemutablecollections">
          <label><input type="checkbox" name="usemutablecollections"> Mutable Collections</label>
        </div>
        <div class="objectclassname option-child">
          <label>Object Name <input type="text" name="objectclassname" value="Row" style="width:8em"></label>
        </div>
        <div class="prettyprint">
          <label><input type="checkbox" name="prettyprint"> Pretty Print</label>
        </div>
        <div class="prettydelimiter option-child">
          <label>Delimiter
            <select name="prettydelimiter">
              <option value="tab">Tab [	]</option>
              <option value="space">Space [ ]</option>
              <option value="custom">Custom Value</option>
            </select>
          </label>
        </div>
        <div class="custom-pretty-delimiter option-child">
          <label>Custom Delimiter <input type="text" name="custom-pretty-delimiter" value="" style="width:8em"></label>
        </div>
        <div class="trailingcomma option-child">
          <label><input type="checkbox" name="trailingcomma"> Trailing Comma</label>
        </div>
        <div class="apply">
          <button class="apply-options">Apply</button>
        </div>
      </div>
    `}setApplyCallback(t){const e=this.parent.querySelector(".apply button");e.onclick=(function(){t(this.getOptionsFromGui())}).bind(this)}getOptionsFromGui(){const t=new nt;return t.options.collectionType=this.htmlData.getSelectedValueFrom("select[name='collectiontype']","list"),t.options.assignToVariable=this.htmlData.getCheckBoxValueFrom(".assigntovariable label input"),t.options.mutableAssignment=this.htmlData.getCheckBoxValueFrom(".mutableassignment label input"),t.options.variableName=this.htmlData.getTextInputValueFrom(".variablename label input")||"data",t.options.quoteNumbers=this.htmlData.getCheckBoxValueFrom(".quotenumbers label input"),t.options.useAnonymousObjects=this.htmlData.getCheckBoxValueFrom(".useanonymousobjects label input"),t.options.useMutableCollections=this.htmlData.getCheckBoxValueFrom(".usemutablecollections label input"),t.options.objectClassName=this.htmlData.getTextInputValueFrom(".objectclassname label input")||"Row",t.options.prettyPrint=this.htmlData.getCheckBoxValueFrom(".prettyprint label input"),t.options.prettyPrintDelimiter=this.htmlData.getSelectWithCustomInput("select[name='prettydelimiter']","custom",".custom-pretty-delimiter label input",t.delimiterMappings,"    "),t.options.trailingComma=this.htmlData.getCheckBoxValueFrom(".trailingcomma label input"),t}setFromOptions(t){const e=(t==null?void 0:t.options)??{},n=(t==null?void 0:t.delimiterMappings)??new nt().delimiterMappings;this.htmlData.setDropDownOptionToKeyValue("select[name='collectiontype']",e.collectionType,"list"),this.htmlData.setCheckBoxFrom(".assigntovariable label input",e.assignToVariable,!0),this.htmlData.setCheckBoxFrom(".mutableassignment label input",e.mutableAssignment,!1),this.htmlData.setTextFieldToValue(".variablename label input",e.variableName??"data"),this.htmlData.setCheckBoxFrom(".quotenumbers label input",e.quoteNumbers,!1),this.htmlData.setCheckBoxFrom(".useanonymousobjects label input",e.useAnonymousObjects,!0),this.htmlData.setCheckBoxFrom(".usemutablecollections label input",e.useMutableCollections,!1),this.htmlData.setTextFieldToValue(".objectclassname label input",e.objectClassName??"Row"),this.htmlData.setCheckBoxFrom(".prettyprint label input",e.prettyPrint,!0),this.htmlData.setSelectWithCustomInput("select[name='prettydelimiter']","custom",".custom-pretty-delimiter label input",n,e.prettyPrintDelimiter),this.htmlData.setCheckBoxFrom(".trailingcomma label input",e.trailingComma,!0)}}class vi{constructor(t){this.parent=t,this.htmlData=new j(this.parent)}addToGui(){this.parent.innerHTML=`
      <div class="csharp-options" style="width:100%">
        <div><p><strong>Options</strong> <span data-help="csharp-options" class="helpicon"></span></p></div>
        <div class="collectiontype">
          <label>Collection Type
            <select name="collectiontype">
              <option value="array">Array new[] { }</option>
              <option value="list">List new List&lt;object&gt; { }</option>
              <option value="ireadonlylist">IReadOnlyList new List&lt;object&gt; { }</option>
              <option value="ienumerable">IEnumerable new List&lt;object&gt; { }</option>
            </select>
          </label>
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
        <div class="dictionaryvaluetype">
          <label>Dictionary Value Type
            <select name="dictionaryvaluetype">
              <option value="auto">Auto (String when Number Convert on)</option>
              <option value="object">object</option>
              <option value="string">string</option>
            </select>
          </label>
        </div>
        <div class="useanonymousobjects">
          <label><input type="checkbox" name="useanonymousobjects"> Anonymous Objects (Dictionary/Map)</label>
        </div>
        <div class="objectclassname option-child">
          <label>Object Name <input type="text" name="objectclassname" value="Row" style="width:8em"></label>
        </div>
        <div class="prettyprint">
          <label><input type="checkbox" name="prettyprint"> Pretty Print</label>
        </div>
        <div class="prettydelimiter option-child">
          <label>Delimiter
            <select name="prettydelimiter">
              <option value="tab">Tab [	]</option>
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
    `}setApplyCallback(t){const e=this.parent.querySelector(".apply button");e.onclick=(function(){t(this.getOptionsFromGui())}).bind(this)}getOptionsFromGui(){const t=new it,e=this.htmlData.getSelectedValueFrom("select[name='collectiontype']","list");return t.options.collectionType=e==="array"?"array":"list",t.options.collectionTargetType=e,t.options.assignToVariable=this.htmlData.getCheckBoxValueFrom(".assigntovariable label input"),t.options.variableName=this.htmlData.getTextInputValueFrom(".variablename label input")||"data",t.options.quoteNumbers=this.htmlData.getCheckBoxValueFrom(".quotenumbers label input"),t.options.dictionaryValueType=this.htmlData.getSelectedValueFrom("select[name='dictionaryvaluetype']","auto"),t.options.useAnonymousObjects=this.htmlData.getCheckBoxValueFrom(".useanonymousobjects label input"),t.options.objectClassName=this.htmlData.getTextInputValueFrom(".objectclassname label input")||"Row",t.options.prettyPrint=this.htmlData.getCheckBoxValueFrom(".prettyprint label input"),t.options.prettyPrintDelimiter=this.htmlData.getSelectWithCustomInput("select[name='prettydelimiter']","custom",".custom-pretty-delimiter label input",t.delimiterMappings,"    "),t}setFromOptions(t){const e=(t==null?void 0:t.options)??{},n=(t==null?void 0:t.delimiterMappings)??new it().delimiterMappings,i=e.collectionTargetType??e.collectionType??"list";this.htmlData.setDropDownOptionToKeyValue("select[name='collectiontype']",i,"list"),this.htmlData.setCheckBoxFrom(".assigntovariable label input",e.assignToVariable,!0),this.htmlData.setTextFieldToValue(".variablename label input",e.variableName??"data"),this.htmlData.setCheckBoxFrom(".quotenumbers label input",e.quoteNumbers,!1),this.htmlData.setDropDownOptionToKeyValue("select[name='dictionaryvaluetype']",e.dictionaryValueType,"auto"),this.htmlData.setCheckBoxFrom(".useanonymousobjects label input",e.useAnonymousObjects,!0),this.htmlData.setTextFieldToValue(".objectclassname label input",e.objectClassName??"Row"),this.htmlData.setCheckBoxFrom(".prettyprint label input",e.prettyPrint,!0),this.htmlData.setSelectWithCustomInput("select[name='prettydelimiter']","custom",".custom-pretty-delimiter label input",n,e.prettyPrintDelimiter)}}class xi{constructor(t){this.parent=t,this.htmlData=new j(this.parent)}addToGui(){this.parent.innerHTML=`
      <div class="perl-options" style="width:100%">
        <div><p><strong>Options</strong> <span data-help="perl-options" class="helpicon"></span></p></div>
        <div class="collectiontype">
          <label>Collection Type
            <select name="collectiontype">
              <option value="array">Array Ref ([...])</option>
              <option value="list">List (...) </option>
            </select>
          </label>
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
        <div class="hashkeystyle">
          <label>Hash Key Style
            <select name="hashkeystyle">
              <option value="quoted">Quoted Keys ('name' =>)</option>
              <option value="bareword">Bareword Keys (name =>)</option>
            </select>
          </label>
        </div>
        <div class="useanonymousobjects">
          <label><input type="checkbox" name="useanonymousobjects"> Anonymous Objects (Hash/Map)</label>
        </div>
        <div class="objectclassname option-child">
          <label>Object Name <input type="text" name="objectclassname" value="Row" style="width:8em"></label>
        </div>
        <div class="objectinstantiationstyle option-child">
          <label>Object Instantiation
            <select name="objectinstantiationstyle">
              <option value="bless">bless(...)</option>
              <option value="constructor">Class-&gt;new(...)</option>
            </select>
          </label>
        </div>
        <div class="prettyprint">
          <label><input type="checkbox" name="prettyprint"> Pretty Print</label>
        </div>
        <div class="prettydelimiter option-child">
          <label>Delimiter
            <select name="prettydelimiter">
              <option value="tab">Tab [	]</option>
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
    `}setApplyCallback(t){const e=this.parent.querySelector(".apply button");e.onclick=(function(){t(this.getOptionsFromGui())}).bind(this)}getOptionsFromGui(){const t=new at;return t.options.collectionType=this.htmlData.getSelectedValueFrom("select[name='collectiontype']","array"),t.options.assignToVariable=this.htmlData.getCheckBoxValueFrom(".assigntovariable label input"),t.options.variableName=this.htmlData.getTextInputValueFrom(".variablename label input")||"data",t.options.quoteNumbers=this.htmlData.getCheckBoxValueFrom(".quotenumbers label input"),t.options.hashKeyStyle=this.htmlData.getSelectedValueFrom("select[name='hashkeystyle']","quoted"),t.options.useAnonymousObjects=this.htmlData.getCheckBoxValueFrom(".useanonymousobjects label input"),t.options.objectClassName=this.htmlData.getTextInputValueFrom(".objectclassname label input")||"Row",t.options.objectInstantiationStyle=this.htmlData.getSelectedValueFrom("select[name='objectinstantiationstyle']","bless"),t.options.prettyPrint=this.htmlData.getCheckBoxValueFrom(".prettyprint label input"),t.options.prettyPrintDelimiter=this.htmlData.getSelectWithCustomInput("select[name='prettydelimiter']","custom",".custom-pretty-delimiter label input",t.delimiterMappings,"  "),t}setFromOptions(t){const e=(t==null?void 0:t.options)??{},n=(t==null?void 0:t.delimiterMappings)??new at().delimiterMappings;this.htmlData.setDropDownOptionToKeyValue("select[name='collectiontype']",e.collectionType,"array"),this.htmlData.setCheckBoxFrom(".assigntovariable label input",e.assignToVariable,!0),this.htmlData.setTextFieldToValue(".variablename label input",e.variableName??"data"),this.htmlData.setCheckBoxFrom(".quotenumbers label input",e.quoteNumbers,!1),this.htmlData.setDropDownOptionToKeyValue("select[name='hashkeystyle']",e.hashKeyStyle,"quoted"),this.htmlData.setCheckBoxFrom(".useanonymousobjects label input",e.useAnonymousObjects,!0),this.htmlData.setTextFieldToValue(".objectclassname label input",e.objectClassName??"Row"),this.htmlData.setDropDownOptionToKeyValue("select[name='objectinstantiationstyle']",e.objectInstantiationStyle,"bless"),this.htmlData.setCheckBoxFrom(".prettyprint label input",e.prettyPrint,!0),this.htmlData.setSelectWithCustomInput("select[name='prettydelimiter']","custom",".custom-pretty-delimiter label input",n,e.prettyPrintDelimiter)}}class Si{constructor(t){this.parent=t,this.htmlData=new j(this.parent)}addToGui(){this.parent.innerHTML=`
        <div class="typescript-options" style="width:100%">
          <div><p><strong>Options</strong> <span data-help="typescript-options" class="helpicon"></span></p></div>

          <div class="collectiontype">
            <label>
              <span class="helpicon option-help-icon" data-help="typescript-option-collection-type" data-help-text="The TypeScript collection type used for the outer container."></span>
              Collection Type
              <select name="collectiontype">
                <option value="list">List (Array&lt;T&gt;)</option>
                <option value="array">Array [ ]</option>
              </select>
            </label>
            <br>
          </div>

          <div class="assigntovariable">
            <label>
              <span class="helpicon option-help-icon" data-help="typescript-option-assign-variable" data-help-text="Assign the collection to a named TypeScript variable."></span>
              <input type="checkbox" name="assigntovariable" value="assigntovariable" checked>
              Assign to Variable
            </label>
            <br>
          </div>

          <div class="variablename option-child">
            <label>
              <span class="helpicon option-help-icon" data-help="typescript-option-variable-name" data-help-text="Name of the TypeScript variable the collection is assigned to."></span>
              Variable Name
              <input type="text" name="variablename" value="data" style="width:8em">
            </label>
            <br>
          </div>

          <div class="quotenumbers">
            <label>
              <span class="helpicon option-help-icon" data-help="typescript-option-quote-numbers" data-help-text="When checked, numeric values are output as quoted strings. When unchecked, they are output as numeric literals."></span>
              <input type="checkbox" name="quotenumbers" value="quotenumbers">
              Number Convert (Quote Numbers)
            </label>
            <br>
          </div>

          <div class="useanonymousobjects">
            <label>
              <span class="helpicon option-help-icon" data-help="typescript-option-anonymous-objects" data-help-text="When checked, each row is output as an anonymous object literal. When unchecked, each row is output as a named class instance."></span>
              <input type="checkbox" name="useanonymousobjects" value="useanonymousobjects" checked>
              Use Anonymous Objects
            </label>
            <br>
          </div>

          <div class="objectclassname option-child">
            <label>
              <span class="helpicon option-help-icon" data-help="typescript-option-class-name" data-help-text="Class name used when Use Anonymous Objects is unchecked."></span>
              Class Name
              <input type="text" name="objectclassname" value="Row" style="width:8em">
            </label>
            <br>
          </div>

          <div class="blankvaluebehavior">
            <label>
              <span class="helpicon option-help-icon" data-help="typescript-option-blank-value" data-help-text="Choose how blank values are exported."></span>
              Blank Values
              <select name="blankvaluebehavior">
                <option value="null">null</option>
                <option value="empty-string">Empty String</option>
              </select>
            </label>
            <br>
          </div>

          <div class="prettyprint">
            <label>
              <span class="helpicon option-help-icon" data-help="typescript-option-pretty-print" data-help-text="Format output with line breaks and indentation."></span>
              <input type="checkbox" name="prettyprint" value="prettyprint" checked>
              Pretty Print
            </label>
            <br>
          </div>

          <div class="prettydelimiter option-child">
            <label>
              <span class="helpicon option-help-icon" data-help="typescript-option-delimiter" data-help-text="Indentation character used when Pretty Print is enabled."></span>
              Delimiter
              <select name="prettydelimiter">
                <option value="tab">Tab [	]</option>
                <option value="space">Space [ ]</option>
                <option value="custom">Custom Value</option>
              </select>
            </label>
            <br>
          </div>

          <div class="custom-pretty-delimiter option-child">
            <label>
              <span class="helpicon option-help-icon" data-help="typescript-option-custom-delimiter" data-help-text="When Delimiter is Custom Value, this value is used as indentation."></span>
              Custom Delimiter
              <input type="text" name="custom-pretty-delimiter" value="" style="width:8em">
            </label>
            <br>
          </div>

          <div class="apply">
            <button class="apply-options">Apply</button>
          </div>
        </div>
        `}setApplyCallback(t){const e=this.parent.querySelector(".apply button");e.onclick=(function(){t(this.getOptionsFromGui())}).bind(this)}getOptionsFromGui(){const t=new st;return t.options.collectionType=this.htmlData.getSelectedValueFrom("select[name='collectiontype']","list"),t.options.assignToVariable=this.htmlData.getCheckBoxValueFrom(".assigntovariable label input"),t.options.variableName=this.htmlData.getTextInputValueFrom(".variablename label input")||"data",t.options.quoteNumbers=this.htmlData.getCheckBoxValueFrom(".quotenumbers label input"),t.options.useAnonymousObjects=this.htmlData.getCheckBoxValueFrom(".useanonymousobjects label input"),t.options.objectClassName=this.htmlData.getTextInputValueFrom(".objectclassname label input")||"Row",t.options.blankValueBehavior=this.htmlData.getSelectedValueFrom("select[name='blankvaluebehavior']","null"),t.options.prettyPrint=this.htmlData.getCheckBoxValueFrom(".prettyprint label input"),t.options.prettyPrintDelimiter=this.htmlData.getSelectWithCustomInput("select[name='prettydelimiter']","custom",".custom-pretty-delimiter label input",t.delimiterMappings,"    "),t}setFromOptions(t){const e=(t==null?void 0:t.options)??{},n=(t==null?void 0:t.delimiterMappings)??new st().delimiterMappings;this.htmlData.setDropDownOptionToKeyValue("select[name='collectiontype']",e.collectionType,"list"),this.htmlData.setCheckBoxFrom(".assigntovariable label input",e.assignToVariable,!0),this.htmlData.setTextFieldToValue(".variablename label input",e.variableName??"data"),this.htmlData.setCheckBoxFrom(".quotenumbers label input",e.quoteNumbers,!1),this.htmlData.setCheckBoxFrom(".useanonymousobjects label input",e.useAnonymousObjects,!0),this.htmlData.setTextFieldToValue(".objectclassname label input",e.objectClassName??"Row"),this.htmlData.setDropDownOptionToKeyValue("select[name='blankvaluebehavior']",e.blankValueBehavior,"null"),this.htmlData.setCheckBoxFrom(".prettyprint label input",e.prettyPrint,!0),this.htmlData.setSelectWithCustomInput("select[name='prettydelimiter']","custom",".custom-pretty-delimiter label input",n,e.prettyPrintDelimiter)}}class Ci{constructor(t){this.parent=t,this.htmlData=new j(this.parent)}addToGui(){this.parent.innerHTML=`
      <div class="xml-options" style="width:100%">
        <div><p><strong>Options</strong> <span data-help="xml-options" class="helpicon"></span></p></div>

        <div class="root-element-name">
          <label><span class="helpicon option-help-icon" data-help="xml-option-root-element" data-help-text="Name of the XML root element. Invalid XML names are auto-fixed."></span>Root Element
            <input type="text" name="root-element-name" value="" style="width:10em">
          </label>
          <br>
        </div>

        <div class="item-element-name">
          <label><span class="helpicon option-help-icon" data-help="xml-option-item-element" data-help-text="Name of the XML item element for each row. Invalid XML names are auto-fixed."></span>Item Element
            <input type="text" name="item-element-name" value="" style="width:10em">
          </label>
          <br>
        </div>

        <div class="attributes-columns-csv">
          <label><span class="helpicon option-help-icon" data-help="xml-option-attributes" data-help-text="Comma-separated list of column names to output as item attributes. Unknown names are ignored."></span>Attributes
            <input type="text" name="attribute-columns-csv" value="" style="width:15em">
          </label>
          <br>
        </div>

        <div class="xml-header">
          <label>
            <span class="helpicon option-help-icon" data-help="xml-option-header" data-help-text="Add XML declaration header to output."></span>
            <input type="checkbox" name="include-xml-header" value="include-xml-header">
            XML Header
          </label>
          <br>
        </div>

        <div class="xml-namespace">
          <label><span class="helpicon option-help-icon" data-help="xml-option-xmlns" data-help-text="Optional XML namespace URI added as xmlns on the root element."></span>XMLNS
            <input type="text" name="xml-namespace" value="" style="width:15em">
          </label>
          <br>
        </div>

        <div class="apply">
          <button class="apply-options">Apply</button>
        </div>
      </div>
    `}setApplyCallback(t){let e=this.parent.querySelector(".xml-options .apply button");e.onclick=(function(){t(this.getOptionsFromGui())}).bind(this)}getOptionsFromGui(){const t=new Nt;return t.options.rootElementName=this.htmlData.getTextInputValueFrom("input[name='root-element-name']"),t.options.itemElementName=this.htmlData.getTextInputValueFrom("input[name='item-element-name']"),t.options.attributeColumnsCsv=this.htmlData.getTextInputValueFrom("input[name='attribute-columns-csv']"),t.options.includeXmlHeader=this.htmlData.getCheckBoxValueFrom("input[name='include-xml-header']"),t.options.xmlns=this.htmlData.getTextInputValueFrom("input[name='xml-namespace']"),t}setFromOptions(t){const e=t!=null&&t.options?t.options:{};this.htmlData.setTextFieldToValue("input[name='root-element-name']",e==null?void 0:e.rootElementName),this.htmlData.setTextFieldToValue("input[name='item-element-name']",e==null?void 0:e.itemElementName),this.htmlData.setTextFieldToValue("input[name='attribute-columns-csv']",e==null?void 0:e.attributeColumnsCsv),this.htmlData.setCheckBoxFrom("input[name='include-xml-header']",e==null?void 0:e.includeXmlHeader,!0),this.htmlData.setTextFieldToValue("input[name='xml-namespace']",e==null?void 0:e.xmlns)}}class $i{constructor(t){this.parent=t,this.htmlData=new j(this.parent)}addToGui(){this.parent.innerHTML=`
      <div class="sql-options" style="width:100%">
        <div><p><strong>Options</strong> <span data-help="sql-options" class="helpicon"></span></p></div>

        <div class="table-name">
          <label><span class="helpicon option-help-icon" data-help="sql-option-table-name" data-help-text="Name of the table used in INSERT statements."></span>Table Name
            <input type="text" name="table-name" value="" style="width:10em">
          </label>
          <br>
        </div>

        <div class="max-values-per-insert">
          <label><span class="helpicon option-help-icon" data-help="sql-option-max-values" data-help-text="Maximum number of value tuples per INSERT statement. Additional rows create more INSERT statements."></span>Max Values
            <input type="number" name="max-values-per-insert" min="1" value="100" style="width:6em">
          </label>
          <br>
        </div>

        <div class="quote-numeric">
          <label>
            <span class="helpicon option-help-icon" data-help="sql-option-quote-numeric" data-help-text="When checked, numeric-looking values are quoted as strings. When unchecked, numeric-looking values are emitted without quotes."></span>
            <input type="checkbox" name="quote-numeric" value="quote-numeric">
            Quote Numeric
          </label>
          <br>
        </div>

        <div class="sql-dialect">
          <label><span class="helpicon option-help-icon" data-help="sql-option-dialect" data-help-text="SQL dialect controls identifier quoting style and transaction wrapper syntax."></span>Dialect
            <select name="sql-dialect">
              <option value="ansi">ANSI SQL</option>
              <option value="postgresql">PostgreSQL</option>
              <option value="mysql">MySQL</option>
              <option value="sqlserver">SQL Server</option>
            </select>
          </label>
          <br>
        </div>

        <div class="quote-identifiers">
          <label>
            <span class="helpicon option-help-icon" data-help="sql-option-quote-identifiers" data-help-text="Quote table and column identifiers using the selected SQL dialect."></span>
            <input type="checkbox" name="quote-identifiers" value="quote-identifiers">
            Quote Identifiers
          </label>
          <br>
        </div>

        <div class="null-handling">
          <label><span class="helpicon option-help-icon" data-help="sql-option-null-handling" data-help-text="Choose how empty values and NULL literals are exported."></span>Null Handling
            <select name="null-handling">
              <option value="empty-string">Keep Empty As ''</option>
              <option value="empty-as-null">Empty As NULL</option>
              <option value="empty-or-literal-null">Empty Or NULL Literal As NULL</option>
            </select>
          </label>
          <br>
        </div>

        <div class="wrap-transaction">
          <label>
            <span class="helpicon option-help-icon" data-help="sql-option-wrap-transaction" data-help-text="Wrap generated INSERT statements with BEGIN/COMMIT transaction statements."></span>
            <input type="checkbox" name="wrap-transaction" value="wrap-transaction">
            Wrap Transaction
          </label>
          <br>
        </div>

        <div class="apply">
          <button class="apply-options">Apply</button>
        </div>
      </div>
    `}setApplyCallback(t){const e=this.parent.querySelector(".sql-options .apply button");e.onclick=(function(){t(this.getOptionsFromGui())}).bind(this)}getOptionsFromGui(){const t=new Pt,e=this.htmlData.getTextInputValueFrom("input[name='max-values-per-insert']"),n=Number.parseInt(e,10);return t.options.tableName=this.htmlData.getTextInputValueFrom("input[name='table-name']"),t.options.maxValuesPerInsert=Number.isNaN(n)?100:n,t.options.quoteNumeric=this.htmlData.getCheckBoxValueFrom("input[name='quote-numeric']"),t.options.sqlDialect=this.htmlData.getSelectedValueFrom("select[name='sql-dialect']","ansi"),t.options.quoteIdentifiers=this.htmlData.getCheckBoxValueFrom("input[name='quote-identifiers']"),t.options.nullHandling=this.htmlData.getSelectedValueFrom("select[name='null-handling']","empty-string"),t.options.wrapTransaction=this.htmlData.getCheckBoxValueFrom("input[name='wrap-transaction']"),t}setFromOptions(t){const e=t!=null&&t.options?t.options:{};this.htmlData.setTextFieldToValue("input[name='table-name']",e==null?void 0:e.tableName),this.htmlData.setTextFieldToValue("input[name='max-values-per-insert']",e==null?void 0:e.maxValuesPerInsert),this.htmlData.setCheckBoxFrom("input[name='quote-numeric']",e==null?void 0:e.quoteNumeric,!0),this.htmlData.setDropDownOptionToKeyValue("select[name='sql-dialect']",e==null?void 0:e.sqlDialect,"ansi"),this.htmlData.setCheckBoxFrom("input[name='quote-identifiers']",e==null?void 0:e.quoteIdentifiers,!0),this.htmlData.setDropDownOptionToKeyValue("select[name='null-handling']",e==null?void 0:e.nullHandling,"empty-string"),this.htmlData.setCheckBoxFrom("input[name='wrap-transaction']",e==null?void 0:e.wrapTransaction,!1)}}class Di{constructor(t){this.parent=t,this.htmlData=new j(this.parent)}addToGui(){this.parent.innerHTML=`
        <div class="gherkin-options" style="width:100%">
          <div><p><strong>Options</strong>  <span data-help="gherkin-options" class="helpicon"></span></p></div>

          <div class="incellpadding">
            <label><span class="helpicon option-help-icon" data-help="gherkin-option-in-cell-padding" data-help-text="Add spacing inside each gherkin table cell."></span>In Cell Padding
              <select name="incellpadding">
                <option value="none">None</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
                <option value="both">Both</option>
              </select>
            </label>
            <br>
          </div>

          
          <div class="prettyprint">            
            <label>
              <span class="helpicon option-help-icon" data-help="gherkin-option-pretty-print" data-help-text="Align and format table rows for easier reading in feature files."></span>
              <input type="checkbox" name="prettyprint" value="prettyprint">
              Pretty Print
            </label>
            <br>
          </div>

          <div class="showheadings">            
            <label>
              <span class="helpicon option-help-icon" data-help="gherkin-option-show-headers" data-help-text="Include column header row in the output table."></span>
              <input type="checkbox" name="showheadings" value="showheadings">
              Show Headers
            </label>
            <br>
          </div>
          
          <div class="leftindent">
            <label><span class="helpicon option-help-icon" data-help="gherkin-option-left-indent" data-help-text="Characters prefixed to each row, typically spaces or tabs for scenario indentation."></span>Left Indent
              <input type="text" name="leftindent" value='' style="width:5em">
            </label>
            <br>
          </div>
          

          <div class="apply">
            <button class="apply-options">Apply</button>
          </div>
      
        </div>
        `}setApplyCallback(t){let e=this.parent.querySelector(".gherkin-options .apply button");e.onclick=(function(){t(this.getOptionsFromGui())}).bind(this)}getOptionsFromGui(){let t=new jt,e={};return e.options={},e.options.showHeadings=this.htmlData.getCheckBoxValueFrom(".showheadings label input"),e.options.leftIndent=this.htmlData.getTextInputValueFrom(".leftindent label input"),e.options.inCellPadding=this.htmlData.getSelectedValueFrom(".incellpadding label select","none"),e.options.prettyPrint=this.htmlData.getCheckBoxValueFrom(".prettyprint label input"),t.mergeOptions(e),t}setFromOptions(t){let e=t!=null&&t.options?t.options:{};this.htmlData.setCheckBoxFrom(".showheadings label input",e==null?void 0:e.showHeadings,!0),this.htmlData.setTextFieldToValue(".leftindent label input",e==null?void 0:e.leftIndent),this.htmlData.setDropDownOptionToKeyValue(".incellpadding label select",e==null?void 0:e.inCellPadding),this.htmlData.setCheckBoxFrom(".prettyprint label input",e==null?void 0:e.prettyPrint,!1)}}class ji{constructor(t){this.parent=t,this.parentDivClass="html-options",this.htmlData=new j(this.parent)}addToGui(){this.parent.innerHTML=`
        <div class="${this.parentDivClass}" style="width:100%">
          <div><p><strong>Options</strong> <span data-help="html-table-options" class="helpicon"></span></p></div>

      
          <div class="compacthtml">            
            <label>
              <span class="helpicon option-help-icon" data-help="html-option-compact" data-help-text="Minify table markup by removing extra whitespace."></span>
              <input type="checkbox" name="compacthtml" value="compacthtml">
              Compact
            </label>
            <br>
          </div>

          <div class="prettyprint">            
            <label>
              <span class="helpicon option-help-icon" data-help="html-option-pretty-print" data-help-text="Format HTML with indentation and line breaks for readability."></span>
              <input type="checkbox" name="prettyprint" value="prettyprint">
              Pretty Print
            </label>
            <br>
          </div>

          <div class="prettydelimiter option-child">
            <label><span class="helpicon option-help-icon" data-help="html-option-delimiter" data-help-text="Indentation character used for pretty printed HTML output."></span>Delimiter
              <select name="prettydelimiter">
                <option value="tab">Tab [\\t]</option>
                <option value="space">Space [ ]</option>
                <option value="custom">Custom Value</option>
              </select>
            </label>
          <br>
          </div>
          <div class="custom-pretty-delimiter option-child">
            <label><span class="helpicon option-help-icon" data-help="html-option-custom-delimiter" data-help-text="When Delimiter is Custom Value, enter the indentation character here."></span>Custom
              <input type="text" name="custom-pretty-delimiter" value='' style="width:5em">
            </label>
            <br>
          </div>  

          <div class="addthead">            
            <label>
              <span class="helpicon option-help-icon" data-help="html-option-add-thead" data-help-text="Include a thead section containing header cells."></span>
              <input type="checkbox" name="addthead" value="addthead">
              Add &lt;thead&gt;
            </label>
            <br>
          </div>

          <div class="addtbody">            
            <label>
              <span class="helpicon option-help-icon" data-help="html-option-add-tbody" data-help-text="Include a tbody section containing data rows."></span>
              <input type="checkbox" name="addtbody" value="addtbody">
              Add &lt;tbody&gt;
            </label>
            <br>
          </div>
  

          <div class="apply">
            <button class="apply-options">Apply</button>
          </div>
      
        </div>
        `}setApplyCallback(t){let e=this.parent.querySelector(".apply button");e.onclick=(function(){t(this.getOptionsFromGui())}).bind(this)}getOptionsFromGui(){let t=new kt;t.options.compact=this.htmlData.getCheckBoxValueFrom(".compacthtml label input"),t.options.prettyPrint=this.htmlData.getCheckBoxValueFrom(".prettyprint label input");let e=this.htmlData.getSelectWithCustomInput("select[name='prettydelimiter']","custom",".custom-pretty-delimiter label input",t.delimiterMappings,"	");return t.options.prettyPrintDelimiter=e,t.options.addTheadToTable=this.htmlData.getCheckBoxValueFrom(".addthead label input"),t.options.addTbodyToTable=this.htmlData.getCheckBoxValueFrom(".addtbody label input"),t}setFromOptions(t){let e=t!=null&&t.options?t.options:{};this.htmlData.setCheckBoxFrom(".compacthtml label input",e==null?void 0:e.compact,!1),this.htmlData.setCheckBoxFrom(".prettyprint label input",e==null?void 0:e.prettyPrint,!1),this.htmlData.setCheckBoxFrom(".addthead label input",e==null?void 0:e.addTheadToTable,!1),this.htmlData.setCheckBoxFrom(".addtbody label input",e==null?void 0:e.addTbodyToTable,!1),this.htmlData.setSelectWithCustomInput("select[name='prettydelimiter']","custom",".custom-pretty-delimiter label input",t.delimiterMappings,e.prettyPrintDelimiter)}}const A=class A{constructor(t,e="junit4"){this.parent=t,this.htmlData=new j(this.parent),this.frameworkId=e}getFrameworkGroupName(){const t=this.frameworkId;return Object.keys(A.FRAMEWORK_GROUPS).find(e=>A.FRAMEWORK_GROUPS[e].includes(t))||"java"}getFrameworkOptions(){const t=this.getFrameworkGroupName();return A.FRAMEWORK_GROUPS[t].map(e=>({value:e,label:A.FRAMEWORK_LABELS[e]||e}))}getDataSourceStrategyOptions(){var e,n,i,s,r;const t=((r=(s=(i=(n=(e=this.parent)==null?void 0:e.querySelector)==null?void 0:n.call(e,"select[name='framework-id']"))==null?void 0:i.value)==null?void 0:s.trim)==null?void 0:r.call(s))||this.frameworkId;return t==="junit5"||t==="junit6"?[{value:"provider",label:"Provider/Method"},{value:"inline",label:"Inline"}]:t==="junit4"||t==="testng"?[{value:"provider",label:"Provider/Method"},{value:"inline",label:"Inline"}]:t==="pytest"||t==="unittest"||t==="nose2"||t==="jest"||t==="vitest"||t==="mocha"||t==="xunit"||t==="nunit"||t==="mstest"?[{value:"provider",label:"Provider/Method"},{value:"inline",label:"Inline"}]:[{value:"provider",label:"Provider/Method"}]}addToGui(){var s;const t=this.getFrameworkOptions(),e=this.getDataSourceStrategyOptions().map(r=>`<option value="${r.value}">${r.label}</option>`).join(""),n=t.map(r=>`<option value="${r.value}">${r.label}</option>`).join("");this.parent.innerHTML=`
      <div class="test-framework-options" style="width:100%">
        <div><p><strong>Options</strong> <span data-help="test-framework-options" class="helpicon"></span></p></div>

        <div class="framework-id">
          <label><span class="helpicon option-help-icon" data-help="test-framework-option-framework" data-help-text="Choose the unit test framework for the current language tab. Output syntax and available strategies depend on this choice."></span>Framework
            <select name="framework-id" ${t.length<=1?"disabled":""}>
              ${n}
            </select>
          </label>
          <br>
        </div>

        <div class="suite-name">
          <label><span class="helpicon option-help-icon" data-help="test-framework-option-suite-name" data-help-text="Class, module, or suite identifier used in generated test code where the framework supports naming."></span>Suite Name
            <input type="text" name="suite-name" value="GeneratedDataTests" style="width:12em">
          </label>
          <br>
        </div>

        <div class="test-name-prefix">
          <label><span class="helpicon option-help-icon" data-help="test-framework-option-test-name-prefix" data-help-text="Prefix used for generated test method names and test titles."></span>Test Name Prefix
            <input type="text" name="test-name-prefix" value="row" style="width:12em">
          </label>
          <br>
        </div>

        <div class="data-source-strategy">
          <label><span class="helpicon option-help-icon" data-help="test-framework-option-data-source-strategy" data-help-text="Controls how row data is supplied to tests: provider/method source or inline values."></span>Data Source Strategy
            <select name="data-source-strategy">
              ${e}
            </select>
          </label>
          <br>
        </div>

        <div class="include-setup">
          <label>
            <span class="helpicon option-help-icon" data-help="test-framework-option-include-setup" data-help-text="Include framework-specific setup scaffolding such as beforeEach, SetUp, fixture, or setup methods."></span>
            <input type="checkbox" name="include-setup" checked>
            Include Setup
          </label>
          <br>
        </div>

        <div class="pretty-print">
          <label>
            <span class="helpicon option-help-icon" data-help="test-framework-option-pretty-print" data-help-text="Format generated row data and test source for readability with one row per line where supported."></span>
            <input type="checkbox" name="pretty-print" checked>
            Pretty Print
          </label>
          <br>
        </div>

        <div class="apply">
          <button class="apply-options">Apply</button>
        </div>
      </div>
    `;const i=this.parent.querySelector("select[name='framework-id']");i&&(i.value=t.some(r=>r.value===this.frameworkId)?this.frameworkId:(s=t[0])==null?void 0:s.value,i.addEventListener("change",()=>this.refreshDataSourceStrategyOptions())),this.refreshDataSourceStrategyOptions()}refreshDataSourceStrategyOptions(){var i;const t=this.parent.querySelector("select[name='data-source-strategy']");if(!t)return;const e=t.value,n=this.getDataSourceStrategyOptions();t.innerHTML=n.map(s=>`<option value="${s.value}">${s.label}</option>`).join(""),t.value=n.some(s=>s.value===e)?e:(i=n[0])==null?void 0:i.value}setApplyCallback(t){const e=this.parent.querySelector(".apply button");e.onclick=(function(){t(this.getOptionsFromGui())}).bind(this)}getOptionsFromGui(){const t=new C;return t.outputFormat=this.htmlData.getSelectedValueFrom("select[name='framework-id']",this.frameworkId)||this.frameworkId,t.options.suiteName=this.htmlData.getTextInputValueFrom("input[name='suite-name']")||t.options.suiteName,t.options.testNamePrefix=this.htmlData.getTextInputValueFrom("input[name='test-name-prefix']")||t.options.testNamePrefix,t.options.dataSourceStrategy=this.htmlData.getSelectedValueFrom("select[name='data-source-strategy']","provider")||"provider",t.options.includeSetup=this.htmlData.getCheckBoxValueFrom("input[name='include-setup']"),t.options.prettyPrint=this.htmlData.getCheckBoxValueFrom("input[name='pretty-print']"),t}setFromOptions(t){var s;const e=(t==null?void 0:t.options)??{},n=(t==null?void 0:t.outputFormat)||this.frameworkId,i=(n==="junit5"||n==="junit6")&&e.dataSourceStrategy==="csv"?"inline":e.dataSourceStrategy;this.htmlData.setDropDownOptionToKeyValue("select[name='framework-id']",n,this.frameworkId),this.frameworkId=n,this.refreshDataSourceStrategyOptions(),this.htmlData.setTextFieldToValue("input[name='suite-name']",e.suiteName??"GeneratedDataTests"),this.htmlData.setTextFieldToValue("input[name='test-name-prefix']",e.testNamePrefix??"row"),this.htmlData.setDropDownOptionToKeyValue("select[name='data-source-strategy']",i,((s=this.getDataSourceStrategyOptions()[0])==null?void 0:s.value)||"provider"),this.htmlData.setCheckBoxFrom("input[name='include-setup']",e.includeSetup,!0),this.htmlData.setCheckBoxFrom("input[name='pretty-print']",e.prettyPrint,!0)}};W(A,"FRAMEWORK_GROUPS",{java:["junit4","junit5","junit6","testng"],python:["pytest","unittest","nose2"],javascript:["jest","vitest","mocha"],csharp:["xunit","nunit","mstest"],ruby:["rspec","minitest"],php:["phpunit","pest"],kotlin:["kotest","junit5-kotlin","spek"],perl:["test-more","test2-suite"]}),W(A,"FRAMEWORK_LABELS",{junit4:"JUnit4",junit5:"JUnit5",junit6:"JUnit6",testng:"TestNG",pytest:"PyTest",unittest:"unittest",nose2:"nose2",jest:"Jest",vitest:"Vitest",mocha:"Mocha",xunit:"xUnit",nunit:"NUnit",mstest:"MSTest",rspec:"RSpec",minitest:"Minitest",phpunit:"PHPUnit",pest:"Pest",kotest:"Kotest","junit5-kotlin":"JUnit5 Kotlin",spek:"Spek","test-more":"Test::More","test2-suite":"Test2::Suite"});let Qt=A;const Xt={"import-export-controls":`
      <p>Using the import and export controls you can:</p>
      <ul>
        <li>"Set Text From Grid"<br> to refresh the text box for the chosen output format.</li>
        <li>"Set Grid From Text"<br> to <a class="helplink" href="/docs/editing-data/text-editing" target="anywaydatadocs">import the text box content</a> into the grid.</li>
        <li>"Choose File"<br> to <a class="helplink" href="docs/editing-data/import-from-file" target="anywaydatadocs">import a text file</a> of the chosen format.</li>
        <li>"Download File"<br> to <a class="helplink" href="docs/editing-data/exporting-data" target="anywaydatadocs">export the Data Grid</a> items in the chosen format.</li>
        <li>"Drag and Drop File"<br> to <a class="helplink" href="docs/editing-data/import-from-file" target="anywaydatadocs">import the file</a> contents using the currently chosen format.</li>
      </ul>
      <p>The options shown depend on the output type, some types are not supported for input and so only the output options will be shown.</p>
    `,"markdown-table-options":`
      <p>Export the table data as <a class="helplink" href="docs/data-formats/markdown/markdown" target="anywaydatadocs">Markdown</a>, a human readable format which can be easily converted to HTML or PDF.</p>
      <p>Choose from the list of <a class="helplink" href="docs/data-formats/markdown/options" target="anywaydatadocs">formatting options</a> and press the [Apply] button to render the data in the chosen style.</p>
      <p><a class="helplink" href="docs/data-formats/markdown/options" target="anywaydatadocs">Learn more</a></p>
    `,"ascii-table-options":`
      <p>Export the table data as Ascii Table suitable for adding to an email or text file.</p>
      <p>Choose from a list of predefined formats and press the [Apply] button to render the table in the chosen style.</p>
      <p><a class="helplink" href="docs/data-formats/ascii-tables/options" target="anywaydatadocs">Learn more</a></p>
    `,"csv-options":`
      <p>Export the table data as <a class="helplink" href="docs/data-formats/csv/csv" target="anywaydatadocs">CSV (Comma Separated Values)</a> suitable for importing into a spreadsheet.</p>
      <p>Choose from the formatting options and press the [Apply] button to render the data in the chosen style.</p>
      <p><a class="helplink" href="docs/data-formats/csv/options" target="anywaydatadocs">Learn more</a></p>
    `,"delimiter-options":`
      <p>Export the table data as a <a class="helplink" href="docs/data-formats/delimited/delimited" target="anywaydatadocs">Delimited</a> output suitable for importing or copy and pasting into a spreadsheet.</p>
      <p>Choose from the formatting options and press the [Apply] button to render the data in the chosen style.</p>
      <p><em>Hint: Use Tab delimiter if copying into another table editing application like a spreadsheet.</em></p>
      <p><a class="helplink" href="docs/data-formats/delimited/options" target="anywaydatadocs">Learn more</a></p>
    `,"json-options":`
      <p>Export the table data as a <a class="helplink" href="docs/data-formats/json/json" target="anywaydatadocs">JSON</a> output suitable for JSON interchange messages e.g. APIs.</p>
      <p>Choose from the formatting options and press the [Apply] button to render the JSON in the chosen style.</p>
      <p><a class="helplink" href="docs/data-formats/json/options" target="anywaydatadocs">Learn more</a></p>
    `,"jsonl-options":`
      <p>Export the table data as JSON Lines (JSONL), with one JSON object per line and no surrounding array.</p>
      <p>JSONL output is always compact single-line records. Number Convert can optionally convert numeric-looking values to numbers.</p>
      <p><a class="helplink" href="docs/data-formats/jsonl/jsonl" target="anywaydatadocs">Learn more</a> and see <a class="helplink" href="docs/data-formats/jsonl/options" target="anywaydatadocs">JSONL options</a>.</p>
    `,"javascript-options":`
      <p>Export the table data as a <a class="helplink" href="docs/data-formats/javascript/javascript" target="anywaydatadocs">Javascript</a> output suitable for using in a Javascript application or unit testing code.</p>
      <p>Choose from the formatting options and press the [Apply] button to render the Javascript in the chosen style.</p>
      <p><a class="helplink" href="docs/data-formats/javascript/options" target="anywaydatadocs">Learn more</a></p>
    `,"java-options":`
      <p>Export the table data as Java code using either anonymous \`Map\` rows or named class instances.</p>
      <p>Configure collection type, variable/class naming, number quoting, blank value handling, imports, and pretty printing before pressing [Apply].</p>
      <p><a class="helplink" href="docs/data-formats/java/options" target="anywaydatadocs">Learn more</a></p>
    `,"python-options":`
      <p>Export the table data as Python code using dictionaries or named class instances.</p>
      <p>Configure collection type, variable/class naming, decimal handling, quote style, import statements, and pretty printing before pressing [Apply].</p>
      <p><a class="helplink" href="docs/data-formats/python/options" target="anywaydatadocs">Learn more</a></p>
    `,"php-options":`
      <p>Export the table data as PHP code using associative arrays or named class instances.</p>
      <p>Configure collection type, PHP tag, variable/class naming, stdClass or class instances, number and scalar coercion, compatibility mode, constructor style, and pretty printing before pressing [Apply].</p>
      <p><em>Named constructor arguments require PHP 8+.</em></p>
      <p><a class="helplink" href="docs/data-formats/php/options" target="anywaydatadocs">Learn more</a></p>
    `,"ruby-options":`
      <p>Export the table data as Ruby code using hashes or named class instances.</p>
      <p>Configure collection type, variable/class naming, number quoting, object style, and pretty printing before pressing [Apply].</p>
      <p><a class="helplink" href="docs/data-formats/ruby/options" target="anywaydatadocs">Learn more</a></p>
    `,"perl-options":`
      <p>Export the table data as Perl code using hash references or blessed object instances.</p>
      <p>Configure collection type, variable/class naming, number quoting, hash key style, object style (bless or constructor), and pretty printing before pressing [Apply].</p>
      <p><a class="helplink" href="docs/data-formats/perl/options" target="anywaydatadocs">Learn more</a></p>
    `,"kotlin-options":`
      <p>Export the table data as Kotlin code using maps or named data class instances.</p>
      <p>Configure collection type, val/var assignment, mutable collections, Kotlin-safe naming, number quoting, object style, and pretty printing (including trailing comma) before pressing [Apply].</p>
      <p><a class="helplink" href="docs/data-formats/kotlin/options" target="anywaydatadocs">Learn more</a></p>
    `,"csharp-options":`
      <p>Export the table data as C# code using dictionaries or named class instances.</p>
      <p>Configure collection target type, variable/class naming, number quoting, dictionary value typing, keyword-safe identifiers, object style, and pretty printing before pressing [Apply].</p>
      <p><a class="helplink" href="docs/data-formats/csharp/options" target="anywaydatadocs">Learn more</a></p>
    `,"typescript-options":`
      <p>Export the table data as TypeScript code using anonymous objects or named class instances.</p>
      <p>Configure collection type, variable/class naming, blank value handling, number quoting, and pretty printing before pressing [Apply].</p>
      <p><a class="helplink" href="docs/data-formats/typescript/options" target="anywaydatadocs">Learn more</a></p>
    `,"xml-options":`
      <p>Export the table data as <a class="helplink" href="docs/data-formats/xml/xml" target="anywaydatadocs">XML</a>, suitable for system integration and data interchange.</p>
      <p>Configure root and item element names, optional attributes, XML header, and XML namespace, then press [Apply] to render using those settings.</p>
      <p><a class="helplink" href="docs/data-formats/xml/options" target="anywaydatadocs">Learn more</a></p>
    `,"sql-options":`
      <p>Export the table data as SQL INSERT statements for loading data into a table.</p>
      <p>Configure table name, max values per INSERT statement, and whether numeric-looking values are quoted.</p>
      <p><a class="helplink" href="docs/data-formats/sql/sql" target="anywaydatadocs">Learn more</a> and see <a class="helplink" href="docs/data-formats/sql/options" target="anywaydatadocs">SQL options</a>.</p>
    `,"gherkin-options":`
      <p>Export the table data as <a class="helplink" href="docs/data-formats/gherkin/gherkin" target="anywaydatadocs">Gherkin</a>, a human readable format used in BDD automation.</p>
      <p>The <a class="helplink" href="docs/data-formats/gherkin/options" target="anywaydatadocs">formatting options</a> help pretty print the output to fit in the specification.</p>
      <p><a class="helplink" href="docs/data-formats/gherkin/options" target="anywaydatadocs">Learn more</a></p>
    `,"html-table-options":`
      <p>Export the table data as a <a class="helplink" href="docs/data-formats/html/html-tables" target="anywaydatadocs">HTML Table</a> suitable for adding to a web page.</p>
      <p>Choose from the formatting options and press the [Apply] button to render the data as HTML code.</p>
      <p>Import any HTML code by pasting the \`table\` contents into the text area and pressing \`Set Grid From Text\`</p>
      <p><a class="helplink" href="docs/data-formats/html/options" target="anywaydatadocs">Learn more</a></p>
    `,"test-framework-options":`
      <p>Export the table data as unit test code for a selected framework.</p>
      <p>Configure suite name, test name prefix, data source strategy, setup inclusion, and formatting options before pressing [Apply].</p>
      <p><a class="helplink" href="docs/data-formats/unit-test-code/options" target="anywaydatadocs">See full unit-test option mapping</a></p>
    `},Xn={"test-data-summary-title":`
      <p>The Test Data section allows you to randomly generate data to populate the grid. You can then export to the various supported formats.</p>
      <p><a class="helplink" href="/docs/test-data/test-data-generation" target="anywaydatadocs">Learn more</a></p>
    `};function Zn(a){let t=a.getElementById("inline-help-items");return t||(t=a.createElement("div"),t.id="inline-help-items",t.style.display="none",a.body.appendChild(t)),t}function Yn(a,t){const e=Zn(a);e.innerHTML="",Object.entries(t).forEach(([n,i])=>{const s=a.createElement("div");s.setAttribute("data-name",n),s.innerHTML=i,e.appendChild(s)})}function ti(a){return function(){const e=globalThis==null?void 0:globalThis.tippy;typeof e=="function"&&e(".helpicon[data-help]",{content(n){const i=n.getAttribute("data-help"),s=n.getAttribute("data-help-text");if(s)return s;const r=a.getElementById("inline-help-items");if(!r||!i)return"";const o=r.querySelector(`div[data-name='${i}']`);return o?o.innerHTML:(console.log("TODO: Create help for "+i),"")},placement:"top-start",allowHTML:!0,interactive:!0})}}function Ti({documentObj:a=document,includeAppOnlyEntries:t=!1}={}){const e=t?{...Xt,...Xn}:Xt;Yn(a,e);const n=ti(a);typeof window<"u"&&(window.updateHelpHints=n),n()}export{hi as A,Si as B,xe as C,V as D,ji as E,Di as F,fe as G,kt as H,Qt as I,H as J,wi as K,li as L,Tt as M,ni as N,Ti as O,Vt as P,yi as R,$i as S,ii as T,Ci as X,Rt as a,ge as b,ye as c,St as d,Ct as e,Se as f,w as g,_ as h,si as i,ri as j,oi as k,ai as l,ut as m,Et as n,pi as o,ci as p,ui as q,In as r,di as s,Qn as t,fi as u,mi as v,gi as w,vi as x,xi as y,bi as z};
