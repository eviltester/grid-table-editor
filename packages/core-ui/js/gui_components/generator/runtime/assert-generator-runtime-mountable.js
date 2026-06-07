function assertGeneratorRuntimeMountable(runtime) {
  if (!runtime.parentElement) {
    throw new Error('Generator page runtime requires a parentElement');
  }
  if (typeof runtime.TabulatorCtor !== 'function') {
    throw new Error('Tabulator library is not available');
  }
}

export { assertGeneratorRuntimeMountable };
