import { jest } from '@jest/globals';
import { InlineMessageController } from '../../../js/gui_components/shared/primitives/inline-message/inline-message-controller.js';

describe('InlineMessageController', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('setStatus clears severity and applies loading state only when message exists', () => {
    const controller = new InlineMessageController({
      props: { severity: 'error' },
    });

    controller.setStatus('Loading preview...', true);
    expect(controller.getState()).toMatchObject({
      message: 'Loading preview...',
      severity: '',
      isLoading: true,
    });

    controller.setStatus('', true);
    expect(controller.getState()).toMatchObject({
      message: '',
      severity: '',
      isLoading: false,
    });
  });

  test('show auto clears after timeout and preserves severity before clearing', () => {
    const controller = new InlineMessageController({
      props: { timeoutMs: 2500 },
    });

    controller.show('Schema invalid', { severity: 'error' });
    expect(controller.getState()).toMatchObject({
      message: 'Schema invalid',
      severity: 'error',
      isLoading: false,
    });

    jest.advanceTimersByTime(2500);
    expect(controller.getState()).toMatchObject({
      message: '',
      severity: '',
      isLoading: false,
    });
  });

  test('sticky show does not auto clear until explicitly cleared', () => {
    const controller = new InlineMessageController({
      props: { timeoutMs: 1000 },
    });

    controller.show('Keep me here', { severity: 'warning', sticky: true });
    jest.advanceTimersByTime(1000);

    expect(controller.getState()).toMatchObject({
      message: 'Keep me here',
      severity: 'warning',
    });

    controller.clear();
    expect(controller.getState().message).toBe('');
  });

  test('scheduleClear cancels earlier pending reset when called again', () => {
    const controller = new InlineMessageController();
    controller.setStatus('Ready');

    controller.scheduleClear(5000);
    controller.scheduleClear(1000);
    jest.advanceTimersByTime(1000);

    expect(controller.getState().message).toBe('');
  });
});
