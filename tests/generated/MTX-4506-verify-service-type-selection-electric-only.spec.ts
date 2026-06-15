const { test, expect } = require('@playwright/test');

test.use({
  baseURL: process.env.BASE_URL || 'http://localhost:3000',
  viewport: { width: 1280, height: 800 },
});

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

class ServicePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.serviceTypeCombobox = page.getByRole('combobox', { name: /service type/i });
    this.electricMeterRead = page.getByLabel(/electric meter read/i, { exact: false });
    this.gasMeterRead = page.getByLabel(/gas meter read/i, { exact: false });
  }

  async goto() {
    const path = process.env.SERVICE_PAGE_PATH || '/';
    await this.page.goto(path);
    // Ensure the Service Type control is present before proceeding
    await expect(this.serviceTypeCombobox).toBeVisible();
  }

  /**
   * Selects a service type by label, supporting both native <select> and custom dropdowns.
   * @param {string} typeLabel
   */
  async selectServiceType(typeLabel) {
    // Click to focus/open first
    await this.serviceTypeCombobox.click();

    // Determine if it's a native select
    const tagName = await this.serviceTypeCombobox.evaluate(el => el.tagName.toLowerCase()).catch(() => null);

    if (tagName === 'select') {
      await this.serviceTypeCombobox.selectOption({ label: typeLabel });
    } else {
      // Custom dropdown pattern with role="option"
      const option = this.page.getByRole('option', { name: new RegExp(`^${escapeRegex(typeLabel)}$`, 'i') });
      await option.click();
    }
  }

  /**
   * Verifies that Electric Meter Read is visible and enabled,
   * and Gas Meter Read is either disabled or hidden.
   */
  async expectElectricEnabledAndGasDisabledOrHidden() {
    await expect(this.electricMeterRead, 'Electric Meter Read should be visible').toBeVisible();
    await expect(this.electricMeterRead, 'Electric Meter Read should be enabled').toBeEnabled();

    if (await this.gasMeterRead.isVisible()) {
      await expect(this.gasMeterRead, 'Gas Meter Read should be disabled when visible').toBeDisabled();
    } else {
      await expect(this.gasMeterRead, 'Gas Meter Read should be hidden').toBeHidden();
    }
  }
}

test.describe('MTX-4506 - Verify Service Type Selection - Electric Only', () => {
  test('Verify Service Type Selection - Electric Only', async ({ page }) => {
    test.info().annotations.push(
      { type: 'Requirement ID', description: 'MTX-4506' },
      { type: 'Priority', description: 'High' },
      { type: 'Objective', description: "Validate that selecting 'Electric only' service type updates the input fields correctly." }
    );

    const servicePage = new ServicePage(page);
    await servicePage.goto();

    await test.step("Step 1: Select 'Electric only' from the Service Type dropdown", async () => {
      await servicePage.selectServiceType('Electric only');
    });

    await test.step("Assert: 'Electric Meter Read' is enabled/visible and 'Gas Meter Read' is disabled or hidden", async () => {
      await servicePage.expectElectricEnabledAndGasDisabledOrHidden();
    });
  });
});