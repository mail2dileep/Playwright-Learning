import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly electricUseInput: Locator;
  private readonly gasUseInput: Locator; // This field is disabled per locator catalog
  private readonly electricServiceRadio: Locator;
  private readonly electricGasServiceRadio: Locator;
  private readonly calculateButton: Locator;

  constructor(private page: Page) {
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.electricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.gasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadio = page.locator('#e');
    this.electricGasServiceRadio = page.locator('#eg');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Navigates to the specified URL.
   * @param url The URL to navigate to.
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Selects a month from the dropdown.
   * @param monthValue The value of the month to select (e.g., 'm06' for June).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters the previous meter reading.
   * @param value The previous read value.
   */
  async enterPreviousRead(value: string): Promise<void> {
    await this.previousReadInput.fill(value);
  }

  /**
   * Enters the current meter reading.
   * @param value The current read value.
   */
  async enterCurrentRead(value: string): Promise<void> {
    await this.currentReadInput.fill(value);
  }

  /**
   * Enters the estimated electric use (kWh) value. This corresponds to 'Electric fuel' pricing.
   * @param value The electric fuel pricing value.
   */
  async enterElectricFuelPricing(value: string): Promise<void> {
    await this.electricUseInput.fill(value);
  }

  /**
   * Retrieves the estimated electric use (kWh) value.
   * @returns The current value of the electric use input field.
   */
  async getElectricFuelPricingValue(): Promise<string> {
    return await this.electricUseInput.inputValue();
  }

  /**
   * Checks if the estimated gas use (Ccf) input field is disabled.
   * @returns True if the gas use input is disabled, false otherwise.
   */
  async isGasFuelPricingInputDisabled(): Promise<boolean> {
    return await this.gasUseInput.isDisabled();
  }

  /**
   * Selects the service type radio button.
   * @param type 'electric' for Electric only, 'electric-gas' for Electric and Gas.
   */
  async selectServiceType(type: 'electric' | 'electric-gas'): Promise<void> {
    if (type === 'electric') {
      await this.electricServiceRadio.check();
    } else if (type === 'electric-gas') {
      await this.electricGasServiceRadio.check();
    }
  }

  /**
   * Clicks the 'Calculate' button.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Checks if the Calculate button is visible, indicating the component is accessible.
   * @returns True if the Calculate button is visible, false otherwise.
   */
  async isCalculateButtonVisible(): Promise<boolean> {
    return await this.calculateButton.isVisible();
  }

  /**
   * Checks if the Electric Fuel Pricing input field is visible.
   * @returns True if the Electric Fuel Pricing input field is visible, false otherwise.
   */
  async isElectricFuelPricingInputVisible(): Promise<boolean> {
    return await this.electricUseInput.isVisible();
  }
}