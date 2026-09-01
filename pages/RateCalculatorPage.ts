import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;

  // Locators
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly serviceTypeElectricRadio: Locator;
  private readonly serviceTypeElectricGasRadio: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators using recommended methods from the catalog
    this.monthDropdown = this.page.getByLabel('Month');
    this.previousReadInput = this.page.getByLabel('Enter Previous Read:');
    this.currentReadInput = this.page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = this.page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = this.page.getByLabel('Estimated Gas use (Ccf):'); // Disabled by default
    this.serviceTypeElectricRadio = this.page.locator('#e'); // RecommendedLocator uses #id for radios
    this.serviceTypeElectricGasRadio = this.page.locator('#eg'); // RecommendedLocator uses #id for radios
    this.howToReadYourBillButton = this.page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = this.page.locator('#howToFindUsageBtn');
    this.resetButton = this.page.locator('#rateCalCancelBtn');
    this.calculateButton = this.page.locator('#validateMoveInBtn');
  }

  /**
   * Navigates to the rate calculator page.
   * @param url The full URL to the calculator page.
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Selects a billing month from the dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm03' for March).
   */
  async selectBillingMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters the previous meter read value.
   * @param readValue The numeric value for previous read.
   */
  async enterPreviousRead(readValue: string): Promise<void> {
    await this.previousReadInput.fill(readValue);
  }

  /**
   * Enters the current meter read value.
   * @param readValue The numeric value for current read.
   */
  async enterCurrentRead(readValue: string): Promise<void> {
    await this.currentReadInput.fill(readValue);
  }

  /**
   * Selects the Electric service type radio button.
   */
  async selectServiceTypeElectric(): Promise<void> {
    await this.serviceTypeElectricRadio.check();
  }

  /**
   * Selects the Electric & Gas service type radio button.
   */
  async selectServiceTypeElectricGas(): Promise<void> {
    await this.serviceTypeElectricGasRadio.check();
  }

  /**
   * Clicks the 'Calculate' button.
   */
  async clickCalculateButton(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Clicks the 'Reset' button.
   */
  async clickResetButton(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Gets the estimated electric use value.
   * @returns The text content of the estimated electric use input field.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Gets the estimated gas use value.
   * Note: This field is typically disabled, so interaction methods are not provided.
   * @returns The text content of the estimated gas use input field.
   */
  async getEstimatedGasUse(): Promise<string> {
    return await this.estimatedGasUseInput.inputValue();
  }

  /**
   * Gets the currently selected month's value from the dropdown.
   * @returns The value attribute of the selected month option.
   */
  async getCurrentMonthValue(): Promise<string> {
    return await this.monthDropdown.inputValue();
  }

  /**
   * Gets the current value of the previous read input.
   * @returns The current value of the previous read input field.
   */
  async getPreviousReadValue(): Promise<string> {
    return await this.previousReadInput.inputValue();
  }

  /**
   * Gets the current value of the current read input.
   * @returns The current value of the current read input field.
   */
  async getCurrentReadValue(): Promise<string> {
    return await this.currentReadInput.inputValue();
  }

  /**
   * Checks if the Electric service type radio button is selected.
   * @returns True if selected, false otherwise.
   */
  async isServiceTypeElectricChecked(): Promise<boolean> {
    return await this.serviceTypeElectricRadio.isChecked();
  }

  /**
   * Checks if the Electric & Gas service type radio button is selected.
   * @returns True if selected, false otherwise.
   */
  async isServiceTypeElectricGasChecked(): Promise<boolean> {
    return await this.serviceTypeElectricGasRadio.isChecked();
  }

  /**
   * Fills all necessary fields and clicks calculate for Electric only service.
   * This method encapsulates a common workflow.
   * @param monthValue The value attribute of the month option (e.g., 'm03').
   * @param previousRead The previous meter read value.
   * @param currentRead The current meter read value.
   */
  async calculateElectricConsumption(monthValue: string, previousRead: string, currentRead: string): Promise<void> {
    await this.selectBillingMonth(monthValue);
    await this.enterPreviousRead(previousRead);
    await this.enterCurrentRead(currentRead);
    await this.selectServiceTypeElectric();
    await this.clickCalculateButton();
  }
}