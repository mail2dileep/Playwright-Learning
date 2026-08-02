import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;
  private readonly monthDropdown: Locator;
  private readonly previousMeterReadInput: Locator;
  private readonly currentMeterReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricServiceRadio: Locator;
  private readonly electricGasServiceRadio: Locator;
  private readonly calculateButton: Locator;
  private readonly resetButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Locators based on recommendedLocator from catalog
    this.monthDropdown = page.getByLabel('Month');
    this.previousMeterReadInput = page.getByLabel('Enter Previous Read:');
    this.currentMeterReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadio = page.locator('#e');
    this.electricGasServiceRadio = page.locator('#eg');
    this.calculateButton = page.locator('#validateMoveInBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
  }

  /**
   * Navigates to the CPS Energy Cost Calculator page.
   * @param url The URL of the calculator page.
   */
  async navigateToCalculatorPage(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Returns the Locator for the Month dropdown.
   */
  getMonthDropdownLocator(): Locator {
    return this.monthDropdown;
  }

  /**
   * Returns the Locator for the 'Enter Previous Read' input field.
   */
  getPreviousMeterReadInputLocator(): Locator {
    return this.previousMeterReadInput;
  }

  /**
   * Returns the Locator for the 'Enter Current Read' input field.
   */
  getCurrentMeterReadInputLocator(): Locator {
    return this.currentMeterReadInput;
  }

  /**
   * Returns the Locator for the 'Estimated Electric use (kWh)' input field.
   */
  getEstimatedElectricUseInputLocator(): Locator {
    return this.estimatedElectricUseInput;
  }

  /**
   * Returns the Locator for the 'Estimated Gas use (Ccf)' input field.
   */
  getEstimatedGasUseInputLocator(): Locator {
    return this.estimatedGasUseInput;
  }

  /**
   * Returns the Locator for the Electric service type radio button.
   */
  getElectricServiceRadioLocator(): Locator {
    return this.electricServiceRadio;
  }

  /**
   * Returns the Locator for the Electric & Gas service type radio button.
   */
  getElectricGasServiceRadioLocator(): Locator {
    return this.electricGasServiceRadio;
  }

  /**
   * Returns the Locator for the 'Calculate' button.
   */
  getCalculateButtonLocator(): Locator {
    return this.calculateButton;
  }

  /**
   * Returns the Locator for the 'Reset' button.
   */
  getResetButtonLocator(): Locator {
    return this.resetButton;
  }

  /**
   * Gets the current selected value of the Month dropdown.
   * @returns The value of the selected option.
   */
  async getMonthDropdownValue(): Promise<string | null> {
    return await this.monthDropdown.inputValue();
  }

  /**
   * Gets the current value of the Previous Meter Read input field.
   * @returns The value of the input field.
   */
  async getPreviousMeterReadValue(): Promise<string> {
    return await this.previousMeterReadInput.inputValue();
  }

  /**
   * Gets the current value of the Current Meter Read input field.
   * @returns The value of the input field.
   */
  async getCurrentMeterReadValue(): Promise<string> {
    return await this.currentMeterReadInput.inputValue();
  }

  /**
   * Gets the current value of the Estimated Electric Use input field.
   * @returns The value of the input field.
   */
  async getEstimatedElectricUseValue(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Gets the current value of the Estimated Gas Use input field.
   * @returns The value of the input field.
   */
  async getEstimatedGasUseValue(): Promise<string> {
    return await this.estimatedGasUseInput.inputValue();
  }
}