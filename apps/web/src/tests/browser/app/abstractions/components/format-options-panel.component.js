const { expect } = require('@playwright/test');

const TEXT_PREVIEW_EDITOR_ROOT = '[data-role="text-preview-editor-root"]';

class FormatOptionsPanelComponent {
  constructor(page) {
    this.page = page;
    this.container = page.locator(`${TEXT_PREVIEW_EDITOR_ROOT} [data-role="options-panel-root"]`);
  }

  async expectVisible() {
    await expect(this.container).toBeVisible();
  }

  async expectReady() {
    await this.expectVisible();
    await expect(this.getApplyButton()).toBeVisible();
  }

  async hasApplyButton() {
    return this.getApplyButton().isVisible();
  }

  async isApplyEnabled() {
    const button = this.getApplyButton();
    return button.isEnabled();
  }

  async expectApplyEnabled(enabled = true) {
    const button = this.getApplyButton();
    if (enabled) {
      await expect(button).toBeEnabled();
      return;
    }
    await expect(button).toBeDisabled();
  }

  async apply() {
    await this.getApplyButton().click();
  }

  async getCurrentOptionState() {
    const state = {};
    const fields = this.container.locator('input,select,textarea');
    const total = await fields.count();
    for (let index = 0; index < total; index += 1) {
      const field = fields.nth(index);
      const key =
        (await field.getAttribute('name')) ||
        (await field.getAttribute('id')) ||
        (await field.getAttribute('class')) ||
        `field-${index}`;

      const isSelect = (await field.locator('xpath=self::select').count()) > 0;
      const isTextarea = (await field.locator('xpath=self::textarea').count()) > 0;
      if (isSelect || isTextarea) {
        state[key] = await field.inputValue();
        continue;
      }

      const type = ((await field.getAttribute('type')) || '').toLowerCase();
      if (type === 'checkbox' || type === 'radio') {
        state[key] = await field.isChecked();
      } else {
        state[key] = await field.inputValue();
      }
    }

    return state;
  }

  async setOption(controlName, value) {
    const select = this.container.locator(`select[name="${controlName}"]`).first();
    if (await select.count()) {
      await select.selectOption(String(value));
      return;
    }

    const checkbox = this.container.locator(`input[type="checkbox"][name="${controlName}"]`).first();
    if (await checkbox.count()) {
      if (value) {
        await checkbox.check();
      } else {
        await checkbox.uncheck();
      }
      return;
    }

    const radio = this.container.locator(`input[type="radio"][name="${controlName}"][value="${value}"]`).first();
    if (await radio.count()) {
      await radio.check();
      return;
    }

    const input = this.container.locator(`input[name="${controlName}"], textarea[name="${controlName}"]`).first();
    if (await input.count()) {
      await input.fill(String(value));
      return;
    }

    throw new Error(`Could not find option control named "${controlName}"`);
  }

  async expectCsvOptionAccessibleNames() {
    await expect(this.container.getByRole('checkbox', { name: 'Use Quotes', exact: true })).toBeVisible();
    await expect(this.container.getByRole('textbox', { name: 'Quote Char', exact: true })).toBeVisible();
    await expect(this.container.getByRole('checkbox', { name: /show help for this option use quotes/i })).toHaveCount(
      0
    );
    await expect(this.container.getByRole('textbox', { name: /show help for this option quote char/i })).toHaveCount(0);
    await expect(this.container.getByRole('button', { name: 'Show help for this option' }).first()).toBeVisible();
  }

  async setFirstEditableOption() {
    const select = this.container.locator('select').first();
    if (await select.count()) {
      const current = await select.inputValue();
      const values = await select.locator('option').evaluateAll((options) => options.map((option) => option.value));
      const next = values.findIndex((value) => value !== current);
      await select.selectOption({ index: next === -1 ? 0 : next });
      return 'select';
    }

    const checkbox = this.container.locator('input[type="checkbox"]').first();
    if (await checkbox.count()) {
      const checked = await checkbox.isChecked();
      if (checked) {
        await checkbox.uncheck();
      } else {
        await checkbox.check();
      }
      return 'checkbox';
    }

    const textInput = this.container.locator('input[type="text"], textarea').first();
    if (await textInput.count()) {
      const current = await textInput.inputValue();
      await textInput.fill(`${current || ''}x`);
      return 'text';
    }

    throw new Error('No editable option controls found in current options panel');
  }

  getApplyButton() {
    return this.container.locator('[data-role="apply-options-button"]').first();
  }
}

module.exports = { FormatOptionsPanelComponent };
