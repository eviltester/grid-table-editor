import { PapaWrappa } from '../../packages/core/js/utils/papawrappa.js';

describe('PapaWrappa', () => {
  let originalPapa;

  beforeEach(() => {
    originalPapa = global.Papa;
    global.Papa = {
      parse: jest.fn(() => ({ data: [] })),
      unparse: jest.fn(() => 'csv output'),
    };
  });

  afterEach(() => {
    global.Papa = originalPapa;
  });

  test('parse delegates to Papa.parse without options', () => {
    const wrapper = new PapaWrappa();
    const result = wrapper.parse('a,b');

    expect(global.Papa.parse).toHaveBeenCalledWith('a,b');
    expect(result).toEqual({ data: [] });
  });

  test('parse delegates to Papa.parse with options', () => {
    const wrapper = new PapaWrappa();
    const options = { header: true };

    wrapper.parse('a,b', options);

    expect(global.Papa.parse).toHaveBeenCalledWith('a,b', options);
  });

  test('unparse delegates to Papa.unparse without options', () => {
    const wrapper = new PapaWrappa();
    const result = wrapper.unparse([{ a: 1 }]);

    expect(global.Papa.unparse).toHaveBeenCalledWith([{ a: 1 }]);
    expect(result).toBe('csv output');
  });

  test('unparse delegates to Papa.unparse with options', () => {
    const wrapper = new PapaWrappa();
    const options = { delimiter: ';' };

    wrapper.unparse([{ a: 1 }], options);

    expect(global.Papa.unparse).toHaveBeenCalledWith([{ a: 1 }], options);
  });
});
