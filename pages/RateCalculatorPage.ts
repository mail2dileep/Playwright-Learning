import { Locator, Page } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;
  private readonly monthDropdown: Locator;
  private readonly previousMeterReadInput: Locator;
  private readonly currentMeterReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricServiceTypeRadio: Locator;
  private readonly electricAndGasServiceTypeRadio: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthDropdown = page.getByLabel('Month');
    this.previousMeterReadInput = page.getByLabel('Enter Previous Read:');
    this.currentMeterReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceTypeRadio = page.locator('#e');
    this.electricAndGasServiceTypeRadio = page.locator('#eg');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Selects the 'Electric and Gas' service type radio button.
   */
  async selectServiceTypeElectricAndGas(): Promise<void> {
    await this.electricAndGasServiceTypeRadio.click();
  }

  /**
   * Enters the specified value into the estimated electric consumption field.
   * @param value The electric consumption value to enter.
   */
  async enterElectricConsumption(value: string): Promise<void> {
    await this.estimatedElectricUseInput.fill(value);
  }

  /**
   * Enters the specified value into the estimated gas consumption field.
   * @param value The gas consumption value to enter.
   */
  async enterGasConsumption(value: string): Promise<void> {
    await this.estimatedGasUseInput.fill(value);
  }

  /**
   * Clicks the 'Calculate' button.
   */
  async clickCalculateButton(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Checks if the estimated electric use field is enabled.
   * @returns A promise that resolves to true if the field is enabled, false otherwise.
   */
  async isEstimatedElectricUseFieldEnabled(): Promise<boolean> {
    return this.estimatedElectricUseInput.isEnabled();
  }

  /**
   * Checks if the estimated gas use field is enabled.
   * @returns A promise that resolves to true if the field is enabled, false otherwise.
   */
  async isEstimatedGasUseFieldEnabled(): Promise<boolean> {
    return this.estimatedGasUseInput.isEnabled();
  }

  /**
   * Retrieves the current value from the estimated electric use field.
   * @returns A promise that resolves to the input value as a string.
   */
  async getEstimatedElectricUseValue(): Promise<string> {
    return this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the current value from the estimated gas use field.
   * @returns A promise that resolves to the input value as a string.
   */
  async getEstimatedGasUseValue(): Promise<string> {
    return this.estimatedGasUseInput.inputValue();
  }

  // TODO: Add method to get the calculated total price once a locator is available in the catalog.
  // async getCalculatedTotalPrice(): Promise<string> {
  //   // Example: return this.totalPriceLocator.textContent();
  //   return "TODO: Implement total price retrieval";
  // }
}
