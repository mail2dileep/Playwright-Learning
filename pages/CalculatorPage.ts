import { Page, Locator } from '@playwright/test';

export class CalculatorPage {
  private readonly page: Page;

  // Locators
  private readonly monthSelect: Locator;
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
    // Initialize locators using recommendedLocator from catalog
    this.monthSelect = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadio = page.locator('#e'); // Recommended: locator('#e')
    this.electricGasServiceRadio = page.locator('#eg'); // Recommended: locator('#eg')
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn'); // Recommended: locator('#howToReadYourBillBtn')
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn'); // Recommended: locator('#howToFindUsageBtn')
    this.resetButton = page.locator('#rateCalCancelBtn'); // Recommended: locator('#rateCalCancelBtn')
    this.calculateButton = page.locator('#validateMoveInBtn'); // Recommended: locator('#validateMoveInBtn')
  }

  /**
   * Selects a month from the dropdown.
   * @param monthValue The value of the month to select (e.g., 'm01' for January).
   */
  async selectMonth(monthValue: string): Promise<void> {
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
   * Selects the 'Electric' service type.
   */
  async selectElectricService(): Promise<void> {
    await this.electricServiceRadio.click();
  }

  /**
   * Selects the 'Electric & Gas' service type.
   */
  async selectElectricGasService(): Promise<void> {
    await this.electricGasServiceRadio.click();
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
   * Clicks the 'How to Read Your Bill' button.
   */
  async clickHowToReadYourBill(): Promise<void> {
    await this.howToReadYourBillButton.click();
  }

  /**
   * Clicks the 'How to Find Usage' button.
   */
  async clickHowToFindUsage(): Promise<void> {
    await this.howToFindUsageButton.click();
  }

  /**
   * Retrieves the estimated electric use (kWh).
   * @returns The estimated electric use as a string.
   */
  async getEstimatedElectricUse(): Promise<string | null> {
    return this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the estimated gas use (Ccf).
   * @returns The estimated gas use as a string.
   */
  async getEstimatedGasUse(): Promise<string | null> {
    return this.estimatedGasUseInput.inputValue();
  }

  /**
   * Checks if the estimated gas use input field is enabled.
   * @returns A promise that resolves to true if the field is enabled, false otherwise.
   */
  async isEstimatedGasUseFieldEnabled(): Promise<boolean> {
    return this.estimatedGasUseInput.isEnabled();
  }

  /**
   * Retrieves the currently selected month value.
   * @returns The value of the selected month option.
   */
  async getSelectedMonthValue(): Promise<string> {
    return this.monthSelect.inputValue();
  }

  /**
   * Gets the value of the previous meter read input field.
   * @returns The value of the previous meter read.
   */
  async getPreviousReadValue(): Promise<string | null> {
    return this.previousReadInput.inputValue();
  }

  /**
   * Gets the value of the current meter read input field.
   * @returns The value of the current meter read.
   */
  async getCurrentReadValue(): Promise<string | null> {
    return this.currentReadInput.inputValue();
  }

  /**
   * Performs a complete calculation workflow for electric service.
   * @param monthValue The value of the month to select (e.g., 'm01').
   * @param previousRead The previous meter read value.
   * @param currentRead The current meter read value.
   */
  async performElectricCalculation(monthValue: string, previousRead: string, currentRead: string): Promise<void> {
    await this.selectMonth(monthValue);
    await this.enterPreviousRead(previousRead);
    await this.enterCurrentRead(currentRead);
    await this.selectElectricService();
    await this.clickCalculate();
  }

  /**
   * Performs a complete calculation workflow for electric and gas service.
   * @param monthValue The value of the month to select (e.g., 'm01').
   * @param previousRead The previous meter read value.
   * @param currentRead The current meter read value.
   */
  async performElectricAndGasCalculation(monthValue: string, previousRead: string, currentRead: string): Promise<void> {
    await this.selectMonth(monthValue);
    await this.enterPreviousRead(previousRead);
    await this.enterCurrentRead(currentRead);
    await this.selectElectricGasService();
    await this.clickCalculate();
  }
}