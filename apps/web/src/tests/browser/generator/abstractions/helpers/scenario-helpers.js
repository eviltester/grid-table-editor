const { expect } = require('@playwright/test');
const { GeneratorPage } = require('../generator.page');
const { trackPageErrors, expectNoPageErrors } = require('../../../shared/helpers/page-error-helpers');

async function openGenerator(page) {
  const pageErrors = trackPageErrors(page);
  const generatorPage = new GeneratorPage(page);
  await generatorPage.goto();
  return { generatorPage, pageErrors };
}

module.exports = {
  openGenerator,
  expectNoPageErrors,
  expect,
};
