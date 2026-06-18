import { validateStringValue, validateVinValue, validateVrmValue } from '../command-help/command-help-validators.js';

const DOMAIN_FAKER_VEHICLE_KEYWORD_DEFINITIONS = [
  {
    keyword: 'vehicle.bicycle',
    delegate: {
      type: 'faker',
      target: 'vehicle.bicycle',
    },
    help: {
      summary: 'Returns a type of bicycle.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/vehicle',
      fakerDocsUrl: 'https://fakerjs.dev/api/vehicle',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'vehicle.bicycle',
          sampleReturnValue: 'Flat-Foot Comfort Bicycle',
          description: 'Shows the default vehicle.bicycle call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'vehicle.color',
    delegate: {
      type: 'faker',
      target: 'vehicle.color',
    },
    help: {
      summary: 'Returns a vehicle color.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/vehicle',
      fakerDocsUrl: 'https://fakerjs.dev/api/vehicle',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'vehicle.color',
          sampleReturnValue: 'magenta',
          description: 'Shows the default vehicle.color call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'vehicle.fuel',
    delegate: {
      type: 'faker',
      target: 'vehicle.fuel',
    },
    help: {
      summary: 'Returns a fuel type.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/vehicle',
      fakerDocsUrl: 'https://fakerjs.dev/api/vehicle',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'vehicle.fuel',
          sampleReturnValue: 'Electric',
          description: 'Shows the default vehicle.fuel call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'vehicle.manufacturer',
    delegate: {
      type: 'faker',
      target: 'vehicle.manufacturer',
    },
    help: {
      summary: 'Returns a manufacturer name.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/vehicle',
      fakerDocsUrl: 'https://fakerjs.dev/api/vehicle',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'vehicle.manufacturer',
          sampleReturnValue: 'Lamborghini',
          description: 'Shows the default vehicle.manufacturer call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'vehicle.model',
    delegate: {
      type: 'faker',
      target: 'vehicle.model',
    },
    help: {
      summary: 'Returns a vehicle model.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/vehicle',
      fakerDocsUrl: 'https://fakerjs.dev/api/vehicle',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'vehicle.model',
          sampleReturnValue: 'Escalade',
          description: 'Shows the default vehicle.model call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'vehicle.type',
    delegate: {
      type: 'faker',
      target: 'vehicle.type',
    },
    help: {
      summary: 'Returns a vehicle type.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/vehicle',
      fakerDocsUrl: 'https://fakerjs.dev/api/vehicle',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'vehicle.type',
          sampleReturnValue: 'Extended Cab Pickup',
          description: 'Shows the default vehicle.type call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'vehicle.vehicle',
    delegate: {
      type: 'faker',
      target: 'vehicle.vehicle',
    },
    help: {
      summary: 'Returns a random vehicle.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/vehicle',
      fakerDocsUrl: 'https://fakerjs.dev/api/vehicle',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'vehicle.vehicle',
          sampleReturnValue: 'Lamborghini Model X',
          description: 'Shows the default vehicle.vehicle call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'vehicle.vin',
    delegate: {
      type: 'faker',
      target: 'vehicle.vin',
    },
    help: {
      summary: 'Returns a vehicle identification number (VIN).',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/vehicle',
      fakerDocsUrl: 'https://fakerjs.dev/api/vehicle',
      validator: validateVinValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'vehicle.vin',
          sampleReturnValue: 'DP09436BDHKN28064',
          description: 'Shows the default vehicle.vin call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'vehicle.vrm',
    delegate: {
      type: 'faker',
      target: 'vehicle.vrm',
    },
    help: {
      summary: 'Returns a vehicle registration number (Vehicle Registration Mark - VRM)',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/vehicle',
      fakerDocsUrl: 'https://fakerjs.dev/api/vehicle',
      validator: validateVrmValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'vehicle.vrm',
          sampleReturnValue: 'KS03DCE',
          description: 'Shows the default vehicle.vrm call.',
        },
      ],
      args: [],
    },
  },
];

export { DOMAIN_FAKER_VEHICLE_KEYWORD_DEFINITIONS };
