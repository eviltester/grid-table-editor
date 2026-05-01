class FormatOptionsPanelComponent {
  constructor(page) {
    this.page = page;
    this.container = page.locator('#tabbedTextArea .options-parent');
  }

  async expectVisible() {
    await this.container.waitFor({ state: 'visible' });
  }

  async expectReady() {
    await this.expectVisible();
    await this.container.locator('.apply-options').first().waitFor({ state: 'visible' });
  }

  async hasApplyButton() {
    return this.container.locator('.apply-options').first().isVisible();
  }

  async isApplyEnabled() {
    const button = this.container.locator('.apply-options').first();
    return button.isEnabled();
  }

  async apply() {
    await this.container.locator('.apply-options').first().click();
  }

  async getCurrentOptionState() {
    return this.container.evaluate((root) => {
      const state = {};
      root.querySelectorAll('input,select,textarea').forEach((el) => {
        const key = el.name || el.id || el.className || el.tagName;
        if (el.tagName.toLowerCase() === 'select') {
          state[key] = el.value;
        } else if (el.type === 'checkbox' || el.type === 'radio') {
          state[key] = !!el.checked;
        } else {
          state[key] = el.value;
        }
      });
      return state;
    });
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

  async setFirstEditableOption() {
    const select = this.container.locator('select').first();
    if (await select.count()) {
      const current = await select.inputValue();
      const options = await select.locator('option').allTextContents();
      const next = options.length > 1 && options[1] !== current ? 1 : 0;
      await select.selectOption({ index: next });
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
}

module.exports = { FormatOptionsPanelComponent };
