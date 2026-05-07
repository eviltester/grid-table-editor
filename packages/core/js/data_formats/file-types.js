// TODO : this should be wrapped into the importer and exporter so an exporter returns filetype
// TODO : there should be a default file name as well as extension e.g. asciitable.txt to help disctinguish from dsv.txt
// TODO : roll this into the convertors
const fileTypes = {};
fileTypes['csv'] = { type: 'csv', fileExtension: '.csv' };
fileTypes['dsv'] = { type: 'dsv', fileExtension: '.txt' };
fileTypes['markdown'] = { type: 'markdown', fileExtension: '.md' };
fileTypes['json'] = { type: 'json', fileExtension: '.json' };
fileTypes['jsonl'] = { type: 'jsonl', fileExtension: '.jsonl' };
fileTypes['javascript'] = { type: 'javascript', fileExtension: '.js' };
fileTypes['python'] = { type: 'python', fileExtension: '.py' };
fileTypes['php'] = { type: 'php', fileExtension: '.php' };
fileTypes['ruby'] = { type: 'ruby', fileExtension: '.rb' };
fileTypes['kotlin'] = { type: 'kotlin', fileExtension: '.kt' };
fileTypes['csharp'] = { type: 'csharp', fileExtension: '.cs' };
fileTypes['perl'] = { type: 'perl', fileExtension: '.pl' };
fileTypes['java'] = { type: 'java', fileExtension: '.java' };
fileTypes['typescript'] = { type: 'typescript', fileExtension: '.ts' };
fileTypes['junit4'] = { type: 'junit4', fileExtension: '.java' };
fileTypes['junit5'] = { type: 'junit5', fileExtension: '.java' };
fileTypes['junit6'] = { type: 'junit6', fileExtension: '.java' };
fileTypes['testng'] = { type: 'testng', fileExtension: '.java' };
fileTypes['pytest'] = { type: 'pytest', fileExtension: '.py' };
fileTypes['unittest'] = { type: 'unittest', fileExtension: '.py' };
fileTypes['nose2'] = { type: 'nose2', fileExtension: '.py' };
fileTypes['jest'] = { type: 'jest', fileExtension: '.js' };
fileTypes['vitest'] = { type: 'vitest', fileExtension: '.ts' };
fileTypes['mocha'] = { type: 'mocha', fileExtension: '.js' };
fileTypes['xunit'] = { type: 'xunit', fileExtension: '.cs' };
fileTypes['nunit'] = { type: 'nunit', fileExtension: '.cs' };
fileTypes['mstest'] = { type: 'mstest', fileExtension: '.cs' };
fileTypes['rspec'] = { type: 'rspec', fileExtension: '.rb' };
fileTypes['minitest'] = { type: 'minitest', fileExtension: '.rb' };
fileTypes['phpunit'] = { type: 'phpunit', fileExtension: '.php' };
fileTypes['pest'] = { type: 'pest', fileExtension: '.php' };
fileTypes['kotest'] = { type: 'kotest', fileExtension: '.kt' };
fileTypes['junit5-kotlin'] = { type: 'junit5-kotlin', fileExtension: '.kt' };
fileTypes['spek'] = { type: 'spek', fileExtension: '.kt' };
fileTypes['test-more'] = { type: 'test-more', fileExtension: '.pl' };
fileTypes['test2-suite'] = { type: 'test2-suite', fileExtension: '.pl' };
fileTypes['xml'] = { type: 'xml', fileExtension: '.xml' };
fileTypes['sql'] = { type: 'sql', fileExtension: '.sql' };
fileTypes['gherkin'] = { type: 'gherkin', fileExtension: '.gherkin' };
fileTypes['html'] = { type: 'html', fileExtension: '.html' };
fileTypes['asciitable'] = { type: 'asciitable', fileExtension: '.txt' };

export { fileTypes };
