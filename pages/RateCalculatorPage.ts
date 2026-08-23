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
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Locators from catalog, ordered by priority
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
   * @param monthValue The value attribute of the month option (e.g., 'm12' for December).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters values into the previous and current meter read input fields.
   * @param previousRead The value for the previous meter read.
   * @param currentRead The value for the current meter read.
   */
  async enterMeterReads(previousRead: string, currentRead: string): Promise<void> {
    await this.previousReadInput.fill(previousRead);
    await this.currentReadInput.fill(currentRead);
  }

  /**
   * Selects the specified service type radio button.
   * @param type 'electric' for electric only, or 'electric-gas' for electric and gas.
   */
  async selectServiceType(type: 'electric' | 'electric-gas'): Promise<void> {
    if (type === 'electric') {
      await this.electricServiceRadio.check();
    } else if (type === 'electric-gas') {
      await this.electricGasServiceRadio.check();
    } else {
      throw new Error(`Invalid service type: ${type}`);
    }
  }

  /**
   * Clicks the 'Calculate' button to trigger usage calculation.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Clicks the 'Reset' button to clear the form.
   */
  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Retrieves the estimated electric usage (kWh) value.
   * @returns The string value of the estimated electric usage.
   */
  async getEstimatedElectricUsage(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the estimated gas usage (Ccf) value.
   * @returns The string value of the estimated gas usage.
   */
  async getEstimatedGasUsage(): Promise<string> {
    return await this.estimatedGasUseInput.inputValue();
  }

  /**
   * Checks if the estimated gas usage input field is disabled.
   * @returns True if the input is disabled, false otherwise.
   */
  async isEstimatedGasUsageInputDisabled(): Promise<boolean> {
      return await this.estimatedGasUseInput.isDisabled();
  }

  /**
   * Performs the full workflow to calculate usage.
   * @param monthValue The value attribute of the month option.
   * @param previousRead The previous meter read value.
   * @param currentRead The current meter read value.
   * @param serviceType The type of service ('electric' or 'electric-gas').
   */
  async calculateUsageWorkflow(
    monthValue: string,
    previousRead: string,
    currentRead: string,
    serviceType: 'electric' | 'electric-gas'
  ): Promise<void> {
    await this.selectMonth(monthValue);
    await this.enterMeterReads(previousRead, currentRead);
    await this.selectServiceType(serviceType);
    await this.clickCalculate();
  }

  /**
   * Retrieves the current selected month value from the dropdown.
   * @returns The value attribute of the currently selected option.
   */
  async getCurrentSelectedMonth(): Promise<string> {
      return await this.monthDropdown.inputValue();
  }

  /**
   * Retrieves the current value of the previous meter read input.
   * @returns The string value of the previous meter read.
   */
  async getPreviousReadValue(): Promise<string> {
      return await this.previousReadInput.inputValue();
  }

  /**
   * Retrieves the current value of the current meter read input.
   * @returns The string value of the current meter read.
   */
  async getCurrentReadValue(): Promise<string> {
      return await this.currentReadInput.inputValue();
  }
}
