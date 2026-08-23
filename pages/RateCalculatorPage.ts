import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricServiceRadio: Locator;
  private readonly electricAndGasServiceRadio: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadio = page.locator('#e');
    this.electricAndGasServiceRadio = page.locator('#eg');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Navigates to the rate calculator page.
   * Assumes the base URL is configured in Playwright config.
   * @param path The relative path to the rate calculator page.
   */
  async navigateTo(path: string): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Selects a billing month from the dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm06' for June).
   */
  async selectBillingMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters the previous meter read value.
   * @param read The previous meter read value as a string.
   */
  async enterPreviousRead(read: string): Promise<void> {
    await this.previousReadInput.fill(read);
  }

  /**
   * Enters the current meter read value.
   * @param read The current meter read value as a string.
   */
  async enterCurrentRead(read: string): Promise<void> {
    await this.currentReadInput.fill(read);
  }

  /**
   * Selects the 'Electric' service type radio button.
   */
  async selectElectricService(): Promise<void> {
    await this.electricServiceRadio.click();
  }

  /**
   * Selects the 'Electric and Gas' service type radio button.
   */
  async selectElectricAndGasService(): Promise<void> {
    await this.electricAndGasServiceRadio.click();
  }

  /**
   * Clicks the 'Calculate' button to compute the estimated usage.
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
   * Gets the estimated electric use (kWh) displayed on the page.
   * @returns The estimated electric use as a string.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Checks if the Estimated Gas use (Ccf) input field is disabled.
   * @returns True if disabled, false otherwise.
   */
  async isEstimatedGasUseDisabled(): Promise<boolean> {
    return await this.estimatedGasUseInput.isDisabled();
  }

  /**
   * A combined action to fill meter reads and select service type.
   * @param previousRead The previous meter read value.
   * @param currentRead The current meter read value.
   * @param serviceType 'electric' or 'electricAndGas'.
   */
  async fillMeterReadsAndSelectService(previousRead: string, currentRead: string, serviceType: 'electric' | 'electricAndGas'): Promise<void> {
    await this.enterPreviousRead(previousRead);
    await this.enterCurrentRead(currentRead);
    if (serviceType === 'electric') {
      await this.selectElectricService();
    } else if (serviceType === 'electricAndGas') {
      await this.selectElectricAndGasService();
    }
  }

  /**
   * A combined action to fill the calculator form and click calculate.
   * @param monthValue The value attribute of the month option (e.g., 'm06').
   * @param previousRead The previous meter read value.
   * @param currentRead The current meter read value.
   * @param serviceType 'electric' or 'electricAndGas'.
   */
  async calculateEstimatedUsage(monthValue: string, previousRead: string, currentRead: string, serviceType: 'electric' | 'electricAndGas'): Promise<void> {
    await this.selectBillingMonth(monthValue);
    await this.fillMeterReadsAndSelectService(previousRead, currentRead, serviceType);
    await this.clickCalculate();
  }
}
