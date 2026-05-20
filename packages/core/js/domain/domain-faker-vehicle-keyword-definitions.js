const DOMAIN_FAKER_VEHICLE_KEYWORD_DEFINITIONS = [
  {
    keyword: 'vehicle.bicycle',
    delegate: {
      type: 'faker',
      target: 'vehicle.bicycle',
    },
    help: {
      summary: 'Returns a type of bicycle.',
      docsUrl: 'https://fakerjs.dev/api/vehicle',
      example: 'Touring Bicycle',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/vehicle',
      example: 'sky blue',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/vehicle',
      example: 'Gasoline',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/vehicle',
      example: 'Hyundai',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/vehicle',
      example: 'Aventador',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/vehicle',
      example: 'Hatchback',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/vehicle',
      example: 'Ford CTS',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/vehicle',
      example: '7SJ9N0LM3LM265056',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/vehicle',
      example: 'OD11RTZ',
      returnType: 'string',
      args: [],
    },
  },
];

export { DOMAIN_FAKER_VEHICLE_KEYWORD_DEFINITIONS };
