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
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthSelect.selectOption(monthValue);
  }

  /**
   * Enters the previous meter read value.
   * @param value The previous meter read.
   */
  async enterPreviousRead(value: string): Promise<void> {
    await this.previousReadInput.fill(value);
  }

  /**
   * Enters the current meter read value.
   * @param value The current meter read.
   */
  async enterCurrentRead(value: string): Promise<void> {
    await this.currentReadInput.fill(value);
  }

  /**
   * Selects the service type radio button.
   * @param type 'E' for Electric, 'EG' for Electric & Gas.
   */
  async selectServiceType(type: 'E' | 'EG'): Promise<void> {
    if (type === 'E') {
      await this.electricServiceRadio.check();
    } else if (type === 'EG') {
      await this.electricGasServiceRadio.check();
    }
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
  async getEstimatedElectricUse(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Resets the calculator form.
   * // TODO: Locator for Reset button not used in this test, but available as 'locator("#rateCalCancelBtn")'.
   */
  // async resetCalculator(): Promise<void> {
  //   await this.page.locator('#rateCalCancelBtn').click();
  // }
}