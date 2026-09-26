import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseOutput: Locator;
  private readonly estimatedGasUseOutput: Locator;
  private readonly electricServiceRadio: Locator;
  private readonly electricGasServiceRadio: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;

  constructor(private page: Page) {
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseOutput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseOutput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadio = page.locator('#e');
    this.electricGasServiceRadio = page.locator('#eg');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
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
   * @param readValue The previous meter read value as a string.
   */
  async enterPreviousRead(readValue: string): Promise<void> {
    await this.previousReadInput.fill(readValue);
  }

  /**
   * Retrieves the current value of the previous read input field.
   * @returns A promise that resolves to the input field's value as a string.
   */
  async getPreviousReadValue(): Promise<string> {
    return await this.previousReadInput.inputValue();
  }

  /**
   * Enters the current meter read value.
   * @param readValue The current meter read value as a string.
   */
  async enterCurrentRead(readValue: string): Promise<void> {
    await this.currentReadInput.fill(readValue);
  }

  /**
   * Retrieves the current value of the current read input field.
   * @returns A promise that resolves to the input field's value as a string.
   */
  async getCurrentReadValue(): Promise<string> {
    return await this.currentReadInput.inputValue();
  }

  /**
   * Selects the service type (Electric or ElectricAndGas).
   * @param serviceType 'Electric' to select only electric, 'ElectricAndGas' for both.
   */
  async selectServiceType(serviceType: 'Electric' | 'ElectricAndGas'): Promise<void> {
    if (serviceType === 'Electric') {
      await this.electricServiceRadio.check();
    } else if (serviceType === 'ElectricAndGas') {
      await this.electricGasServiceRadio.check();
    } else {
      throw new Error(`Invalid service type: ${serviceType}`);
    }
  }

  /**
   * Clicks the Calculate button.
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

  /**
   * Retrieves the estimated electric use value.
   * @returns A promise that resolves to the estimated electric use as a string.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return await this.estimatedElectricUseOutput.inputValue();
  }

  /**
   * Retrieves the estimated gas use value.
   * @returns A promise that resolves to the estimated gas use as a string.
   */
  async getEstimatedGasUse(): Promise<string> {
    return await this.estimatedGasUseOutput.inputValue();
  }

  /**
   * Checks if the estimated gas use field is disabled.
   * @returns A promise that resolves to true if the field is disabled, false otherwise.
   */
  async isEstimatedGasUseFieldDisabled(): Promise<boolean> {
    return await this.estimatedGasUseOutput.isDisabled();
  }
}