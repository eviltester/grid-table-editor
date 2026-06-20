import { validateJwtValue } from '../../../command-help/command-help-validators.js';

const INTERNET_JWT_KEYWORD_DEFINITION = {
  keyword: 'internet.jwt',
  delegate: {
    type: 'faker',
    target: 'internet.jwt',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Generates a random JWT (JSON Web Token).',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/internet',
    fakerDocsUrl: 'https://fakerjs.dev/api/internet',
    validator: validateJwtValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'internet.jwt()',
        sampleReturnValue:
          'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3ODE3NDc3NTAsImV4cCI6MTc4MTc0Nzc2MSwibmJmIjoxNzY5MzMwODQwLCJpc3MiOiJIZWdtYW5uIC0gSm9obnN0b24iLCJzdWIiOiJhM2UwYTY4Mi0zY2Y1LTRiZWUtYTEwMi1lMTZmOGI1YWQwY2YiLCJhdWQiOiI0YzE3ZTQ0Mi0wYTM0LTQ3MDktODI5Yi0xNmI2MDhhOGY5ZTIiLCJqdGkiOiJjNjJlNWNiZS05YzU0LTRlNmYtOWE5MS1mNzk2M2U5MDk1OGUifQ.UC0VGZa8VH4KKVI7111fRxyQ7hAYy1NeOoRKy83726dIy04XzcfKcAYQeuCP914u',
        description: 'Shows internet.jwt when optional params are omitted.',
      },
      {
        functionCall: 'internet.jwt(header={"value":"sample"})',
        sampleReturnValue:
          'eyJ2YWx1ZSI6InNhbXBsZSJ9.eyJpYXQiOjE3ODE3NDc3NTAsImV4cCI6MTc4MTgwOTk4NywibmJmIjoxNzUwMjY5MzM0LCJpc3MiOiJEaWJiZXJ0IC0gTGluZCIsInN1YiI6IjZhM2UwYTY4LTIzY2YtNDViZS1iZTEwLTJlMTZmOGI1YWQwYyIsImF1ZCI6ImI0YzE3ZTQ0LTIwYTMtNDQ3MC04OTI5LWIxNmI2MDhhOGY5ZSIsImp0aSI6IjJjNjJlNWNiLWU5YzUtNDRlNi1iZmE5LTFmNzk2M2U5MDk1OCJ9.mUC0VGZa8VH4KKVI7111fRxyQ7hAYy1NeOoRKy83726dIy04XzcfKcAYQeuCP914',
        description: 'Shows internet.jwt using header.',
      },
      {
        functionCall: 'internet.jwt(payload={"value":"sample"})',
        sampleReturnValue:
          'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2YWx1ZSI6InNhbXBsZSJ9.0i95bloxpGcS1Fpy8cNYjGST52aS6qXxGjGP1KZKhM6rUih81Gdgu3z9AH6pHp3x',
        description: 'Shows internet.jwt using payload.',
      },
      {
        functionCall: 'internet.jwt(refDate=1718755200000)',
        sampleReturnValue:
          'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTg3MDQ4MzAsImV4cCI6MTcxODcwNDg0MSwibmJmIjoxNzA2Mjg3OTIwLCJpc3MiOiJIZWdtYW5uIC0gSm9obnN0b24iLCJzdWIiOiJhM2UwYTY4Mi0zY2Y1LTRiZWUtYTEwMi1lMTZmOGI1YWQwY2YiLCJhdWQiOiI0YzE3ZTQ0Mi0wYTM0LTQ3MDktODI5Yi0xNmI2MDhhOGY5ZTIiLCJqdGkiOiJjNjJlNWNiZS05YzU0LTRlNmYtOWE5MS1mNzk2M2U5MDk1OGUifQ.UC0VGZa8VH4KKVI7111fRxyQ7hAYy1NeOoRKy83726dIy04XzcfKcAYQeuCP914u',
        description: 'Shows internet.jwt using refDate.',
      },
    ],
    args: [
      {
        name: 'header',
        type: 'object',
        required: false,
        description: 'The header to use for the token. If present, it will replace any default values.',
      },
      {
        name: 'payload',
        type: 'object',
        required: false,
        description: 'The payload to use for the token. If present, it will replace any default values.',
      },
      {
        name: 'refDate',
        type: 'number',
        required: false,
        description: 'Reference date as a Unix timestamp in milliseconds since epoch used as the generation anchor.',
      },
    ],
  },
};

export { INTERNET_JWT_KEYWORD_DEFINITION };
