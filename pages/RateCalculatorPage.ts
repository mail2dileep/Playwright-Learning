import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly monthDropdown: Locator;
  private readonly previousMeterReadInput: Locator;
  private readonly currentMeterReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricOnlyRadio: Locator;
  private readonly electricGasRadio: Locator;
  private readonly calculateButton: Locator;
  private readonly resetButton: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;

  constructor(private page: Page) {
    this.monthDropdown = page.getByLabel('Month');
    this.previousMeterReadInput = page.getByLabel('Enter Previous Read:');
    this.currentMeterReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricOnlyRadio = page.locator('#e');
    this.electricGasRadio = page.locator('#eg');
    this.calculateButton = page.locator('#validateMoveInBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
  }

  /**
   * Selects the 'Electric only' service type radio button.
   */
  async selectServiceTypeElectricOnly(): Promise<void> {
    await this.electricOnlyRadio.click();
  }

  /**
   * Checks if the 'Enter Previous Read:' field is visible.
   * @returns A promise that resolves to true if the field is visible, false otherwise.
   */
  async isElectricPreviousReadFieldVisible(): Promise<boolean> {
    return this.previousMeterReadInput.isVisible();
  }

  /**
   * Checks if the 'Enter Current Read:' field is visible.
   * @returns A promise that resolves to true if the field is visible, false otherwise.
   */
  async isElectricCurrentReadFieldVisible(): Promise<boolean> {
    return this.currentMeterReadInput.isVisible();
  }

  /**
   * Checks if the 'Estimated Electric use (kWh):' field is visible.
   * @returns A promise that resolves to true if the field is visible, false otherwise.
   */
  async isEstimatedElectricUseFieldVisible(): Promise<boolean> {
    return this.estimatedElectricUseInput.isVisible();
  }

  /**
   * Checks if the 'Estimated Gas use (Ccf):' field is hidden.
   * @returns A promise that resolves to true if the field is hidden, false otherwise.
   */
  async isGasConsumptionFieldHidden(): Promise<boolean> {
    return this.estimatedGasUseInput.isHidden();
  }
}