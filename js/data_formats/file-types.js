// todo: this should be wrapped into the importer and exporter so an exporter returns filetype
const fileTypes ={};
fileTypes["csv"] = {type: "csv", fileExtension: ".csv"};
fileTypes["dsv"] = {type: "dsv", fileExtension: ".txt"};
fileTypes["markdown"] =   {type: "markdown", fileExtension: ".md"};
fileTypes["json"] =   {type: "json", fileExtension: ".json"};
fileTypes["javascript"] =   {type: "javascript", fileExtension: ".js"};
fileTypes["gherkin"] =   {type: "gherkin", fileExtension: ".gherkin"};
fileTypes["html"] = {type: "html", fileExtension: ".html"};
fileTypes["asciitable"] = {type: "asciitable", fileExtension: ".txt"};


export {fileTypes};