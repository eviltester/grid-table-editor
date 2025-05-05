import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import { TestDataGenerator } from "../../js/data_generation/testDataGenerator";
import { convertDataToArrayOfStrings } from "./outputData";
import Papa from "papaparse";
import type { UnparseConfig } from "papaparse";
import { faker } from '@faker-js/faker';
import { number } from "yargs";
const RandExp = require('randexp');

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
      .default('n',1, "Default 1 to test the rules")
      .alias('o', 'outputfile')
      .nargs('o', 1)
      .describe('o', 'Output file')
      .alias('t', 'testMode')
      .nargs('t', 0)
      .describe('t', 'Test the input spec by writing all output to console and only generating 1 line')
    .help('h')
    .alias('h', 'help')
    .epilog('copyright 2025 Compendium Developments Ltd')
    .parse()


    // faker commands should match the faker API
    // https://fakerjs.dev/api/

    const inputFile = Bun.file(argv.inputfile);

    if(!await inputFile.exists()){
      console.log(`Input file does not exist`);  
    }

    const testDataSpec = await inputFile.text();

    // const testDataSpec = readFileContentsSync(argv.inputfile)

    var numberToGenerate = argv.numberOfLines;

    // if no output file provided then by default output no progress log
    var hideProgressLog = !argv.outputfile

    if(argv.testMode==true){
      numberToGenerate = 1;
      hideProgressLog = false;
      outputProgressLog("> Operating in Test Mode - showing progress and generating 1 entry", hideProgressLog);
    }

    outputProgressLog("> Processing Input File " + argv.inputfile, hideProgressLog );
    outputProgressLog("", hideProgressLog);
    outputProgressLog(testDataSpec, hideProgressLog);
    outputProgressLog("", hideProgressLog);

    outputProgressLog("> Parsing Input File into Test Data Generation Rules", hideProgressLog);

    const generator = new TestDataGenerator(faker, RandExp);
    generator.importSpec(testDataSpec);
    generator.compile();

    outputProgressLog("", hideProgressLog);
    outputProgressLog(generator.compilationReport(), hideProgressLog);
    outputProgressLog("", hideProgressLog);

    if(!generator.isValid()){
      outputProgressLog("Invalid Rules File:", false);
      outputProgressLog(generator.errors().join("\n"), false)
    }else{

      const papaParseConfig = {} as UnparseConfig;

      papaParseConfig.quoteChar = "\"";
      papaParseConfig.quotes = true;
      papaParseConfig.header = true;

      outputProgressLog("", hideProgressLog);
      outputProgressLog(`> Generating ${numberToGenerate} lines of random data`, hideProgressLog);
      outputProgressLog("", hideProgressLog);
      outputProgressLog("e.g.", hideProgressLog);
      const exampleData = generator.generate(1);
      outputProgressLog(`${convertDataToArrayOfStrings(exampleData)[0]}`, hideProgressLog)
      outputProgressLog(`${convertDataToArrayOfStrings(exampleData)[1]}`, hideProgressLog)
      outputProgressLog("", hideProgressLog);

      const csvOutput = Papa.unparse(
        generator.generate(numberToGenerate),
        papaParseConfig
      );

      const displayOutputFileName = argv.outputfile ? argv.outputfile : "OUTPUT TO CONSOLE";
      outputProgressLog(`> Writing to CSV - ${displayOutputFileName}`, hideProgressLog)
      outputProgressLog("", hideProgressLog);

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

