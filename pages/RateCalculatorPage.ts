import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly monthSelect: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricServiceRadio: Locator;
  private readonly electricGasServiceRadio: Locator;
  private readonly calculateButton: Locator;
  private readonly resetButton: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;

  constructor(private page: Page) {
    this.monthSelect = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    // This field is disabled, only a getter for its current value is appropriate
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):'); 
    this.electricServiceRadio = page.locator('#e');
    this.electricGasServiceRadio = page.locator('#eg');
    this.calculateButton = page.locator('#validateMoveInBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
  }

  /**
   * Selects a month from the dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm06' for June).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthSelect.selectOption(monthValue);
  }

  /**
   * Enters the previous meter read value.
   * @param readValue The previous read value as a string.
   */
  async enterPreviousRead(readValue: string): Promise<void> {
    await this.previousReadInput.fill(readValue);
  }

  /**
   * Enters the current meter read value.
   * @param readValue The current read value as a string.
   */
  async enterCurrentRead(readValue: string): Promise<void> {
    await this.currentReadInput.fill(readValue);
  }

  /**
   * Selects the service type (Electric or Electric/Gas).
   * @param type 'electric' for Electric service, 'electric-gas' for Electric and Gas service.
   */
  async selectServiceType(type: 'electric' | 'electric-gas'): Promise<void> {
    if (type === 'electric') {
      await this.electricServiceRadio.click();
    } else if (type === 'electric-gas') {
      await this.electricGasServiceRadio.click();
    } else {
      throw new Error('Invalid service type provided. Must be "electric" or "electric-gas".');
    }
  }

  /**
   * Clicks the 'Calculate' button to compute rates.
   */
  async calculateRates(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Clicks the 'Reset' button to clear the form fields.
   */
  async resetForm(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Retrieves the current value of the 'Estimated Electric use (kWh)' field.
   * @returns The estimated electric use value as a string.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the current value of the 'Estimated Gas use (Ccf)' field.
   * This field is typically disabled but its value can be read.
   * @returns The estimated gas use value as a string.
   */
  async getEstimatedGasUse(): Promise<string> {
    return this.estimatedGasUseInput.inputValue();
  }

  /**
   * Retrieves the current value of the 'Enter Previous Read:' field.
   * @returns The previous read value as a string.
   */
  async getPreviousReadValue(): Promise<string> {
    return this.previousReadInput.inputValue();
  }

  /**
   * Retrieves the current value of the 'Enter Current Read:' field.
   * @returns The current read value as a string.
   */
  async getCurrentReadValue(): Promise<string> {
    return this.currentReadInput.inputValue();
  }

  /**
   * Retrieves the currently selected month's value from the dropdown.
   * @returns The value attribute of the selected month as a string.
   */
  async getSelectedMonthValue(): Promise<string> {
    return this.monthSelect.inputValue();
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
