import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import { RulesParser } from "./data_generation/testDataRules";
import { convertDataToArrayOfStrings } from "./outputData";
import Papa from "papaparse";
import type { UnparseConfig } from "papaparse";

const argv = yargs(hideBin(process.argv))
    .usage('Usage: anywaydata <command> [options]')
    .command('generate', 'Generate Test Data from an input spec')
      .example('anywaydata generate -i inputdata.txt -n 10 -o outputdata.txt', 
        'Generate 10 lines of data, using the input data spec, written to outputdata.txt'
      )
      .alias('i', 'inputfile')
      .nargs('i', 1)
      .describe('i', 'Text file with a data spec')
      .demandOption(['i'])
      .alias('n', 'numberOfLines')
      .nargs('n', 1)
      .describe('n', 'Number of Lines of Data to Generate')
      .demandOption(['n'])
      .alias('o', 'outputfile')
      .nargs('o', 1)
      .describe('o', 'Output file')
    .help('h')
    .alias('h', 'help')
    .epilog('copyright 2025 Compendium Developments Ltd')
    .parse()


    // faker commands should match the faker API
    // https://fakerjs.dev/api/

    const inputFile = Bun.file(argv.inputfile);

    const testDataSpec = await inputFile.text();

    // const testDataSpec = readFileContentsSync(argv.inputfile)

    const enableProgressLog = !argv.outputfile

    outputProgressLog("> Processing Input File " + argv.inputfile, enableProgressLog );
    outputProgressLog("", enableProgressLog);
    outputProgressLog(testDataSpec, enableProgressLog);
    outputProgressLog("", enableProgressLog);

    outputProgressLog("> Parsing Input File into Test Data Generation Rules", enableProgressLog);

    const rulesParser = new RulesParser();
    rulesParser.parseText(testDataSpec);

    if(!rulesParser.isValid()){
      outputProgressLog("Invalid Rules File:", true);
      outputProgressLog(rulesParser.errors.join("\n"), true)
    }else{

      const papaParseConfig = {} as UnparseConfig;

      papaParseConfig.quoteChar = "\"";
      papaParseConfig.quotes = true;
      papaParseConfig.header = true;

      //console.log(rulesParser.testDataRules)
      outputProgressLog(`> Generating ${argv.numberOfLines} lines of random data`, enableProgressLog);
      outputProgressLog("e.g.", enableProgressLog);
      const exampleData = rulesParser.testDataRules.generate(1);
      outputProgressLog(`${convertDataToArrayOfStrings(exampleData)[0]}`, enableProgressLog)
      outputProgressLog(`${convertDataToArrayOfStrings(exampleData)[1]}`, enableProgressLog)

      //console.log(convertDataToArrayOfStrings(rulesParser.testDataRules.generate(1)))

      const csvOutput = Papa.unparse(
        rulesParser.testDataRules.generate(argv.numberOfLines),
        // v9 was returning objects bu amended fakerTestDataRule to handle this
        //convertDataToArrayOfStrings(rulesParser.testDataRules.generate(argv.numberOfLines)),
        papaParseConfig
      );

      outputProgressLog(`> Writing to CSV - ${argv.outputfile}`, enableProgressLog)

      if(argv.outputfile){
        await Bun.write(argv.outputfile, csvOutput);
      }else{
        //no output file provided, write to standard out
        console.log(csvOutput);
      }
    }

    function outputProgressLog(logMessage: string, silent: Boolean ){
      if(!silent){
        console.log(logMessage)
      }
    }

