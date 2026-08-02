import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricServiceRadio: Locator;
  private readonly electricGasServiceRadio: Locator;
  private readonly calculateButton: Locator;
  private readonly resetButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadio = page.locator('#e');
    this.electricGasServiceRadio = page.locator('#eg');
    this.calculateButton = page.locator('#validateMoveInBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
  }

  /**
   * Selects the service type (Electric or Electric and Gas).
   * @param type 'electric' for Electric, 'electric-gas' for Electric and Gas.
   */
  async selectServiceType(type: 'electric' | 'electric-gas'): Promise<void> {
    if (type === 'electric') {
      await this.electricServiceRadio.click();
    } else if (type === 'electric-gas') {
      await this.electricGasServiceRadio.click();
    } else {
      throw new Error(`Invalid service type: ${type}`);
    }
  }

  /**
   * Enters the previous and current meter read values.
   * @param previousRead The value for the 'Enter Previous Read:' field.
   * @param currentRead The value for the 'Enter Current Read:' field.
   */
  async enterMeterReads(previousRead: string, currentRead: string): Promise<void> {
    await this.previousReadInput.fill(previousRead);
    await this.currentReadInput.fill(currentRead);
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
   * Retrieves the value from the 'Estimated Electric use (kWh):' field.
   * @returns The estimated electric use as a string.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the value from the 'Estimated Gas use (Ccf):' field.
   * @returns The estimated gas use as a string.
   */
  async getEstimatedGasUse(): Promise<string> {
    // This field might be disabled initially, Playwright will wait for it to be actionable if enabled.
    return this.estimatedGasUseInput.inputValue();
  }

  /**
   * Retrieves the value from the 'Enter Previous Read:' field.
   * @returns The previous read value as a string.
   */
  async getPreviousReadValue(): Promise<string> {
    return this.previousReadInput.inputValue();
  }

  /**
   * Retrieves the value from the 'Enter Current Read:' field.
   * @returns The current read value as a string.
   */
  async getCurrentReadValue(): Promise<string> {
    return this.currentReadInput.inputValue();
  }

  /**
   * Checks if the 'Enter Previous Read:' field is cleared (empty or '0').
   * @returns True if the field is cleared, false otherwise.
   */
  async isPreviousReadCleared(): Promise<boolean> {
    const value = await this.previousReadInput.inputValue();
    return value === '' || value === '0';
  }

  /**
   * Checks if the 'Enter Current Read:' field is cleared (empty or '0').
   * @returns True if the field is cleared, false otherwise.
   */
  async isCurrentReadCleared(): Promise<boolean> {
    const value = await this.currentReadInput.inputValue();
    return value === '' || value === '0';
  }

  /**
   * Checks if the 'Estimated Electric use (kWh):' field is cleared (empty or '0').
   * @returns True if the field is cleared, false otherwise.
   */
  async isEstimatedElectricUseCleared(): Promise<boolean> {
    const value = await this.estimatedElectricUseInput.inputValue();
    return value === '' || value === '0';
  }

  /**
   * Checks if the 'Estimated Gas use (Ccf):' field is cleared (empty or '0').
   * @returns True if the field is cleared, false otherwise.
   */
  async isEstimatedGasUseCleared(): Promise<boolean> {
    const value = await this.estimatedGasUseInput.inputValue();
    return value === '' || value === '0';
  }
}
