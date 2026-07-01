import { validateStringValue } from '../../../command-help/command-help-validators.js';
import { createLoremCountArgsValidator } from './lorem-arg-validators.js';

const validateLoremParagraphsArgs = createLoremCountArgsValidator({
  countName: 'paragraphCount',
  minName: 'paragraphCountMin',
  maxName: 'paragraphCountMax',
});

const LOREM_PARAGRAPHS_KEYWORD_DEFINITION = {
  keyword: 'lorem.paragraphs',
  delegate: {
    type: 'faker',
    target: 'lorem.paragraphs',
    argTransform: 'loremCountFromHelpArgs',
  },
  help: {
    summary: 'Generates the given number of paragraphs.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/lorem',
    fakerDocsUrl: 'https://fakerjs.dev/api/lorem',
    validator: validateStringValue,
    argsValidator: validateLoremParagraphsArgs,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'lorem.paragraphs()',
        sampleReturnValue:
          'Suppellex a cognatus arca aliquam audentia. Crux fugit curatio stillicidium bardus. Acsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus.\n' +
          'Varius ago adflicto assentator utrimque altus curiositas vita expedita stultus. Stipes trucido accusamus tandem voveo. Cicuta testimonium amet dedico ver claudeo civis aperio.\n' +
          'Spoliatio beneficium cena. Adnuo natus arca odit subseco ambulo. Suasoria cupio admiratio facilis sonitus dolorum.',
        description: 'Shows lorem.paragraphs when optional params are omitted.',
      },
      {
        functionCall: 'lorem.paragraphs(max=10, min=1)',
        sampleReturnValue:
          'A cognatus arca aliquam audentia coniuratio crux fugit. Stillicidium bardus utrimque acsi spargo cur. Aqua avaritia thesaurus volo combibo stultus utor.\n' +
          'Ago adflicto assentator utrimque altus curiositas vita expedita stultus comedo. Trucido accusamus tandem voveo tamisium cicuta testimonium amet. Ver claudeo civis aperio accusantium spoliatio.\n' +
          'Cena deprimo adnuo natus. Odit subseco ambulo cupio. Cupio admiratio facilis sonitus dolorum vinco occaecati venio.\n' +
          'Apud timor cubicularis asperiores. Conqueror tantillus sursum vacuus quia tantillus conscendo centum vehemens cursus. Somnus quasi amplus vir defaeco nesciunt cumque capillus venio natus.\n' +
          'Provident compello et. Consuasor ver qui accendo vetus studio vulpes at approbo vicissitudo. Aedificium temeritas tego vesica sum ante accusantium acquiro.',
        description: 'Shows lorem.paragraphs using min.',
      },
      {
        functionCall: 'lorem.paragraphs(max=5)',
        sampleReturnValue:
          'A cognatus arca aliquam audentia coniuratio crux fugit. Stillicidium bardus utrimque acsi spargo cur. Aqua avaritia thesaurus volo combibo stultus utor.\n' +
          'Ago adflicto assentator utrimque altus curiositas vita expedita stultus comedo. Trucido accusamus tandem voveo tamisium cicuta testimonium amet. Ver claudeo civis aperio accusantium spoliatio.\n' +
          'Cena deprimo adnuo natus. Odit subseco ambulo cupio. Cupio admiratio facilis sonitus dolorum vinco occaecati venio.',
        description: 'Shows lorem.paragraphs using max.',
      },
      {
        functionCall: 'lorem.paragraphs(paragraphCount=5)',
        sampleReturnValue:
          'Suppellex a cognatus arca aliquam audentia. Crux fugit curatio stillicidium bardus. Acsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus.\n' +
          'Varius ago adflicto assentator utrimque altus curiositas vita expedita stultus. Stipes trucido accusamus tandem voveo. Cicuta testimonium amet dedico ver claudeo civis aperio.\n' +
          'Spoliatio beneficium cena. Adnuo natus arca odit subseco ambulo. Suasoria cupio admiratio facilis sonitus dolorum.\n' +
          'Occaecati venio apto apud timor cubicularis asperiores vestigium conqueror tantillus. Vacuus quia tantillus conscendo centum vehemens cursus vobis. Quasi amplus vir defaeco nesciunt cumque capillus venio.\n' +
          'Abbas provident compello et valde consuasor ver. Accendo vetus studio vulpes at approbo vicissitudo. Aedificium temeritas tego vesica sum ante accusantium acquiro.',
        description: 'Shows lorem.paragraphs using paragraphCount.',
      },
      {
        functionCall: 'lorem.paragraphs(separator="-")',
        sampleReturnValue:
          'Suppellex a cognatus arca aliquam audentia. Crux fugit curatio stillicidium bardus. Acsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus.-' +
          'Varius ago adflicto assentator utrimque altus curiositas vita expedita stultus. Stipes trucido accusamus tandem voveo. Cicuta testimonium amet dedico ver claudeo civis aperio.-' +
          'Spoliatio beneficium cena. Adnuo natus arca odit subseco ambulo. Suasoria cupio admiratio facilis sonitus dolorum.',
        description: 'Shows lorem.paragraphs using separator.',
      },
      {
        functionCall: 'lorem.paragraphs(paragraphCountMax=5)',
        sampleReturnValue:
          'A cognatus arca aliquam audentia coniuratio crux fugit. Stillicidium bardus utrimque acsi spargo cur. Aqua avaritia thesaurus volo combibo stultus utor.\n' +
          'Ago adflicto assentator utrimque altus curiositas vita expedita stultus comedo. Trucido accusamus tandem voveo tamisium cicuta testimonium amet. Ver claudeo civis aperio accusantium spoliatio.\n' +
          'Cena deprimo adnuo natus. Odit subseco ambulo cupio. Cupio admiratio facilis sonitus dolorum vinco occaecati venio.',
        description: 'Shows lorem.paragraphs using paragraphCountMax.',
      },
      {
        functionCall: 'lorem.paragraphs(paragraphCountMin=5)',
        sampleReturnValue:
          'Suppellex a cognatus arca aliquam audentia. Crux fugit curatio stillicidium bardus. Acsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus.\n' +
          'Varius ago adflicto assentator utrimque altus curiositas vita expedita stultus. Stipes trucido accusamus tandem voveo. Cicuta testimonium amet dedico ver claudeo civis aperio.\n' +
          'Spoliatio beneficium cena. Adnuo natus arca odit subseco ambulo. Suasoria cupio admiratio facilis sonitus dolorum.\n' +
          'Occaecati venio apto apud timor cubicularis asperiores vestigium conqueror tantillus. Vacuus quia tantillus conscendo centum vehemens cursus vobis. Quasi amplus vir defaeco nesciunt cumque capillus venio.\n' +
          'Abbas provident compello et valde consuasor ver. Accendo vetus studio vulpes at approbo vicissitudo. Aedificium temeritas tego vesica sum ante accusantium acquiro.',
        description: 'Shows lorem.paragraphs using paragraphCountMin.',
      },
    ],
    args: [
      {
        name: 'min',
        type: 'number',
        required: false,
        description: 'Minimum bound used when generating a value.',
      },
      {
        name: 'max',
        type: 'number',
        required: false,
        description: 'Maximum bound used when generating a value.',
      },
      {
        name: 'paragraphCount',
        type: 'number',
        required: false,
        description: 'Number of paragraphs to generate.',
      },
      {
        name: 'separator',
        type: 'string',
        required: false,
        description: 'Separator inserted between generated items.',
      },
      {
        name: 'paragraphCountMax',
        type: 'number',
        required: false,
        description: 'The maximum number of paragraphs to generate.',
      },
      {
        name: 'paragraphCountMin',
        type: 'number',
        required: false,
        description: 'The minimum number of paragraphs to generate.',
      },
    ],
  },
};

export { LOREM_PARAGRAPHS_KEYWORD_DEFINITION };
