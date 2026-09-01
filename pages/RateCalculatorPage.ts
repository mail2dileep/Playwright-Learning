import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;

  // Encapsulate all locators
  readonly monthDropdown: Locator;
  readonly previousReadInput: Locator;
  readonly currentReadInput: Locator;
  readonly estimatedElectricUseInput: Locator;
  readonly estimatedGasUseInput: Locator;
  readonly electricServiceRadio: Locator;
  readonly electricGasServiceRadio: Locator;
  readonly howToReadYourBillButton: Locator;
  readonly howToFindUsageButton: Locator;
  readonly resetButton: Locator;
  readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Use recommended locators from the catalog
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadio = page.locator('#e');
    this.electricGasServiceRadio = page.locator('#eg');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Navigates to the rate calculator page.
   * @param url The URL of the rate calculator page.
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Selects a month from the dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm10' for October).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters the previous meter read value.
   * @param read The previous meter read value as a string.
   */
  async enterPreviousRead(read: string): Promise<void> {
    await this.previousReadInput.fill(read);
  }

  /**
   * Enters the current meter read value.
   * @param read The current meter read value as a string.
   */
  async enterCurrentRead(read: string): Promise<void> {
    await this.currentReadInput.fill(read);
  }

  /**
   * Selects the 'Electric' service type radio button.
   */
  async selectElectricService(): Promise<void> {
    await this.electricServiceRadio.check();
  }

  /**
   * Selects the 'Electric & Gas' service type radio button.
   */
  async selectElectricAndGasService(): Promise<void> {
    await this.electricGasServiceRadio.check();
  }

  /**
   * Clicks the 'Calculate' button.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Clicks the 'Reset' button.
   */
  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Retrieves the value from the 'Estimated Electric use (kWh):' input field.
   * @returns The estimated electric use value as a string.
   */
  async getEstimatedElectricUseValue(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the value from the 'Estimated Gas use (Ccf):' input field.
   * @returns The estimated gas use value as a string.
   */
  async getEstimatedGasUseValue(): Promise<string> {
    return await this.estimatedGasUseInput.inputValue();
  }

  /**
   * Checks if the 'Estimated Electric use (kWh):' input field is visible.
   * @returns True if visible, false otherwise.
   */
  async isEstimatedElectricUseVisible(): Promise<boolean> {
    return await this.estimatedElectricUseInput.isVisible();
  }

  /**
   * Checks if the 'Estimated Gas use (Ccf):' input field is enabled.
   * @returns True if enabled, false otherwise.
   */
  async isEstimatedGasUseEnabled(): Promise<boolean> {
    return await this.estimatedGasUseInput.isEnabled();
  }
}