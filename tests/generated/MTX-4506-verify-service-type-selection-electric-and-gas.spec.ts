import { test, expect } from '@playwright/test';

// Requirement ID: MTX-4506
// Test Name: Verify Service Type Selection - Electric and Gas
// Objective: Validate that selecting 'Electric and Gas' displays both input fields.

class ServiceFormPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.serviceTypeCombobox = page.getByRole('combobox', { name: /service type/i });
    this.electricMeterInput = page.getByLabel(/electric meter read/i);
    this.gasMeterInput = page.getByLabel(/gas meter read/i);
  }

  async goto(url) {
    await this.page.goto(url);
  }

  /**
   * Select a service type by visible label. Supports native <select> and custom combobox widgets.
   * @param {string} label
   */
  async selectServiceType(label) {
    const combo = this.serviceTypeCombobox;
    await combo.waitFor({ state: 'visible' });
    // Try native select first
    try {
      await combo.selectOption({ label });
      return;
    } catch {
      // Fallback for custom combobox/listbox implementations
    }

    await combo.click({ force: true });

    const optionByRole = this.page.getByRole('option', { name: new RegExp(`^${label}$`, 'i') });
    if (await optionByRole.count()) {
      await optionByRole.first().click();
      return;
    }

    const optionByText = this.page.getByText(label, { exact: true });
    if (await optionByText.count()) {
      await optionByText.first().click();
      return;
    }

    // Last resort: try selecting by value equals label on native selects (if supported)
    try {
      await combo.selectOption({ value: label });
    } catch (err) {
      throw new Error(`Unable to select service type option: "${label}". Original error: ${err}`);
    }
  }

  async selectServiceTypeElectricAndGas() {
    await this.selectServiceType('Electric and Gas');
  }

  async expectBothFieldsVisibleAndEditable() {
    await expect(this.electricMeterInput, 'Electric Meter Read field should be visible').toBeVisible();
    await expect(this.electricMeterInput, 'Electric Meter Read field should be editable').toBeEditable();
    await expect(this.gasMeterInput, 'Gas Meter Read field should be visible').toBeVisible();
    await expect(this.gasMeterInput, 'Gas Meter Read field should be editable').toBeEditable();
  }
}

test.describe('MTX-4506: Verify Service Type Selection - Electric and Gas', () => {
  test('Verify Service Type Selection - Electric and Gas', async ({ page }, testInfo) => {
    const serviceForm = new ServiceFormPage(page);

    // Resolve target URL from environment or project baseURL, defaulting to localhost
    const base =
      process.env.TEST_URL ||
      process.env.BASE_URL ||
      process.env.APP_URL ||
      testInfo.project.use?.baseURL ||
      'http://localhost:3000';
    const path = process.env.TEST_PATH || '';
    const url = path ? new URL(path, base).toString() : base;

    await serviceForm.goto(url);

    await test.step("Step 1: Select 'Electric and Gas' from the Service Type dropdown", async () => {
      await serviceForm.selectServiceTypeElectricAndGas();
    });

    await test.step("Expected: Both 'Electric Meter Read' and 'Gas Meter Read' fields are visible and editable", async () => {
      await serviceForm.expectBothFieldsVisibleAndEditable();
    });
  });
});