import { test, expect } from '@playwright/test';

class RateEstimatorPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    /** @type {import('@playwright/test').Page | import('@playwright/test').Frame} */
    this.ctx = page; // Will switch to the correct frame if widget is embedded
  }

  async goto() {
    await this.page.goto('https://www.cpsenergy.com/content/corporate/en/my-home/savings-programs/rate_estimator_residential.html', { waitUntil: 'domcontentloaded' });
    await this.acceptCookiesIfPresent();
    await this.resolveCalculatorContext();
  }

  async acceptCookiesIfPresent() {
    const tryClick = async (root) => {
      const candidates = [
        root.getByRole('button', { name: /accept all/i }),
        root.getByRole('button', { name: /accept & close/i }),
        root.getByRole('button', { name: /accept/i }),
        root.getByRole('button', { name: /agree/i }),
        root.getByRole('button', { name: /got it/i }),
      ];
      for (const btn of candidates) {
        try {
          if (await btn.isVisible({ timeout: 1000 })) {
            await btn.click({ trial: true }).catch(() => {});
            await btn.click().catch(() => {});
            return true;
          }
        } catch (_) { /* ignore */ }
      }
      return false;
    };

    try {
      await tryClick(this.page);
      for (const frame of this.page.frames()) {
        await tryClick(frame);
      }
    } catch (_) {
      // ignore consent errors
    }
  }

  async resolveCalculatorContext() {
    // First, wait for frames to load a bit
    await this.page.waitForTimeout(1000);

    // Quick check if controls exist directly on the page
    const pageHasCalculator = await this._hasCalculatorControls(this.page);
    if (pageHasCalculator) {
      this.ctx = this.page;
      return;
    }

    // Otherwise search through frames for recognizable controls
    for (const frame of this.page.frames()) {
      if (frame === this.page.mainFrame()) continue;
      const has = await this._hasCalculatorControls(frame);
      if (has) {
        this.ctx = frame;
        return;
      }
    }

    // If still not found, try waiting a bit longer and retry frames
    await this.page.waitForTimeout(2000);
    for (const frame of this.page.frames()) {
      const has = await this._hasCalculatorControls(frame);
      if (has) {
        this.ctx = frame;
        return;
      }
    }
  }

  async _hasCalculatorControls(root) {
    const checks = [
      root.getByLabel(/service\s*type/i).first(),
      root.getByRole('combobox', { name: /service\s*type/i }).first(),
      root.getByRole('radio', { name: /electric only/i }).first(),
      root.getByRole('heading', { name: /rate\s*(calculator|estimator)/i }).first(),
    ];
    for (const loc of checks) {
      try {
        if (await loc.isVisible({ timeout: 500 })) {
          return true;
        }
      } catch (_) { /* ignore */ }
    }
    return false;
  }

  async expectCalculatorVisible() {
    const candidates = [
      this.ctx.getByRole('heading', { name: /rate\s*(calculator|estimator)/i }).first(),
      this.ctx.getByLabel(/service\s*type/i).first(),
      this.ctx.getByRole('combobox', { name: /service\s*type/i }).first(),
      this.ctx.getByRole('radio', { name: /electric only/i }).first(),
      this.ctx.getByRole('radio', { name: /electric and gas/i }).first(),
    ];

    let foundVisible = null;
    for (const loc of candidates) {
      try {
        await loc.waitFor({ state: 'visible', timeout: 5000 });
        foundVisible = loc;
        break;
      } catch (_) { /* try next */ }
    }
    if (!foundVisible) {
      throw new Error('Rate calculator section is not visible on the page.');
    }
  }

  async selectServiceType(optionLabel) {
    // Try radio buttons first
    const radio = this.ctx.getByRole('radio', { name: new RegExp(optionLabel, 'i') }).first();
    if (await radio.count()) {
      if (await radio.isVisible().catch(() => false)) {
        await radio.check({ force: true });
        return;
      }
    }

    // Try a native select (combobox) labeled "Service Type"
    const select = this.ctx.getByRole('combobox', { name: /service\s*type/i }).first();
    if (await select.count()) {
      if (await select.isVisible().catch(() => false)) {
        // Try selecting by label
        await select.selectOption({ label: optionLabel }).catch(async () => {
          // Fallback: by value or partial label
          const valueCandidate = optionLabel.toLowerCase().replace(/\s+/g, '_');
          await select.selectOption(valueCandidate).catch(async () => {
            // Final fallback: click to open and choose option by text
            await select.click();
            const opt = this.ctx.getByRole('option', { name: new RegExp(optionLabel, 'i') }).first();
            if (await opt.isVisible({ timeout: 2000 }).catch(() => false)) {
              await opt.click();
            } else {
              // Try listbox item
              const li = this.ctx.getByText(new RegExp(`^\\s*${optionLabel}\\s*$`, 'i')).first();
              await li.click({ timeout: 2000 });
            }
          });
        });
        return;
      }
    }

    // Try a fieldset/group with label "Service Type" and click its option by text
    const group = this.ctx.getByRole('group', { name: /service\s*type/i }).first();
    if (await group.count()) {
      const opt = group.getByText(new RegExp(`^\\s*${optionLabel}\\s*$`, 'i')).first();
      if (await opt.isVisible().catch(() => false)) {
        await opt.click();
        return;
      }
    }

    // Generic attempt: click text matching the option
    const generic = this.ctx.getByText(new RegExp(`^\\s*${optionLabel}\\s*$`, 'i')).first();
    if (await generic.isVisible().catch(() => false)) {
      await generic.click();
      return;
    }

    throw new Error(`Unable to select Service Type option: ${optionLabel}`);
  }

  electricMeterInput() {
    // Try common labels
    let locator = this.ctx.getByLabel(/electric\s*meter\s*read/i).first();
    return locator;
  }

  gasMeterInput() {
    let locator = this.ctx.getByLabel(/gas\s*meter\s*read/i).first();
    return locator;
  }
}

test.describe('MTX-4506 | TC_001 - Verify Rate Calculator Visibility and Service Type Selection', () => {
  test('Ensure the rate calculator is visible and service types can be selected correctly', async ({ page }) => {
    test.setTimeout(120000);
    const ratePage = new RateEstimatorPage(page);

    // Step 1: Navigate and verify calculator visibility
    await ratePage.goto();
    await ratePage.expectCalculatorVisible();

    // Step 2: Select 'Electric only' and verify fields
    await ratePage.selectServiceType('Electric only');

    const electricOnly_electricInput = ratePage.electricMeterInput();
    const electricOnly_gasInput = ratePage.gasMeterInput();

    // Wait for potential UI updates after selection
    await page.waitForTimeout(500);

    await expect(electricOnly_electricInput, 'Electric Meter Read should be visible for Electric only').toBeVisible({ timeout: 10000 });
    await expect(electricOnly_electricInput, 'Electric Meter Read should be enabled for Electric only').toBeEnabled();

    // Gas field should be hidden or disabled when 'Electric only' is selected
    let gasVisible = false;
    try {
      gasVisible = await electricOnly_gasInput.isVisible({ timeout: 2000 });
    } catch (_) {
      gasVisible = false;
    }
    if (gasVisible) {
      await expect(electricOnly_gasInput, 'Gas Meter Read should be disabled for Electric only').toBeDisabled();
    } else {
      // If not visible, ensure it's actually hidden
      await expect(electricOnly_gasInput, 'Gas Meter Read should be hidden for Electric only').toBeHidden({ timeout: 10000 });
    }

    // Step 3: Select 'Electric and Gas' and verify both fields
    await ratePage.selectServiceType('Electric and Gas');

    const both_electricInput = ratePage.electricMeterInput();
    const both_gasInput = ratePage.gasMeterInput();

    // Wait for UI to reflect the change
    await page.waitForTimeout(500);

    await expect(both_electricInput, 'Electric Meter Read should be visible for Electric and Gas').toBeVisible({ timeout: 10000 });
    await expect(both_electricInput, 'Electric Meter Read should be enabled for Electric and Gas').toBeEnabled();

    await expect(both_gasInput, 'Gas Meter Read should be visible for Electric and Gas').toBeVisible({ timeout: 10000 });
    await expect(both_gasInput, 'Gas Meter Read should be enabled for Electric and Gas').toBeEnabled();
  });
});