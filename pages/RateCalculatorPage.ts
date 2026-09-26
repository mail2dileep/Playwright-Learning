import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;

  // Locators
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricServiceTypeRadio: Locator;
  private readonly electricGasServiceTypeRadio: Locator;
  private readonly calculateButton: Locator;
  private readonly resetButton: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Initialize locators using recommendedLocator from catalog
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceTypeRadio = page.locator('#e');
    this.electricGasServiceTypeRadio = page.locator('#eg');
    this.calculateButton = page.locator('#validateMoveInBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
  }

  /**
   * Navigates to the rate calculator page.
   * This is a placeholder as the actual URL was not provided. Default to '/rate-calculator'.
   * Ensure baseURL is configured in playwright.config.ts or passed in the test.
   */
  async navigateTo(path: string = '/rate-calculator'): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Selects a month from the dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm07' for July).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters the previous meter read value.
   * @param readValue The previous meter reading.
   */
  async enterPreviousRead(readValue: string): Promise<void> {
    await this.previousReadInput.fill(readValue);
  }

  /**
   * Enters the current meter read value.
   * @param readValue The current meter reading.
   */
  async enterCurrentRead(readValue: string): Promise<void> {
    await this.currentReadInput.fill(readValue);
  }

  /**
   * Selects the Electric service type radio button.
   */
  async selectElectricServiceType(): Promise<void> {
    await this.electricServiceTypeRadio.check();
  }

  /**
   * Selects the Electric and Gas service type radio button.
   */
  async selectElectricAndGasServiceType(): Promise<void> {
    await this.electricGasServiceTypeRadio.check();
  }

  /**
   * Clicks the Calculate button to submit the meter readings.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Clicks the Reset button.
   */
  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  // --- Methods to retrieve Locators for assertions in the test spec --- //

  /**
   * Returns the Locator for the Month dropdown.
   * Useful for assertions like toHaveValue().
   */
  getMonthDropdownLocator(): Locator {
    return this.monthDropdown;
  }

  /**
   * Returns the Locator for the Previous Read input field.
   * Useful for assertions like toHaveValue().
   */
  getPreviousReadInputLocator(): Locator {
    return this.previousReadInput;
  }

  /**
   * Returns the Locator for the Current Read input field.
   * Useful for assertions like toHaveValue().
   */
  getCurrentReadInputLocator(): Locator {
    return this.currentReadInput;
  }

  /**
   * Returns the Locator for the Estimated Electric use (kWh) input field.
   * Useful for assertions like toHaveValue().
   */
  getEstimatedElectricUseLocator(): Locator {
    return this.estimatedElectricUseInput;
  }

  /**
   * Returns the Locator for the Estimated Gas use (Ccf) input field.
   * Useful for assertions like toHaveValue() or toBeDisabled().
   */
  getEstimatedGasUseLocator(): Locator {
    return this.estimatedGasUseInput;
  }

  /**
   * Returns the Locator for the Electric service type radio button.
   * Useful for assertions like toBeChecked().
   */
  getElectricServiceTypeRadioLocator(): Locator {
    return this.electricServiceTypeRadio;
  }

  /**
   * Returns the Locator for the Electric and Gas service type radio button.
   * Useful for assertions like toBeChecked().
   */
  getElectricAndGasServiceTypeRadioLocator(): Locator {
    return this.electricGasServiceTypeRadio;
  }

  /**
   * Returns the Locator for the Calculate button.
   * Useful for assertions like toBeEnabled() or toBeDisabled().
   */
  getCalculateButtonLocator(): Locator {
    return this.calculateButton;
  }

  /**
   * Returns the Locator for the Reset button.
   * Useful for assertions like toBeEnabled() or toBeDisabled().
   */
  getResetButtonLocator(): Locator {
    return this.resetButton;
  }
}