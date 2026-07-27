import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;
  private readonly monthDropdown: Locator;
  private readonly previousMeterReadInput: Locator;
  private readonly currentMeterReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricOnlyRadio: Locator;
  private readonly electricGasRadio: Locator;
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
    this.electricOnlyRadio = page.locator('#e');
    this.electricGasRadio = page.locator('#eg');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Selects the 'Electric only' service type radio button.
   */
  async selectElectricOnlyServiceType(): Promise<void> {
    await this.electricOnlyRadio.click();
  }

  /**
   * Enters a value into the Previous Meter Read field.
   * @param readValue The value to enter.
   */
  async enterPreviousMeterRead(readValue: string): Promise<void> {
    await this.previousMeterReadInput.fill(readValue);
  }

  /**
   * Clicks the Calculate button.
   */
  async clickCalculateButton(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Returns the Locator for the Previous Meter Read input field.
   */
  getPreviousMeterReadInputField(): Locator {
    return this.previousMeterReadInput;
  }

  /**
   * Returns the Locator for the Estimated Gas Use input field.
   */
  getEstimatedGasUseInputField(): Locator {
    return this.estimatedGasUseInput;
  }

  /**
   * Returns the Locator for the Estimated Electric Use input field.
   */
  getEstimatedElectricUseInputField(): Locator {
    return this.estimatedElectricUseInput;
  }
}