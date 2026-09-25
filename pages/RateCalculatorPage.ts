import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricServiceRadio: Locator;
  private readonly electricGasServiceRadio: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;

  constructor(private page: Page) {
    // Locators based on Catalog and priority
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
   * Selects a month from the dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm10' for October).
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
   * Selects the 'Electric Only' service type radio button.
   */
  async selectServiceTypeElectric(): Promise<void> {
    await this.electricServiceRadio.check();
  }

  /**
   * Selects the 'Electric and Gas' service type radio button.
   */
  async selectServiceTypeElectricGas(): Promise<void> {
    await this.electricGasServiceRadio.check();
  }

  /**
   * Clicks the Calculate button.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Retrieves the estimated electric use (kWh) value.
   * @returns The string value of the estimated electric use.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the estimated gas use (Ccf) value.
   * Note: This field is disabled, but its value can still be read.
   * @returns The string value of the estimated gas use.
   */
  async getEstimatedGasUse(): Promise<string> {
    return await this.estimatedGasUseInput.inputValue();
  }

  /**
   * Clicks the Reset button.
   */
  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Retrieves the value of the previous meter read input.
   * @returns The string value of the previous meter read.
   */
  async getPreviousReadValue(): Promise<string> {
    return await this.previousReadInput.inputValue();
  }

  /**
   * Retrieves the value of the current meter read input.
   * @returns The string value of the current meter read.
   */
  async getCurrentReadValue(): Promise<string> {
    return await this.currentReadInput.inputValue();
  }

  /**
   * Retrieves the currently selected month value from the dropdown.
   * @returns The string value of the selected month.
   */
  async getSelectedMonthValue(): Promise<string> {
    return await this.monthDropdown.inputValue();
  }

  /**
   * Performs a complete rate calculation workflow.
   * @param monthValue The value attribute for the month dropdown (e.g., 'm10').
   * @param prevRead The previous meter read value.
   * @param currentRead The current meter read value.
   * @param serviceType The service type to select ('Electric' or 'ElectricGas').
   */
  async performCalculation(
    monthValue: string,
    prevRead: string,
    currentRead: string,
    serviceType: 'Electric' | 'ElectricGas'
  ): Promise<void> {
    await this.selectMonth(monthValue);
    await this.enterPreviousRead(prevRead);
    await this.enterCurrentRead(currentRead);
    if (serviceType === 'Electric') {
      await this.selectServiceTypeElectric();
    } else {
      await this.selectServiceTypeElectricGas();
    }
    await this.clickCalculate();
  }
}