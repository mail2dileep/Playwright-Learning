import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricServiceRadioButton: Locator;
  private readonly electricGasServiceRadioButton: Locator;
  private readonly calculateButton: Locator;
  private readonly resetButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Locators, all within the "calculator_current" parent container as per catalog
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadioButton = page.locator('#e'); // Using recommended locator
    this.electricGasServiceRadioButton = page.locator('#eg'); // Using recommended locator
    this.calculateButton = page.locator('#validateMoveInBtn'); // Using recommended locator
    this.resetButton = page.locator('#rateCalCancelBtn'); // Using recommended locator
  }

  /**
   * Selects a month from the dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm06' for June).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Gets the value of the selected month from the dropdown.
   * @returns The value attribute of the selected month option.
   */
  async getSelectedMonthValue(): Promise<string> {
    return await this.monthDropdown.inputValue();
  }

  /**
   * Enters the previous meter read value.
   * @param readValue The previous meter read as a string.
   */
  async enterPreviousRead(readValue: string): Promise<void> {
    await this.previousReadInput.fill(readValue);
  }

  /**
   * Gets the current value from the previous read input field.
   * @returns The value of the previous read input.
   */
  async getPreviousReadValue(): Promise<string> {
    return await this.previousReadInput.inputValue();
  }

  /**
   * Enters the current meter read value.
   * @param readValue The current meter read as a string.
   */
  async enterCurrentRead(readValue: string): Promise<void> {
    await this.currentReadInput.fill(readValue);
  }

  /**
   * Gets the current value from the current read input field.
   * @returns The value of the current read input.
   */
  async getCurrentReadValue(): Promise<string> {
    return await this.currentReadInput.inputValue();
  }

  /**
   * Selects the 'Electric' service type radio button.
   */
  async selectElectricService(): Promise<void> {
    await this.electricServiceRadioButton.check();
  }

  /**
   * Checks if the 'Electric' service type radio button is selected.
   * @returns True if selected, false otherwise.
   */
  async isElectricServiceSelected(): Promise<boolean> {
    return await this.electricServiceRadioButton.isChecked();
  }

  /**
   * Selects the 'Electric/Gas' service type radio button.
   */
  async selectElectricGasService(): Promise<void> {
    await this.electricGasServiceRadioButton.check();
  }

  /**
   * Checks if the 'Electric/Gas' service type radio button is selected.
   * @returns True if selected, false otherwise.
   */
  async isElectricGasServiceSelected(): Promise<boolean> {
    return await this.electricGasServiceRadioButton.isChecked();
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
   * Gets the estimated electric use (kWh) value.
   * @returns The estimated electric use as a string.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Gets the estimated gas use (Ccf) value.
   * @returns The estimated gas use as a string.
   */
  async getEstimatedGasUse(): Promise<string> {
    return await this.estimatedGasUseInput.inputValue();
  }

  /**
   * Fills in all necessary fields for an electric calculation and clicks calculate.
   * @param monthValue The value of the month to select (e.g., 'm06').
   * @param previousRead The previous meter reading.
   * @param currentRead The current meter reading.
   */
  async performElectricCalculation(monthValue: string, previousRead: string, currentRead: string): Promise<void> {
    await this.selectMonth(monthValue);
    await this.enterPreviousRead(previousRead);
    await this.enterCurrentRead(currentRead);
    await this.selectElectricService(); // Ensure Electric service is selected
    await this.clickCalculate();
  }
}
