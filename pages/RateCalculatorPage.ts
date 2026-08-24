import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;
  private readonly monthSelect: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly electricServiceRadio: Locator;
  private readonly electricGasServiceRadio: Locator;
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthSelect = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.electricServiceRadio = page.locator('#e');
    this.electricGasServiceRadio = page.locator('#eg');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Selects a month from the dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm06' for June).
   */
  async selectBillingMonth(monthValue: string): Promise<void> {
    await this.monthSelect.selectOption(monthValue);
  }

  /**
   * Enters the previous meter read value.
   * @param readValue The numeric value for the previous read.
   */
  async enterPreviousMeterRead(readValue: string): Promise<void> {
    await this.previousReadInput.fill(readValue);
  }

  /**
   * Enters the current meter read value.
   * @param readValue The numeric value for the current read.
   */
  async enterCurrentMeterRead(readValue: string): Promise<void> {
    await this.currentReadInput.fill(readValue);
  }

  /**
   * Selects the Electric service type radio button.
   */
  async selectElectricServiceType(): Promise<void> {
    await this.electricServiceRadio.click();
  }

  /**
   * Selects the Electric & Gas service type radio button.
   */
  async selectElectricAndGasServiceType(): Promise<void> {
    await this.electricGasServiceRadio.click();
  }

  /**
   * Clicks the Calculate button.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Retrieves the estimated electric use value.
   * @returns The string value of the estimated electric use.
   */
  async getEstimatedElectricUse(): Promise<string | null> {
    return this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Fills out the rate calculator form and clicks calculate.
   * @param monthValue The value for the month dropdown (e.g., 'm07').
   * @param previousRead The previous meter read value.
   * @param currentRead The current meter read value.
   * @param serviceType 'Electric' or 'ElectricAndGas'.
   */
  async calculateRates(
    monthValue: string,
    previousRead: string,
    currentRead: string,
    serviceType: 'Electric' | 'ElectricAndGas'
  ): Promise<void> {
    await this.selectBillingMonth(monthValue);
    await this.enterPreviousMeterRead(previousRead);
    await this.enterCurrentRead(currentRead);
    if (serviceType === 'Electric') {
      await this.selectElectricServiceType();
    } else if (serviceType === 'ElectricAndGas') {
      await this.selectElectricAndGasServiceType();
    }
    await this.clickCalculate();
  }
}
