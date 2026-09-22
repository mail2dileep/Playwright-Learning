import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator; // This is disabled by default
  private readonly electricServiceRadioButton: Locator;
  private readonly electricAndGasServiceRadioButton: Locator;
  private readonly calculateButton: Locator;
  private readonly resetButton: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;


  constructor(private page: Page) {
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadioButton = page.locator('#e');
    this.electricAndGasServiceRadioButton = page.locator('#eg');
    this.calculateButton = page.locator('#validateMoveInBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
  }

  /**
   * Selects a month from the Month dropdown.
   * @param monthValue The value attribute of the option to select (e.g., 'm07' for July).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters the previous meter read value into the corresponding input field.
   * @param readValue The numeric string value for the previous read.
   */
  async enterPreviousMeterRead(readValue: string): Promise<void> {
    await this.previousReadInput.fill(readValue);
  }

  /**
   * Enters the current meter read value into the corresponding input field.
   * @param readValue The numeric string value for the current read.
   */
  async enterCurrentMeterRead(readValue: string): Promise<void> {
    await this.currentReadInput.fill(readValue);
  }

  /**
   * Selects the specified service type radio button.
   * @param type 'Electric' for Electric only, or 'ElectricAndGas' for Electric and Gas.
   */
  async selectServiceType(type: 'Electric' | 'ElectricAndGas'): Promise<void> {
    if (type === 'Electric') {
      await this.electricServiceRadioButton.check();
    } else if (type === 'ElectricAndGas') {
      await this.electricAndGasServiceRadioButton.check();
    } else {
      throw new Error(`Invalid service type: ${type}`);
    }
  }

  /**
   * Clicks the 'Calculate' button to process the entered data.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Clicks the 'Reset' button to clear the form fields.
   */
  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Retrieves the estimated electric use (kWh) from the output field.
   * @returns The estimated electric use as a string.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the estimated gas use (Ccf) from the output field.
   * @returns The estimated gas use as a string.
   */
  async getEstimatedGasUse(): Promise<string> {
    return await this.estimatedGasUseInput.inputValue();
  }

  /**
   * Checks if the estimated gas use field is disabled.
   * @returns True if the field is disabled, false otherwise.
   */
  async isEstimatedGasUseFieldDisabled(): Promise<boolean> {
    return await this.estimatedGasUseInput.isDisabled();
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