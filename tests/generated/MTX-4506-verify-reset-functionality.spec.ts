import { test, expect } from '@playwright/test';

class MeterReadPage {
  /**
   * Page Object for the Meter Read screen
   * Assumes:
   * - Numeric inputs for Electric and Gas have accessible labels "Electric" and "Gas"
   * - Service type is a native select with accessible name containing "Service"
   * - Reset button has accessible name "Reset"
   */
  constructor(page) {
    this.page = page;
    this.electricInput = page.getByRole('spinbutton', { name: /electric/i });
    this.gasInput = page.getByRole('spinbutton', { name: /gas/i });
    this.serviceTypeSelect = page.getByRole('combobox', { name: /service/i });
    this.selectedServiceOption = this.serviceTypeSelect.locator('option:checked');
    this.resetButton = page.getByRole('button', { name: /^reset$/i });
  }

  async goto() {
    // Uses baseURL if configured; otherwise navigates to root.
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async enterMeterReads({ electric, gas }) {
    await this.electricInput.fill('');
    await this.electricInput.fill(String(electric));
    await this.gasInput.fill('');
    await this.gasInput.fill(String(gas));
  }

  async selectServiceTypeByLabel(label) {
    // Select option by visible label
    await this.serviceTypeSelect.selectOption({ label });
  }

  async clickReset() {
    await this.resetButton.click();
  }

  async getSelectedServiceLabel() {
    const text = await this.selectedServiceOption.textContent();
    return (text || '').trim();
  }
}

test.describe('MTX-4506 - Verify Reset Functionality', () => {
  test('Verify Reset Functionality', async ({ page }) => {
    const meterPage = new MeterReadPage(page);
    await meterPage.goto();

    // Capture the default service type label before any user interaction
    const defaultServiceLabel = await meterPage.getSelectedServiceLabel();

    // Step 1: Enter values and select service type
    await meterPage.enterMeterReads({ electric: 100, gas: 50 });
    await meterPage.selectServiceTypeByLabel('Electric and Gas');

    // Expected Result after Step 1
    await expect(meterPage.electricInput).toHaveValue('100');
    await expect(meterPage.gasInput).toHaveValue('50');
    await expect(meterPage.selectedServiceOption).toHaveText('Electric and Gas');

    // Step 2: Click Reset
    await meterPage.clickReset();

    // Expected Result after Step 2
    await expect(meterPage.electricInput).toHaveValue('');
    await expect(meterPage.gasInput).toHaveValue('');
    await expect(meterPage.selectedServiceOption).toHaveText(defaultServiceLabel);
  });
});