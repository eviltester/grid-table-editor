const { expect } = require('@playwright/test');

function trackPageErrors(page) {
  const pageErrors = [];
  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });
  return pageErrors;
}

function expectNoPageErrors(pageErrors) {
  expect(pageErrors).toEqual([]);
}

module.exports = {
  trackPageErrors,
  expectNoPageErrors,
};
