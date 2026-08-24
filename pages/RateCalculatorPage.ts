import { Page, Locator } from "@playwright/test";

export class RateCalculatorPage {
  private readonly page: Page;

  // Locators
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricServiceRadioButton: Locator;
  private readonly electricGasServiceRadioButton: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthDropdown = this.page.getByLabel('Month');
    this.previousReadInput = this.page.getByLabel('Enter Previous Read:');
    this.currentReadInput = this.page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = this.page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = this.page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadioButton = this.page.locator('#e');
    this.electricGasServiceRadioButton = this.page.locator('#eg');
    this.howToReadYourBillButton = this.page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = this.page.locator('#howToFindUsageBtn');
    this.resetButton = this.page.locator('#rateCalCancelBtn');
    this.calculateButton = this.page.locator('#validateMoveInBtn');
  }

  /**
   * Navigates to the Rate Calculator page.
   * @param url The URL of the calculator page.
   */
  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Selects a month from the month dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm07' for July).
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
   * Selects the service type (Electric or Electric/Gas).
   * @param type 'Electric' or 'ElectricGas'.
   */
  async selectServiceType(type: 'Electric' | 'ElectricGas'): Promise<void> {
    if (type === 'Electric') {
      await this.electricServiceRadioButton.check();
    } else if (type === 'ElectricGas') {
      await this.electricGasServiceRadioButton.check();
    } else {
      throw new Error(`Invalid service type: ${type}`);
    }
  }

  /**
   * Clicks the 'Calculate' button to compute usage.
   */
  async calculateConsumption(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Gets the estimated electric use value from the input field.
   * @returns The estimated electric use as a string or null if not found.
   */
  async getEstimatedElectricUse(): Promise<string | null> {
    return this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Gets the estimated gas use value from the input field.
   * @returns The estimated gas use as a string or null if not found.
   */
  async getEstimatedGasUse(): Promise<string | null> {
    // This field is typically disabled but can be read for verification.
    return this.estimatedGasUseInput.inputValue();
  }

  /**
   * Clicks the 'Reset' button to clear the calculator fields.
   */
  async resetCalculator(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Clicks the 'How to Read Your Bill' button.
   */
  async clickHowToReadYourBill(): Promise<void> {
    await this.howToReadYourBillButton.click();
  }

  /**
   * Clicks the 'How to Find Usage' button.
   */
  async clickHowToFindUsage(): Promise<void> {
    await this.howToFindUsageButton.click();
  }
}
