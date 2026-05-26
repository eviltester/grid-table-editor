function scheduleTimeout(callback, delayMs, ...args) {
  const timeoutHandle = setTimeout(callback, delayMs, ...args);
  if (timeoutHandle && typeof timeoutHandle.unref === 'function') {
    timeoutHandle.unref();
  }
  return timeoutHandle;
}

export { scheduleTimeout };
