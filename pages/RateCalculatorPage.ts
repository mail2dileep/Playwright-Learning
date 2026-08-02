import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;
  private readonly monthSelect: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly electricConsumptionOutput: Locator;
  private readonly gasConsumptionOutput: Locator;
  private readonly electricServiceRadio: Locator;
  private readonly electricGasServiceRadio: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthSelect = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.electricConsumptionOutput = page.getByLabel('Estimated Electric use (kWh):');
    this.gasConsumptionOutput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadio = page.locator('#e');
    this.electricGasServiceRadio = page.locator('#eg');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Navigates to the rate calculator page.
   * @param url The URL of the rate calculator page.
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Selects a month from the billing month dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm06' for June).
   */
  async selectBillingMonth(monthValue: string): Promise<void> {
    await this.monthSelect.selectOption(monthValue);
  }

  /**
   * Enters the previous meter read value.
   * @param readValue The previous meter read value as a string.
   */
  async enterPreviousRead(readValue: string): Promise<void> {
    await this.previousReadInput.fill(readValue);
  }

  /**
   * Enters the current meter read value.
   * @param readValue The current meter read value as a string.
   */
  async enterCurrentRead(readValue: string): Promise<void> {
    await this.currentReadInput.fill(readValue);
  }

  /**
   * Selects the type of service (Electric or Electric and Gas).
   * @param serviceType The service type: 'Electric' or 'ElectricAndGas'.
   */
  async selectServiceType(serviceType: 'Electric' | 'ElectricAndGas'): Promise<void> {
    if (serviceType === 'Electric') {
      await this.electricServiceRadio.check();
    } else if (serviceType === 'ElectricAndGas') {
      await this.electricGasServiceRadio.check();
    }
  }

  /**
   * Clicks the Calculate button to update estimated usage.
   */  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Gets the estimated electric use in kWh.
   * @returns The estimated electric use as a string.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return await this.electricConsumptionOutput.inputValue();
  }

  /**
   * Gets the estimated gas use in Ccf.
   * Note: This field may be disabled based on service type selection.
   * @returns The estimated gas use as a string.
   */
  async getEstimatedGasUse(): Promise<string> {
    return await this.gasConsumptionOutput.inputValue();
  }

  /**
   * Checks if the gas consumption field is enabled.
   * @returns True if the gas consumption field is enabled, false otherwise.
   */
  async isGasConsumptionFieldEnabled(): Promise<boolean> {
    return await this.gasConsumptionOutput.isEnabled();
  }

  /**
   * Clicks the Reset button.
   */
  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Clicks the "How to Read Your Bill" button.
   */
  async clickHowToReadYourBill(): Promise<void> {
    await this.howToReadYourBillButton.click();
  }

  /**
   * Clicks the "How to Find Usage" button.
   */
  async clickHowToFindUsage(): Promise<void> {
    await this.howToFindUsageButton.click();
  }
}
