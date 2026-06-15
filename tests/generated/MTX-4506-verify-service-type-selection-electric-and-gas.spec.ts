const { test, expect } = require('@playwright/test');

class ServiceSetupPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    const base = process.env.APP_URL || 'http://localhost:3000';
    this.url = `${base.replace(/\/$/, '')}/service-setup`;

    // Locators
    this.serviceTypeDropdown = this.page.getByRole('combobox', { name: /service type/i });
    this.electricMeterReadInput = this.page.getByLabel(/electric meter read/i);
    this.gasMeterReadInput = this.page.getByLabel(/gas meter read/i);
  }

  async goto() {
    await this.page.goto(this.url);
  }

  async selectServiceType(label) {
    // Prefer selecting by label for accessibility-friendly apps
    await expect(this.serviceTypeDropdown, 'Service Type dropdown should be visible').toBeVisible();
    await this.serviceTypeDropdown.selectOption({ label });
  }
}

test.describe('MTX-4506 - Verify Service Type Selection - Electric and Gas', () => {
  test('Validate that selecting Electric and Gas allows input for both meters', async ({ page }) => {
    const serviceSetup = new ServiceSetupPage(page);

    // Navigate to Service Setup page
    await serviceSetup.goto();

    // Step 1: Select 'Electric and Gas' from the Service Type dropdown
    await serviceSetup.selectServiceType('Electric and Gas');

    // Expected Result: Both 'Electric Meter Read' and 'Gas Meter Read' fields are available for data entry.
    await expect(serviceSetup.electricMeterReadInput, 'Electric Meter Read input should be visible').toBeVisible();
    await expect(serviceSetup.electricMeterReadInput, 'Electric Meter Read input should be editable').toBeEditable();

    await expect(serviceSetup.gasMeterReadInput, 'Gas Meter Read input should be visible').toBeVisible();
    await expect(serviceSetup.gasMeterReadInput, 'Gas Meter Read input should be editable').toBeEditable();

    // Optional: Prove inputs accept data entry by filling and asserting values
    await serviceSetup.electricMeterReadInput.fill('12345');
    await expect(serviceSetup.electricMeterReadInput).toHaveValue('12345');

    await serviceSetup.gasMeterReadInput.fill('67890');
    await expect(serviceSetup.gasMeterReadInput).toHaveValue('67890');
  });
});