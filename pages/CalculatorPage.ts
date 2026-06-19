import { Page, Locator } from '@playwright/test';

export class CalculatorPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Locators
  // TODO: Locator for 'Electric Meter Read' field not found in catalog. Using a placeholder.
  private get electricMeterReadField(): Locator {
    return this.page.locator('//TODO: Add actual locator for Electric Meter Read');
  }

  // TODO: Locator for 'Gas Meter Read' field not found in catalog. Using a placeholder.
  private get gasMeterReadField(): Locator {
    return this.page.locator('//TODO: Add actual locator for Gas Meter Read');
  }

  // TODO: Locator for validation error message for 'Electric Meter Read' not found in catalog. Using a placeholder.
  private get electricMeterReadErrorLocator(): Locator {
    return this.page.locator('//TODO: Add actual locator for Electric Meter Read validation error');
  }

  // TODO: Locator for validation error message for 'Gas Meter Read' not found in catalog. Using a placeholder.
  private get gasMeterReadErrorLocator(): Locator {
    return this.page.locator('//TODO: Add actual locator for Gas Meter Read validation error');
  }

  /**
   * Navigates to the calculator page.
   * @param url The URL of the calculator page.
   */
  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Enters a value into the 'Electric Meter Read' field.
   * @param value The value to enter.
   */
  async enterElectricMeterRead(value: string): Promise<void> {
    await this.electricMeterReadField.fill(value);
  }

  /**
   * Enters a value into the 'Gas Meter Read' field.
   * @param value The value to enter.
   */
  async enterGasMeterRead(value: string): Promise<void> {
    await this.gasMeterReadField.fill(value);
  }

  /**
   * Retrieves the text of the validation error for the 'Electric Meter Read' field.
   * @returns The error message text.
   */
  async getElectricMeterReadErrorText(): Promise<string | null> {
    // Ensure the locator is visible before attempting to get text
    await this.electricMeterReadErrorLocator.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {}); // Catch to avoid breaking if error is not present
    return await this.electricMeterReadErrorLocator.textContent();
  }

  /**
   * Retrieves the text of the validation error for the 'Gas Meter Read' field.
   * @returns The error message text.
   */
  async getGasMeterReadErrorText(): Promise<string | null> {
    // Ensure the locator is visible before attempting to get text
    await this.gasMeterReadErrorLocator.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {}); // Catch to avoid breaking if error is not present
    return await this.gasMeterReadErrorLocator.textContent();
  }

  /**
   * Checks if the Electric Meter Read field displays a validation error.
   * @returns True if an error is visible, false otherwise.
   */
  async isElectricMeterReadErrorVisible(): Promise<boolean> {
    return await this.electricMeterReadErrorLocator.isVisible();
  }

  /**
   * Checks if the Gas Meter Read field displays a validation error.
   * @returns True if an error is visible, false otherwise.
   */
  async isGasMeterReadErrorVisible(): Promise<boolean> {
    return await this.gasMeterReadErrorLocator.isVisible();
  }
}