import { test, expect } from '@playwright/test';

class MeterReadPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.electricInput = page.getByLabel(/^\s*electric\s*$/i);
    this.gasInput = page.getByLabel(/^\s*gas\s*$/i);
    this.serviceSelect = page.getByLabel(/service( type)?/i);
    this.resetButton = page.getByRole('button', { name: /reset/i });
  }

  async goto(url) {
    await this.page.goto(url);
  }

  async fillElectric(value) {
    await this.electricInput.fill('');
    await this.electricInput.fill(String(value));
  }

  async fillGas(value) {
    await this.gasInput.fill('');
    await this.gasInput.fill(String(value));
  }

  async selectService(label) {
    // Assumes a native <select>. If a custom component is used, adjust accordingly.
    await this.serviceSelect.selectOption({ label });
  }

  async getElectricValue() {
    return this.electricInput.inputValue();
  }

  async getGasValue() {
    return this.gasInput.inputValue();
  }

  async getSelectedService() {
    const option = this.serviceSelect.locator('option:checked');
    const value = (await option.getAttribute('value')) || '';
    const label = ((await option.textContent()) || '').trim();
    return { value, label };
  }

  async reset() {
    await this.resetButton.click();
  }
}

test.describe('MTX-4506 - TC_003 - Verify Reset Functionality', () => {
  test('Ensure the Reset button clears all user inputs and selections', async ({ page, baseURL }) => {
    const appUrl = process.env.APP_BASE_URL || baseURL || 'http://localhost:3000';
    const meterPage = new MeterReadPage(page);

    await meterPage.goto(appUrl);

    // Step 1: Enter meter reads and select service type
    await meterPage.fillElectric('450');
    await meterPage.fillGas('80');
    await meterPage.selectService('Electric and Gas');

    // Expected: Fields contain the entered data.
    await expect(meterPage.electricInput).toHaveValue('450');
    await expect(meterPage.gasInput).toHaveValue('80');
    const beforeService = await meterPage.getSelectedService();
    expect(beforeService.label.toLowerCase()).toBe('electric and gas');

    // Step 2: Click Reset
    await meterPage.reset();

    // Expected: All input fields are cleared and dropdowns return to default state.
    await expect(meterPage.electricInput).toHaveValue('');
    await expect(meterPage.gasInput).toHaveValue('');

    const afterService = await meterPage.getSelectedService();
    const serviceResetToDefault =
      !afterService.value ||
      /select|choose|please select|--/i.test(afterService.label) ||
      afterService.label === '';
    expect(serviceResetToDefault).toBeTruthy();
  });
});