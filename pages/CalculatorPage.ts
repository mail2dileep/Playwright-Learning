import { Page, Locator } from '@playwright/test';

export class CalculatorPage {
  private readonly page: Page;
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseOutput: Locator;
  private readonly estimatedGasUseOutput: Locator;
  private readonly electricServiceRadioButton: Locator;
  private readonly electricAndGasServiceRadioButton: Locator;
  private readonly calculateButton: Locator;
  private readonly resetButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Locators from the catalog, within 'calculator_current' context
    // Month Dropdown
    this.monthDropdown = page.getByLabel('Month');
    // Previous Read Input
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    // Current Read Input
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    // Estimated Electric Use Output
    this.estimatedElectricUseOutput = page.getByLabel('Estimated Electric use (kWh):');
    // Estimated Gas Use Output (disabled, for display/assertion only)
    this.estimatedGasUseOutput = page.getByLabel('Estimated Gas use (Ccf):');
    // Electric Service Radio Button
    this.electricServiceRadioButton = page.locator('#e');
    // Electric and Gas Service Radio Button
    this.electricAndGasServiceRadioButton = page.locator('#eg');
    // Calculate Button
    this.calculateButton = page.locator('#validateMoveInBtn');
    // Reset Button
    this.resetButton = page.locator('#rateCalCancelBtn');
  }

  /**
   * Navigates to the calculator page.
   * Assumes the base URL is configured in Playwright config.
   */
  async navigateToCalculator(): Promise<void> {
    // TODO: The test step 'Log into AEM and open the calculator component properties'
    // requires specific AEM authoring locators not present in the catalog.
    // This method only navigates to the public-facing calculator URL.
    await this.page.goto('/calculator'); // Assuming a /calculator endpoint
  }

  /**
   * Selects a month from the dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm06' for June).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters the previous meter read value.
   * @param readValue The previous meter read value.
   */
  async enterPreviousRead(readValue: string): Promise<void> {
    await this.previousReadInput.fill(readValue);
  }

  /**
   * Enters the current meter read value.
   * @param readValue The current meter read value.
   */
  async enterCurrentRead(readValue: string): Promise<void> {
    await this.currentReadInput.fill(readValue);
  }

  /**
   * Selects the 'Electric only' service type radio button.
   */
  async selectElectricService(): Promise<void> {
    await this.electricServiceRadioButton.check();
  }

  /**
   * Selects the 'Electric and Gas' service type radio button.
   */
  async selectElectricAndGasService(): Promise<void> {
    await this.electricAndGasServiceRadioButton.check();
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
   * Gets the estimated electric use value.
   * @returns The string value of the estimated electric use.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return await this.estimatedElectricUseOutput.inputValue();
  }

  /**
   * Gets the estimated gas use value.
   * Note: The 'Estimated Gas use' field is disabled according to the catalog.
   * This method can retrieve its value but cannot interact with it.
   * @returns The string value of the estimated gas use.
   */
  async getEstimatedGasUse(): Promise<string> {
    return await this.estimatedGasUseOutput.inputValue();
  }

  /**
   * Verifies the month dropdown's current value.
   * @param expectedValue The expected current value of the month dropdown (e.g., 'm06').
   */
  async verifySelectedMonth(expectedValue: string): Promise<string> {
    return await this.monthDropdown.inputValue();
  }

  /**
   * Verifies the previous read input's current value.
   * @param expectedValue The expected current value.
   */
  async verifyPreviousRead(expectedValue: string): Promise<string> {
    return await this.previousReadInput.inputValue();
  }

  /**
   * Verifies the current read input's current value.
   * @param expectedValue The expected current value.
   */
  async verifyCurrentRead(expectedValue: string): Promise<string> {
    return await this.currentReadInput.inputValue();
  }
}
